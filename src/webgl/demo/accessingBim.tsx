import { WebglViewerWithResidence } from '../webglUtils'

export function AccessingBim () {

  return WebglViewerWithResidence((viewer, vim) =>{
    viewer.modal.message({title:"Bim Demo", body:"Check console for BIM element info"})
    setTimeout(() => viewer.modal.message(undefined), 2000)

    viewer.core.selection.onSelectionChanged.sub(async () => {
      const elements = viewer.core.selection.getAll().filter(e => e.type === 'Element3D')
      const first = elements[0]
      const bimElement = await first?.getBimElement()
      if (!bimElement) return
      console.log("Element Id:", bimElement.id)
      console.log("Element Name", bimElement.name)
      console.log("Element Type:", bimElement.type)
      console.log("Family Name:", bimElement.familyName)

      console.log(bimElement)
    })
  })
}
