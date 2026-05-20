/**
 * Key Measure Sidebar — Interactive Prototype
 *
 * Features:
 *  1. "Takeoff" → "Key Measure" throughout
 *  2. Three-level hierarchy: Category → Subfolder → Key Measure
 *  3. Drag-and-drop:
 *     - Reorder Subfolders within a Category
 *     - Reorder Key Measures within a Subfolder
 *     - Move Key Measures between Subfolders *within the same Category*
 *     - Prevent dragging Key Measures across different Categories
 *  4. Visual feedback: drop indicators, hover states, insertion lines
 *  5. Active measurements not interrupted during reorder
 */

// ===== State =====
let data = JSON.parse(JSON.stringify(KEY_MEASURE_DATA));   // deep copy
let dragState = null;  // { type:'keymeasure'|'subfolder', id, categoryId, el, ghost }

// ===== Render =====
function render(filter = '') {
  const tree = document.getElementById('km-tree');
  tree.innerHTML = '';
  const lc = filter.toLowerCase();

  data.forEach(cat => {
    // Filter: if searching, check if any KM matches
    let visibleSubfolders = cat.subfolders.map(sf => {
      const filteredKMs = lc
        ? sf.keyMeasures.filter(km => km.name.toLowerCase().includes(lc) || sf.name.toLowerCase().includes(lc))
        : sf.keyMeasures;
      return { ...sf, keyMeasures: filteredKMs };
    }).filter(sf => sf.keyMeasures.length > 0 || sf.name.toLowerCase().includes(lc));

    if (lc && visibleSubfolders.length === 0 && !cat.name.toLowerCase().includes(lc)) return;

    const catEl = document.createElement('div');
    catEl.className = 'km-category';
    catEl.dataset.catId = cat.id;

    // Category header
    const totalKMs = cat.subfolders.reduce((n, sf) => n + sf.keyMeasures.length, 0);
    const catHeader = document.createElement('div');
    catHeader.className = 'km-category-header';
    catHeader.innerHTML = `
      <span class="caret ${cat.expanded ? 'open' : ''}"><i class="fa-solid fa-caret-right"></i></span>
      <span class="color-swatch" style="background:${cat.colorCode}"></span>
      <span class="cat-name">${cat.name}</span>
      <span class="cat-count">${totalKMs}</span>
      <span class="lock-icon" title="Categories cannot be reordered"><i class="fa-solid fa-lock"></i></span>
    `;
    catHeader.addEventListener('click', () => { cat.expanded = !cat.expanded; render(filter); });
    catEl.appendChild(catHeader);

    // Children container
    const childrenEl = document.createElement('div');
    childrenEl.className = 'km-children' + (cat.expanded ? '' : ' collapsed');

    (lc ? visibleSubfolders : cat.subfolders).forEach(sf => {
      const sfEl = document.createElement('div');
      sfEl.className = 'km-subfolder';
      sfEl.dataset.sfId = sf.id;
      sfEl.dataset.catId = cat.id;

      // Subfolder header
      const sfHeader = document.createElement('div');
      sfHeader.className = 'km-subfolder-header';
      sfHeader.draggable = true;
      sfHeader.dataset.sfId = sf.id;
      sfHeader.dataset.catId = cat.id;
      sfHeader.innerHTML = `
        <span class="drag-handle"><i class="fa-solid fa-grip-vertical"></i></span>
        <span class="caret ${sf.expanded ? 'open' : ''}"><i class="fa-solid fa-caret-right"></i></span>
        <i class="fa-solid fa-folder folder-icon"></i>
        <span class="sf-name">${sf.name}</span>
        <span class="sf-count">${sf.keyMeasures.length}</span>
      `;

      // Toggle expand
      sfHeader.addEventListener('click', (e) => {
        if (e.target.closest('.drag-handle')) return;
        const real = findSubfolder(sf.id);
        if (real) { real.expanded = !real.expanded; render(filter); }
      });

      // Subfolder drag events
      sfHeader.addEventListener('dragstart', (e) => onSubfolderDragStart(e, sf, cat));
      sfHeader.addEventListener('dragend', onDragEnd);

      sfEl.appendChild(sfHeader);

      // Key Measures container
      const kmsEl = document.createElement('div');
      kmsEl.className = 'km-children' + (sf.expanded ? '' : ' collapsed');
      kmsEl.dataset.sfId = sf.id;
      kmsEl.dataset.catId = cat.id;

      // Subfolder as drop target for key measures
      kmsEl.addEventListener('dragover', (e) => onKMDragOver(e, kmsEl, sf, cat));
      kmsEl.addEventListener('dragleave', (e) => onKMDragLeave(e, kmsEl));
      kmsEl.addEventListener('drop', (e) => onKMDrop(e, kmsEl, sf, cat));

      (lc ? sf.keyMeasures.filter(km => km.name.toLowerCase().includes(lc) || sf.name.toLowerCase().includes(lc)) : sf.keyMeasures).forEach(km => {
        const kmEl = document.createElement('div');
        kmEl.className = 'km-item' + (km.active ? ' active-measure' : '');
        kmEl.draggable = true;
        kmEl.dataset.kmId = km.id;
        kmEl.dataset.sfId = sf.id;
        kmEl.dataset.catId = cat.id;
        kmEl.innerHTML = `
          <span class="drag-handle"><i class="fa-solid fa-grip-vertical"></i></span>
          <span class="km-color" style="background:${km.colorCode}"></span>
          <span class="km-name" title="${km.name}">${km.name}</span>
          <span class="km-tool-badge">${km.toolType}</span>
        `;

        kmEl.addEventListener('dragstart', (e) => onKMDragStart(e, km, sf, cat));
        kmEl.addEventListener('dragend', onDragEnd);
        kmEl.addEventListener('click', () => { toggleActive(km); render(filter); });

        kmsEl.appendChild(kmEl);
      });

      sfEl.appendChild(kmsEl);

      // Subfolder-level drop target for reordering subfolders
      sfEl.addEventListener('dragover', (e) => onSubfolderDragOver(e, sfEl, sf, cat));
      sfEl.addEventListener('drop', (e) => onSubfolderDrop(e, sf, cat));

      childrenEl.appendChild(sfEl);
    });

    catEl.appendChild(childrenEl);
    tree.appendChild(catEl);
  });
}

