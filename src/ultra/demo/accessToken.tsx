import * as VIM from 'vim-web'
import { AccessTokenPanel } from '../../utils/accesToken'

export function AccessToken () {
  return AccessTokenPanel(createComponent)
}
  
async function createComponent (div: HTMLDivElement, url: string, token: string) {
  const ultra = await VIM.React.Ultra.createViewer(div)
  await ultra.core.connect()
  const request = ultra.load({url: url, authToken: token})
  await request.getResult()
  await ultra.core.camera.frameAll(0)
  return ultra
}
