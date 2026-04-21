import { RefObject, useEffect, useRef, useState } from 'react'
import * as VIM from 'vim-web'
import * as DevUrls from '../urls'
import { fetchVimBuffer } from '../utils/vimCache'

type ViewerApi = VIM.React.Webgl.ViewerApi
const Webgl = VIM.React.Webgl
type IWebglVim = VIM.Core.Webgl.IWebglVim


/**
 * Custom hook to create a WebGL viewer and attach it to a div element.
 * Returns the viewer as state once ready.
 */
export function useWebglViewer (div: RefObject<HTMLDivElement>): ViewerApi | undefined {
  const viewerRef = useRef<ViewerApi>()
  const [viewer, setViewer] = useState<ViewerApi>()

  useEffect(() => {
    let disposed = false
    Webgl.createViewer(div.current ?? undefined).then((v) => {
      if (disposed) {
        v.dispose()
        return
      }
      viewerRef.current = v
      ;(globalThis as any).viewer = v
      setViewer(v)
    })

    return () => {
      disposed = true
      viewerRef.current?.dispose()
    }
  }, [])

  return viewer
}

/**
 * State-returning hook: creates a WebGL viewer and loads a model.
 * Returns [viewer, vim] as React state — use useEffect for demo logic.
 */
export function useWebglModel (div: RefObject<HTMLDivElement>, model: string): [ViewerApi | undefined, IWebglVim | undefined] {
  const viewer = useWebglViewer(div)
  const [vim, setVim] = useState<IWebglVim>()

  useEffect(() => {
    if (!viewer) return
    let cancelled = false
    viewer.modal.loading({ message: 'Fetching VIM file', progress: 0, mode: 'bytes' })
    const onProgress = (received: number) => {
      if (cancelled) return
      viewer.modal.loading({
        message: 'Fetching VIM file',
        progress: received,
        mode: 'bytes',
      })
    }
    fetchVimBuffer(model, onProgress).then((buffer) => {
      if (cancelled) return
      viewer.modal.loading(undefined)
      return viewer.load({ buffer }).getVim()
    }).then((v) => {
      if (v && !cancelled) setVim(v)
    })
    return () => { cancelled = true }
  }, [viewer])

  return [viewer, vim]
}

/**
 * State-returning hook: creates a WebGL viewer and loads the residence model.
 */
export function useWebglResidence (div: RefObject<HTMLDivElement>) {
  return useWebglModel(div, DevUrls.residence)
}