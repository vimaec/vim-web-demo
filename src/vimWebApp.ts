//import { settingsGui } from './settingsGui'
import { buildUI } from './vimReact'
import * as VIM from 'vim-webgl-viewer/'
import Stats from 'stats-js'

// Parse URL
const params = new URLSearchParams(window.location.search)
let url = params.has('vim')
  ? params.get('vim')
  : 'https://vim.azureedge.net/samples/residence.vim'

url = params.has('model')
? params.get('model')
: 'https://vim.azureedge.net/samples/residence.vim'


let transparency = 'all' as VIM.Transparency.Mode
if (params.has('transparency')) {
  const t = params.get('transparency')
  transparency = VIM.Transparency.isValid(t) ? t : 'all'
}

// Create Viewer
const [canvasId, setProgress] = buildUI()

const viewer = new VIM.Viewer({
  canvas: {id : canvasId},
  groundPlane: {
    show: true,
    texture:
      'https://vimdevelopment01storage.blob.core.windows.net/textures/vim-floor-soft.png',
    opacity: 1,
    size: 5
  }
})
viewer.camera

// Load Model
viewer.loadVim(
  url,
  {
    position: {x: 0, y: 0, z:0},
    rotation: { x: 270, y: 0, z: 0 },
    scale: 0.1,
    transparency: transparency,
  },
  (progress) => setProgress(progress.loaded)
).then(_ => setProgress(undefined))

// Make viewer accessible in console
globalThis.viewer = viewer

/*
// Add a new DAT.gui controller
settingsGui.bind(viewer.settings, (settings) => {
  viewer.settings = settings
  viewer.ApplySettings()
})
*/

// Add Stats display
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