// ===== Helpers =====
function findCategory(catId) { return data.find(c => c.id === catId); }
function findSubfolder(sfId) {
  for (const cat of data) { const sf = cat.subfolders.find(s => s.id === sfId); if (sf) return sf; }
  return null;
}
function findKM(kmId) {
  for (const cat of data) for (const sf of cat.subfolders) { const km = sf.keyMeasures.find(k => k.id === kmId); if (km) return km; }
  return null;
}
function removeKM(kmId) {
  for (const cat of data) for (const sf of cat.subfolders) {
    const idx = sf.keyMeasures.findIndex(k => k.id === kmId);
    if (idx >= 0) { return sf.keyMeasures.splice(idx, 1)[0]; }
  }
}
function getCategoryForKM(kmId) {
  for (const cat of data) for (const sf of cat.subfolders) if (sf.keyMeasures.some(k => k.id === kmId)) return cat;
  return null;
}

function toggleActive(km) {
  // Simulate toggling active measurement
  const wasActive = km.active;
  // Deactivate all
  data.forEach(c => c.subfolders.forEach(s => s.keyMeasures.forEach(k => k.active = false)));
  if (!wasActive) { km.active = true; showToast(`Now measuring: ${km.name}`, 'success'); }
  else { showToast('Measurement stopped', ''); }
}

// ===== Toast =====
function showToast(msg, type = '') {
  const container = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.textContent = msg;
  container.innerHTML = '';
  container.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2200);
}

