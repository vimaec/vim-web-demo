import { WebglViewerWithResidence } from '../webglUtils'
import * as VIM from 'vim-web'
import THREE = VIM.THREE

export function WebglMarkers () {

  return WebglViewerWithResidence((viewer, vim) =>{
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
          icon: VIM.React.Icons.close,
          tip: 'Remove Marker',
          action: () => RemoveMarker(viewer)
        }
      ]}
    ])
  })
}

// Get the selected elements, add a marker at the center of the selection
async function AddMarker(viewer: VIM.React.Webgl.ViewerRef) {
  const box = await viewer.core.selection.getBoundingBox()
  const pos = box.getCenter(new THREE.Vector3())
  viewer.core.gizmos.markers.add(pos)
}

// Remove all markers from the selection
async function RemoveMarker(viewer: VIM.React.Webgl.ViewerRef) {
  const selection = await viewer.core.selection.getAll()
  selection.forEach((e) => {
    if(e.type === 'Marker'){
      viewer.core.gizmos.markers.remove(e)
    }
  })
}