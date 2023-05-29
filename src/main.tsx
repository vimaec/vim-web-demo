//import { settingsGui } from './settingsGui'
import 'vim-webgl-component/dist/style.css';
import {VIM, createVimComponent, VimComponentRef, getLocalSettings } from 'vim-webgl-component'

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

createVimComponent(loadVim, undefined, getLocalSettings())

async function loadVim(ref: VimComponentRef){

  globalThis.vimComponent = ref
  const vim = await ref.loader.load(url,
    {
      rotation: new VIM.THREE.Vector3(270, 0, 0)
    }
  )
  ref.viewer.add(vim)
  globalThis.VIM = VIM
  console.log("Vim Successfully loaded")
}