// ======================================================
//  KEY MEASURE DRAG & DROP
// ======================================================
function onKMDragStart(e, km, sf, cat) {
  e.stopPropagation();
  dragState = { type: 'keymeasure', id: km.id, categoryId: cat.id, sourceSfId: sf.id };
  e.dataTransfer.effectAllowed = 'move';

  // Ghost
  const ghost = document.getElementById('drag-ghost');
  ghost.innerHTML = `<span class="ghost-icon"><i class="fa-solid fa-ruler-combined"></i></span>${km.name}`;
  ghost.classList.add('visible');
  e.dataTransfer.setDragImage(ghost, 0, 0);

  // Mark element
  setTimeout(() => { const el = document.querySelector(`[data-km-id="${km.id}"]`); if (el) el.classList.add('dragging'); }, 0);
}

function onKMDragOver(e, container, sf, cat) {
  if (!dragState || dragState.type !== 'keymeasure') return;
  e.preventDefault();
  e.stopPropagation();

  // Block cross-category drops
  if (dragState.categoryId !== cat.id) {
    container.classList.add('drop-invalid');
    container.classList.remove('drop-target-highlight');
    e.dataTransfer.dropEffect = 'none';
    clearIndicators(container);
    return;
  }

  container.classList.remove('drop-invalid');
  e.dataTransfer.dropEffect = 'move';

  // Find insertion position
  const items = [...container.querySelectorAll('.km-item:not(.dragging)')];
  const insertBefore = getInsertBeforeElement(items, e.clientY);

  clearIndicators(container);
  if (!insertBefore && items.length === 0) {
    container.classList.add('drop-target-highlight');
  } else {
    const indicator = document.createElement('div');
    indicator.className = 'drop-indicator';
    if (insertBefore) { container.insertBefore(indicator, insertBefore); }
    else { container.appendChild(indicator); }
  }
}

function onKMDragLeave(e, container) {
  container.classList.remove('drop-target-highlight', 'drop-invalid');
  clearIndicators(container);
}

function onKMDrop(e, container, targetSf, cat) {
  e.preventDefault();
  e.stopPropagation();
  container.classList.remove('drop-target-highlight', 'drop-invalid');
  clearIndicators(container);

  if (!dragState || dragState.type !== 'keymeasure') return;
  if (dragState.categoryId !== cat.id) {
    showToast('Cannot move Key Measures across Categories', 'warn');
    return;
  }

  // Protect active measurements
  const kmObj = findKM(dragState.id);
  const wasActive = kmObj ? kmObj.active : false;

  // Calculate insertion index
  const items = [...container.querySelectorAll('.km-item:not(.dragging)')];
  const insertBefore = getInsertBeforeElement(items, e.clientY);
  let insertIndex = insertBefore ? items.indexOf(insertBefore) : items.length;

  // Remove from source
  const removed = removeKM(dragState.id);
  if (!removed) return;

  // Restore active state
  if (wasActive) removed.active = true;

  // Find the real subfolder in data
  const realSf = findSubfolder(targetSf.id);
  if (!realSf) return;

  // If dropping in same subfolder, adjust index
  insertIndex = Math.min(insertIndex, realSf.keyMeasures.length);
  realSf.keyMeasures.splice(insertIndex, 0, removed);

  showToast(`Moved "${removed.name}" to ${realSf.name}`, 'success');
  render(document.getElementById('km-search').value);
}

