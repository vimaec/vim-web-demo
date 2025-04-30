import React, { useRef } from 'react'
import { useUltra } from '../ultraUtils'
import * as VIM from 'vim-web'

import ViewerRef = VIM.React.Ultra.ViewerRef

export function ConnectionError () {
  const div = useRef<HTMLDivElement>(null)
  useUltra(div, (ultra) => {
    void badConnection(ultra)
  })

  return (
    <div ref={div} className='vc-inset-0 vc-absolute'/>
  )
}

async function badConnection (ultra: ViewerRef) {
  await ultra.core.connect({url:'ws:/invalidServer'})
}
