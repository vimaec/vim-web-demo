import React, { useEffect, useRef } from 'react'
import { useWebglResidence } from '../webglUtils'
import * as VIM from 'vim-web'

export function AccessingBim () {
  const div = useRef<HTMLDivElement>(null)
  const [viewer, vim] = useWebglResidence(div)

  useEffect(() => {
    if (!viewer || !vim) return

    // Auto-select an element so the BIM info is immediately visible
    const element = vim.getElementFromIndex(301)
    if (element) {
      viewer.core.selection.select(element)
      viewer.core.camera.lerp(1).frame(element)
    }

    const unsub = viewer.core.selection.onSelectionChanged.sub(async () => {
      const bim = vim.bim
      if (!bim) return

      const elements = viewer.core.selection.getAll()
        .filter((e): e is VIM.Core.Webgl.IElement3D => e.type === 'Element3D')
      const first = elements[0]
      const bimElement = await first?.getBimElement()
      if (!bimElement) return

      // Collect BIM info
      const lines: string[] = []
      lines.push(`Id: ${bimElement.id}`)
      lines.push(`Name: ${bimElement.name}`)
      lines.push(`Type: ${bimElement.type}`)

      if (bimElement.categoryIndex != null && bim.category) {
        const category = await bim.category.get(bimElement.categoryIndex)
        lines.push(`Category: ${category.name}`)
      }

      if (bimElement.levelIndex != null && bim.level && bim.element) {
        const level = await bim.level.get(bimElement.levelIndex)
        if (level.elementIndex != null) {
          const levelElement = await bim.element.get(level.elementIndex)
          lines.push(`Level: ${levelElement.name}`)
        }
      }

      if (bim.familyInstance && bim.familyType && bim.element) {
        const familyInstances = await bim.familyInstance.getAll()
        const familyInstance = familyInstances.find(fi => fi.elementIndex === bimElement.index)
        if (familyInstance && familyInstance.familyTypeIndex != null) {
          const familyType = await bim.familyType.get(familyInstance.familyTypeIndex)
          if (familyType.elementIndex != null) {
            const familyTypeElement = await bim.element.get(familyType.elementIndex)
            lines.push(`Family Type: ${familyTypeElement.name}`)
          }
        }
      }

      console.log('BIM Element Info:\n' + lines.join('\n'))
    })

    return () => unsub()
  }, [vim])

  return <div ref={div} className='vc-inset-0 vc-absolute'/>
}
