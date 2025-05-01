import { WebglViewerWithResidence } from '../webglUtils'

export function AccessingBim () {
  return WebglViewerWithResidence((viewer, vim) =>{
    viewer.core.selection.onSelectionChanged.sub(async () => {
      const elements = viewer.core.selection.getAll().filter(e => e.type === 'Element3D')
      const first = elements[0]
      const bimElement = await first.getBimElement()
      console.log("Element Id:", bimElement.id)
      console.log("Element Name", bimElement.name)
      console.log("Element Type:", bimElement.type)
      console.log("Family Name:", bimElement.familyName)

      console.log(bimElement)
    })
  })
}
