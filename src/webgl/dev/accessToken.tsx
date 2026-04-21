import * as VIM from 'vim-web'
import { AccessTokenPanel } from '../../utils/accesToken'

const Webgl = VIM.React.Webgl

export function AccessToken () {
  return AccessTokenPanel(createComponent)
}

async function createComponent (div: HTMLDivElement, url: string, token: string) {
  const webgl = await Webgl.createViewer(div)
  const request = webgl.load(
    { url, headers: VIM.Core.authHeaders(token) }
  )

  const result = await request.getResult()
  if (result.isSuccess) {
    webgl.framing.frameScene.call()
  }
  return webgl
}
