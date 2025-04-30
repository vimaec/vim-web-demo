import React, { useRef } from 'react'
import { useUltra } from '../ultraUtils'
import * as Urls from '../../urls'
import * as VIM from 'vim-web'

import ViewerRef = VIM.React.Ultra.ViewerRef

export function Home () {
  const div = useRef<HTMLDivElement>(null)
  useUltra(div, (ultra) => {
    void loadFile(ultra)
  })

  return (
    <div ref={div} className='vc-inset-0 vc-absolute'/>
  )
}

async function loadFile (viewer: ViewerRef) {
  


  const success = await viewer.core.connect()
  const request = viewer.load({url:getPathFromUrl() ?? Urls.medicalTower})
  const load = await request.getResult()
  await viewer.core.camera.frameAll(0)
  globalThis.viewer = viewer
}

function getPathFromUrl () {
  const params = new URLSearchParams(window.location.search)
  return params.get('vim') ?? undefined
}
