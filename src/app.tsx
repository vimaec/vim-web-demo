import React, { useState } from "react";
import { pages as webglDemoPages, home as webglHome } from "./webgl/demo/pageIndex";
import { pages as webglDevPages } from "./webgl/dev/pageIndex";
import { pages as ultraDemoPages } from "./ultra/demo/pageIndex";
import { pages as ultraDevPages } from "./ultra/dev/pageIndex";
import {type Page} from "./page"




export function App() {
  const pages = new Map<string, Page[]>()
  if(window.location.pathname.includes("dev")) {
    pages.set("webgl", webglDevPages)
    pages.set("ultra", ultraDevPages)

  }
  else{
    pages.set("webgl", webglDemoPages)
    pages.set('ultra', ultraDemoPages)
    
  }


  const [selectedPage, setSelectedPageId] = useState(webglHome); // Initialize with the first page's path


  function renderSection(section: string, pages: Page[]) {
    return (
      <div key={section} style={{ marginBottom: "2rem" }}>
        <h2>{section}</h2>
        {pages.map((page) => renderLink(page))}
      </div>
    );
  }

  function renderLink(page: Page) {
    const isSelected = page === selectedPage;

    return (
      <div
        key={page.name}
        style={{
          marginBottom: "1rem",
          cursor: "pointer",
          fontWeight: isSelected ? "bold" : "normal",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}
        onClick={() => setSelectedPageId(page)}
      >
        {page.name}
        {isSelected && (
          <a
            href={page.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()} // prevent selecting the page when clicking the icon
            style={{ fontSize: "1rem", textDecoration: "none" }}
          >
            {'('}🔗{'source)'}
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="APP" style={{ display: "flex", height: "100vh" }}>
      {/* Left side: Page list */}
      <div className="Menu" style={{ width: "200px", borderRight: "1px solid #ccc", padding: "1rem", overflowY: "auto" }}>
        {[...pages.entries()].map(([index, page]) => renderSection(index, page))}
      </div>

      {/* Right side: Selected page content */}
      <div style={{ flexGrow: 1, position: "relative" }}>
        {selectedPage?.content()}
      </div>
    </div>
  );
}
