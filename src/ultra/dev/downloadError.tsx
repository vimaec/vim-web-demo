import React, { useEffect, useRef } from 'react'
import { useUltra } from '../ultraUtils'

export function DownloadError () {
  const div = useRef<HTMLDivElement>(null)
  const ultra = useUltra(div)

  useEffect(() => {
    if (!ultra) return
    ;(async () => {
      await ultra.core.connect()
      ultra.load({url:'https://invalidURL.vim'})
    })()
  }, [ultra])

  return (
    <div ref={div} className='vc-inset-0 vc-absolute'/>
  )
}
