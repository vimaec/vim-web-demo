import React, { useEffect, useRef } from 'react'
import * as VIM  from 'vim-web'
import { useUltraResidence } from '../ultraUtils'

type ViewerApi = VIM.React.Ultra.ViewerApi
type UltraVim = VIM.Core.Ultra.IUltraVim

export function GhostColor () {
  const div = useRef<HTMLDivElement>(null)
  const [ultra, vim] = useUltraResidence(div)

  useEffect(() => {
    if (!ultra || !vim) return
    void toggleColors(ultra, vim)
  }, [vim])

  return (
    <div ref={div} className='vc-inset-0 vc-absolute'/>
  )
}

async function toggleColors (ultra: ViewerApi, vim: UltraVim) {
  vim.getAllElements().forEach(e => {
    e.ghosted = true
  })
  ultra.core.renderer.ghostColor = new VIM.THREE.Color(1, 0, 0)

  await new Promise(resolve => setTimeout(resolve, 1000))
  ultra.core.renderer.ghostColor = new VIM.THREE.Color(0, 1, 0)

  await new Promise(resolve => setTimeout(resolve, 1000))
  ultra.core.renderer.ghostColor = new VIM.THREE.Color(0, 0, 1)
}
