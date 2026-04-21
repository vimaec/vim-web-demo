import React, { useEffect, useRef } from 'react'
import { useUltra } from '../ultraUtils'
import * as Urls from '../../urls'
import * as VIM from 'vim-web'

type ViewerApi = VIM.React.Ultra.ViewerApi

export function Home () {
  const div = useRef<HTMLDivElement>(null)
  const ultra = useUltra(div)

  useEffect(() => {
    if (!ultra) return
    void loadFile(ultra)
  }, [ultra])

  return (
    <div ref={div} className='vc-inset-0 vc-absolute'/>
  )
}

async function loadFile (viewer: ViewerApi) {
  await viewer.core.connect()
  const request = viewer.load({url:getPathFromUrl() ?? Urls.medicalTower})
  await request.getResult()
  await viewer.core.camera.snap().frame('all')
}

function getPathFromUrl () {
  const params = new URLSearchParams(window.location.search)
  return params.get('vim') ?? undefined
}
