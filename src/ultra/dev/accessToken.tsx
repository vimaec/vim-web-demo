import * as VIM from 'vim-web'
import { AccessTokenPanel } from '../../utils/accesToken'

export function AccessToken () {
  return AccessTokenPanel(createComponent)
}
  
async function createComponent (div: HTMLDivElement, url: string, token: string) {
  const ultra = await VIM.React.Ultra.createViewer(div)
  await ultra.core.connect()
  const request = ultra.load({url: url, headers: VIM.Core.authHeaders(token)})
  await request.getResult()
  await ultra.core.camera.snap().frame('all')
  return ultra
}
