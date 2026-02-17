import React, { useRef } from 'react'
import { useWebglViewerWithResidence } from '../webglUtils'
import * as DevUrls from '../../urls'

export function WebglUnload () {
  const div = useRef<HTMLDivElement>(null)

  useWebglViewerWithResidence(div, async (viewer, vim) =>{
    await new Promise(resolve => setTimeout(resolve, 1000))
    viewer.remove(vim)

    await new Promise(resolve => setTimeout(resolve, 1000))
    const request = viewer.load({
      url: DevUrls.residence
    })
    const result = await request.getResult()
    if (result.isSuccess) {
      viewer.camera.frameScene.call()
    }
  })
  
  return (
    <div ref={div} className='vc-inset-0 vc-absolute'/>
  )
}
