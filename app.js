/**
 * Key Measure Sidebar — Interactive Prototype v2
 *
 * Updated to match reference PLBM UI:
 *  - Grey folder icons for categories & subfolders
 *  - Color bars on the RIGHT side of Key Measures
 *  - Tool-type icons (grid, wrench) on the left of Key Measures
 *  - "+" buttons to add Subfolders (on category hover) and Key Measures (on subfolder hover)
 *  - Drag-and-drop preserved
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

  data.forEach(cat => {
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
    const catHeader = document.createElement('div');
    catHeader.className = 'km-category-header';
    catHeader.innerHTML = `
      <span class="caret ${cat.expanded ? 'open' : ''}"><i class="fa-solid fa-caret-right"></i></span>
      <i class="fa-regular fa-folder-open folder-icon"></i>
      <span class="cat-name">${cat.name}</span>
      <button class="add-btn" data-action="add-subfolder" data-cat-id="${cat.id}" title="Add subfolder to ${cat.name}"><i class="fa-solid fa-plus"></i></button>
    `;
    // Toggle expand (but not on + button)
    catHeader.addEventListener('click', (e) => {
      if (e.target.closest('.add-btn')) return;
      cat.expanded = !cat.expanded;
      render(filter);
    });
    // + button handler
    catHeader.querySelector('.add-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      showAddSubfolderModal(cat);
    });
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
        <i class="fa-regular fa-folder folder-icon"></i>
        <span class="sf-name">${sf.name}</span>
        <button class="add-btn" data-action="add-km" data-sf-id="${sf.id}" data-cat-id="${cat.id}" title="Add key measure to ${sf.name}"><i class="fa-solid fa-plus"></i></button>
      `;

      // Toggle expand
      sfHeader.addEventListener('click', (e) => {
        if (e.target.closest('.drag-handle') || e.target.closest('.add-btn')) return;
        const real = findSubfolder(sf.id);
        if (real) { real.expanded = !real.expanded; render(filter); }
      });
      // + button for KMs
      sfHeader.querySelector('.add-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        showAddKMModal(sf, cat);
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

      kmsEl.addEventListener('dragover', (e) => onKMDragOver(e, kmsEl, sf, cat));
      kmsEl.addEventListener('dragleave', (e) => onKMDragLeave(e, kmsEl));
      kmsEl.addEventListener('drop', (e) => onKMDrop(e, kmsEl, sf, cat));

      const kmsToRender = lc ? sf.keyMeasures.filter(km => km.name.toLowerCase().includes(lc) || sf.name.toLowerCase().includes(lc)) : sf.keyMeasures;
      kmsToRender.forEach(km => {
        const kmEl = document.createElement('div');
        kmEl.className = 'km-item' + (km.active ? ' active-measure' : '');
        kmEl.draggable = true;
        kmEl.dataset.kmId = km.id;
        kmEl.dataset.sfId = sf.id;
        kmEl.dataset.catId = cat.id;

        const iconClass = TOOL_ICONS[km.toolType] || 'fa-solid fa-circle';
        kmEl.innerHTML = `
          <span class="drag-handle"><i class="fa-solid fa-grip-vertical"></i></span>
          <i class="${iconClass} km-tool-icon"></i>
          <span class="km-name" title="${km.name}">${km.name}</span>
          <span class="km-color-bar" style="background:${km.colorCode}"></span>
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

function toggleActive(km) {
  const wasActive = km.active;
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
//  ADD SUBFOLDER / KEY MEASURE MODALS
// ======================================================
function showAddSubfolderModal(cat) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-box">
      <h4>Add Subfolder to "${cat.name}"</h4>
      <label>Subfolder Name</label>
      <input type="text" id="modal-sf-name" placeholder="e.g. Framing, Shingles..." autofocus>
      <div class="modal-btns">
        <button class="cancel">Cancel</button>
        <button class="primary">Add Subfolder</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  const inp = overlay.querySelector('#modal-sf-name');
  inp.focus();
  overlay.querySelector('.cancel').onclick = () => overlay.remove();
  overlay.querySelector('.primary').onclick = () => {
    const name = inp.value.trim();
    if (!name) { inp.style.borderColor = '#e53935'; return; }
    const newSf = {
      id: 'sf-' + Date.now(),
      name,
      type: 'subfolder',
      categoryId: cat.id,
      expanded: true,
      keyMeasures: []
    };
    const realCat = findCategory(cat.id);
    realCat.subfolders.push(newSf);
    realCat.expanded = true;
    overlay.remove();
    showToast(`Added subfolder "${name}"`, 'success');
    render(document.getElementById('km-search').value);
  };
  inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') overlay.querySelector('.primary').click(); if (e.key === 'Escape') overlay.remove(); });
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
}

function showAddKMModal(sf, cat) {
  const colorOptions = ['#1a47ba', '#e84393', '#6c5ce7', '#e17055', '#00b894', '#fdcb6e', '#d63031', '#0984e3'];
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-box">
      <h4>Add Key Measure to "${sf.name}"</h4>
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
    const realSf = findSubfolder(sf.id);
    realSf.keyMeasures.push(newKM);
    realSf.expanded = true;
    // Also expand parent category
    const realCat = findCategory(cat.id);
    if (realCat) realCat.expanded = true;
    overlay.remove();
    showToast(`Added "${name}" to ${sf.name}`, 'success');
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
      subfolders: []
    });
    overlay.remove();
    showToast(`Added category "${name.toUpperCase()}"`, 'success');
    render(document.getElementById('km-search').value);
  };
  inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') overlay.querySelector('.primary').click(); if (e.key === 'Escape') overlay.remove(); });
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
});

// ======================================================
//  KEY MEASURE DRAG & DROP
// ======================================================
function onKMDragStart(e, km, sf, cat) {
  e.stopPropagation();
  dragState = { type: 'keymeasure', id: km.id, categoryId: cat.id, sourceSfId: sf.id };
  e.dataTransfer.effectAllowed = 'move';
  const ghost = document.getElementById('drag-ghost');
  ghost.innerHTML = `<span class="ghost-icon"><i class="fa-solid fa-ruler-combined"></i></span>${km.name}`;
  ghost.classList.add('visible');
  e.dataTransfer.setDragImage(ghost, 0, 0);
  setTimeout(() => { const el = document.querySelector(`[data-km-id="${km.id}"]`); if (el) el.classList.add('dragging'); }, 0);
}

function onKMDragOver(e, container, sf, cat) {
  if (!dragState || dragState.type !== 'keymeasure') return;
  e.preventDefault();
  e.stopPropagation();
  if (dragState.categoryId !== cat.id) {
    container.classList.add('drop-invalid');
    container.classList.remove('drop-target-highlight');
    e.dataTransfer.dropEffect = 'none';
    clearIndicators(container);
    return;
  }
  container.classList.remove('drop-invalid');
  e.dataTransfer.dropEffect = 'move';
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
  const kmObj = findKM(dragState.id);
  const wasActive = kmObj ? kmObj.active : false;
  const items = [...container.querySelectorAll('.km-item:not(.dragging)')];
  const insertBefore = getInsertBeforeElement(items, e.clientY);
  let insertIndex = insertBefore ? items.indexOf(insertBefore) : items.length;
  const removed = removeKM(dragState.id);
  if (!removed) return;
  if (wasActive) removed.active = true;
  const realSf = findSubfolder(targetSf.id);
  if (!realSf) return;
  insertIndex = Math.min(insertIndex, realSf.keyMeasures.length);
  realSf.keyMeasures.splice(insertIndex, 0, removed);
  showToast(`Moved "${removed.name}" to ${realSf.name}`, 'success');
  render(document.getElementById('km-search').value);
}

// ======================================================
//  SUBFOLDER DRAG & DROP
// ======================================================
function onSubfolderDragStart(e, sf, cat) {
  if (e.target.closest('.km-item')) return;
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
  if (dragState.categoryId !== cat.id) return;
  e.preventDefault();
  e.stopPropagation();
  e.dataTransfer.dropEffect = 'move';
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

// ===== Utility =====
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

function clearIndicators(container) { container.querySelectorAll('.drop-indicator').forEach(el => el.remove()); }
function clearSubfolderIndicators(container) { container.querySelectorAll('.subfolder-drop-zone').forEach(el => el.remove()); }

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
