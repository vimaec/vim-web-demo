import React, { useEffect, useRef } from 'react'
import { useUltra } from '../ultraUtils'
import * as Urls from '../../urls'

export function AbortError () {
  const div = useRef<HTMLDivElement>(null)
  const ultra = useUltra(div)

  useEffect(() => {
    if (!ultra) return
    ;(async () => {
      await ultra.core.connect()
      const request = ultra.load({url:Urls.residence})
      request.abort()
    })()
  }, [ultra])

  return (
    <div ref={div} className='vc-inset-0 vc-absolute'/>
  )
}
