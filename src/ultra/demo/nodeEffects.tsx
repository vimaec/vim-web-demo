import React, { useRef } from 'react'
import * as VIM  from 'vim-web'
import { useUltraWithTower } from '../ultraUtils'

import ViewerRef = VIM.React.Ultra.ViewerRef
import Vim = VIM.Core.Ultra.Vim
import VisibilityState = VIM.Core.Ultra.VisibilityState

export function NodeEffects () {
  const div = useRef<HTMLDivElement>(null)

  useUltraWithTower(div, (ultra, tower) => {
    void changeState(ultra, tower)
  })

  return (
    <div ref={div} className='vc-inset-0 vc-absolute'/>
  )
}

async function changeState (ultra: ViewerRef, tower: Vim) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    tower.getAllElements().forEach(e => {
      e.state = VisibilityState.HIGHLIGHTED
    })
    await new Promise(resolve => setTimeout(resolve, 2000))

    tower.getAllElements().forEach(e => {
      e.state = VisibilityState.GHOSTED
    })
    await new Promise(resolve => setTimeout(resolve, 2000))

    tower.getAllElements().forEach(e => {
      e.state = VisibilityState.HIDDEN
    })
    await new Promise(resolve => setTimeout(resolve, 2000))

    tower.getAllElements().forEach(e => {
      e.state = VisibilityState.VISIBLE
    })
    await new Promise(resolve => setTimeout(resolve, 2000))
  }
}
