import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import * as VIM from 'vim-web'
import * as Urls from '../../urls'

const Webgl = VIM.React.Webgl
type ViewerApi = VIM.React.Webgl.ViewerApi
type IWebglVim = VIM.Core.Webgl.IWebglVim
type IElement = VIM.BIM.IElement
type VimDocument = VIM.BIM.VimDocument

/**
 * Custom project inspector.
 *
 * The built-in BIM tree exposes no API to control its structure or labels
 * (only a visibility toggle), so this demo hides it (`ui.panelBimTree: false`)
 * and renders its own tree in a left pane instead. The built-in BIM info panel
 * is hidden too (`ui.panelBimInfo: false`) and replaced by a "BIM Inspector"
 * section below the tree, populated from the current selection.
 *
 * The tree groups every geometry element by:
 *   Room > Category > Family > Type > Element
 *
 * Each level is just an extractor function over the BIM `IElement` (see LEVELS
 * below) — reorder or swap them to change the hierarchy. Clicking a leaf
 * selects and frames that element in the 3D scene.
 *
 * The "Open local .vim" button (same as the Local File demo) loads a model from
 * disk, replacing the current one and rebuilding the tree.
 */
export function CustomInspector () {
  const viewerDiv = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<ViewerApi>()
  const vimRef = useRef<IWebglVim>()
  const unsubRef = useRef<() => void>()
  const bimToken = useRef(0) // guards against out-of-order async BIM-info loads
  // True while the inspector is pushing a selection into the viewer. The
  // viewer fires onSelectionChanged in response; this flag lets the listener
  // ignore that echo so an inspector click can't loop back into itself.
  const applyingSelfRef = useRef(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string>()
  const [loadError, setLoadError] = useState<string>()
  const [tree, setTree] = useState<TreeItem[]>()
  const [bimInfo, setBimInfo] = useState<BimInfo>()
  // The set of selected BIM element indices. Mirrored in a ref so click
  // handlers can read the latest value without a stale closure.
  const [selected, setSelected] = useState<ReadonlySet<number>>(() => new Set())
  const selectedRef = useRef<ReadonlySet<number>>(selected)
  const updateSelected = (next: ReadonlySet<number>) => {
    selectedRef.current = next
    setSelected(next)
  }

  // Expand state lives here (not per-row) so the tree can be flattened and
  // virtualized — collapsed rows never mount.
  const [expanded, setExpanded] = useState<ReadonlySet<number>>(() => new Set())
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [viewportH, setViewportH] = useState(600) // replaced by the measured height on mount

  const toggleExpand = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Visible rows (respecting collapse state) as a flat list, then the window of
  // rows currently on screen. Only the window is rendered.
  const rows = useMemo(() => (tree ? flattenTree(tree, expanded) : []), [tree, expanded])
  const start = Math.max(0, Math.floor(scrollTop / ROW_H) - OVERSCAN)
  const end = Math.min(rows.length, Math.ceil((scrollTop + viewportH) / ROW_H) + OVERSCAN)
  const windowRows = rows.slice(start, end)

  // Track the scroll viewport height so the window covers exactly what's shown.
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const measure = () => setViewportH(el.clientHeight)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Disposes any existing viewer and creates a fresh one in the container,
  // wiring up selection sync and the room-toggle control-bar button.
  //
  // We rebuild the viewer for every load rather than reuse one. Reusing it and
  // loading a second model triggers a library crash: loading builds geometry
  // via vim.load() → scene.clear() → renderer.removeScene(), which recomputes a
  // combined bounding box across the renderer's retained scenes and throws on
  // any whose geometry isn't built ("Cannot read properties of undefined
  // (reading 'union')"). The renderer's internal scene list isn't fully reset
  // between loads, so this accumulates. A fresh viewer guarantees a clean one.
  const makeViewer = async (): Promise<ViewerApi | undefined> => {
    unsubRef.current?.()
    unsubRef.current = undefined
    viewerRef.current?.dispose()
    viewerRef.current = undefined
    vimRef.current = undefined

    const div = viewerDiv.current
    if (!div) return undefined

    // Hide the built-in BIM tree, its control-bar toggle, and the BIM info
    // panel so this custom inspector visually replaces the stock UI.
    const viewer = await Webgl.createViewer(div, {
      ui: { panelBimTree: false, miscProjectInspector: false, panelBimInfo: false },
    })
    viewerRef.current = viewer
    ;(globalThis as any).viewer = viewer // for testing in the browser console

    // Sync selections made in the viewport back into the tree highlight. We
    // ignore echoes from our own inspector-driven selections (recursion guard)
    // and never expand rows here — only update the highlight.
    const selection = viewer.core.selection
    unsubRef.current = selection.onSelectionChanged.sub(() => {
      if (applyingSelfRef.current) return
      const next = new Set<number>()
      for (const s of selection.getAll()) {
        if (s.type === 'Element3D' && s.element !== undefined) next.add(s.element)
      }
      updateSelected(next)
      loadBimInfo(firstOf(next))
    })

    // Append a toggle button to the control bar for room geometry. The
    // callbacks read live state, and `isOn` highlights the button while rooms
    // are shown. Returning [...bar, …] keeps the built-in sections.
    const showRooms = viewer.renderSettings.showRooms
    const Icons = VIM.React.Icons
    viewer.controlBar.customize((bar) => [
      ...bar,
      {
        id: 'custom-rooms',
        buttons: [{
          id: 'toggle-rooms',
          tip: () => (showRooms.get() ? 'Hide rooms' : 'Show rooms'),
          isOn: () => showRooms.get(),
          action: () => showRooms.set(!showRooms.get()),
          icon: (options) => (showRooms.get() ? Icons.visible(options) : Icons.hidden(options)),
        }],
      },
    ])

    return viewer
  }

  // Loads a model into a freshly-created viewer, then rebuilds the inspector
  // tree. `source` is a url or a buffer (RequestSource), matching viewer.load().
  const loadModel = async (source: Parameters<ViewerApi['load']>[0], message: string) => {
    setTree(undefined)
    updateSelected(new Set())
    setBimInfo(undefined)
    setLoadError(undefined)
    setExpanded(new Set()) // collapsed by default; also drops stale ids from the old tree
    setScrollTop(0)
    if (scrollRef.current) scrollRef.current.scrollTop = 0

    const viewer = await makeViewer()
    if (!viewer) return

    viewer.modal.loading({ progress: -1, mode: 'percent', message })
    try {
      const vim = await viewer.load(source).getVim()
      if (viewerRef.current !== viewer || !vim) return // superseded / unmounted mid-load
      vimRef.current = vim

      viewer.framing.frameScene.call()
      // Set the material directly. The public `isolation.ghostOpacity` StateRef
      // is persisted to localStorage and its setter no-ops when the value is
      // unchanged, so once "0.01" has been stored it never re-pushes to the
      // (independently-defaulted) material. Writing the material guarantees it
      // applies; the StateRef.set keeps the settings-panel slider in sync.
      viewer.core.materials.ghostOpacity = 0.01
      viewer.isolation.ghostOpacity.set(0.01)
      setTree(await buildInspectorTree(vim))
    } catch (err) {
      // Surface the real underlying error. The library otherwise reports load
      // failures through a (mislabeled) "VIM Ultra" modal that hides the cause.
      const errorMessage = err instanceof Error ? err.message : String(err)
      console.error('Failed to load VIM file:', err)
      setLoadError(errorMessage)
    } finally {
      viewer.modal.loading(undefined)
    }
  }

  // Reads BIM parameters for the given element and groups them for display.
  const loadBimInfo = async (elementIndex: number | undefined) => {
    const token = ++bimToken.current
    const vim = vimRef.current
    const element = elementIndex !== undefined ? vim?.getElementFromIndex(elementIndex) : undefined
    if (!element) { setBimInfo(undefined); return }

    const [bimElement, params] = await Promise.all([element.getBimElement(), element.getBimParameters()])
    if (token !== bimToken.current) return // a newer selection superseded this load

    const groups: BimGroup[] = []
    const byGroup = new Map<string, BimRow[]>()
    for (const p of params) {
      if (!p.name) continue
      const group = p.group && p.group.length > 0 ? p.group : 'Other'
      let rows = byGroup.get(group)
      if (!rows) { rows = []; byGroup.set(group, rows); groups.push({ group, rows }) }
      rows.push({ name: p.name, value: p.value ?? '' })
    }
    const name = bimElement.name && bimElement.name.length > 0 ? bimElement.name : 'Element'
    setBimInfo({ title: `${name} [${bimElement.id ?? elementIndex}]`, groups })
  }

  useEffect(() => {
    loadModel({ url: Urls.residence }, 'Loading model…')
    return () => {
      unsubRef.current?.()
      viewerRef.current?.dispose()
      viewerRef.current = undefined
    }
  }, [])

  // Read the chosen .vim file from disk and load it as a buffer.
  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target
    const file = input.files?.[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (event) => {
      const buffer = event.target?.result
      if (buffer instanceof ArrayBuffer) loadModel({ buffer }, 'Loading from disk')
    }
    reader.readAsArrayBuffer(file)
    // Clear the value so picking the same file again still fires `change`. We
    // show the name ourselves (below), so the native "No file chosen" label is
    // hidden and never out of sync.
    input.value = ''
  }

  // Selects every element under a clicked row. A plain click replaces the
  // selection; ctrl/cmd-click toggles those elements in or out of it.
  const onSelect = (elements: number[], toggle: boolean) => {
    const viewer = viewerRef.current
    const vim = vimRef.current
    if (!viewer || !vim || elements.length === 0) return

    const objects = elements
      .map((i) => vim.getElementFromIndex(i))
      .filter((e): e is NonNullable<typeof e> => !!e)
    if (objects.length === 0) return

    const current = selectedRef.current
    const next = new Set(current)

    // Guard the viewer mutation so the resulting onSelectionChanged echo is
    // ignored by our listener. We update the highlight ourselves below.
    applyingSelfRef.current = true
    try {
      if (toggle) {
        const allSelected = elements.every((i) => current.has(i))
        if (allSelected) {
          viewer.core.selection.remove(objects)
          elements.forEach((i) => next.delete(i))
        } else {
          viewer.core.selection.add(objects)
          elements.forEach((i) => next.add(i))
        }
      } else {
        viewer.core.selection.select(objects)
        next.clear()
        elements.forEach((i) => next.add(i))
      }
    } finally {
      applyingSelfRef.current = false
    }

    updateSelected(next)
    loadBimInfo(firstOf(next))

    // Re-center the orbit pivot on the centroid of the new selection. setTarget
    // moves only the orbit target, not the camera. getBoundingBox reflects the
    // viewer selection we just mutated; its center is the centroid.
    viewer.core.selection.getBoundingBox().then((box) => {
      if (!box || viewerRef.current !== viewer) return
      const centroid = box.min.clone().add(box.max).multiplyScalar(0.5)
      viewer.core.camera.snap().setTarget(centroid)
    })
  }

  return (
    // Fill the page's content area. The parent is `position: relative`, so
    // absolute inset-0 sizes us reliably (a percentage height would collapse).
    <div style={{ display: 'flex', position: 'absolute', inset: 0 }}>
      {/* Custom inspector pane: header, tree, then BIM info stacked vertically. */}
      <div style={paneStyle}>
        <div style={{ flex: '0 0 auto', padding: '0.75rem', borderBottom: '1px solid #ddd' }}>
          <h3 style={{ margin: '0 0 0.5rem' }}>Project Inspector</h3>
          <input ref={fileInputRef} type="file" accept=".vim" onChange={handleFile} style={{ display: 'none' }} />
          <button onClick={() => fileInputRef.current?.click()} style={{ width: '100%', cursor: 'pointer' }}>
            Open local .vim
          </button>
          {fileName && (
            <div style={{ marginTop: '0.25rem', color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={fileName}>
              {fileName}
            </div>
          )}
        </div>

        {/* Virtualized tree: only the rows in view are mounted, so deep/wide
            expansions stay fast. Horizontal-only padding keeps row offsets
            aligned with scrollTop. */}
        <div
          ref={scrollRef}
          style={{ ...sectionStyle, padding: '0 0.75rem' }}
          onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
        >
          {loadError && <div style={{ color: '#b00020', whiteSpace: 'pre-wrap', padding: '0.5rem 0' }}>Load failed: {loadError}</div>}
          {!tree && !loadError && <div style={{ color: '#888', padding: '0.5rem 0' }}>Loading model…</div>}
          {tree && (
            <div style={{ height: rows.length * ROW_H, position: 'relative' }}>
              {windowRows.map((row) => (
                <div
                  key={row.node.kind === 'group' ? `g${row.node.id}` : `l${row.node.elements[0]}`}
                  style={{ position: 'absolute', top: row.index * ROW_H, left: 0, right: 0, height: ROW_H }}
                >
                  <TreeRow row={row} expanded={expanded} selected={selected} onToggle={toggleExpand} onSelect={onSelect} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ ...sectionStyle, borderTop: '1px solid #ddd' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>BIM Inspector</h4>
          {bimInfo ? <BimInfoView info={bimInfo} /> : <div style={{ color: '#888' }}>Select an element to inspect.</div>}
        </div>
      </div>

      {/* 3D viewer fills the rest.
          createViewer() forces the element it's given to `position: absolute`
          and adds the `vim-component` class (which sets `inset: 0`), so it
          fills its nearest positioned ancestor. We give it a `flex: 1`,
          `position: relative` wrapper so it fills only this region — not the
          pane. Passing the bare flex item instead would let it cover the pane. */}
      <div style={{ flex: 1, position: 'relative' }}>
        <div ref={viewerDiv} />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Tree data                                                          */
/* ------------------------------------------------------------------ */

// `elements` holds every BIM element index under a node, so a click can select
// the whole hierarchy. For a leaf it's just its own element.
type Leaf = { kind: 'leaf'; label: string; elements: number[] }
// `id` is a stable per-group key used to track expand/collapse state (group
// rows are the only expandable nodes).
type Group = { kind: 'group'; id: number; label: string; level: string; count: number; children: TreeItem[]; elements: number[] }
type TreeItem = Group | Leaf

// A flattened, depth-tagged tree node with its position in the visible list.
type Row = { node: TreeItem; depth: number; index: number }

/** Flattens the tree into the list of currently-visible rows (collapsed subtrees omitted). */
function flattenTree (items: TreeItem[], expanded: ReadonlySet<number>): Row[] {
  const out: Row[] = []
  const walk = (list: TreeItem[], depth: number) => {
    for (const node of list) {
      out.push({ node, depth, index: out.length })
      if (node.kind === 'group' && expanded.has(node.id)) walk(node.children, depth + 1)
    }
  }
  walk(items, 0)
  return out
}

/** First value of a set, or undefined when empty. */
function firstOf (set: ReadonlySet<number>): number | undefined {
  return set.values().next().value
}

/** A grouping level: a display name plus how to extract its bucket key from an element. */
type Level = { name: string; key: (e: IElement) => string }

/**
 * Reads the BIM tables off the loaded vim and builds the nested tree.
 * Only geometry elements are included so every leaf is selectable in the scene.
 */
async function buildInspectorTree (vim: IWebglVim): Promise<TreeItem[]> {
  const doc = vim.bim
  if (!doc?.element) return []

  const [bimElements, categories, rooms, typeNames] = await Promise.all([
    doc.element.getAll(),
    doc.category?.getAll() ?? Promise.resolve([]),
    doc.room?.getAll() ?? Promise.resolve([]),
    buildFamilyTypeNameMap(doc),
  ])

  // Index BIM tables by their row index for O(1) lookups while grouping.
  const bimByIndex = new Map(bimElements.map((e) => [e.index, e]))
  const categoryByIndex = new Map(categories.map((c) => [c.index, c]))
  const roomByIndex = new Map(rooms.map((r) => [r.index, r]))

  // A room has no name field of its own — its name is the name of its element.
  const roomLabel = (e: IElement): string => {
    if (e.roomIndex === undefined) return 'No Room'
    const room = roomByIndex.get(e.roomIndex)
    const roomElement = room?.elementIndex !== undefined ? bimByIndex.get(room.elementIndex) : undefined
    return roomElement?.name ?? room?.number ?? `Room ${e.roomIndex}`
  }

  const categoryLabel = (e: IElement): string =>
    (e.categoryIndex !== undefined ? categoryByIndex.get(e.categoryIndex)?.name : undefined) ?? 'Uncategorized'

  // Reorder / swap these to change the hierarchy.
  const LEVELS: Level[] = [
    { name: 'Room', key: roomLabel },
    { name: 'Category', key: categoryLabel },
    { name: 'Family', key: (e) => e.familyName ?? '(No Family)' },
    { name: 'Type', key: (e) => typeNames.get(e.index) ?? '(No Type)' },
  ]

  const leafLabel = (e: IElement): string => {
    const name = e.name && e.name.length > 0 ? e.name : 'Element'
    return `${name} [${e.id ?? e.index}]`
  }

  // Restrict to elements that actually have geometry — these are the ones a
  // user can click and see in the scene. `getAllElements()` returns the 3D
  // elements; we group their underlying BIM rows.
  const geometryIndices = new Set(vim.getAllElements().map((e) => e.element))
  const elements = bimElements.filter((e) => geometryIndices.has(e.index))

  const idGen = (() => { let n = 0; return () => n++ })()
  return groupElements(elements, LEVELS, 0, leafLabel, idGen)
}

/**
 * Maps each element index to its Revit *type* name (e.g. "Generic - 200mm").
 *
 * An element's type isn't a direct field — it's reached through the family
 * instance → family type → type element chain. This mirrors vim-web's own
 * internal `getFamilyTypeNameMap` helper. Elements that aren't family instances
 * (e.g. system-family walls/floors) won't appear here and fall back to "(No Type)".
 */
async function buildFamilyTypeNameMap (doc: VimDocument): Promise<Map<number, string>> {
  const result = new Map<number, string>()
  const familyInstance = doc.familyInstance
  const familyType = doc.familyType
  const element = doc.element
  if (!familyInstance || !familyType || !element) return result

  const [instanceElement, instanceFamilyType, typeElement, names] = await Promise.all([
    familyInstance.getAllElementIndex(),
    familyInstance.getAllFamilyTypeIndex(),
    familyType.getAllElementIndex(),
    element.getAllName(),
  ])
  if (!instanceElement || !instanceFamilyType || !typeElement || !names) return result

  for (let i = 0; i < instanceElement.length; i++) {
    const ftIndex = instanceFamilyType[i]
    if (ftIndex === undefined || ftIndex < 0) continue
    const typeElementIndex = typeElement[ftIndex]
    if (typeElementIndex === undefined || typeElementIndex < 0) continue
    const name = names[typeElementIndex]
    if (name) result.set(instanceElement[i], name)
  }
  return result
}

/** Recursively groups elements by each level, producing leaves at the bottom. */
function groupElements (elements: IElement[], levels: Level[], depth: number, leafLabel: (e: IElement) => string, idGen: () => number): TreeItem[] {
  if (depth === levels.length) {
    return elements
      .map((e): Leaf => ({ kind: 'leaf', label: leafLabel(e), elements: [e.index] }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }

  const { name, key } = levels[depth]
  const buckets = new Map<string, IElement[]>()
  for (const e of elements) {
    const k = key(e)
    const bucket = buckets.get(k)
    if (bucket) bucket.push(e)
    else buckets.set(k, [e])
  }

  return [...buckets.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([label, els]): Group => {
      const children = groupElements(els, levels, depth + 1, leafLabel, idGen)
      return {
        kind: 'group',
        id: idGen(),
        label,
        level: name,
        count: els.length,
        children,
        elements: children.flatMap((c) => c.elements),
      }
    })
}

/* ------------------------------------------------------------------ */
/* Tree rendering                                                     */
/* ------------------------------------------------------------------ */

const INDENT_PX = 14 // horizontal step per tree level
const ROW_H = 24     // fixed row height (px) — required for virtualization math
const OVERSCAN = 8   // extra rows rendered above/below the viewport

/** A single flattened, fixed-height tree row. */
function TreeRow (props: {
  row: Row
  expanded: ReadonlySet<number>
  selected: ReadonlySet<number>
  onToggle: (id: number) => void
  onSelect: (elements: number[], toggle: boolean) => void
}) {
  const { row, expanded, selected, onToggle, onSelect } = props
  const { node, depth } = row
  const isGroup = node.kind === 'group'
  const isOpen = isGroup && expanded.has(node.id)

  // A row is selected when every element under it is in the selection.
  const isSelected = node.elements.length > 0 && node.elements.every((i) => selected.has(i))

  return (
    <div
      title={isGroup ? node.level : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        height: ROW_H,
        paddingLeft: `${depth * INDENT_PX + 4}px`,
        whiteSpace: 'nowrap',
        borderRadius: 3,
        background: isSelected ? '#cde4ff' : undefined,
        fontWeight: isSelected ? 'bold' : undefined,
      }}
    >
      {/* Chevron toggles expansion only — its own handler stops propagation, and
          selection lives on the sibling region to the right. */}
      <span
        onClick={isGroup ? (e) => { e.stopPropagation(); onToggle(node.id) } : undefined}
        style={{
          flexShrink: 0,
          width: '1.4rem',
          textAlign: 'center',
          fontSize: '1.05rem',
          lineHeight: 1,
          color: '#666',
          cursor: isGroup ? 'pointer' : 'default',
          userSelect: 'none',
        }}
      >
        {isGroup ? (isOpen ? '▾' : '▸') : ''}
      </span>
      <span
        onClick={(e) => onSelect(node.elements, e.ctrlKey || e.metaKey)}
        style={{ flex: 1, cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        {isGroup
          ? <>{node.label} <span style={{ color: '#999', fontWeight: 'normal' }}>({node.count})</span></>
          : <>▪ {node.label}</>}
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* BIM Inspector rendering                                            */
/* ------------------------------------------------------------------ */

type BimRow = { name: string; value: string }
type BimGroup = { group: string; rows: BimRow[] }
type BimInfo = { title: string; groups: BimGroup[] }

function BimInfoView (props: { info: BimInfo }) {
  const { info } = props
  return (
    <div>
      <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{info.title}</div>
      {info.groups.map((g, i) => (
        <div key={i} style={{ marginBottom: '0.6rem' }}>
          <div style={{ fontWeight: 'bold', color: '#555', borderBottom: '1px solid #eee', marginBottom: '2px' }}>{g.group}</div>
          {g.rows.map((r, j) => (
            <div key={j} style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
              <span style={{ color: '#666' }}>{r.name}</span>
              <span style={{ textAlign: 'right', wordBreak: 'break-word' }}>{r.value}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Styles                                                             */
/* ------------------------------------------------------------------ */

const paneStyle: React.CSSProperties = {
  width: '320px',
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  borderRight: '1px solid #ccc',
  background: '#fff',
  fontFamily: "'Roboto', sans-serif",
  fontSize: '13px',
  lineHeight: '1.4rem',
}

// Each scrollable section takes half the remaining height. `minHeight: 0` is
// required for an `overflow: auto` child of a flex column to actually scroll.
const sectionStyle: React.CSSProperties = {
  flex: '1 1 50%',
  minHeight: 0,
  overflow: 'auto',
  padding: '0.5rem 0.75rem',
}
