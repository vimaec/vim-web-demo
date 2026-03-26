import React, { useEffect, useRef } from 'react'
import { useWebglResidence } from '../webglUtils'
import * as VIM from 'vim-web'

export function CustomInputs () {
  const div = useRef<HTMLDivElement>(null)
  const [viewer, vim] = useWebglResidence(div)

  useEffect(() => {
    if (!viewer || !vim) return

    // Color selected elements red
    const unsubSelection = viewer.core.selection.onSelectionChanged.subscribe(() => {
      colorSelection(viewer.core, new VIM.THREE.Color(0xff0000))
    })

    // Change color to green on key R press
    const restoreKey = viewer.core.inputs.keyboard.override('KeyR', 'down', () => {
      colorSelection(viewer.core, new VIM.THREE.Color(0x00ff00))
    })

    // Auto-select an element to demonstrate the red coloring immediately
    const element = vim.getElementFromIndex(301)
    if (element) {
      viewer.core.selection.select(element)
    }

    return () => {
      unsubSelection()
      restoreKey()
    }
  }, [vim])

  return <div ref={div} className='vc-inset-0 vc-absolute'/>
}

function colorSelection(viewer: VIM.Core.Webgl.Viewer, color: VIM.THREE.Color) {
  viewer.selection.getAll()
    .filter((e): e is VIM.Core.Webgl.IElement3D => e.type === 'Element3D')
    .forEach((e) => { e.color = color })
}
