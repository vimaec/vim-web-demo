import React, { useRef } from 'react'
import * as VIM  from 'vim-web'
import { useUltraWithWolford } from '../ultraUtils'

import NodeState = VIM.Core.Ultra.VisibilityState
import ViewerRef = VIM.React.Ultra.ViewerRef
import Vim = VIM.Core.Ultra.Vim

export function GhostColor () {
  const div = useRef<HTMLDivElement>(null)

  useUltraWithWolford(div, (ultra, _tower) => {
    void toggleLock(ultra, _tower)
  })

  return (
    <div ref={div} className='vc-inset-0 vc-absolute'/>
  )
}

async function toggleLock (ultra: ViewerRef, vim: Vim) {
  vim.getAllElements().forEach(e => {
    e.state = NodeState.GHOSTED
  })
  ultra.core.renderer.ghostColor = new VIM.THREE.Color(1, 0, 0)

  await new Promise(resolve => setTimeout(resolve, 1000))
  ultra.core.renderer.ghostColor = new VIM.THREE.Color(0, 1, 0)

  await new Promise(resolve => setTimeout(resolve, 1000))
  ultra.core.renderer.ghostColor = new VIM.THREE.Color(0, 0, 1)
}
