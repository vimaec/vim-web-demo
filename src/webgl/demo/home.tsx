import React, { useEffect, useRef } from 'react'

import * as Urls from '../../devUrls'
import * as VIM from 'vim-web'


import ViewerRef = VIM.React.Webgl.ViewerRef

export function WebglHome () {

  const div = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<ViewerRef>()
  useEffect(() => {
    console.log('WebglHome Effect')

    let disposed = false
    VIM.React.Webgl.createViewer(div.current).then((viewer) => {
      // If was disposed before finished creating, dispose it
      if(disposed){
        console.log('WebglHome Dispose')
        viewer.dispose()
        return
      }
      viewerRef.current = viewer
      globalThis.viewer = viewer // for testing in browser console
      loadFile(viewerRef.current)
    })

    return () => {
      disposed = true
      console.log('WebglHome Dispose')
      viewerRef.current?.dispose()
    }
  }, [])

  return (
    <div ref={div} className='vc-inset-0 vc-absolute'/>
  )
}

async function loadFile (viewer: ViewerRef ) {
  const url = getPathFromUrl() ?? Urls.localResidence
  const request = viewer.loader.request(
    { url }, 
  )
  const result = await request.getResult()
  if (result.isSuccess()) {
    viewer.loader.add(result.result)
    viewer.camera.frameScene.call()
  }
}

function getPathFromUrl () {
  const params = new URLSearchParams(window.location.search)
  return params.get('vim') ?? undefined
}
