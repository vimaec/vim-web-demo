# VIM Web Demo App

This repository demonstrates how to load and use the VIM Web NPM package.

## Standalone Setup

The following is a standalone HTML page illustrating the usage of the `vim-web` package. The other code in this repository provides a more extensive demonstration of the viewer and its capabilities.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>VIM Web — standalone viewer</title>

    <!--
      The vim-web viewer ships its UI styles (control bar, panels, modal, etc.)
      as a separate CSS file. Without this link the 3D scene still renders but
      the UI will be unstyled.
    -->
    <link
      rel="stylesheet"
      href="https://unpkg.com/vim-web@1.0.0-beta.2/dist/style.css"
    />

    <style>
      html, body { height: 100%; margin: 0; background: #1a1a1a; }

      /*
        The viewer calls createViewer(element) and fills `element` with an
        absolutely-positioned canvas + UI layer. Give that element a size or
        nothing will be visible.
      */
      #viewer { position: relative; width: 100vw; height: 100vh; }
    </style>

    <!--
      vim-web is published to npm as ES modules. An import map lets us write
      bare specifiers like `import * as VIM from 'vim-web'` in the browser,
      just as we would inside a bundled project. esm.sh serves npm packages
      as browser-friendly ES modules and wires the peer-dep versions of
      React / ReactDOM so vim-web's internal hooks line up with ours.
    -->
    <script type="importmap">
    {
      "imports": {
        "react":             "https://esm.sh/react@18.3.1",
        "react/jsx-runtime": "https://esm.sh/react@18.3.1/jsx-runtime",
        "react-dom":         "https://esm.sh/react-dom@18.3.1",
        "react-dom/client":  "https://esm.sh/react-dom@18.3.1/client",
        "vim-web":           "https://esm.sh/vim-web@1.0.0-beta.2?deps=react@18.3.1,react-dom@18.3.1"
      }
    }
    </script>
  </head>

  <body>
    <div id="viewer"></div>

    <script type="module">
      import * as VIM from 'vim-web';

      /*
        Any URL to a .vim file works here. The sample below is hosted by
        VIM on a public CDN. To load a file next to this HTML instead,
        change this to something like './residence.vim' and serve the
        folder over HTTP (e.g. `npx http-server .`). Opening the file
        with file:// will fail because fetch() cannot read local files.
      */
      const VIM_URL = 'https://storage.cdn.vimaec.com/samples/residence.v1.2.75.vim';

      async function main () {
        // createViewer builds the UI inside the element we pass in and
        // returns a handle we use for everything else.
        const viewer = await VIM.React.Webgl.createViewer(
          document.getElementById('viewer')
        );

        // Optional niceties: when the user isolates objects, show the rest
        // of the model as a transparent ghost so context isn't lost.
        viewer.isolation.autoIsolate.set(true);
        viewer.isolation.showGhost.set(true);

        // Exposed as `viewer` in the browser console so you can poke at
        // the API interactively (camera, isolation, sectionBox, ...).
        globalThis.viewer = viewer;

        // load() kicks off the download + parse and returns a request
        // object that reports progress and resolves with a result.
        const request = viewer.load({ url: VIM_URL });
        const result = await request.getResult();

        if (result.isSuccess) {
          // Fit the camera around the loaded geometry.
          viewer.framing.frameScene.call();
        } else {
          console.error('Failed to load VIM:', result);
        }
      }

      main().catch(err => console.error(err));
    </script>
  </body>
</html>
```

## Developer Setup

```bash
# check out this repository
npm install
npm run dev

# Open your browser at http://localhost:3000
# By default, it should load a VIM file from a hard-coded URL.
```

### Tinkering

The entry point of the application is under `src/main.tsx`.

### Making a Release

```bash
# Increment the version number
npm run replace-version

# Build
npm run build

# Test the dev build
npm run serve-dev

# Build the release version
npm run release

# ...commit to your branch, make a PR into the main branch, merge.
```
