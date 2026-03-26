import React, { useEffect, useRef } from 'react'

import * as Urls from '../../urls'
import * as VIM from 'vim-web'

type ViewerApi = VIM.React.Webgl.ViewerApi

export function Home () {

  const div = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<ViewerApi>()
  useEffect(() => {
    VIM.React.Webgl.createViewer(div.current ?? undefined).then((viewer) => {
      viewer.isolation.autoIsolate.set(true)
      viewer.isolation.showGhost.set(true)
      viewerRef.current = viewer
      ;(globalThis as any).viewer = viewer // for testing in browser console
      loadFile(viewerRef.current)
    })

    return () => {
      viewerRef.current?.dispose()
    }
  }, [])

  return (
    <div ref={div} className='vc-inset-0 vc-absolute'/>
  )
}

async function loadFile (viewer: ViewerApi ) {
  const url = getPathFromUrl() ?? Urls.residence
  const request = viewer.load(
    { url },
  )

  const result = await request.getResult()
  if (result.isSuccess) {
    viewer.framing.frameScene.call()
  }
}

function getPathFromUrl () {
  const params = new URLSearchParams(window.location.search)
  return params.get('vim') ?? undefined
}
