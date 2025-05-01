import React, { useEffect, useState } from "react";
import { pages as webglDemoPages, home as webglHome } from "./webgl/demo/pageIndex";
import { pages as webglDevPages } from "./webgl/dev/pageIndex";
import { pages as ultraDemoPages } from "./ultra/demo/pageIndex";
import { pages as ultraDevPages } from "./ultra/dev/pageIndex";
import { type Page } from "./page";

// Combine all known pages
const allPages: Page[] = [
  ...webglDemoPages,
  ...webglDevPages,
  ...ultraDemoPages,
  ...ultraDevPages,
];

// Helpers
function getPageSlug(page: Page): string {
  return page.github.split("/").at(-1)!.replace(".tsx", "");
}

function getCurrentSlugFromUrl(): string | undefined {
  return window.location.pathname.split("/").at(-1);
}

function parseInitialPage(): "dev" | Page | undefined {
  const slug = getCurrentSlugFromUrl();
  if (!slug || slug === "vim-web-demo") return undefined;
  if (slug === "dev") return "dev";
  return allPages.find((p) => getPageSlug(p) === slug);
}

// Main component
export function App() {
  const parsedPage = parseInitialPage();

  const groupedPages = new Map<string, Page[]>(
    parsedPage === "dev"
      ? [
          ["Webgl", webglDevPages],
          ["Ultra", ultraDevPages],
        ]
      : [
          ["Webgl", webglDemoPages],
          ["Ultra", ultraDemoPages],
        ]
  );

  const initialPage: Page =
    parsedPage === "dev" || parsedPage === undefined ? webglHome : parsedPage;

  const [selectedPage, setSelectedPage] = useState<Page>(initialPage);

  // Sync URL with selection
  useEffect(() => {
    window.history.replaceState({}, "", getPageSlug(selectedPage));
  }, [selectedPage]);

  const renderLink = (page: Page) => {
    const isSelected = selectedPage === page;
    return (
      <div
        key={page.name}
        style={{
          cursor: "pointer",
          fontWeight: isSelected ? 'bold' : '',
          display: "flex",
          alignItems: "center",
          fontSize: "14px",
          lineHeight: "1.5rem",
          gap: "0.5rem", // <-- This adds spacing between name and source link
        }}
        onClick={() => setSelectedPage(page)}
      >
        {page.name}
        {isSelected && (
          <a
            href={page.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{ fontSize: "1rem" }}
          >
            (🔗source)
          </a>
        )}
      </div>
    );
  };

  const renderSection = (title: string, pages: Page[]) => (
    <div key={title} style={{ marginBottom: "2rem" }}>
      <h3>{title}</h3>
      {pages.map(renderLink)}
    </div>
  );

  return (
    <div className="APP" style={{
        display: "flex",
        height: "100vh",
        fontFamily: "'Roboto', sans-serif"
      }}>
      {/* Sidebar */}
      <div
        className="Menu"
        style={{
          width: "200px",
          borderRight: "1px solid #ccc",
          padding: "1rem",
          overflowY: "auto",
        }}
      >
        {[...groupedPages.entries()].map(([label, pages]) =>
          renderSection(label, pages)
        )}
      </div>

      {/* Main content */}
      <div style={{ flexGrow: 1, position: "relative" }}>
        {selectedPage?.content()}
      </div>
    </div>
  );
}