// ======================================================
//  SUBFOLDER DRAG & DROP
// ======================================================
function onSubfolderDragStart(e, sf, cat) {
  if (e.target.closest('.km-item')) return; // Let KM handle its own
  e.stopPropagation();
  dragState = { type: 'subfolder', id: sf.id, categoryId: cat.id };
  e.dataTransfer.effectAllowed = 'move';

  const ghost = document.getElementById('drag-ghost');
  ghost.innerHTML = `<span class="ghost-icon"><i class="fa-solid fa-folder"></i></span>${sf.name}`;
  ghost.classList.add('visible');
  e.dataTransfer.setDragImage(ghost, 0, 0);

  setTimeout(() => {
    const el = document.querySelector(`.km-subfolder[data-sf-id="${sf.id}"]`);
    if (el) el.classList.add('dragging');
  }, 0);
}

function onSubfolderDragOver(e, sfEl, sf, cat) {
  if (!dragState || dragState.type !== 'subfolder') return;
  if (dragState.categoryId !== cat.id) return; // Can't reorder across categories
  e.preventDefault();
  e.stopPropagation();
  e.dataTransfer.dropEffect = 'move';

  // Show insertion indicator
  const catChildren = sfEl.parentElement;
  clearSubfolderIndicators(catChildren);
  const rect = sfEl.getBoundingClientRect();
  const midY = rect.top + rect.height / 2;
  const indicator = document.createElement('div');
  indicator.className = 'subfolder-drop-zone';
  if (e.clientY < midY) { catChildren.insertBefore(indicator, sfEl); }
  else { catChildren.insertBefore(indicator, sfEl.nextSibling); }
}

function onSubfolderDrop(e, targetSf, cat) {
  e.preventDefault();
  e.stopPropagation();

  if (!dragState || dragState.type !== 'subfolder') return;
  if (dragState.categoryId !== cat.id) return;

  const realCat = findCategory(cat.id);
  if (!realCat) return;

  const fromIdx = realCat.subfolders.findIndex(s => s.id === dragState.id);
  const toIdx = realCat.subfolders.findIndex(s => s.id === targetSf.id);
  if (fromIdx < 0 || toIdx < 0 || fromIdx === toIdx) { render(document.getElementById('km-search').value); return; }

  // Reorder
  const [moved] = realCat.subfolders.splice(fromIdx, 1);
  realCat.subfolders.splice(toIdx, 0, moved);
  showToast(`Reordered "${moved.name}" in ${realCat.name}`, 'success');
  render(document.getElementById('km-search').value);
}

// ===== Drag End =====
function onDragEnd() {
  document.getElementById('drag-ghost').classList.remove('visible');
  document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
  document.querySelectorAll('.drop-target-highlight, .drop-invalid').forEach(el => el.classList.remove('drop-target-highlight', 'drop-invalid'));
  document.querySelectorAll('.drop-indicator, .subfolder-drop-zone').forEach(el => el.remove());
  dragState = null;
}

// ===== Utility: find insert position =====
function getInsertBeforeElement(items, y) {
  let closest = null;
  let closestOffset = Number.NEGATIVE_INFINITY;
  items.forEach(item => {
    const box = item.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closestOffset) { closestOffset = offset; closest = item; }
  });
  return closest;
}

function clearIndicators(container) {
  container.querySelectorAll('.drop-indicator').forEach(el => el.remove());
}
function clearSubfolderIndicators(container) {
  container.querySelectorAll('.subfolder-drop-zone').forEach(el => el.remove());
}

// ===== Search =====
document.getElementById('km-search').addEventListener('input', (e) => {
  render(e.target.value);
});

// ===== Tab switching =====
document.getElementById('tab-keymeasure').addEventListener('click', () => {
  document.getElementById('tab-keymeasure').classList.add('active');
  document.getElementById('tab-sections').classList.remove('active');
  document.getElementById('km-tree').style.display = '';
});
document.getElementById('tab-sections').addEventListener('click', () => {
  document.getElementById('tab-sections').classList.add('active');
  document.getElementById('tab-keymeasure').classList.remove('active');
  document.getElementById('km-tree').innerHTML = '<div style="padding:20px;color:#999;text-align:center;font-size:12px;">Sections view — not part of this prototype</div>';
});

// ===== Init =====
render();
