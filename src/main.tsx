import 'vim-webgl-component/dist/style.css';
import {THREE, VIM, createVimComponent, getLocalSettings } from 'vim-webgl-component'
import { Object3D } from 'vim-webgl-viewer';

// Parse URL
const params = new URLSearchParams(window.location.search)
let url = params.has('vim') || params.has('model')
  ? params.get('vim') ?? params.get('model') 
  : 'https://vim.azureedge.net/samples/residence.v1.2.75.vim'

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

demo()
async function demo () {
  const cmp = await createVimComponent(undefined, getLocalSettings())

  const request = await cmp.loader.request({
    url: url ?? 'https://vim.azureedge.com/samples/Wolford_Residence.r2025.vim'
  }, {
    rotation: new THREE.Vector3(270, 0, 0)
  })

  for await (const progress of request.getProgress()) {
    console.log(`Downloading Vim (${(progress.loaded / 1000).toFixed(0)} kb)`)
  }
  const result = await request.getResult()
  if (result.isError()) {
    console.error(result.error)
    return
  }
  const vim = result.result
  cmp.loader.add(vim)

  globalThis.THREE = THREE
  globalThis.component = cmp
  globalThis.vim = vim

  // Example: select a specific element in the file and log its bimElement data to the console
  // var [obj] = vim.getObjectsFromElementId(348218) as Object3D[]
  // cmp.viewer.selection.add(obj)
  // var bimElement = await obj.getBimElement()
  // console.log(bimElement)
}


