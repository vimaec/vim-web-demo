import React, { useEffect, useRef } from 'react'
import { useWebglResidence } from '../webglUtils'
import * as VIM from 'vim-web'

export function CustomControlBar () {
  const div = useRef<HTMLDivElement>(null)
  const [viewer] = useWebglResidence(div)

  useEffect(() => {
    if (!viewer) return
    viewer.controlBar.customize((bar) => [{
      id:'custom',
      buttons:[{
        id:'custom_button',
        tip:'Custom Button',
        action:() => viewer.core.camera.lerp(1).orbitTowards(new VIM.THREE.Vector3(0, 0, -1)),
        icon:VIM.React.Icons.checkmark
      }]
    }])
  }, [viewer])

  return <div ref={div} className='vc-inset-0 vc-absolute'/>
}
