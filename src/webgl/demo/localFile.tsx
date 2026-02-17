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
      viewer.modal.loading({ progress: -1, mode: 'percent', message: 'Loading from Disk' });

      await delay(1000);

      try {
        const vim = await viewer.load({ buffer: content }, {});
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

  // ==================== TMP TESTING CODE START ====================
  // Create file input button
  const button = document.createElement('button');
  button.textContent = 'Load Local VIM File';
  button.style.cssText = 'position:absolute;top:10px;left:10px;z-index:9999;padding:10px 20px;background:#4CAF50;color:white;border:none;border-radius:5px;cursor:pointer;font-size:14px;font-weight:bold;';
  document.body.appendChild(button);

  // Create file input (hidden)
  const tmpFileInput = document.createElement('input');
  tmpFileInput.type = 'file';
  tmpFileInput.accept = '.vim';
  tmpFileInput.style.display = 'none';
  document.body.appendChild(tmpFileInput);

  // Create stats display
  const statsDiv = document.createElement('div');
  statsDiv.style.cssText = 'position:absolute;top:60px;left:10px;z-index:9999;background:rgba(0,0,0,0.8);color:#0f0;padding:10px;font-family:monospace;font-size:12px;border-radius:5px;';
  document.body.appendChild(statsDiv);

  button.onclick = () => tmpFileInput.click();

  tmpFileInput.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    statsDiv.innerHTML = 'Loading...';
    const loadStartTime = performance.now();

    try {
      const buffer = await file.arrayBuffer();
      const request = viewer.load({ buffer });

      const result = await request.getResult();
      const loadEndTime = performance.now();
      const loadTime = ((loadEndTime - loadStartTime) / 1000).toFixed(2);

      if (result.isError) {
        statsDiv.innerHTML = `Error: ${result.error}`;
        return;
      }

      if (!result.isSuccess) return;

      const vim = result.vim;
      const elementCount = vim.getAllElements().length;

      statsDiv.innerHTML = `Load Time: ${loadTime}s<br>Measuring FPS...`;

      // Frame camera
      viewer.camera.frameScene.call();

      // Measure FPS for 5 seconds
      let frameCount = 0;
      const fpsStartTime = performance.now();
      let lastFrameTime = fpsStartTime;
      const fpsSamples: number[] = [];

      const measureFPS = () => {
        const now = performance.now();
        const delta = now - lastFrameTime;
        const fps = 1000 / delta;
        fpsSamples.push(fps);
        frameCount++;
        lastFrameTime = now;

        const elapsed = (now - fpsStartTime) / 1000;

        if (elapsed < 5) {
          const avgFPS = fpsSamples.reduce((a, b) => a + b, 0) / fpsSamples.length;
          const minFPS = Math.min(...fpsSamples);
          const maxFPS = Math.max(...fpsSamples);

          statsDiv.innerHTML = `
Load Time: ${loadTime}s<br>
Elements: ${elementCount}<br>
Elapsed: ${elapsed.toFixed(1)}s / 5.0s<br>
Frames: ${frameCount}<br>
Current FPS: ${fps.toFixed(1)}<br>
Avg FPS: ${avgFPS.toFixed(1)}<br>
Min FPS: ${minFPS.toFixed(1)}<br>
Max FPS: ${maxFPS.toFixed(1)}
          `.trim();
          requestAnimationFrame(measureFPS);
        } else {
          const avgFPS = fpsSamples.reduce((a, b) => a + b, 0) / fpsSamples.length;
          const minFPS = Math.min(...fpsSamples);
          const maxFPS = Math.max(...fpsSamples);

          statsDiv.innerHTML = `
COMPLETE<br>
Load Time: ${loadTime}s<br>
Elements: ${elementCount}<br>
Total Frames: ${frameCount}<br>
Avg FPS: ${avgFPS.toFixed(1)}<br>
Min FPS: ${minFPS.toFixed(1)}<br>
Max FPS: ${maxFPS.toFixed(1)}
          `.trim();
        }
      };

      requestAnimationFrame(measureFPS);

    } catch (err) {
      statsDiv.innerHTML = `Error: ${err}`;
      console.error('Load error:', err);
    }
  };
  // ==================== TMP TESTING CODE END ====================
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
