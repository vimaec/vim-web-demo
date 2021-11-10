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
  canvasId: canvasId,
  url: url,
  object: {
    scale: 0.1,
    rotation: { x: 270 },
    position: { y: 0 }
  },
  plane: {
    show: false
  },
  showStats: true
})

// Make viewer accessible in console
globalThis.viewer = viewer

// Add a new DAT.gui controller
if (viewer.settings.showGui) {
  settingsGui.bind(viewer.settings, (settings) => {
    viewer.settings = settings
    viewer.ApplySettings()
  })
}

// Add Stats display
let stats
if (viewer.settings.showStats) {
  stats = new Stats()
  stats.dom.style.top = '84px'
  stats.dom.style.left = '16px'
  document.body.appendChild(stats.dom)
  animate()
}

function animate () {
  requestAnimationFrame(() => animate())

  if (stats) {
    stats.update()
  }
}



