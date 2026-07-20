import React, { useEffect, useRef } from 'react'
import * as VIM  from 'vim-web'
import { useUltraResidence } from '../ultraUtils'

type UltraVim = VIM.Core.Ultra.IUltraVim

export function NodeEffects () {
  const div = useRef<HTMLDivElement>(null)
  const [, residence] = useUltraResidence(div)

  useEffect(() => {
    if (!residence) return
    void changeState(residence)
  }, [residence])

  return (
    <div ref={div} className='vc-inset-0 vc-absolute'/>
  )
}

async function changeState (residence: UltraVim) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    residence.getAllElements().forEach(e => {
      e.outline = true
    })
    await new Promise(resolve => setTimeout(resolve, 2000))

    residence.getAllElements().forEach(e => {
      e.outline = false
      e.ghosted = true
    })
    await new Promise(resolve => setTimeout(resolve, 2000))

    residence.getAllElements().forEach(e => {
      e.ghosted = false
      e.visible = false
    })
    await new Promise(resolve => setTimeout(resolve, 2000))

    residence.getAllElements().forEach(e => {
      e.visible = true
    })
    await new Promise(resolve => setTimeout(resolve, 2000))
  }
}
