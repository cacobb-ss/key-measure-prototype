# Key Measure Sidebar — Interactive Prototype

An interactive HTML/CSS/JS prototype of the **Key Measure** sidebar panel for the Strong-Tie Pipeline LBM application. This prototype demonstrates the proposed UI for managing Key Measures with drag-and-drop reordering, hierarchical organization, and inline creation.

## 🔗 Live Demo

**[View the prototype →](https://cacobb-ss.github.io/key-measure-prototype/)**

## Features

### Three-Level Hierarchy
- **Categories** (top level) — e.g., FRAMING, DOORS, ROOFING, WALLS EXTERIOR
- **Subcategories** — e.g., LVL, SYP, Shingles, Underlayment
- **Key Measures** — individual items like "2x14 LVL", "Ext Wall 2×6 8'"

### Drag-and-Drop
- ✅ Reorder **Subcategories** within a Category (orange insertion line)
- ✅ Reorder **Key Measures** within a Subcategory (blue insertion line)
- ✅ Move Key Measures **between Subcategories** within the same Category
- 🚫 Cross-Category moves are blocked with red visual feedback + warning toast

### Inline Creation
- **"+" button on Category** → Add a new Subcategory (modal form)
- **"+" button on Subcategory** → Add a new Key Measure (modal with name, tool type, unit, color picker)
- **Blue "+" button** next to search → Add a new top-level Category

### Active Measurement State
- Click any Key Measure to toggle an "active measurement" state (green highlight with pulse animation)
- Active state is **preserved** during drag-and-drop reordering

### Search / Filter
- Real-time filtering of Key Measures as you type in the search box

## Terminology Changes (from existing codebase)

| Before | After |
|--------|-------|
| Takeoff | Key Measure |
| Subfolder | Subcategory |

## Tech Stack

- Pure HTML, CSS, and vanilla JavaScript — no frameworks or build tools
- Font Awesome 6.5 for icons
- Compatible with GitHub Pages (static site)

## Local Development

Simply open `index.html` in a browser, or serve with any static file server:

```bash
python3 -m http.server 3000
# Open http://localhost:3000
```

## File Structure

```
├── index.html   — Main page layout (toolbar, sheets panel, blueprint, sidebar)
├── styles.css   — All visual styling
├── data.js      — Mock data (categories, subcategories, key measures)
├── app.js       — Interactive logic (rendering, drag-and-drop, modals, search)
└── README.md    — This file
```
