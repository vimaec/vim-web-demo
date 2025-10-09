import React, { useRef } from 'react'
import * as VIM  from 'vim-web'
import { useUltraWithTower } from '../ultraUtils'

import ViewerRef = VIM.React.Ultra.ViewerRef
import Vim = VIM.Core.Ultra.Vim
import RGBA32 = VIM.Core.Ultra.RGBA32

export function Colors () {
  const div = useRef<HTMLDivElement>(null)

  useUltraWithTower(div, (ultra, tower) => {
    void createColors(ultra, tower)
  })

  return (
    <div ref={div} className='vc-inset-0 vc-absolute'/>
  )
}

async function createColors (ultra: ViewerRef, tower:Vim) {
  tower.getAllElements().forEach(e => {
    e.color = new RGBA32(Math.floor(Math.random() * 0xFFFFFFFF))
  })
}
