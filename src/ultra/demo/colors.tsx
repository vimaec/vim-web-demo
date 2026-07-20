import React, { useEffect, useRef } from 'react'
import * as VIM  from 'vim-web'
import { useUltraResidence } from '../ultraUtils'

export function Colors () {
  const div = useRef<HTMLDivElement>(null)
  const [, residence] = useUltraResidence(div)

  useEffect(() => {
    if (!residence) return
    residence.getAllElements().forEach(e => {
      e.color = new VIM.THREE.Color(Math.floor(Math.random() * 0xFFFFFFFF))
    })
  }, [residence])

  return (
    <div ref={div} className='vc-inset-0 vc-absolute'/>
  )
}
