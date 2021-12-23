//import { settingsGui } from './settingsGui'
import { buildUI } from './vimReact'
import {Viewer} from 'vim-webgl-viewer'
import Stats from 'stats-js'

// Parse URL
const params = new URLSearchParams(window.location.search)
const url = params.has('model')
  ? params.get('model')
  : 'https://vim.azureedge.net/samples/residence.vim'


const canvasId = buildUI(Viewer.stateChangeEvent)

const viewer = new Viewer({
  canvas: {id : canvasId},
  plane: {
    show: true,
    texture:
      'https://vimdevelopment01storage.blob.core.windows.net/textures/vim-floor-soft.png',
    opacity: 1,
    size: 5
  }
})

viewer.loadModel(
  {
    url: url,
    rotation: { x: 270, y: 0, z: 0 }
  },
  (vim) => console.log('Callback: Viewer Ready!'),
  (progress) => {
    if (progress === 'processing') console.log('Callback: Processing')
    else {
      console.log(`Callback: Downloading: ${progress.loaded / 1000000} MB`)
    }
  },
  (error) => console.error('Callback: Error: ' + error.message)
)

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



