import * as VIM from 'vim-web'
import THREE = VIM.THREE
import { AccessTokenPanel } from '../../utils/accesToken'

import Webgl = VIM.React.Webgl

export function WebglAccessToken () {
  return AccessTokenPanel(createComponent)
}

async function createComponent (div: HTMLDivElement, url: string, token: string) {
  const webgl = await Webgl.createViewer(div)
  const request = webgl.loader.request(
    {
      url,
      headers: {
        Authorization: token
      }
    },
    { rotation: new THREE.Vector3(270, 0, 0) }
  )

  const result = await request.getResult()
  if (result.isSuccess()) {
    webgl.loader.add(result.result)
    webgl.camera.frameScene.call()
  }
  return webgl
}
