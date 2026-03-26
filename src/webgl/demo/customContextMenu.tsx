import React, { useEffect, useRef } from 'react'
import { useWebglResidence } from '../webglUtils'
import * as VIM from 'vim-web'

export function CustomContextMenu () {
  const div = useRef<HTMLDivElement>(null)
  const [viewer, vim] = useWebglResidence(div)

  useEffect(() => {
    if (!viewer || !vim) return

    let colored = false
    viewer.contextMenu.customize((menu) =>[
      ...menu,
      {
        type: 'button',
        id : 'custom',
        label: 'Toggle Random Colors',
        action: () => {
          colored = !colored
          vim.getAllElements().forEach((e) => {
            e.color = colored
              ? new VIM.THREE.Color(Math.random(), Math.random(), Math.random())
              : undefined
          })
        },
        enabled: true, keyboard: undefined
      }
    ])

  }, [vim])

  return <div ref={div} className='vc-inset-0 vc-absolute'/>
}
