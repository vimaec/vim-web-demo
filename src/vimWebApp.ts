import { settingsGui } from './settingsGui'
import { buildUI } from './vimReact'
import {Viewer} from 'vim-webgl-viewer'
import Stats from 'stats-js'

// Parse URL
const params = new URLSearchParams(window.location.search)
const url = params.has('model')
  ? params.get('model')
  : 'https://vim.azureedge.net/samples/residence.vim'

const canvasId = buildUI(Viewer.stateChangeEventName)

const viewer = new Viewer({
  mouseOrbit: false,
  canvasId: canvasId,
  url: url,
  object: {
    scale: 0.1,
    rotation: { x: 270 },
    position: { y: 0 }
  },
  plane: {
    show: true,
    texture:
    'https://vimdevelopment01storage.blob.core.windows.net/textures/vim-floor-soft.png',
    opacity: 1,
    size: 5
  },
})

// Make viewer accessible in console
globalThis.viewer = viewer

// Add a new DAT.gui controller
settingsGui.bind(viewer.settings, (settings) => {
  viewer.settings = settings
  viewer.ApplySettings()
})

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



