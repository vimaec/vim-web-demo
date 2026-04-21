import React, { useEffect, useRef } from 'react'
import { useWebglResidence } from '../webglUtils'
import * as DevUrls from '../../urls'

export function Unload () {
  const div = useRef<HTMLDivElement>(null)
  const [viewer, vim] = useWebglResidence(div)

  useEffect(() => {
    if (!viewer || !vim) return
    ;(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      viewer.unload(vim)

      await new Promise(resolve => setTimeout(resolve, 1000))
      const result = await viewer.load({ url: DevUrls.residence }).getResult()
      if (result.isSuccess) {
        viewer.framing.frameScene.call()
      }
    })()
  }, [vim])

  return (
    <div ref={div} className='vc-inset-0 vc-absolute'/>
  )
}
