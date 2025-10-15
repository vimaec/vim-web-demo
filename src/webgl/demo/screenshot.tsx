import { WebglViewerWithResidence } from '../webglUtils'
import * as VIM from 'vim-web'
import THREE = VIM.THREE

export function WebglScreenshot () {

  return WebglViewerWithResidence((viewer, vim) =>{
    viewer.controlBar.customize((bar) => [{
      id:'Screenshot',
      buttons: [
        {
          // Add button to remove a marker
          id: 'take_screenshot',
          icon: VIM.React.Icons.camera,
          tip: 'Take Screenshot',
          action: () => TakeScreenshot(viewer)
        }
      ]}
    ])
  })
}

async function TakeScreenshot(viewer: VIM.React.Webgl.ViewerRef) {
    // required because renderer.onDemand = true
    viewer.core.renderer.needsUpdate = true; 
    // Fresh render to make sure the screenshot buffer is not cleared
    viewer.core.renderer.render();
    
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
    const url = viewer.core.renderer.renderer.domElement.toDataURL('image/png');
    
    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = "screenshot.png";
    link.click();
}
