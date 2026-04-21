import React, { useEffect, useRef } from 'react'
import { useWebglResidence } from '../webglUtils'
import * as VIM from 'vim-web'
import THREE = VIM.THREE

export function Markers () {
  const div = useRef<HTMLDivElement>(null)
  const [viewer] = useWebglResidence(div)

  useEffect(() => {
    if (!viewer) return
    viewer.controlBar.customize((bar) => [{
      id:'markers',
      buttons: [
        {
          // Add button to add a marker
          id: 'add_marker',
          icon: VIM.React.Icons.checkmark,
          tip: 'Add Marker',
          action: () => AddMarker(viewer)
        },
        {
          // Add button to remove a marker
          id: 'remove_marker',
          icon: VIM.React.Icons.closeIcon,
          tip: 'Remove Marker',
          action: () => RemoveMarker(viewer)
        }
      ]}
    ])
  }, [viewer])

  return <div ref={div} className='vc-inset-0 vc-absolute'/>
}

// Get the selected elements, add a marker at the center of the selection
async function AddMarker(viewer: VIM.React.Webgl.ViewerApi) {
  const box = await viewer.core.selection.getBoundingBox()
  if(!box) return;
  const pos = box.getCenter(new THREE.Vector3())
  viewer.core.gizmos.markers.add(pos)
}

// Remove all markers from the selection
function RemoveMarker(viewer: VIM.React.Webgl.ViewerApi) {
  const selection = viewer.core.selection.getAll()
  selection.forEach((e: VIM.Core.Webgl.ISelectable) => {
    if(e.type === 'Marker'){
      viewer.core.gizmos.markers.remove(e as VIM.Core.Webgl.IMarker)
    }
  })
}
