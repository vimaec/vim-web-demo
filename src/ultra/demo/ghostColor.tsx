import React, { useRef } from 'react'
import * as VIM  from 'vim-web'
import { useUltraWithWolford } from '../ultraUtils'

import NodeState = VIM.Core.Ultra.VisibilityState
import ViewerRef = VIM.React.Ultra.ViewerRef
import Vim = VIM.Core.Ultra.Vim
import RGBA = VIM.Core.Ultra.RGBA

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
  ultra.core.renderer.ghostColor = new RGBA(1, 0, 0, 0.25)

  await new Promise(resolve => setTimeout(resolve, 1000))
  ultra.core.renderer.ghostColor = new RGBA(0, 1, 0, 0.25)

  await new Promise(resolve => setTimeout(resolve, 1000))
  ultra.core.renderer.ghostColor = new RGBA(0, 0, 1, 0.25)
}
