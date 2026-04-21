import React, { useEffect, useRef } from 'react'
import { useUltra } from '../ultraUtils'

export function ConnectionError () {
  const div = useRef<HTMLDivElement>(null)
  const ultra = useUltra(div)

  useEffect(() => {
    if (!ultra) return
    void ultra.core.connect({url:'ws:/invalidServer'})
  }, [ultra])

  return (
    <div ref={div} className='vc-inset-0 vc-absolute'/>
  )
}
