/**
 * Key Measure Sidebar — Interactive Prototype v4
 *
 * UNRESTRICTED DRAG-AND-DROP:
 *  - Categories can be reordered
 *  - Subcategories can be moved between ANY Categories (not just reordered within same)
 *  - Key Measures can be moved between ANY Subcategories (cross-Category allowed)
 *  - Key Measures can be dragged directly onto a Category header (placed into first Subcategory, or auto-created "Uncategorized")
 *
 * Color coding for insertion lines:
 *  - Green (#388e3c)  = Category reorder
 *  - Orange (#ff9800) = Subcategory reorder/move
 *  - Blue (#1565c0)   = Key Measure reorder/move
 */

// ===== State =====
let data = JSON.parse(JSON.stringify(KEY_MEASURE_DATA));
let dragState = null;

// Tool type → Font Awesome icon map
const TOOL_ICONS = {
  'Count': 'fa-solid fa-hashtag',
  'Linear': 'fa-solid fa-ruler',
  'Area': 'fa-solid fa-table-cells',
};

// ===== Render =====
function render(filter = '') {
  const tree = document.getElementById('km-tree');
  tree.innerHTML = '';
  const lc = filter.toLowerCase();

  data.forEach((cat, catIdx) => {
    let visibleSubcategories = cat.subcategories.map(sc => {
      const filteredKMs = lc
        ? sc.keyMeasures.filter(km => km.name.toLowerCase().includes(lc) || sc.name.toLowerCase().includes(lc))
        : sc.keyMeasures;
      return { ...sc, keyMeasures: filteredKMs };
    }).filter(sc => sc.keyMeasures.length > 0 || sc.name.toLowerCase().includes(lc));

    if (lc && visibleSubcategories.length === 0 && !cat.name.toLowerCase().includes(lc)) return;

    const catEl = document.createElement('div');
    catEl.className = 'km-category';
    catEl.dataset.catId = cat.id;
    catEl.dataset.catIdx = catIdx;

    // ── Category header (now draggable) ──
    const catHeader = document.createElement('div');
    catHeader.className = 'km-category-header';
    catHeader.draggable = true;
    catHeader.dataset.catId = cat.id;
    catHeader.innerHTML = `
      <span class="drag-handle cat-drag-handle"><i class="fa-solid fa-grip-vertical"></i></span>
      <span class="caret ${cat.expanded ? 'open' : ''}"><i class="fa-solid fa-caret-right"></i></span>
      <i class="fa-regular fa-folder-open folder-icon"></i>
      <span class="cat-name">${cat.name}</span>
      <button class="add-btn" data-action="add-subcategory" data-cat-id="${cat.id}" title="Add subcategory to ${cat.name}"><i class="fa-solid fa-plus"></i></button>
    `;

    // Category drag start
    catHeader.addEventListener('dragstart', (e) => onCategoryDragStart(e, cat));
    catHeader.addEventListener('dragend', onDragEnd);

    // Toggle expand (but not on + button or drag handle)
    catHeader.addEventListener('click', (e) => {
      if (e.target.closest('.add-btn') || e.target.closest('.drag-handle')) return;
      cat.expanded = !cat.expanded;
      render(filter);
    });
    catHeader.querySelector('.add-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      showAddSubcategoryModal(cat);
    });

    // Category header as drop target for: category reorder, subcategory move-into, KM direct drop
    catHeader.addEventListener('dragover', (e) => onCategoryHeaderDragOver(e, catHeader, cat));
    catHeader.addEventListener('dragleave', (e) => onCategoryHeaderDragLeave(e, catHeader));
    catHeader.addEventListener('drop', (e) => onCategoryHeaderDrop(e, catHeader, cat));

    catEl.appendChild(catHeader);

    // ── Children container ──
    const childrenEl = document.createElement('div');
    childrenEl.className = 'km-children' + (cat.expanded ? '' : ' collapsed');
    childrenEl.dataset.catId = cat.id;

    // Children container is also a drop target for subcategories (reorder + move between cats)
    childrenEl.addEventListener('dragover', (e) => onCategoryChildrenDragOver(e, childrenEl, cat));
    childrenEl.addEventListener('dragleave', (e) => { childrenEl.classList.remove('drop-target-highlight'); });
    childrenEl.addEventListener('drop', (e) => onCategoryChildrenDrop(e, childrenEl, cat));

    (lc ? visibleSubcategories : cat.subcategories).forEach(sc => {
      const scEl = document.createElement('div');
      scEl.className = 'km-subcategory';
      scEl.dataset.scId = sc.id;
      scEl.dataset.catId = cat.id;

      // Subcategory header
      const scHeader = document.createElement('div');
      scHeader.className = 'km-subcategory-header';
      scHeader.draggable = true;
      scHeader.dataset.scId = sc.id;
      scHeader.dataset.catId = cat.id;
      scHeader.innerHTML = `
        <span class="drag-handle"><i class="fa-solid fa-grip-vertical"></i></span>
        <span class="caret ${sc.expanded ? 'open' : ''}"><i class="fa-solid fa-caret-right"></i></span>
        <i class="fa-regular fa-folder folder-icon"></i>
        <span class="sc-name">${sc.name}</span>
        <button class="add-btn" data-action="add-km" data-sc-id="${sc.id}" data-cat-id="${cat.id}" title="Add key measure to ${sc.name}"><i class="fa-solid fa-plus"></i></button>
      `;

      scHeader.addEventListener('click', (e) => {
        if (e.target.closest('.drag-handle') || e.target.closest('.add-btn')) return;
        const real = findSubcategory(sc.id);
        if (real) { real.expanded = !real.expanded; render(filter); }
      });
      scHeader.querySelector('.add-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        showAddKMModal(sc, cat);
      });

      scHeader.addEventListener('dragstart', (e) => onSubcategoryDragStart(e, sc, cat));
      scHeader.addEventListener('dragend', onDragEnd);

      scEl.appendChild(scHeader);

      // Key Measures container
      const kmsEl = document.createElement('div');
      kmsEl.className = 'km-children' + (sc.expanded ? '' : ' collapsed');
      kmsEl.dataset.scId = sc.id;
      kmsEl.dataset.catId = cat.id;

      // KM container as drop target for key measures (unrestricted)
      kmsEl.addEventListener('dragover', (e) => onKMDragOver(e, kmsEl, sc, cat));
      kmsEl.addEventListener('dragleave', (e) => onKMDragLeave(e, kmsEl));
      kmsEl.addEventListener('drop', (e) => onKMDrop(e, kmsEl, sc, cat));

      const kmsToRender = lc ? sc.keyMeasures.filter(km => km.name.toLowerCase().includes(lc) || sc.name.toLowerCase().includes(lc)) : sc.keyMeasures;
      kmsToRender.forEach(km => {
        const kmEl = document.createElement('div');
        kmEl.className = 'km-item' + (km.active ? ' active-measure' : '');
        kmEl.draggable = true;
        kmEl.dataset.kmId = km.id;
        kmEl.dataset.scId = sc.id;
        kmEl.dataset.catId = cat.id;

        const iconClass = TOOL_ICONS[km.toolType] || 'fa-solid fa-circle';
        kmEl.innerHTML = `
          <span class="drag-handle"><i class="fa-solid fa-grip-vertical"></i></span>
          <i class="${iconClass} km-tool-icon"></i>
          <span class="km-name" title="${km.name}">${km.name}</span>
          <span class="km-color-bar" style="background:${km.colorCode}"></span>
        `;

        kmEl.addEventListener('dragstart', (e) => onKMDragStart(e, km, sc, cat));
        kmEl.addEventListener('dragend', onDragEnd);
        kmEl.addEventListener('click', () => { toggleActive(km); render(filter); });

        kmsEl.appendChild(kmEl);
      });

      scEl.appendChild(kmsEl);

      // Subcategory element as drop target for subcategory reordering/moving
      scEl.addEventListener('dragover', (e) => onSubcategoryDragOver(e, scEl, sc, cat));
      scEl.addEventListener('drop', (e) => onSubcategoryDrop(e, sc, cat));

      childrenEl.appendChild(scEl);
    });

    catEl.appendChild(childrenEl);

    // Category element as drop target for category reordering
    catEl.addEventListener('dragover', (e) => onCategoryDragOver(e, catEl, cat));
    catEl.addEventListener('drop', (e) => onCategoryDrop(e, catEl, cat));

    tree.appendChild(catEl);
  });
}

