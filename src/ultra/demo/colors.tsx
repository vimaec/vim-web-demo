import React, { useEffect, useRef } from 'react'
import * as VIM  from 'vim-web'
import { useUltraTower } from '../ultraUtils'

export function Colors () {
  const div = useRef<HTMLDivElement>(null)
  const [, tower] = useUltraTower(div)

  useEffect(() => {
    if (!tower) return
    tower.getAllElements().forEach(e => {
      e.color = new VIM.THREE.Color(Math.floor(Math.random() * 0xFFFFFFFF))
    })
  }, [tower])

  return (
    <div ref={div} className='vc-inset-0 vc-absolute'/>
  )
}
