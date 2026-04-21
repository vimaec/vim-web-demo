import * as VIM from 'vim-web'
import * as Urls from '../urls'
import { useRef, useEffect, useState, RefObject } from 'react'

const Ultra = VIM.React.Ultra
type ViewerApi = VIM.React.Ultra.ViewerApi
type UltraVim = VIM.Core.Ultra.IUltraVim

/**
 * Creates an Ultra viewer and returns it as state once ready.
 */
export function useUltra (div: RefObject<HTMLDivElement>): ViewerApi | undefined {
  const viewerRef = useRef<ViewerApi>()
  const [viewer, setViewer] = useState<ViewerApi>()

  useEffect(() => {
    let disposed = false
    Ultra.createViewer(div.current!).then((v) => {
      if (disposed) {
        v.dispose()
        return
      }
      viewerRef.current = v
      ;(globalThis as any).ultra = v
      setViewer(v)
    })

    return () => {
      disposed = true
      viewerRef.current?.dispose()
    }
  }, [])

  return viewer
}

/**
 * Creates an Ultra viewer, connects, and loads a model.
 * Returns [viewer, vim] as state.
 */
export function useUltraModel (div: RefObject<HTMLDivElement>, model: string): [ViewerApi | undefined, UltraVim | undefined] {
  const viewer = useUltra(div)
  const [vim, setVim] = useState<UltraVim>()

  useEffect(() => {
    if (!viewer) return
    let cancelled = false
    ;(async () => {
      await viewer.core.connect()
      if (cancelled) return
      const result = await viewer.load({ url: model }).getResult()
      if (cancelled) return
      if (result.isSuccess) {
        setVim(result.vim)
      }
    })()
    return () => { cancelled = true }
  }, [viewer])

  return [viewer, vim]
}

/**
 * Creates an Ultra viewer, connects, and loads the medical tower.
 */
export function useUltraTower (div: RefObject<HTMLDivElement>) {
  return useUltraModel(div, Urls.medicalTower)
}

/**
 * Creates an Ultra viewer, connects, and loads the residence.
 */
export function useUltraResidence (div: RefObject<HTMLDivElement>) {
  return useUltraModel(div, Urls.residence)
}
