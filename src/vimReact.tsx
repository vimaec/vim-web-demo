// eslint-disable-next-line no-use-before-define
import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import urlLogo from './assets/logo.png'
import './style.css'

const canvasId = 'vim-canvas'


export type Progress = 'processing'| number | string
export type Table = [string, string][]
export function buildUI(){
  // Create container for React
  const ui = document.createElement('div')
  ui.className = 'vim'
  ui.style.height = '100%'
  document.body.append(ui)

  // Render
  const hooks = {
    setProgress: null as (p: Progress) => void,
    setTable: null as (p: Table) => void
   }
  ReactDOM.render(<VimUI hook={hooks} />, ui)
  return {
    canvas: canvasId,
    setProgress: (p:Progress) => hooks.setProgress(p),
    setTable: (t: Table) => hooks.setTable(t)
  }
}

function VimUI (props: {hook:any }) {
  const [progress, setProgress] = useState<Progress>()
  props.hook.setProgress = setProgress

  const [table, setTable] = useState<Table>()
  props.hook.setTable = setTable

  return (
    <>
      <canvas id={canvasId}> </canvas>
      <Logo />
      <VimLoadingBox progress={progress} />
      <BimData data={table}/>
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

function BimData(prop: { data: Table })
{
  if(!prop.data) return null

  const set = new Set(["Type", "Name", "FamilyName", "Id"])
  const mains = prop.data.filter(pair => set.has(pair[0])).map((pair, index) => {
    return <tr key={'main-tr' + index} >
      <th key={'main-th' + index}>{pair[0]}</th>
      <td key={'main-td' + index}>{pair[1]}</td>
    </tr>
  })
  
  const details = prop.data.filter(pair => !set.has(pair[0])).map((pair, index) => {
    return <tr key={'details-tr' + index} >
      <th key={'details-th' + index}>{pair[0]}</th>
      <td key={'details-td' + index}>{pair[1]}</td>
    </tr>
  })

  return(
    <div className="vim-bim-explorer">
      <h1>Bim Inspector</h1>
      <div className="main">
        <table>
          <tbody>
            {mains}
          </tbody>
        </table>
      </div>
      <p></p>
      <div className="details">
        <table>
          <thead>
            <tr><th>Details</th></tr>
          </thead>
          <tbody>
            {details}
          </tbody>
        </table>
      </div>

    </div>
  )
}
