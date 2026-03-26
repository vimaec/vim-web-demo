import React, { useEffect, useRef } from 'react'
import * as VIM  from 'vim-web'
import { useUltraTower } from '../ultraUtils'

type UltraVim = VIM.Core.Ultra.IUltraVim

export function NodeEffects () {
  const div = useRef<HTMLDivElement>(null)
  const [, tower] = useUltraTower(div)

  useEffect(() => {
    if (!tower) return
    void changeState(tower)
  }, [tower])

  return (
    <div ref={div} className='vc-inset-0 vc-absolute'/>
  )
}

async function changeState (tower: UltraVim) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    tower.getAllElements().forEach(e => {
      e.outline = true
    })
    await new Promise(resolve => setTimeout(resolve, 2000))

    tower.getAllElements().forEach(e => {
      e.outline = false
      e.ghosted = true
    })
    await new Promise(resolve => setTimeout(resolve, 2000))

    tower.getAllElements().forEach(e => {
      e.ghosted = false
      e.visible = false
    })
    await new Promise(resolve => setTimeout(resolve, 2000))

    tower.getAllElements().forEach(e => {
      e.visible = true
    })
    await new Promise(resolve => setTimeout(resolve, 2000))
  }
}
