import React, { useEffect, useRef } from 'react'
import { useWebglResidence } from '../webglUtils'
import * as VIM from 'vim-web'

export function CustomGenericPanel () {
  const div = useRef<HTMLDivElement>(null)
  const [viewer] = useWebglResidence(div)

  useEffect(() => {
    if (!viewer) return

    // Open isolation panel
    viewer.isolation.showPanel.set(true)

    // Create a new state for the demo
    const state = VIM.React.createState(false)
    state.onChange.subscribe(() => {console.log("hello! : " + state.get())})

    viewer.isolationPanel.customize((bar) => {
      // modify an item in the panel
      const item = bar.find((b) => b.id === VIM.React.IsolationPanel.Ids.showGhost)
      if (item && 'label' in item) item.label += " (custom)"

      // Remove an item from the panel
      bar = bar.filter((b) => b.id !== VIM.React.IsolationPanel.Ids.ghostOpacity)

      // Add a new item to the panel
      bar.push({
        type: "bool",
        id: VIM.React.IsolationPanel.Ids.ghostOpacity,
        label: "CUSTOM BUTTON",
        state: state,
        enabled: () => true,
      })
      return bar
      }
    )
  }, [viewer])

  return <div ref={div} className='vc-inset-0 vc-absolute'/>
}
