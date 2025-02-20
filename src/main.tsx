import React, { useEffect, useRef } from 'react'
import { WebglReact } from 'vim-web'
import { createRoot } from 'react-dom/client'
import 'vim-web/dist/style.css';

function getPathFromUrl () {
  const params = new URLSearchParams(window.location.search)
  return params.get('vim') ?? 'https://storage.cdn.vimaec.com/samples/residence.v1.2.75.vim'
}

async function createComponent (div: HTMLDivElement, ref: React.MutableRefObject<WebglReact.Refs.VimComponentRef>) {
  const webgl = await WebglReact.createWebglComponent(div)
  ref.current = webgl
  globalThis.viewer = webgl

  const url = getPathFromUrl()
  const request = webgl.loader.request({ url } )

  const result = await request.getResult()
  if (result.isSuccess()) {
    webgl.loader.add(result.result)
    webgl.camera.frameVisibleObjects()
  }
}

export function VimWebComponent () {
  const div = useRef<HTMLDivElement>(null)
  const cmp = useRef<WebglReact.Refs.VimComponentRef>()
  useEffect(() => {
    createComponent(div.current, cmp)
    return () => cmp.current?.dispose()
  }, [])

  return (
    <div ref={div} className='vc-inset-0 vc-absolute'/>
  )
}

function App () {
  return <VimWebComponent/>
}

const container = document.getElementById('root')
if (!container) throw new Error('No container found')
const root = createRoot(container)
root.render(<App/>)
