import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import 'vim-web/dist/style.css';


// Get the container div
const container = document.getElementById("root");

// Make sure it exists
if (!container) {
  throw new Error("Root container not found");
}

// Create a React root
const root = createRoot(container);

console.log("Root container found", container);
// Render your App
root.render(
  //<React.StrictMode>
    <App />
  //</React.StrictMode>
);
