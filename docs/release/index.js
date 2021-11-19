import { R as ReactDOM, a as React, r as react, V as Viewer, S as Stats } from "./vendor.js";
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
    show: true,
    texture: "https://vimdevelopment01storage.blob.core.windows.net/textures/vim-floor-soft.png",
    opacity: 1,
    size: 5
  }
});
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
