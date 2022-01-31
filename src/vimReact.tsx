// eslint-disable-next-line no-use-before-define
import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import {ViewerState} from 'vim-webgl-viewer'
import urlLogo from './assets/logo.png'
import './style.css'

const canvasId = 'vim-canvas'

type Progress = 'processing'| number | string
export function buildUI():[string, (state : Progress) => void]{
  // Create container for React
  const ui = document.createElement('div')
  ui.className = 'vim'
  ui.style.height = '100%'
  document.body.append(ui)

  // Render
  const obj = {state: '', set: null as (p: Progress) => void }
  ReactDOM.render(<VimUI p={obj} />, ui)
  return [canvasId, (str) => obj.set(str)]
}

function VimUI (props: {p:any }) {
  const [progress, setProgress] = useState<Progress>()
  props.p.msg = progress
  props.p.set = setProgress

  return (
    <>
      <canvas id={canvasId}> </canvas>
      <Logo />
      <VimLoadingBox progress={progress} />
    </>
  )
}

function Logo () {
  return (
    <div className="vim-logo">
      <a href="https://vimaec.com">
        <img src={urlLogo}></img>
      </a>
    </div>
  )
}

function VimLoadingBox (prop: { progress: Progress }) {
  const msg = 
  prop.progress ==='processing' ? 'Processing'
  : typeof(prop.progress) === 'number' ? `Downloading: ${Math.round(prop.progress / 1000000)} MB`
  : typeof(prop.progress) === 'string' ? `Error: ${prop.progress}`
  : undefined

  if (!msg) return null
  return (
    <div className="vim-loading-box">
      <h1> {msg} </h1>
    </div>
  )
}
