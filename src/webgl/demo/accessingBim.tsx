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
      console.log("Element Name:", bimElement.name)
      console.log("Element Type:", bimElement.type)
      
      // Get the category from the category table
      // Direct accessors such as element.category are no longer available
      const category = await vim.bim.category.get(bimElement.categoryIndex)
      console.log("Element Category:", category.name)

      // Get the level information from the level table
      // Then back to element, because a level is also an element
      const level = await vim.bim.level.get(bimElement.levelIndex)
      const levelElement = await vim.bim.element.get(level.elementIndex)
      console.log("Element Level:", levelElement.name)

      // For family Type, you need to find the family related to the element at hand first
      // Once you have the family instance, you got to family type, and then back to element to get the name
      const familyInstances = await vim.bim.familyInstance.getAll()
      const familyInstance = familyInstances.find(fi => fi.elementIndex === bimElement.index)
      const familyType = await vim.bim.familyType.get(familyInstance.familyTypeIndex)
      const familyTypeElement = await vim.bim.element.get(familyType.elementIndex)
      console.log("Family Type Name:", familyTypeElement.name)
    })
  })
}
