var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import { G as GUI$1, R as ReactDOM, a as React, r as react, V as Viewer, S as Stats } from "./vendor.js";
const p = function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(script) {
    const fetchOpts = {};
    if (script.integrity)
      fetchOpts.integrity = script.integrity;
    if (script.referrerpolicy)
      fetchOpts.referrerPolicy = script.referrerpolicy;
    if (script.crossorigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (script.crossorigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
};
p();
var style = "";
let gid = 0;
class PropDesc {
  constructor(type, def) {
    __publicField(this, "id", gid++);
    __publicField(this, "name", "");
    __publicField(this, "vis", true);
    __publicField(this, "min");
    __publicField(this, "max");
    __publicField(this, "step");
    __publicField(this, "choices");
    __publicField(this, "options");
    __publicField(this, "def");
    __publicField(this, "type");
    this.type = type;
    this.def = def;
  }
  setStep(step) {
    this.step = step;
    return this;
  }
  setRange(min, max) {
    this.min = min;
    this.max = max;
    return this;
  }
  setName(name) {
    this.name = name;
    return this;
  }
  setChoices(xs) {
    this.choices = xs;
    return this;
  }
  setOptions(xs) {
    this.options = xs;
    return this;
  }
}
class PropValue {
  constructor(_desc) {
    __publicField(this, "_value");
    this._desc = _desc;
    this._value = _desc.def;
  }
  get name() {
    return this._desc.name;
  }
  get value() {
    return this._value;
  }
  set value(value) {
    this._value = value;
  }
}
class PropList {
  constructor(desc, name = "") {
    __publicField(this, "items", []);
    this.desc = desc;
    this.name = name;
    for (const k in desc) {
      const v = desc[k];
      if (v instanceof PropDesc)
        this.items.push(new PropValue(v));
      else
        this.items.push(new PropList(v, k));
    }
  }
  fromJson(json) {
    for (const pv of this.items) {
      if (pv.name in json) {
        const v = json[pv.name];
        if (pv instanceof PropValue)
          pv.value = v;
        else
          pv.fromJson(v);
      }
    }
    return this;
  }
  get toJson() {
    const r = {};
    for (const pv of this.items) {
      if (pv instanceof PropValue) {
        r[pv.name] = pv.value;
      } else {
        r[pv.name] = pv.toJson;
      }
    }
    return r;
  }
  find(name) {
    return this.items.find((v) => v.name === name);
  }
}
const settingsGui = {
  gui: new GUI$1(),
  bind: function(settings, callback) {
    const propDesc = objectToPropDesc(settings, {});
    const props = new PropList(propDesc);
    props.fromJson(settings);
    bindControls(props, this.gui, () => callback(props.toJson));
    function objectToPropDesc(obj, pdm) {
      for (const k in obj) {
        const v = obj[k];
        switch (typeof v) {
          case "number":
            pdm[k] = floatProp(v).setName(k);
            break;
          case "string":
            pdm[k] = stringProp(v).setName(k);
            break;
          case "boolean":
            pdm[k] = boolProp(v).setName(k);
            break;
          case "object":
            pdm[k] = objectToPropDesc(v, {});
            break;
        }
      }
      return pdm;
    }
    function bindControls(list, gui, onChange) {
      for (const k in list.desc) {
        bindControl(list, k, gui, onChange);
      }
      return gui;
    }
    function bindControl(list, name, gui, onChange) {
      const pv = list.find(name);
      if (!pv)
        throw new Error("Could not find parameter " + name);
      if (pv instanceof PropValue) {
        const desc = pv._desc;
        if (desc.choices) {
          return gui.add(pv, "value", desc.choices).name(pv.name).setValue(pv.value).onChange(() => onChange(pv));
        } else if (desc.type === "vec3") {
          const folder = gui.addFolder(desc.name);
          folder.open();
          folder.add(pv.value, "x").step(0.1).onChange(() => onChange(pv));
          folder.add(pv.value, "y").step(0.1).onChange(() => onChange(pv));
          folder.add(pv.value, "z").step(0.1).onChange(() => onChange(pv));
          return folder;
        } else if (desc.type === "hsv") {
          const folder = gui.addFolder(desc.name);
          folder.open();
          folder.add(pv.value, "x").name("hue").step(0.1).onChange(() => onChange(pv));
          folder.add(pv.value, "y").name("saturation").step(0.1).onChange(() => onChange(pv));
          folder.add(pv.value, "z").name("value").step(0.1).onChange(() => onChange(pv));
          return folder;
        } else if (desc.type === "rot") {
          const folder = gui.addFolder(desc.name);
          folder.open();
          folder.add(pv.value, "yaw", -1, 1, 0.01).onChange(() => onChange(pv));
          folder.add(pv.value, "pitch", -1, 1, 0.01).onChange(() => onChange(pv));
          folder.add(pv.value, "roll", -1, 1, 0.01).onChange(() => onChange(pv));
          return folder;
        } else if (desc.type === "color") {
          const controller = gui.addColor(pv, "value").name(pv.name);
          controller.onChange(() => onChange(pv));
          return controller;
        } else {
          const controller = gui.add(pv, "value", desc.min, desc.max, desc.step).name(pv.name);
          controller.onChange(() => onChange(pv));
          return controller;
        }
      } else {
        const folder = gui.addFolder(name);
        bindControls(pv, folder, onChange);
        return folder;
      }
    }
    function prop(type, def) {
      return new PropDesc(type, def);
    }
    function boolProp(x) {
      return prop("boolean", x);
    }
    function stringProp(x) {
      return prop("string", x);
    }
    function floatProp(x = 0) {
      return prop("float", x);
    }
  }
};
var urlLogo = "./logo.png";
const canvasId$1 = "vim-canvas";
function buildUI(viewerEventName) {
  const ui = document.createElement("div");
  ui.className = "vim";
  document.body.append(ui);
  ReactDOM.render(/* @__PURE__ */ React.createElement(VimUI, {
    eventName: viewerEventName
  }), ui);
  return canvasId$1;
}
function VimUI(props) {
  const [msg, setProgress] = react.exports.useState("");
  addEventListener(props.eventName, (event) => {
    setProgress(FormatStateMessage(event.detail));
  });
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("canvas", {
    id: canvasId$1
  }, " "), /* @__PURE__ */ React.createElement(Logo, null), /* @__PURE__ */ React.createElement(VimLoadingBox, {
    msg
  }));
}
function Logo() {
  return /* @__PURE__ */ React.createElement("div", {
    className: "vim-logo"
  }, /* @__PURE__ */ React.createElement("a", {
    href: "https://vimaec.com"
  }, /* @__PURE__ */ React.createElement("img", {
    src: urlLogo
  })));
}
function FormatStateMessage(state) {
  return state === "Default" ? "" : state === "Processing" ? "Processing" : `Downloading: ${Math.round(state[1] / 1e6)} MB`;
}
function VimLoadingBox(prop) {
  if (prop.msg === "")
    return null;
  return /* @__PURE__ */ React.createElement("div", {
    className: "vim-loading-box"
  }, /* @__PURE__ */ React.createElement("h1", null, " ", prop.msg, " "));
}
const params = new URLSearchParams(window.location.search);
const url = params.has("model") ? params.get("model") : "https://vim.azureedge.net/samples/residence.vim";
const canvasId = buildUI(Viewer.stateChangeEventName);
const viewer = new Viewer({
  mouseOrbit: false,
  canvasId,
  url,
  object: {
    scale: 0.1,
    rotation: { x: 270 },
    position: { y: 0 }
  },
  plane: {
    show: false
  },
  showStats: true
});
globalThis.viewer = viewer;
if (viewer.settings.showGui) {
  settingsGui.bind(viewer.settings, (settings) => {
    viewer.settings = settings;
    viewer.ApplySettings();
  });
}
let stats;
if (viewer.settings.showStats) {
  stats = new Stats();
  stats.dom.style.top = "84px";
  stats.dom.style.left = "16px";
  document.body.appendChild(stats.dom);
  animate();
}
function animate() {
  requestAnimationFrame(() => animate());
  if (stats) {
    stats.update();
  }
}
//# sourceMappingURL=index.js.map
