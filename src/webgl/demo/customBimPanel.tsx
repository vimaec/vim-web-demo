import React, { useEffect, useRef } from 'react'
import { useWebglResidence } from '../webglUtils'
import * as VIM from 'vim-web'

export function CustomBimPanel () {
  const div = useRef<HTMLDivElement>(null)
  const [viewer, vim] = useWebglResidence(div)

  useEffect(() => {
    if (!viewer || !vim) return

    // Append !!!! to all header values
    viewer.bimInfo.onRenderHeaderEntryValue = data => <>{data.data.value + "!!!!"}</>

    // Replace first entry with an image
    viewer.bimInfo.onRenderHeaderEntry = data => data.data.label === 'Document'
     ? <>{VIM.React.Icons.checkmark({height:16, width:16, fill: 'black'})}</>
     : data.standard()

    // Replace the Product entry with an input field
    viewer.bimInfo.onRenderBodyEntryValue = data => data.data.label === 'Product' ?<input/> : data.standard()

    // Add a completely new section by adding new data entries
    viewer.bimInfo.onData = data => {
      const entry = {key: 'custom3', label: 'Custom3', value: 'Custom3'}
      const group = {title: 'Custom2', key: 'custom2', content:[entry]}
      const section = {title: 'Custom1', key: 'custom1', content:[group]}
      if (!data.body) data.body = []
      data.body.push(section)
      return Promise.resolve(data)
    }

    // Auto-select an element so the BIM panel opens with customizations visible
    const element = vim.getElementFromIndex(301)
    if (element) {
      viewer.core.selection.select(element)
    }
  }, [vim])

  return <div ref={div} className='vc-inset-0 vc-absolute'/>
}
