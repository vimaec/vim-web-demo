import React, { useRef, useState } from 'react';
import * as VIM from 'vim-web';
import { useUltraNoModel } from '../ultraUtils';
import { residence } from '../../devUrls';
import ViewerRef = VIM.React.Ultra.ViewerRef;

export function SectionBox() {
  const div = useRef(null);
  const ref = useRef<ViewerRef>();

  const [visible, setVisible] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [clip, setClip] = useState(false);
  const [box, setBox] = useState(new VIM.THREE.Box3());

  const updateBox = (newBox: VIM.THREE.Box3) => {
    ref.current?.core.sectionBox.fitBox(newBox);
    setBox(newBox);
  };

  useUltraNoModel(div, (ultra) => {
    createSectionBox(ultra);
    ref.current = ultra;

    ultra.core.sectionBox.onUpdate.subscribe(() => {
      setVisible(ultra.core.sectionBox.visible);
      setInteractive(ultra.core.sectionBox.interactive);
      setClip(ultra.core.sectionBox.clip);
      setBox(ultra.core.sectionBox.getBox());
    });
  });

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
            ref.current!.core.sectionBox.visible = value;
          }}
        />
        <br />
        <Checkbox
          label="Interactible"
          checked={interactive}
          onChange={(value) => {
            setInteractive(value);
            ref.current!.core.sectionBox.interactive = value;
          }}
        />
        <br />
        <Checkbox
          label="Clip"
          checked={clip}
          onChange={(value) => {
            setClip(value);
            ref.current!.core.sectionBox.clip = value;
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

async function createSectionBox(ultra: ViewerRef) {
  await ultra.core.connect();

  const request = ultra.load({ url: residence });
  const result = await request.getResult();

  if (result.isSuccess) {
    await ultra.core.camera.frameAll(0);
    const box = await ultra.core.renderer.getBoundingBox();
    if (box) ultra.core.sectionBox.fitBox(box);
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
