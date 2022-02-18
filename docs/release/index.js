import { R as ReactDOM, a as React, r as react, T as Transparency, V as Viewer, S as Stats } from "./vendor.js";
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
var urlLogo = "./logo.png";
const canvasId$1 = "vim-canvas";
function buildUI() {
  const ui = document.createElement("div");
  ui.className = "vim";
  ui.style.height = "100%";
  document.body.append(ui);
  const obj = { state: "", set: null };
  ReactDOM.render(/* @__PURE__ */ React.createElement(VimUI, {
    p: obj
  }), ui);
  return [canvasId$1, (str) => obj.set(str)];
}
function VimUI(props) {
  const [progress, setProgress2] = react.exports.useState();
  props.p.msg = progress;
  props.p.set = setProgress2;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("canvas", {
    id: canvasId$1
  }, " "), /* @__PURE__ */ React.createElement(Logo, null), /* @__PURE__ */ React.createElement(VimLoadingBox, {
    progress
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
function VimLoadingBox(prop) {
  const msg = prop.progress === "processing" ? "Processing" : typeof prop.progress === "number" ? `Downloading: ${Math.round(prop.progress / 1e6)} MB` : typeof prop.progress === "string" ? `Error: ${prop.progress}` : void 0;
  if (!msg)
    return null;
  return /* @__PURE__ */ React.createElement("div", {
    className: "vim-loading-box"
  }, /* @__PURE__ */ React.createElement("h1", null, " ", msg, " "));
}
const params = new URLSearchParams(window.location.search);
let url = params.has("vim") ? params.get("vim") : "https://vim.azureedge.net/samples/residence.vim";
url = params.has("model") ? params.get("model") : "https://vim.azureedge.net/samples/residence.vim";
let transparency = "all";
if (params.has("transparency")) {
  const t = params.get("transparency");
  transparency = Transparency.IsValid(t) ? t : "all";
}
const [canvasId, setProgress] = buildUI();
const viewer = new Viewer({
  canvas: { id: canvasId },
  groundPlane: {
    show: true,
    texture: "https://vimdevelopment01storage.blob.core.windows.net/textures/vim-floor-soft.png",
    opacity: 1,
    size: 5
  }
});
viewer.camera;
viewer.loadVim(url, {
  transparency,
  rotation: { x: 270, y: 0, z: 0 }
}, (result) => setProgress(void 0), (progress) => setProgress(progress === "processing" ? "processing" : progress.loaded), (error) => setProgress(error.message));
globalThis.viewer = viewer;
const stats = new Stats();
stats.dom.style.top = "84px";
stats.dom.style.left = "16px";
document.body.appendChild(stats.dom);
animate();
function animate() {
  requestAnimationFrame(() => animate());
  if (stats) {
    stats.update();
  }
}
//# sourceMappingURL=index.js.map
