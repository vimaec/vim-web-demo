//import { settingsGui } from './settingsGui'
import * as VIM from 'vim-webgl-viewer'
import * as VR from  'vim-webgl-component'
import Stats from 'stats-js'
import ReactDOM from 'react-dom'
import React from 'react'
import 'vim-webgl-component/dist/style.css';

// Parse URL
const params = new URLSearchParams(window.location.search)
let url = params.has('vim') || params.has('model')
  ? params.get('vim') ?? params.get('model') 
  : 'https://vim.azureedge.net/samples/residence.vim'

// Parse Transparency
let transparency = 'all' as VIM.Transparency.Mode
if (params.has('transparency')) {
  const t = params.get('transparency')
  transparency = VIM.Transparency.isValid(t) ? t : 'all'
}

ReactDOM.render(<VR.VimComponent onViewerReady={onViewerReady}/>, VR.createRoot())

function onViewerReady(viewer : VIM.Viewer){
  viewer.loadVim(
    url,
    {
      rotation: { x: 270, y: 0, z: 0 },
      transparency : transparency
    } 
  ).then(_ => console.log("Vim Successfully loaded"))
}

const stats = new Stats()
stats.dom.style.top = '84px'
stats.dom.style.left = '16px'
document.body.appendChild(stats.dom)
animate()

function animate () {
  requestAnimationFrame(() => animate())

  if (stats) {
    stats.update()
  }
}



