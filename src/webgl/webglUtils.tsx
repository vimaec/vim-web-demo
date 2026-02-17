import React, { RefObject, useEffect, useRef } from 'react'
import * as VIM from 'vim-web'
import * as DevUrls from '../urls'

import ViewerRef = VIM.React.Webgl.ViewerRef
import Webgl = VIM.React.Webgl
import Vim = VIM.Core.Webgl.Vim


/**
 * Custom hook to create a WebGL viewer and attach it to a div element.
 * @param div - The div element to attach the viewer to
 * @param onReady - Callback function to be called when the viewer is ready
 */
export function useWebglViewer (div: RefObject<HTMLDivElement>, onReady?: (viewer: ViewerRef) => void) {
  const viewerRef = useRef<ViewerRef>()
  useEffect(() => {
    // Track disposal to prevent async callbacks from operating on a disposed viewer
    // when navigating away before the viewer or its onReady callback finishes.
    let disposed = false
    Webgl.createViewer(div.current).then((viewer) => {
      if (disposed) {
        viewer.dispose()
        return
      }
      viewer.isolation.autoIsolate.set(true)
      viewer.isolation.showGhost.set(true)
      viewerRef.current = viewer
      globalThis.viewer = viewer
      const result = onReady?.(viewer) as any
      // Swallow errors from async onReady callbacks that fire after disposal.
      if (result?.catch) {
        result.catch((e: any) => { if (!disposed) throw e })
      }
    })

    return () => {
      disposed = true
      viewerRef.current?.dispose()
    }
  }, [])
}

/**
 * Custom hook to create a WebGL viewer and load a model into it.
 * @param div - The div element to attach the viewer to 
 * @param model - The URL of the model to load
 * @param onReady - Callback function to be called when the viewer is ready and the model is loaded
 * @returns {void}
 */
export function useWebglViewerWithModel (div: RefObject<HTMLDivElement>, model: string, onReady?: (viewer: ViewerRef, vim : Vim) => void) {
  useWebglViewer(div, async (viewer) => {
    const request = viewer.load(
      { url: model }
    )
    const result = await request.getResult()
    if (result.isSuccess) {
      viewer.core.camera.snap().frame('all')
      onReady?.(viewer, result.vim)
      return
    }
    throw new Error('Failed to load model')
  })
}

/**
 * Custom hook to create a WebGL viewer and load the residence model into it.
 * @param div - The div element to attach the viewer to
 * @param onReady - Callback function to be called when the viewer is ready
 */
export function useWebglViewerWithResidence(div: RefObject<HTMLDivElement>, onReady?: (viewer: ViewerRef, vim : Vim) => void) {
  useWebglViewerWithModel(div, DevUrls.residence, onReady)
}

/**
 * Custom hook to create a WebGL viewer and load the medical tower model into it.
 * @param div - The div element to attach the viewer to
 * @param onReady - Callback function to be called when the viewer is ready
 */
export function useWebglViewerWithTower(div: RefObject<HTMLDivElement>, onReady?: (viewer: ViewerRef) => void) {
  useWebglViewerWithModel(div, DevUrls.medicalTower, onReady)
}


/**
 * Custom hook to create a WebGL viewer and load the residence tower model into it.
 * @param div - The div element to attach the viewer to
 * @param onReady - Callback function to be called when the viewer is ready
 */
export function WebglViewerWithResidence( onReady?: (viewer: ViewerRef, vim : Vim) => void) {
  const div = useRef<HTMLDivElement>(null)
  useWebglViewerWithModel(div, DevUrls.residence, onReady)
  return (
    <div ref={div} className='vc-inset-0 vc-absolute'/>
  )
}