// ===== Helpers =====
function findCategory(catId) { return data.find(c => c.id === catId); }
function findCategoryForSubcategory(scId) {
  return data.find(cat => cat.subcategories.some(s => s.id === scId));
}
function findSubcategory(scId) {
  for (const cat of data) { const sc = cat.subcategories.find(s => s.id === scId); if (sc) return sc; }
  return null;
}
function findKM(kmId) {
  for (const cat of data) for (const sc of cat.subcategories) { const km = sc.keyMeasures.find(k => k.id === kmId); if (km) return km; }
  return null;
}
function removeKM(kmId) {
  for (const cat of data) for (const sc of cat.subcategories) {
    const idx = sc.keyMeasures.findIndex(k => k.id === kmId);
    if (idx >= 0) return sc.keyMeasures.splice(idx, 1)[0];
  }
}
function removeSubcategory(scId) {
  for (const cat of data) {
    const idx = cat.subcategories.findIndex(s => s.id === scId);
    if (idx >= 0) return cat.subcategories.splice(idx, 1)[0];
  }
}

function toggleActive(km) {
  const wasActive = km.active;
  data.forEach(c => c.subcategories.forEach(s => s.keyMeasures.forEach(k => k.active = false)));
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

// ===== Utility: insertion position =====
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

function clearAllIndicators() {
  document.querySelectorAll('.drop-indicator, .subcategory-drop-zone, .category-drop-zone').forEach(el => el.remove());
  document.querySelectorAll('.drop-target-highlight, .drop-invalid').forEach(el => el.classList.remove('drop-target-highlight', 'drop-invalid'));
}
function clearIndicators(container) { container.querySelectorAll('.drop-indicator').forEach(el => el.remove()); }
function clearSubcategoryIndicators(container) { container.querySelectorAll('.subcategory-drop-zone').forEach(el => el.remove()); }
function clearCategoryIndicators() { document.querySelectorAll('.category-drop-zone').forEach(el => el.remove()); }


// ======================================================
//  1. CATEGORY DRAG & DROP (NEW)
// ======================================================
function onCategoryDragStart(e, cat) {
  e.stopPropagation();
  dragState = { type: 'category', id: cat.id };
  e.dataTransfer.effectAllowed = 'move';
  const ghost = document.getElementById('drag-ghost');
  ghost.innerHTML = `<span class="ghost-icon"><i class="fa-regular fa-folder-open"></i></span>${cat.name}`;
  ghost.classList.add('visible');
  e.dataTransfer.setDragImage(ghost, 0, 0);
  setTimeout(() => {
    const el = document.querySelector(`.km-category[data-cat-id="${cat.id}"]`);
    if (el) el.classList.add('dragging');
  }, 0);
}

function onCategoryDragOver(e, catEl, cat) {
  if (!dragState || dragState.type !== 'category') return;
  if (dragState.id === cat.id) return; // Can't drop on self
  e.preventDefault();
  e.stopPropagation();
  e.dataTransfer.dropEffect = 'move';

  clearCategoryIndicators();
  const rect = catEl.getBoundingClientRect();
  const midY = rect.top + rect.height / 2;
  const indicator = document.createElement('div');
  indicator.className = 'category-drop-zone';
  const tree = catEl.parentElement;
  if (e.clientY < midY) { tree.insertBefore(indicator, catEl); }
  else { tree.insertBefore(indicator, catEl.nextSibling); }
}

function onCategoryDrop(e, catEl, targetCat) {
  e.preventDefault();
  e.stopPropagation();
  clearCategoryIndicators();
  if (!dragState || dragState.type !== 'category') return;
  if (dragState.id === targetCat.id) return;

  const fromIdx = data.findIndex(c => c.id === dragState.id);
  const toIdx = data.findIndex(c => c.id === targetCat.id);
  if (fromIdx < 0 || toIdx < 0) return;

  const [moved] = data.splice(fromIdx, 1);
  data.splice(toIdx, 0, moved);
  showToast(`Reordered "${moved.name}"`, 'success');
  render(document.getElementById('km-search').value);
}

// Category header as drop target for subcategories & key measures being dropped INTO it
function onCategoryHeaderDragOver(e, catHeader, cat) {
  if (!dragState) return;

  // Accept subcategory drops (move into this category)
  if (dragState.type === 'subcategory') {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    catHeader.classList.add('drop-target-highlight');
    return;
  }

  // Accept key measure drops (direct to category → placed in first subcategory or auto-created)
  if (dragState.type === 'keymeasure') {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    catHeader.classList.add('drop-target-highlight');
    return;
  }
}

function onCategoryHeaderDragLeave(e, catHeader) {
  catHeader.classList.remove('drop-target-highlight', 'drop-invalid');
}

function onCategoryHeaderDrop(e, catHeader, cat) {
  e.preventDefault();
  e.stopPropagation();
  catHeader.classList.remove('drop-target-highlight');
  if (!dragState) return;

  const realCat = findCategory(cat.id);
  if (!realCat) return;

  // Subcategory dropped onto category header → move into this category
  if (dragState.type === 'subcategory') {
    if (findCategoryForSubcategory(dragState.id)?.id === cat.id) return; // Already in this category
    const removed = removeSubcategory(dragState.id);
    if (!removed) return;
    removed.categoryId = cat.id;
    realCat.subcategories.push(removed);
    realCat.expanded = true;
    showToast(`Moved "${removed.name}" to ${realCat.name}`, 'success');
    render(document.getElementById('km-search').value);
    return;
  }

  // Key measure dropped onto category header → place in first subcategory or auto-create one
  if (dragState.type === 'keymeasure') {
    const kmObj = findKM(dragState.id);
    const wasActive = kmObj ? kmObj.active : false;
    const removed = removeKM(dragState.id);
    if (!removed) return;
    if (wasActive) removed.active = true;

    if (realCat.subcategories.length === 0) {
      // Auto-create an "Uncategorized" subcategory
      realCat.subcategories.push({
        id: 'sc-auto-' + Date.now(),
        name: 'Uncategorized',
        type: 'subcategory',
        categoryId: cat.id,
        expanded: true,
        keyMeasures: []
      });
    }
    // Place in first subcategory
    realCat.subcategories[0].keyMeasures.push(removed);
    realCat.subcategories[0].expanded = true;
    realCat.expanded = true;
    showToast(`Moved "${removed.name}" to ${realCat.name} → ${realCat.subcategories[0].name}`, 'success');
    render(document.getElementById('km-search').value);
    return;
  }
}

// Category children container — accept subcategory drops for reorder/move
function onCategoryChildrenDragOver(e, childrenEl, cat) {
  if (!dragState || dragState.type !== 'subcategory') return;
  e.preventDefault();
  e.stopPropagation();
  e.dataTransfer.dropEffect = 'move';

  // If the category has no subcategories, show highlight on the children area
  if (cat.subcategories.length === 0) {
    childrenEl.classList.add('drop-target-highlight');
  }
}

function onCategoryChildrenDrop(e, childrenEl, cat) {
  e.preventDefault();
  e.stopPropagation();
  childrenEl.classList.remove('drop-target-highlight');
  if (!dragState || dragState.type !== 'subcategory') return;

  const realCat = findCategory(cat.id);
  if (!realCat) return;

  // If dropping into empty category
  if (realCat.subcategories.length === 0) {
    const removed = removeSubcategory(dragState.id);
    if (!removed) return;
    removed.categoryId = cat.id;
    realCat.subcategories.push(removed);
    realCat.expanded = true;
    showToast(`Moved "${removed.name}" to ${realCat.name}`, 'success');
    render(document.getElementById('km-search').value);
  }
}


// ======================================================
//  2. SUBCATEGORY DRAG & DROP (UNRESTRICTED)
// ======================================================
function onSubcategoryDragStart(e, sc, cat) {
  if (e.target.closest('.km-item')) return;
  e.stopPropagation();
  dragState = { type: 'subcategory', id: sc.id, sourceCatId: cat.id };
  e.dataTransfer.effectAllowed = 'move';
  const ghost = document.getElementById('drag-ghost');
  ghost.innerHTML = `<span class="ghost-icon"><i class="fa-solid fa-folder"></i></span>${sc.name}`;
  ghost.classList.add('visible');
  e.dataTransfer.setDragImage(ghost, 0, 0);
  setTimeout(() => {
    const el = document.querySelector(`.km-subcategory[data-sc-id="${sc.id}"]`);
    if (el) el.classList.add('dragging');
  }, 0);
}

function onSubcategoryDragOver(e, scEl, targetSc, targetCat) {
  if (!dragState || dragState.type !== 'subcategory') return;
  if (dragState.id === targetSc.id) return; // Can't drop on self
  e.preventDefault();
  e.stopPropagation();
  e.dataTransfer.dropEffect = 'move';

  // Clear previous indicators in ALL category children containers
  document.querySelectorAll('.subcategory-drop-zone').forEach(el => el.remove());

  const parentContainer = scEl.parentElement;
  const rect = scEl.getBoundingClientRect();
  const midY = rect.top + rect.height / 2;
  const indicator = document.createElement('div');
  indicator.className = 'subcategory-drop-zone';
  if (e.clientY < midY) { parentContainer.insertBefore(indicator, scEl); }
  else { parentContainer.insertBefore(indicator, scEl.nextSibling); }
}

function onSubcategoryDrop(e, targetSc, targetCat) {
  e.preventDefault();
  e.stopPropagation();
  document.querySelectorAll('.subcategory-drop-zone').forEach(el => el.remove());
  if (!dragState || dragState.type !== 'subcategory') return;
  if (dragState.id === targetSc.id) return;

  // Find source and remove
  const sourceCat = findCategoryForSubcategory(dragState.id);
  if (!sourceCat) return;
  const fromIdx = sourceCat.subcategories.findIndex(s => s.id === dragState.id);
  if (fromIdx < 0) return;
  const [moved] = sourceCat.subcategories.splice(fromIdx, 1);

  // Find target category and insertion index
  const realTargetCat = findCategory(targetCat.id);
  if (!realTargetCat) return;
  const toIdx = realTargetCat.subcategories.findIndex(s => s.id === targetSc.id);

  // Update categoryId
  moved.categoryId = targetCat.id;
  realTargetCat.subcategories.splice(toIdx >= 0 ? toIdx : realTargetCat.subcategories.length, 0, moved);

  const action = sourceCat.id === targetCat.id ? 'Reordered' : 'Moved';
  showToast(`${action} "${moved.name}" ${action === 'Moved' ? 'to ' + realTargetCat.name : 'in ' + realTargetCat.name}`, 'success');
  render(document.getElementById('km-search').value);
}


// ======================================================
//  3. KEY MEASURE DRAG & DROP (UNRESTRICTED)
// ======================================================
function onKMDragStart(e, km, sc, cat) {
  e.stopPropagation();
  dragState = { type: 'keymeasure', id: km.id, sourceCatId: cat.id, sourceScId: sc.id };
  e.dataTransfer.effectAllowed = 'move';
  const ghost = document.getElementById('drag-ghost');
  ghost.innerHTML = `<span class="ghost-icon"><i class="fa-solid fa-ruler-combined"></i></span>${km.name}`;
  ghost.classList.add('visible');
  e.dataTransfer.setDragImage(ghost, 0, 0);
  setTimeout(() => { const el = document.querySelector(`[data-km-id="${km.id}"]`); if (el) el.classList.add('dragging'); }, 0);
}

function onKMDragOver(e, container, sc, cat) {
  if (!dragState || dragState.type !== 'keymeasure') return;
  e.preventDefault();
  e.stopPropagation();

  // NO cross-category restriction — all subcategories accept KM drops
  e.dataTransfer.dropEffect = 'move';
  container.classList.remove('drop-invalid');

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

function onKMDrop(e, container, targetSc, targetCat) {
  e.preventDefault();
  e.stopPropagation();
  container.classList.remove('drop-target-highlight', 'drop-invalid');
  clearIndicators(container);
  if (!dragState || dragState.type !== 'keymeasure') return;

  // NO cross-category restriction — just move it
  const kmObj = findKM(dragState.id);
  const wasActive = kmObj ? kmObj.active : false;
  const items = [...container.querySelectorAll('.km-item:not(.dragging)')];
  const insertBefore = getInsertBeforeElement(items, e.clientY);
  let insertIndex = insertBefore ? items.indexOf(insertBefore) : items.length;
  const removed = removeKM(dragState.id);
  if (!removed) return;
  if (wasActive) removed.active = true;
  const realSc = findSubcategory(targetSc.id);
  if (!realSc) return;
  insertIndex = Math.min(insertIndex, realSc.keyMeasures.length);
  realSc.keyMeasures.splice(insertIndex, 0, removed);

  const crossCategory = dragState.sourceCatId !== targetCat.id;
  const targetCatName = findCategory(targetCat.id)?.name || '';
  const msg = crossCategory
    ? `Moved "${removed.name}" to ${targetCatName} → ${realSc.name}`
    : `Moved "${removed.name}" to ${realSc.name}`;
  showToast(msg, 'success');
  render(document.getElementById('km-search').value);
}


// ======================================================
//  DRAG END (cleanup)
// ======================================================
function onDragEnd() {
  document.getElementById('drag-ghost').classList.remove('visible');
  document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
  clearAllIndicators();
  dragState = null;
}


// ======================================================
//  ADD SUBCATEGORY / KEY MEASURE MODALS (unchanged)
// ======================================================
function showAddSubcategoryModal(cat) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-box">
      <h4>Add Subcategory to "${cat.name}"</h4>
      <label>Subcategory Name</label>
      <input type="text" id="modal-sc-name" placeholder="e.g. Framing, Shingles..." autofocus>
      <div class="modal-btns">
        <button class="cancel">Cancel</button>
        <button class="primary">Add Subcategory</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  const inp = overlay.querySelector('#modal-sc-name');
  inp.focus();
  overlay.querySelector('.cancel').onclick = () => overlay.remove();
  overlay.querySelector('.primary').onclick = () => {
    const name = inp.value.trim();
    if (!name) { inp.style.borderColor = '#e53935'; return; }
    const newSc = {
      id: 'sc-' + Date.now(),
      name,
      type: 'subcategory',
      categoryId: cat.id,
      expanded: true,
      keyMeasures: []
    };
    const realCat = findCategory(cat.id);
    realCat.subcategories.push(newSc);
    realCat.expanded = true;
    overlay.remove();
    showToast(`Added subcategory "${name}"`, 'success');
    render(document.getElementById('km-search').value);
  };
  inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') overlay.querySelector('.primary').click(); if (e.key === 'Escape') overlay.remove(); });
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
}

function showAddKMModal(sc, cat) {
  const colorOptions = ['#1a47ba', '#e84393', '#6c5ce7', '#e17055', '#00b894', '#fdcb6e', '#d63031', '#0984e3'];
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-box">
      <h4>Add Key Measure to "${sc.name}"</h4>
      <label>Name</label>
      <input type="text" id="modal-km-name" placeholder="e.g. 2x14 LVL" autofocus>
      <label>Tool Type</label>
      <select id="modal-km-tool">
        <option value="Count">Count</option>
        <option value="Linear" selected>Linear</option>
        <option value="Area">Area</option>
      </select>
      <label>Unit</label>
      <select id="modal-km-unit">
        <option value="EA">EA</option>
        <option value="LF" selected>LF</option>
        <option value="SF">SF</option>
        <option value="SQ">SQ</option>
      </select>
      <label>Color</label>
      <div style="display:flex;gap:6px;margin-top:4px;" id="modal-color-picks">
        ${colorOptions.map((c, i) => `<span data-color="${c}" style="width:22px;height:22px;border-radius:4px;background:${c};cursor:pointer;border:2px solid ${i === 0 ? '#333' : 'transparent'};display:inline-block;" class="color-pick ${i === 0 ? 'selected' : ''}"></span>`).join('')}
      </div>
      <div class="modal-btns">
        <button class="cancel">Cancel</button>
        <button class="primary">Add Key Measure</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  const inp = overlay.querySelector('#modal-km-name');
  inp.focus();

  let selectedColor = colorOptions[0];
  overlay.querySelectorAll('.color-pick').forEach(el => {
    el.onclick = () => {
      overlay.querySelectorAll('.color-pick').forEach(p => p.style.borderColor = 'transparent');
      el.style.borderColor = '#333';
      selectedColor = el.dataset.color;
    };
  });

  overlay.querySelector('.cancel').onclick = () => overlay.remove();
  overlay.querySelector('.primary').onclick = () => {
    const name = inp.value.trim();
    if (!name) { inp.style.borderColor = '#e53935'; return; }
    const tool = overlay.querySelector('#modal-km-tool').value;
    const unit = overlay.querySelector('#modal-km-unit').value;
    const newKM = {
      id: 'km-' + Date.now(),
      name,
      toolType: tool,
      unit,
      colorCode: selectedColor,
      active: false
    };
    const realSc = findSubcategory(sc.id);
    realSc.keyMeasures.push(newKM);
    realSc.expanded = true;
    const realCat = findCategory(cat.id);
    if (realCat) realCat.expanded = true;
    overlay.remove();
    showToast(`Added "${name}" to ${sc.name}`, 'success');
    render(document.getElementById('km-search').value);
  };
  inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') overlay.querySelector('.primary').click(); if (e.key === 'Escape') overlay.remove(); });
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
}

// Top-level add category button
document.getElementById('btn-add-top').addEventListener('click', () => {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-box">
      <h4>Add New Category</h4>
      <label>Category Name</label>
      <input type="text" id="modal-cat-name" placeholder="e.g. FRAMING, ROOFING..." autofocus>
      <div class="modal-btns">
        <button class="cancel">Cancel</button>
        <button class="primary">Add Category</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  const inp = overlay.querySelector('#modal-cat-name');
  inp.focus();
  overlay.querySelector('.cancel').onclick = () => overlay.remove();
  overlay.querySelector('.primary').onclick = () => {
    const name = inp.value.trim();
    if (!name) { inp.style.borderColor = '#e53935'; return; }
    data.push({
      id: 'cat-' + Date.now(),
      name: name.toUpperCase(),
      type: 'category',
      colorCode: '#6c757d',
      expanded: true,
      subcategories: []
    });
    overlay.remove();
    showToast(`Added category "${name.toUpperCase()}"`, 'success');
    render(document.getElementById('km-search').value);
  };
  inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') overlay.querySelector('.primary').click(); if (e.key === 'Escape') overlay.remove(); });
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
});


// ===== Search =====
document.getElementById('km-search').addEventListener('input', (e) => { render(e.target.value); });

// ===== Tab switching =====
document.getElementById('tab-keymeasure').addEventListener('click', () => {
  document.getElementById('tab-keymeasure').classList.add('active');
  document.getElementById('tab-sections').classList.remove('active');
  render(document.getElementById('km-search').value);
});
document.getElementById('tab-sections').addEventListener('click', () => {
  document.getElementById('tab-sections').classList.add('active');
  document.getElementById('tab-keymeasure').classList.remove('active');
  document.getElementById('km-tree').innerHTML = '<div style="padding:20px;color:#999;text-align:center;font-size:12px;">Sections view — not part of this prototype</div>';
});

// ===== Init =====
render();
