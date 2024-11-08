# VIM WebGL Test App

## Setup

```bash
# check out this repository
npm install
npm run dev

# Open your browser to localhost:3000
# By default, it should load a VIM file from a hard-coded URL.
```

## Tinkering

The entry point of the application is under `src/main.tsx`.

## Release

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
