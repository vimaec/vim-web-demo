import React, { useEffect, useRef, useState } from 'react';
import * as VIM from 'vim-web';
import { useUltra } from '../ultraUtils';
import { residence } from '../../urls';

type ViewerApi = VIM.React.Ultra.ViewerApi;

export function SectionBox() {
  const div = useRef(null);
  const viewer = useUltra(div);

  const [visible, setVisible] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [active, setActive] = useState(false);
  const [box, setBox] = useState(new VIM.THREE.Box3());

  const updateBox = (newBox: VIM.THREE.Box3) => {
    viewer?.core.sectionBox.setBox(newBox);
    setBox(newBox);
  };

  useEffect(() => {
    if (!viewer) return
    void createSectionBox(viewer)

    const unsub = viewer.core.sectionBox.onUpdate.subscribe(() => {
      setVisible(viewer.core.sectionBox.visible);
      setInteractive(viewer.core.sectionBox.interactive);
      setActive(viewer.core.sectionBox.active);
      const b = viewer.core.sectionBox.getBox();
      if (b) setBox(b);
    });

    return unsub
  }, [viewer]);

  return (
    <div className="vc-inset-0 vc-absolute">
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 1000,
          background: 'white',
          padding: '10px',
          borderRadius: '5px',
        }}
      >
        <Checkbox
          label="Visible"
          checked={visible}
          onChange={(value) => {
            setVisible(value);
            if (viewer) viewer.core.sectionBox.visible = value;
          }}
        />
        <br />
        <Checkbox
          label="Interactible"
          checked={interactive}
          onChange={(value) => {
            setInteractive(value);
            if (viewer) viewer.core.sectionBox.interactive = value;
          }}
        />
        <br />
        <Checkbox
          label="Clip"
          checked={active}
          onChange={(value) => {
            setActive(value);
            if (viewer) viewer.core.sectionBox.active = value;
          }}
        />
        <br />

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {renderBoxInput('Min.x', () => box.min.x, (v) => {
            const b = box.clone();
            b.min.x = v;
            updateBox(b);
          })}
          {renderBoxInput('Max.x', () => box.max.x, (v) => {
            const b = box.clone();
            b.max.x = v;
            updateBox(b);
          })}
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {renderBoxInput('Min.y', () => box.min.y, (v) => {
            const b = box.clone();
            b.min.y = v;
            updateBox(b);
          })}
          {renderBoxInput('Max.y', () => box.max.y, (v) => {
            const b = box.clone();
            b.max.y = v;
            updateBox(b);
          })}
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {renderBoxInput('Min.z', () => box.min.z, (v) => {
            const b = box.clone();
            b.min.z = v;
            updateBox(b);
          })}
          {renderBoxInput('Max.z', () => box.max.z, (v) => {
            const b = box.clone();
            b.max.z = v;
            updateBox(b);
          })}
        </div>
      </div>

      <div ref={div} className="vc-inset-0 vc-absolute" />
    </div>
  );
}

async function createSectionBox(ultra: ViewerApi) {
  await ultra.core.connect();

  const request = ultra.load({ url: residence });
  const result = await request.getResult();

  if (result.isSuccess) {
    await ultra.core.camera.snap().frame('all');
    const box = await ultra.core.renderer.getBoundingBox();
    if (box) ultra.core.sectionBox.setBox(box);
  }
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}

function renderBoxInput(
  label: string,
  get: () => number,
  set: (value: number) => void
) {
  return (
    <label>
      {label}
      <input
        type="number"
        style={{ width: '50px', marginLeft: '4px' }}
        value={get().toFixed(1)}
        onChange={(e) => set(parseFloat(e.target.value) || 0)}
      />
    </label>
  );
}
