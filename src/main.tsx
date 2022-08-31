//import { settingsGui } from './settingsGui'
import Stats from 'stats-js'
import {createRoot} from 'react-dom/client'
import React from 'react'
import 'vim-webgl-component/dist/style.css';
import {VIM, VimComponent, createContainer } from 'vim-webgl-component'

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

// Parse Dev mode
let devMode = false
if (params.has('dev')) {
  const t = params.get('dev')
  devMode =  t === 'true'
}

const viewer = new VIM.Viewer()
const root = createRoot(createContainer(viewer))
root.render(<VimComponent viewer = {viewer} onMount = {loadVim}/>)

function loadVim(){
  globalThis.viewer = viewer
  viewer.loadVim(
    url,
    {
      rotation: { x: 270, y: 0, z: 0 },
      transparency : transparency
    } 
  ).then(_ => console.log("Vim Successfully loaded"))
}

// Add the FPS Counter
const stats = new Stats()
const style = stats.dom.style as CSSStyleDeclaration
style.right = '24px'
style.left = 'auto'
style.top = '200px'
// -half width

document.body.appendChild(stats.dom)
animate()

function animate () {
  requestAnimationFrame(() => animate())

  if (stats) {
    stats.update()
  }
}



