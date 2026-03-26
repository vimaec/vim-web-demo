import React, { useEffect, useRef } from 'react'
import { useUltra } from '../ultraUtils'
import * as Urls from '../../urls'

export function LoadError () {
  const div = useRef<HTMLDivElement>(null)
  const ultra = useUltra(div)

  useEffect(() => {
    if (!ultra) return
    ;(async () => {
      await ultra.core.connect()
      ultra.load({url:Urls.notAVim})
    })()
  }, [ultra])

  return (
    <div ref={div} className='vc-inset-0 vc-absolute'/>
  )
}
