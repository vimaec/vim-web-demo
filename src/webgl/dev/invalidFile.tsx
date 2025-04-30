import React, { useRef } from 'react'
import { useWebglViewerWithModel } from '../webglUtils'
import * as Urls from '../../urls'
  
export function WebglInvalidFile () {
  const div = useRef<HTMLDivElement>(null)

  useWebglViewerWithModel(div, Urls.notAVim)

  return (
    <div ref={div} className='vc-inset-0 vc-absolute'/>
  )
}
