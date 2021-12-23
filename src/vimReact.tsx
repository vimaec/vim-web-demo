// eslint-disable-next-line no-use-before-define
import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import {ViewerState} from 'vim-webgl-viewer'
import urlLogo from './assets/logo.png'
import './style.css'

const canvasId = 'vim-canvas'

export function buildUI (viewerEventName: string): string {
  // Create container for React
  const ui = document.createElement('div')
  ui.className = 'vim'
  ui.style.height = '100%'
  document.body.append(ui)

  // Render
  ReactDOM.render(<VimUI eventName={viewerEventName} />, ui)
  return canvasId
}

function VimUI (props: { eventName: string }) {
  const [msg, setProgress] = useState('')

  addEventListener(props.eventName, (event: CustomEvent<ViewerState>) => {
    setProgress(FormatStateMessage(event.detail))
  })

  return (
    <>
      <canvas id={canvasId}> </canvas>
      <Logo />
      <VimLoadingBox msg={msg} />
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

function FormatStateMessage (state: ViewerState): string {

  if (state[0] === 'Downloading') {
    return `Downloading: ${Math.round((state[1] as number) / 1000000)} MB`
  }
  if (state[0] === 'Error') {
    return 'Error : ' + (state[1] as ErrorEvent).message
  }
  if (state === 'Processing') return 'Processing'
}

function VimLoadingBox (prop: { msg: string }) {
  if (!prop.msg) return null
  return (
    <div className="vim-loading-box">
      <h1> {prop.msg} </h1>
    </div>
  )
}
