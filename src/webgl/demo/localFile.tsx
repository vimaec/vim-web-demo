import React, { ChangeEvent, useEffect, useRef } from 'react';
import * as VIM from 'vim-web';

import Webgl = VIM.React.Webgl;
import ViewerRef = VIM.React.Webgl.ViewerRef;

export function WebglLocalFile() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<ViewerRef>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    createComponent(containerRef, viewerRef);
    return () => viewerRef.current?.dispose();
  }, []);

  const handleOpen = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    fileInputRef.current!.hidden = true;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result;
      if (!(content instanceof ArrayBuffer)) return;

      const viewer = viewerRef.current!;
      viewer.modal.loading({ progress: -1, mode: '%', message: 'Loading from Disk' });

      await delay(1000);

      try {
        const vim = await viewer.loader.open({ buffer: content }, {});
        viewer.loader.add(vim);
      } finally {
        viewer.modal.loading(undefined);
        viewer.camera.frameScene.call();
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <>
      <div ref={containerRef} className="vc-inset-0 vc-absolute" />
      <div className="navigation vc-fixed vc-top-10 vc-left-1/2 vc--translate-x-1/2 vc-z-50 vc-flex vc-flex-col vc-gap-1">
        <input
          ref={fileInputRef}
          name="fileBrowserInput"
          type="file"
          accept=".vim"
          onChange={handleOpen}
        />
      </div>
    </>
  );
}

async function createComponent(
  containerRef: React.RefObject<HTMLDivElement>,
  viewerRef: React.MutableRefObject<ViewerRef | undefined>
) {
  if (!containerRef.current) return;

  const viewer = await Webgl.createViewer(containerRef.current);
  viewerRef.current = viewer;
  globalThis.viewer = viewer;
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
