import React, { useEffect, useRef } from 'react'
import { useWebglResidence } from '../webglUtils'
import * as VIM from 'vim-web'

export function Screenshot () {
  const div = useRef<HTMLDivElement>(null)
  const [viewer] = useWebglResidence(div)

  useEffect(() => {
    if (!viewer) return
    viewer.controlBar.customize((bar) => [{
      id:'Screenshot',
      buttons: [
        {
          id: 'take_screenshot',
          icon: VIM.React.Icons.camera,
          tip: 'Take Screenshot',
          action: () => TakeScreenshot(viewer)
        }
      ]}
    ])
  }, [viewer])

  return <div ref={div} className='vc-inset-0 vc-absolute'/>
}

async function TakeScreenshot(viewer: VIM.React.Webgl.ViewerApi) {
    // required because renderer.onDemand = true
    viewer.core.renderer.requestRender();
    // Fresh render to make sure the screenshot buffer is not cleared
    viewer.core.renderer.render();

    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
    const url = viewer.core.renderer.three.domElement.toDataURL('image/png');

    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = "screenshot.png";
    link.click();
}
