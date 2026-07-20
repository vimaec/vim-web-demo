import React, { useEffect, useRef } from 'react'
import * as VIM  from 'vim-web'
import { useUltraResidence } from '../ultraUtils'
import { generateRandomIndices } from '../testUtils'

type ViewerApi = VIM.React.Ultra.ViewerApi
type UltraVim = VIM.Core.Ultra.IUltraVim

export function Camera () {
  const div = useRef<HTMLDivElement>(null)
  const [ultra, residence] = useUltraResidence(div)

  useEffect(() => {
    if (!ultra || !residence) return
    void framing(ultra, residence)
  }, [residence])

  return (
    <div ref={div} className='vc-inset-0 vc-absolute'/>
  )
}

async function framing (ultra: ViewerApi, residence: UltraVim)  {

  // Wait for the user to get ready
  await new Promise(resolve => setTimeout(resolve, 2000))

  for (let i = 0; i < 5; i++) {
    const indices = generateRandomIndices(5, 40_000)
    highlight(residence, indices)

    // Test framing with 5 indices
    console.log('Framing 5 random indices')
    const box = await residence.scene.getBoundingBoxForElements(indices)
    const position = box ? await ultra.core.camera.lerp(1).frame(box) : undefined
    if (position?.isValid()) {
      console.log('Saving position')
      ultra.core.camera.save(position)
    }
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Test framing whole model
    console.log('Framing whole model')
    await ultra.core.camera.lerp(1).frame(residence)
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Restore the saved camera position
    console.log('Resetting camera to last saved position')
    ultra.core.camera.snap().reset()
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Test frameAll
    console.log('Framing whole scene')
    await ultra.core.camera.lerp(1).frame('all')
    await new Promise(resolve => setTimeout(resolve, 2000))
  }

  // Test framing with a large number of indices
  const indices = generateRandomIndices(80_000, 120_000)
  highlight(residence, indices)
  const box = await residence.scene.getBoundingBoxForElements(indices)
  if (box) await ultra.core.camera.lerp(1).frame(box)
}

function highlight (residence: UltraVim, indices: number[]) {
  residence.getAllElements().forEach((e) => {
    e.visible = true
    e.outline = false
    e.ghosted = false
  })
  indices.forEach((i) => {
    const e = residence.getElement(i)
    if (e) e.outline = true
  })
}
