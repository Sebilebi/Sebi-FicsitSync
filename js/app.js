/**
 * FICSIT OPERATIONS // OS v3.2
 * Master Application Controller & Command Center Logic
 */

let currentMode = 'live_map'; // 'live_map' | 'schematics' | 'mall_summary'
let currentBranchId = 'iron';
let currentSchematicsViewMode = 'flow'; // 'flow' | 'cards'
let isSvgViewActive = false;
let activeOnlyFilter = false;
let globalModeFilter = false;
let globalSearchQuery = '';

let currentScimTab = 'resources';
let currentCollectibleSubTab = 'power_slugs';
const APP_STATE_KEY = 'ficsit_app_state_v3';

function saveAppState() {
  const state = {
    globalModeFilter,
    activeOnlyFilter,
    currentBranchId,
    currentMode,
    currentScimTab,
    currentCollectibleSubTab,
    isSvgViewActive,
    map: null
  };

  if (window.tacticalMap) {
    state.map = {
      bg: window.tacticalMap.currentMapBg,
      status: window.tacticalMap.filters.status,
      purity: window.tacticalMap.filters.purity,
      layers: window.tacticalMap.filters.layers,
      resources: Array.from(window.tacticalMap.filters.resources),
      resourcesInitialized: window.tacticalMap.filters.resourcesInitialized,
      collectibles: Array.from(window.tacticalMap.collectibleVisibility),
      cameraX: window.tacticalMap.cameraX,
      cameraY: window.tacticalMap.cameraY,
      scale: window.tacticalMap.scale
    };
  } else {
    // If tacticalMap not initialized yet, preserve existing map state if any
    try {
      const saved = JSON.parse(localStorage.getItem(APP_STATE_KEY) || '{}');
      if (saved.map) state.map = saved.map;
    } catch(e) {}
  }

  localStorage.setItem(APP_STATE_KEY, JSON.stringify(state));
}

let pendingMapState = null;

function loadAppState() {
  try {
    const saved = localStorage.getItem(APP_STATE_KEY);
    if (saved) {
      const state = JSON.parse(saved);
      if (typeof state.globalModeFilter !== 'undefined') globalModeFilter = state.globalModeFilter;
      if (typeof state.activeOnlyFilter !== 'undefined') activeOnlyFilter = state.activeOnlyFilter;
      if (state.currentBranchId) currentBranchId = state.currentBranchId;
      if (state.currentMode) currentMode = state.currentMode;
      if (state.currentScimTab) currentScimTab = state.currentScimTab;
      if (state.currentCollectibleSubTab) currentCollectibleSubTab = state.currentCollectibleSubTab;
      if (typeof state.isSvgViewActive !== 'undefined') isSvgViewActive = state.isSvgViewActive;
      if (state.map) pendingMapState = state.map;
    }
  } catch (e) {
    console.warn('Could not load app state', e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadAppState();
  initCommandCenter();
  populateZoneItemSelect();
  initSaveAndMetricsSync();
});

// ==========================================
// 1. INICIALIZACIÓN DEL COMMAND CENTER
// ==========================================
function initCommandCenter() {
  renderBranchNavRail();
  renderMallSummary();

  // Initialize Map directly as the hero landing view or restore from hash/state
  setTimeout(() => {
    let targetMode = currentMode || 'live_map';
    const hash = window.location.hash.replace('#', '');
    if (['live_map', 'schematics', 'mall_summary'].includes(hash)) {
      targetMode = hash;
    }
    switchMainMode(targetMode);
    
    // Set UI checkboxes for schematics
    const chkActive = document.getElementById('filter-active-only');
    if (chkActive) chkActive.checked = activeOnlyFilter;
    const chkGlobal = document.getElementById('filter-global-mode');
    if (chkGlobal) chkGlobal.checked = globalModeFilter;
    
    const targetSvgState = isSvgViewActive;
    isSvgViewActive = !targetSvgState; 
    toggleSvgSchematicView();

    switchScimSidebarTab(currentScimTab);
    switchCollectibleSubTab(currentCollectibleSubTab);
    
  }, 50);

  // Global Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const input = document.getElementById('global-search-input');
      if (input) {
        input.focus();
        input.select();
      }
    } else if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  // Flow graph dynamic SVG update listeners
  const flowWrap = document.getElementById('schematics-flow-wrapper');
  if (flowWrap) {
    flowWrap.addEventListener('scroll', () => {
      if (currentMode === 'schematics' && currentSchematicsViewMode === 'flow') {
        requestAnimationFrame(updateFlowGraphConnections);
      }
    });
  }
  window.addEventListener('resize', () => {
    if (currentMode === 'schematics') {
      resetBlueprintZoom();
      if (currentSchematicsViewMode === 'flow') {
        requestAnimationFrame(updateFlowGraphConnections);
      }
    }
  });

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (['live_map', 'schematics', 'mall_summary'].includes(hash)) {
      if (currentMode !== hash) switchMainMode(hash);
    }
  });
}

// ==========================================
// 2. GESTIÓN DE MODOS DE PANTALLA PRINCIPALES
// ==========================================
function closeAllModals() {
  const itemModal = document.getElementById('item-modal');
  if (itemModal) itemModal.classList.remove('active');
  const machineModal = document.getElementById('scim-machine-modal');
  if (machineModal) machineModal.classList.remove('active');
  const zoneModal = document.getElementById('zone-modal');
  if (zoneModal) {
    zoneModal.classList.remove('active');
    delete zoneModal.dataset.editingZoneId;
    const titleEl = document.getElementById('zone-modal-title');
    if (titleEl) titleEl.textContent = 'DELIMITAR NUEVA ZONA';
  }
  const powerModal = document.getElementById('power-modal');
  if (powerModal) {
    powerModal.classList.remove('active');
    if (typeof stopPowerOscilloscope === 'function') stopPowerOscilloscope();
  }
  document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
  window.hasDraggedBlueprint = false;
  if (window.tacticalMap) {
    if (typeof window.tacticalMap.clearHover === 'function') {
      window.tacticalMap.clearHover();
    } else {
      window.tacticalMap.hoveredMachine = null;
      window.tacticalMap.hoveredMiner = null;
      window.tacticalMap.hoveredNode = null;
      window.tacticalMap.hoveredStorage = null;
      window.tacticalMap.hoveredBelt = null;
      window.tacticalMap.hoveredPipe = null;
      window.tacticalMap.hoveredCollectible = null;
      window.tacticalMap.hoveredAttachment = null;
      window.tacticalMap.isDragging = false;
      window.tacticalMap.hasDragged = false;
    }
    if (typeof window.tacticalMap.setDrawMode === 'function') {
      window.tacticalMap.setDrawMode(false);
    }
  }
}
window.closeAllModals = closeAllModals;

function switchMainMode(modeId) {
  closeAllModals();
  currentMode = modeId;
  window.currentMode = modeId;
  window.hasDraggedBlueprint = false;
  if (window.location.hash !== `#${modeId}`) {
    window.history.replaceState(null, null, `#${modeId}`);
  }
  
  if (typeof saveAppState === 'function') saveAppState();

  // Views
  const views = [
    { id: 'live_map', el: document.getElementById('view-live-map'), btn: document.getElementById('btn-mode-map') },
    { id: 'schematics', el: document.getElementById('view-schematics'), btn: document.getElementById('btn-mode-schematics') },
    { id: 'mall_summary', el: document.getElementById('view-mall'), btn: document.getElementById('btn-mode-mall') }
  ];

  views.forEach(v => {
    if (v.el) {
      if (v.id === modeId) {
        v.el.classList.add('active');
        v.el.style.display = 'flex';
      } else {
        v.el.classList.remove('active');
        v.el.style.display = 'none';
      }
    }
    if (v.btn) {
      v.btn.classList.toggle('active', v.id === modeId);
    }
  });

  if (modeId === 'live_map') {
    if (!window.tacticalMap) {
      window.tacticalMap = new TacticalMap('tactical-map-canvas');
      
      if (pendingMapState) {
        window.tacticalMap.currentMapBg = pendingMapState.bg || 'realistic';
        if (pendingMapState.status) window.tacticalMap.filters.status = pendingMapState.status;
        if (pendingMapState.purity) window.tacticalMap.filters.purity = pendingMapState.purity;
        if (pendingMapState.layers) window.tacticalMap.filters.layers = pendingMapState.layers;
        if (pendingMapState.resources !== undefined) {
          window.tacticalMap.filters.resources = new Set(pendingMapState.resources);
          window.tacticalMap.filters.resourcesInitialized = pendingMapState.resourcesInitialized !== undefined ? pendingMapState.resourcesInitialized : true;
        }
        if (pendingMapState.collectibles) {
          window.tacticalMap.collectibleVisibility = new Set(pendingMapState.collectibles);
        }
        if (pendingMapState.cameraX !== undefined) {
          window.tacticalMap.cameraX = pendingMapState.cameraX;
          window.tacticalMap.cameraY = pendingMapState.cameraY;
          window.tacticalMap.scale = pendingMapState.scale;
          window.tacticalMap._hasRestoredCamera = true;
        }
        
        // Sync DOM Background Pills
        ['realistic', 'topo', 'blueprint'].forEach(bg => {
          const btn = document.getElementById('btn-bg-' + bg);
          if (btn) btn.classList.toggle('active', bg === window.tacticalMap.currentMapBg);
        });
        
        // Sync Status toggles
        document.querySelectorAll('.scim-status-toggle-btn').forEach(btn => {
          btn.classList.toggle('active', btn.dataset.status === window.tacticalMap.filters.status);
        });
        
        // Sync Purity checkboxes
        ['PURE', 'NORMAL', 'IMPURE'].forEach(p => {
          const cb = document.querySelector(`.scim-purity-label input[onchange*="${p}"]`);
          if (cb && window.tacticalMap.filters.purity[p] !== undefined) {
            cb.checked = window.tacticalMap.filters.purity[p];
          }
        });

        // Sync Layer checkboxes
        ['terrain', 'belts', 'pipes', 'power', 'machines'].forEach(layer => {
          const cb = document.querySelector(`.layer-toggle-row input[onchange*="${layer}"]`);
          if (cb) cb.checked = window.tacticalMap.filters.layers[layer];
        });
      }

      if (window.cachedBuildingsData) {
        applyMapData(window.cachedBuildingsData, window.cachedZonesData, window.cachedNodesData);
      }
    }
    setTimeout(() => {
      if (window.tacticalMap) {
        window.tacticalMap.resizeCanvas();
        window.tacticalMap.render();
      }
      updateQuickZonesBar();
    }, 60);
    loadMapData();
  } else if (modeId === 'schematics') {
    renderSchematics(currentBranchId);
    requestAnimationFrame(() => resetBlueprintZoom());
    setTimeout(() => resetBlueprintZoom(), 60);
  } else if (modeId === 'mall_summary') {
    renderMallSummary();
  }
}
window.switchMainMode = switchMainMode;

// Compatibility alias for legacy calls
window.switchTab = (tabId) => {
  closeAllModals();
  if (tabId === 'live_map') switchMainMode('live_map');
  else if (tabId === 'mall_summary') switchMainMode('mall_summary');
  else {
    currentBranchId = tabId;
    switchMainMode('schematics');
    renderSchematics(tabId);
  }
};

// ==========================================
// 3. ESQUEMAS DE PRODUCCIÓN INTERACTIVOS (CARDS PIPELINE)
// ==========================================
function renderBranchNavRail() {
  const container = document.getElementById('branch-nav-container');
  if (!container) return;

  container.innerHTML = SATISFACTORY_CATEGORIES.map(cat => {
    const isActive = cat.id === currentBranchId;
    return `
      <div class="branch-nav-card ${isActive ? 'active' : ''}" onclick="selectBranch('${cat.id}')">
        <div class="branch-info-group">
          <span class="branch-icon">${cat.icon}</span>
          <span class="branch-name">${cat.name}</span>
        </div>
        <span class="branch-badge">${cat.items.length}</span>
      </div>
    `;
  }).join('');
}

function selectBranch(branchId) {
  closeAllModals();
  currentBranchId = branchId;
  saveAppState();
  renderBranchNavRail();
  renderSchematics(branchId);
  requestAnimationFrame(() => resetBlueprintZoom());
  setTimeout(() => resetBlueprintZoom(), 50);
}
window.selectBranch = selectBranch;

// ==========================================
// 3. ESQUEMAS DE PRODUCCIÓN INTERACTIVOS
// ==========================================
const FLOW_TIER_MAPPINGS = {
  // Hierro
  'Iron_Ore': 0, 'Iron_Ingot': 1, 'Iron_Plate': 2, 'Iron_Rod': 2,
  'Screw': 3, 'Reinforced_Iron_Plate': 3, 'Rotor': 3, 'Modular_Frame': 4,
  // Cobre
  'Copper_Ore': 0, 'Copper_Ingot': 1, 'Wire': 2, 'Copper_Sheet': 2,
  'Cable': 3, 'Circuit_Board': 3, 'AI_Limiter': 3, 'Computer': 4,
  // Acero
  'Limestone': 0, 'Coal': 0, 'Concrete': 1, 'Steel_Ingot': 1,
  'Steel_Beam': 2, 'Steel_Pipe': 2, 'Encased_Industrial_Beam': 3, 'Stator': 3,
  'Motor': 4, 'Heavy_Modular_Frame': 4,
  // Petróleo
  'Crude_Oil': 0, 'Plastic': 1, 'Rubber': 1, 'Fuel': 1, 'Polymer_Resin': 1,
  'Petroleum_Coke': 2, 'Empty_Canister': 2,
  // MAM
  'Caterium_Ore': 0, 'Raw_Quartz': 0, 'Sulfur': 0,
  'Caterium_Ingot': 1, 'Quartz_Crystal': 1, 'Silica': 1, 'Black_Powder': 1, 'Solid_Biofuel': 1,
  'Quickwire': 2, 'Crystal_Oscillator': 2,
  // Espacio
  'Smart_Plating': 1, 'Versatile_Framework': 1, 'Automated_Wiring': 1,
  'Modular_Engine': 2, 'Adaptive_Control_Unit': 3
};

const FLOW_TIER_NAMES = {
  0: { name: 'Materia Prima / Extracción', icon: '⛏️' },
  1: { name: 'Fundición / Refinado', icon: '🔥' },
  2: { name: 'Componentes Básicos', icon: '⚙️' },
  3: { name: 'Ensamblaje Intermedio', icon: '🏭' },
  4: { name: 'Manufactura Final', icon: '🏗️' },
  5: { name: 'Proyecto Espacial', icon: '🚀' }
};

const FLOW_ITEM_DEPENDENCIES = {
  // Hierro
  "Iron_Ingot": ["Iron_Ore"],
  "Iron_Plate": ["Iron_Ingot"],
  "Iron_Rod": ["Iron_Ingot"],
  "Screw": ["Iron_Rod"],
  "Reinforced_Iron_Plate": ["Iron_Plate", "Screw"],
  "Rotor": ["Iron_Rod", "Screw"],
  "Modular_Frame": ["Reinforced_Iron_Plate", "Iron_Rod"],

  // Cobre
  "Copper_Ingot": ["Copper_Ore"],
  "Wire": ["Copper_Ingot"],
  "Cable": ["Wire"],
  "Copper_Sheet": ["Copper_Ingot"],
  "Circuit_Board": ["Copper_Sheet"],
  "AI_Limiter": ["Copper_Sheet", "Quickwire"],
  "Computer": ["Circuit_Board", "Cable"],

  // Acero
  "Concrete": ["Limestone"],
  "Steel_Ingot": ["Coal"],
  "Steel_Beam": ["Steel_Ingot"],
  "Steel_Pipe": ["Steel_Ingot"],
  "Encased_Industrial_Beam": ["Steel_Beam", "Concrete"],
  "Stator": ["Steel_Pipe"],
  "Motor": ["Rotor", "Stator"],
  "Heavy_Modular_Frame": ["Modular_Frame", "Encased_Industrial_Beam", "Concrete"],

  // Petróleo
  "Plastic": ["Crude_Oil"],
  "Rubber": ["Crude_Oil"],
  "Fuel": ["Crude_Oil"],
  "Polymer_Resin": ["Crude_Oil"],
  "Petroleum_Coke": ["Crude_Oil"],
  "Empty_Canister": ["Plastic"],

  // MAM
  "Caterium_Ingot": ["Caterium_Ore"],
  "Quickwire": ["Caterium_Ingot"],
  "Quartz_Crystal": ["Raw_Quartz"],
  "Silica": ["Raw_Quartz"],
  "Crystal_Oscillator": ["Quartz_Crystal"],
  "Black_Powder": ["Sulfur"],
  "Solid_Biofuel": [],

  // Espacio
  "Smart_Plating": ["Reinforced_Iron_Plate", "Rotor"],
  "Versatile_Framework": ["Modular_Frame", "Steel_Beam"],
  "Automated_Wiring": ["Stator", "Cable"],
  "Modular_Engine": ["Smart_Plating"],
  "Adaptive_Control_Unit": ["Automated_Wiring", "Modular_Engine"]
};

// ==========================================
// 3. PLANO MAESTRO SVG INTERACTIVO (PAN & ZOOM)
// ==========================================
let bpZoom = 1.0;
let bpPanX = 0;
let bpPanY = 0;
const bpMinZoom = 0.25;
const bpMaxZoom = 3.5;
let bpPanZoomInitialized = false;

function updateBlueprintTransform() {
  const stage = document.getElementById('blueprint-pan-zoom-stage');
  if (stage) {
    stage.setAttribute('transform', `translate(${bpPanX}, ${bpPanY}) scale(${bpZoom})`);
  }
  const zoomIndicator = document.getElementById('svg-blueprint-zoom-val');
  if (zoomIndicator) {
    zoomIndicator.textContent = `${Math.round(bpZoom * 100)}%`;
  }
}

function initBlueprintPanZoom() {
  if (bpPanZoomInitialized) return;
  const viewport = document.getElementById('svg-blueprint-viewport');
  if (!viewport) return;

  bpPanZoomInitialized = true;
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let dragOriginClientX = 0;
  let dragOriginClientY = 0;
  window.hasDraggedBlueprint = false;

  viewport.addEventListener('mousedown', (e) => {
    if (e.target.closest('button')) return;
    isDragging = true;
    window.hasDraggedBlueprint = false;
    dragOriginClientX = e.clientX;
    dragOriginClientY = e.clientY;
    viewport.style.cursor = 'grabbing';
    startX = e.clientX - bpPanX;
    startY = e.clientY - bpPanY;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    if (Math.hypot(e.clientX - dragOriginClientX, e.clientY - dragOriginClientY) > 5) {
      window.hasDraggedBlueprint = true;
    }
    bpPanX = e.clientX - startX;
    bpPanY = e.clientY - startY;
    updateBlueprintTransform();
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    if (viewport) viewport.style.cursor = 'grab';
    setTimeout(() => {
      window.hasDraggedBlueprint = false;
    }, 150);
  });

  // Capture phase click interceptor: if blueprint was dragged, swallow the click so it never triggers nodes
  viewport.addEventListener('click', (e) => {
    if (window.hasDraggedBlueprint) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      setTimeout(() => {
        window.hasDraggedBlueprint = false;
      }, 50);
      return;
    }
  }, true);

  window.addEventListener('blur', () => {
    isDragging = false;
    window.hasDraggedBlueprint = false;
    if (viewport) viewport.style.cursor = 'grab';
  });

  viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    window.hasDraggedBlueprint = true;
    setTimeout(() => {
      window.hasDraggedBlueprint = false;
    }, 150);
    const rect = viewport.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
    const newZoom = Math.min(bpMaxZoom, Math.max(bpMinZoom, bpZoom * zoomFactor));

    if (newZoom !== bpZoom) {
      bpPanX = mouseX - (mouseX - bpPanX) * (newZoom / bpZoom);
      bpPanY = mouseY - (mouseY - bpPanY) * (newZoom / bpZoom);
      bpZoom = newZoom;
      updateBlueprintTransform();
    }
  }, { passive: false });

  // Touch support for touch screens
  let touchStartDist = 0;
  let touchStartScale = 1;
  viewport.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      window.hasDraggedBlueprint = false;
      startX = e.touches[0].clientX - bpPanX;
      startY = e.touches[0].clientY - bpPanY;
    } else if (e.touches.length === 2) {
      isDragging = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchStartDist = Math.hypot(dx, dy);
      touchStartScale = bpZoom;
    }
  }, { passive: true });

  viewport.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1 && isDragging) {
      window.hasDraggedBlueprint = true;
      bpPanX = e.touches[0].clientX - startX;
      bpPanY = e.touches[0].clientY - startY;
      updateBlueprintTransform();
    } else if (e.touches.length === 2 && touchStartDist > 0) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const factor = dist / touchStartDist;
      bpZoom = Math.min(bpMaxZoom, Math.max(bpMinZoom, touchStartScale * factor));
      updateBlueprintTransform();
    }
  }, { passive: true });

  viewport.addEventListener('touchend', () => {
    isDragging = false;
    touchStartDist = 0;
  });
}

function zoomBlueprintIn() {
  bpZoom = Math.min(bpMaxZoom, bpZoom * 1.25);
  updateBlueprintTransform();
}
window.zoomBlueprintIn = zoomBlueprintIn;

function zoomBlueprintOut() {
  bpZoom = Math.max(bpMinZoom, bpZoom * 0.8);
  updateBlueprintTransform();
}
window.zoomBlueprintOut = zoomBlueprintOut;

function resetBlueprintZoom(bounds) {
  const viewport = document.getElementById('svg-blueprint-viewport');
  if (!viewport) return;

  const rect = viewport.getBoundingClientRect();
  const vpW = (rect.width > 50) ? rect.width : (viewport.clientWidth || (window.innerWidth - 220));
  const vpH = (rect.height > 50) ? rect.height : (viewport.clientHeight || (window.innerHeight - 100));

  const b = bounds || window.currentBlueprintBounds || { minX: 0, maxX: 1760, minY: 35, maxY: 385 };

  const contentW = Math.max(100, b.maxX - b.minX);
  const contentH = Math.max(100, b.maxY - b.minY);
  const contentCenterX = (b.minX + b.maxX) / 2;
  const contentCenterY = (b.minY + b.maxY) / 2;

  // 40px safety border so cards don't touch screen edges
  const paddingX = 40;
  const paddingY = 40;

  const availableW = Math.max(100, vpW - paddingX);
  const availableH = Math.max(100, vpH - paddingY);

  const scaleX = availableW / contentW;
  const scaleY = availableH / contentH;

  // Maximum possible zoom to see everything with full clarity
  const idealZoom = Math.min(scaleX, scaleY);
  bpZoom = Math.max(bpMinZoom, Math.min(bpMaxZoom, idealZoom));

  // Perfect center alignment
  const vpCenterX = vpW / 2;
  const vpCenterY = vpH / 2;

  bpPanX = Math.round(vpCenterX - contentCenterX * bpZoom);
  bpPanY = Math.round(vpCenterY - contentCenterY * bpZoom);

  updateBlueprintTransform();
}
window.resetBlueprintZoom = resetBlueprintZoom;

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
if (typeof window !== 'undefined') window.escapeHtml = escapeHtml;

function getItemRateInfo(item, zones, isGlobalMode = globalModeFilter) {
  const cleanId = (item.id || '').toLowerCase().replace(/_/g, '');
  const cleanName = (item.name || '').toLowerCase();
  const metric = findMetricForItem(window.liveMetrics?.global, item.id);

  const assignedZones = (zones || []).filter(z => {
    if (!z || !z.item) return false;
    const c = z.item.toLowerCase().replace(/_/g, '');
    return c === cleanId || c.includes(cleanId) || cleanId.includes(c);
  });

  const producingZones = (zones || []).filter(z => {
    const zm = window.liveMetrics?.zones?.[z.id];
    if (!zm || !zm.production) return false;
    return Object.keys(zm.production).some(k => {
      const ck = k.toLowerCase().replace(/_/g, '');
      return ck === cleanId || ck.includes(cleanId) || cleanId.includes(ck);
    });
  });

  const allBlds = window.cachedBuildingsData?.buildings || window.tacticalMap?.buildings || [];
  const enclosingZones = (zones || []).filter(z => {
    if (!z || !z.bounds) return false;
    return allBlds.some(b => {
      if (b.x < z.bounds.minX || b.x > z.bounds.maxX || b.y < z.bounds.minY || b.y > z.bounds.maxY) return false;
      return (b.outputs || []).some(o => {
        const co = ((o.item || o.name || '') + '').toLowerCase().replace(/_/g, '');
        return co === cleanId || co.includes(cleanId) || cleanId.includes(co);
      });
    });
  });

  const nameMatchZones = (zones || []).filter(z => {
    if (!z || !z.name) return false;
    const zn = z.name.toLowerCase();
    return zn.includes(cleanName) || cleanName.includes(zn);
  });

  // Deduplicated map of all matching zones
  const allMatchingMap = new Map();
  for (const z of assignedZones) { if (z && z.id) allMatchingMap.set(z.id, z); }
  for (const z of producingZones) { if (z && z.id) allMatchingMap.set(z.id, z); }
  for (const z of enclosingZones) { if (z && z.id) allMatchingMap.set(z.id, z); }
  for (const z of nameMatchZones) { if (z && z.id) allMatchingMap.set(z.id, z); }

  const allMatchingZones = Array.from(allMatchingMap.values());

  let linkedZone = null;
  let itemRate = 0;
  let machinesCount = 0;

  if (isGlobalMode) {
    itemRate = metric ? (metric.production_nominal || 0) : 0;
    machinesCount = metric ? (metric.machines_count || 0) : 0;
    linkedZone = allMatchingZones[0] || null;
  } else {
    if (allMatchingZones.length > 0) {
      linkedZone = allMatchingZones[0];
      for (const z of allMatchingZones) {
        const zm = window.liveMetrics?.zones?.[z.id];
        if (zm && zm.production) {
          for (const [k, p] of Object.entries(zm.production)) {
            const ck = k.toLowerCase().replace(/_/g, '');
            if (ck === cleanId || ck.includes(cleanId) || cleanId.includes(ck)) {
              itemRate += (p.rate || 0);
              machinesCount += (p.count || 0);
            }
          }
        }
      }
    } else {
      linkedZone = null;
      itemRate = 0;
      machinesCount = 0;
    }

    if (metric && metric.production_nominal !== undefined) {
      itemRate = Math.min(itemRate, metric.production_nominal);
      machinesCount = Math.min(machinesCount, metric.machines_count);
    }
  }

  const isProducing = itemRate > 0;
  const rateText = isProducing ? `+${Math.round(itemRate * 10) / 10}/m` : '0/m (Buffer)';

  let zoneBadgeText = '⚠️ Sin zona';
  let zoneColor = '#eab308';

  if (isGlobalMode) {
    zoneBadgeText = isProducing ? '🌍 Global' : '⚠️ Inactivo';
    zoneColor = isProducing ? '#10b981' : '#64748b';
  } else if (allMatchingZones.length > 1) {
    zoneBadgeText = `🏭 ${allMatchingZones.length} zonas`;
    zoneColor = allMatchingZones[0].color || '#38bdf8';
  } else if (linkedZone) {
    const zName = linkedZone.name || 'Zona';
    zoneBadgeText = `🏭 ${zName.substring(0, 14)}`;
    zoneColor = linkedZone.color || '#38bdf8';
  }

  return {
    itemRate,
    machinesCount,
    isProducing,
    rateText,
    linkedZone,
    allMatchingZones,
    zoneBadgeText,
    zoneColor,
    assignedZones,
    producingZones
  };
}
window.getItemRateInfo = getItemRateInfo;

function renderSchematics(branchId) {
  const cat = SATISFACTORY_CATEGORIES.find(c => c.id === branchId) || SATISFACTORY_CATEGORIES[0];
  if (!cat) return;

  // Header
  const iconEl = document.getElementById('current-branch-icon');
  const titleEl = document.getElementById('current-branch-title');
  const subEl = document.getElementById('current-branch-subtitle');
  if (iconEl) iconEl.innerHTML = cat.icon;
  if (titleEl) titleEl.textContent = cat.name;
  if (subEl) subEl.textContent = `Plano interactivo: [Entrada Insumos] ➔ [Fábrica] ➔ [Almacén Local] ➔ [Salida Mall Central] con enlace a zonas`;

  initBlueprintPanZoom();

  const stage = document.getElementById('blueprint-pan-zoom-stage');
  if (!stage) return;

  const zones = window.cachedZonesData || window.tacticalMap?.zones || [];

  let items = cat.items;
  if (activeOnlyFilter) {
    items = items.filter(item => {
      const info = getItemRateInfo(item, zones, globalModeFilter);
      return info.isProducing;
    });
    if (items.length === 0) items = cat.items;
  }

  const half = Math.ceil(items.length / 2);
  const leftItems = items.slice(0, half);
  const rightItems = items.slice(half);
  const maxRows = Math.max(leftItems.length, rightItems.length, 1);
  const rowSpacing = 88;
  const svgWidth = 1760;

  const mallW = 340;
  const mallH = 260;
  const mallX = (svgWidth - mallW) / 2; // 710

  // Calculate balanced vertical alignment so rows and Mall center together
  const rowsHeight = (maxRows - 1) * rowSpacing + 54;
  let startY = 50;
  let mallY = 50;
  let mallCenterY = 50 + mallH / 2;

  if (rowsHeight < mallH) {
    mallY = 40;
    mallCenterY = mallY + mallH / 2;
    startY = Math.round(mallCenterY - rowsHeight / 2);
  } else {
    startY = 50;
    const rowsCenterY = startY + rowsHeight / 2;
    mallCenterY = rowsCenterY;
    mallY = Math.round(mallCenterY - mallH / 2);
  }

  const contentMinX = 0;
  const contentMaxX = svgWidth;
  const contentMinY = Math.max(0, Math.min(startY - 15, mallY));
  const contentMaxY = Math.max(startY + rowsHeight + 15, mallY + mallH);

  window.currentBlueprintBounds = {
    minX: contentMinX,
    maxX: contentMaxX,
    minY: contentMinY,
    maxY: contentMaxY
  };

  function getMachineType(item) {
    if (item.type === 'extractor') return 'Extractor Minero';
    if (item.input.includes('Petróleo')) return 'Refinería';
    if (item.input.includes('+')) return 'Ensambladora';
    if (item.input.includes('Mineral') || item.input.includes('Hierro +')) return 'Fundición';
    return 'Constructor';
  }

  function renderRow(item, index, side) {
    const y = startY + index * rowSpacing;
    const info = getItemRateInfo(item, zones, globalModeFilter);
    const itemRate = info.itemRate;
    const isProducing = info.isProducing;
    const rateText = info.rateText;
    const machineType = getMachineType(item);
    const linkedZone = info.linkedZone;
    const allMatchingZones = info.allMatchingZones || [];
    const zoneBadgeText = info.zoneBadgeText;
    const zoneColor = info.zoneColor;
    const itemColor = item.color || '#ea580c';

    const zoneNamesList = allMatchingZones.map(z => z.name || 'Zona').join(', ');
    const zoneTitleAttr = allMatchingZones.length > 1
      ? `Clic para ver ficha técnica de ${item.name} (${allMatchingZones.length} zonas: ${zoneNamesList})`
      : (allMatchingZones.length === 1 ? `Clic para ver ficha técnica de ${item.name} (${allMatchingZones[0].name})` : `Clic para ver ficha técnica de ${item.name}`);

    if (side === 'left') {
      return `
        <g transform="translate(20, ${y})">
          <!-- Entrada Tren Insumo -->
          <line x1="-15" y1="27" x2="10" y2="27" stroke="#0284c7" stroke-width="2" stroke-dasharray="3 2" />
          <rect x="-15" y="20" width="14" height="14" rx="2" fill="#0369a1" />
          <text x="-8" y="30" font-size="8" text-anchor="middle" fill="#ffffff">🚂</text>

          <!-- 1. Estación Entrada -->
          <g transform="translate(10, 0)">
            <rect x="0" y="0" width="85" height="54" rx="5" fill="#0c1829" stroke="#0284c7" stroke-width="1.5" />
            <rect x="2" y="2" width="81" height="11" rx="3" fill="#0284c7" />
            <text x="42.5" y="10" text-anchor="middle" font-size="6.5" font-weight="900" fill="#ffffff">ESTACIÓN ENTRADA</text>
            <text x="42.5" y="22" text-anchor="middle" font-size="5.5" font-weight="bold" fill="#38bdf8">DESCARGA INSUMO</text>
            <text x="42.5" y="34" text-anchor="middle" font-size="8">📥 🚉</text>
            <text x="42.5" y="47" text-anchor="middle" font-size="6" font-weight="bold" fill="#93c5fd">${item.input.substring(0, 16)}</text>
          </g>

          <!-- Cinta a Fábrica -->
          <line x1="95" y1="27" x2="118" y2="27" stroke="#0284c7" stroke-width="3" stroke-dasharray="3 2" />

          <!-- 2. Fábrica -->
          <g transform="translate(118, 0)" class="bp-node-clickable" onclick="window.openItemModal('${item.id}')" title="${zoneTitleAttr}">
            <rect x="6" y="-6" width="5" height="6" fill="#334155" />
            <rect x="14" y="-9" width="5" height="9" fill="#334155" />
            <rect x="0" y="0" width="88" height="54" rx="5" fill="#0f172a" stroke="${isProducing ? '#10b981' : '#475569'}" stroke-width="${isProducing ? '2' : '1.5'}" />
            <text x="44" y="10" text-anchor="middle" font-size="6.5" font-weight="900" fill="${isProducing ? '#34d399' : '#94a3b8'}">${machineType.substring(0, 16)}</text>
            <text x="44" y="19" text-anchor="middle" font-size="6.5" font-weight="bold" fill="#f8fafc">${item.name.substring(0, 14)}</text>
            <rect x="6" y="23" width="26" height="26" rx="3" fill="#1e293b" stroke="#334155" stroke-width="1" />
            <image href="icons/${item.id}.png" x="7" y="24" width="24" height="24" preserveAspectRatio="xMidYMid meet" />
            
            <!-- Rate & Zone -->
            <rect x="35" y="23" width="48" height="12" rx="2" fill="${isProducing ? 'rgba(16, 185, 129, 0.2)' : 'rgba(148, 163, 184, 0.1)'}" />
            <text x="59" y="32" text-anchor="middle" font-size="5.5" font-weight="900" fill="${isProducing ? '#34d399' : '#94a3b8'}">${rateText}</text>
            <text x="59" y="47" text-anchor="middle" font-size="5" font-weight="bold" fill="${zoneColor}">${zoneBadgeText}</text>
          </g>

          <!-- Tractor Buffer -->
          <g transform="translate(206, 0)">
            <line x1="0" y1="27" x2="32" y2="27" stroke="#78716c" stroke-width="3" stroke-dasharray="3 2" />
            <text x="16" y="23" text-anchor="middle" font-size="11">🚜</text>
            <text x="16" y="37" text-anchor="middle" font-size="5" font-weight="bold" fill="#94a3b8">Tractor</text>
          </g>

          <!-- 3. Almacén Local -->
          <g transform="translate(238, 0)" class="bp-node-clickable" onclick="window.openItemModal('${item.id}')" title="${zoneTitleAttr}">
            <rect x="0" y="0" width="80" height="54" rx="5" fill="#0f172a" stroke="${itemColor}" stroke-width="2" />
            <rect x="2" y="2" width="76" height="11" rx="3" fill="${itemColor}" />
            <text x="40" y="10" text-anchor="middle" font-size="6.5" font-weight="900" fill="#ffffff">ALMACÉN LOCAL</text>
            <text x="40" y="20" text-anchor="middle" font-size="6" font-weight="bold" fill="${itemColor}">${item.name.substring(0, 13)}</text>
            <rect x="28" y="23" width="24" height="24" rx="3" fill="#1e293b" stroke="${itemColor}" stroke-width="1" />
            <image href="icons/${item.id}.png" x="29" y="24" width="22" height="22" preserveAspectRatio="xMidYMid meet" />
          </g>

          <!-- Cinta a Salida -->
          <line x1="318" y1="27" x2="342" y2="27" stroke="#ea580c" stroke-width="3" stroke-dasharray="2 2" />

          <!-- 4. Estación Salida -->
          <g transform="translate(342, 0)">
            <rect x="0" y="0" width="88" height="54" rx="5" fill="#1f1116" stroke="#dc2626" stroke-width="1.5" />
            <rect x="2" y="2" width="84" height="11" rx="3" fill="#dc2626" />
            <text x="44" y="10" text-anchor="middle" font-size="6.5" font-weight="900" fill="#ffffff">ESTACIÓN SALIDA</text>
            <text x="44" y="22" text-anchor="middle" font-size="5.5" font-weight="bold" fill="#fca5a5">CARGA AL MALL</text>
            <text x="44" y="34" text-anchor="middle" font-size="8">📥 🚉</text>
            <line x1="0" y1="48" x2="88" y2="48" stroke="#ef4444" stroke-width="2" stroke-dasharray="3 2" />
            <text x="44" y="46" text-anchor="middle" font-size="5" font-weight="bold" fill="#f87171">Vía de Carga</text>
          </g>
        </g>
      `;
    } else {
      // Right Side (Symmetrical Mirror)
      return `
        <g transform="translate(1310, ${y})">
          <!-- 4. Estación Salida -->
          <g transform="translate(0, 0)">
            <rect x="0" y="0" width="88" height="54" rx="5" fill="#1f1116" stroke="#dc2626" stroke-width="1.5" />
            <rect x="2" y="2" width="84" height="11" rx="3" fill="#dc2626" />
            <text x="44" y="10" text-anchor="middle" font-size="6.5" font-weight="900" fill="#ffffff">ESTACIÓN SALIDA</text>
            <text x="44" y="22" text-anchor="middle" font-size="5.5" font-weight="bold" fill="#fca5a5">CARGA AL MALL</text>
            <text x="44" y="34" text-anchor="middle" font-size="8">📤 🚉</text>
            <line x1="0" y1="48" x2="88" y2="48" stroke="#ef4444" stroke-width="2" stroke-dasharray="3 2" />
            <text x="44" y="46" text-anchor="middle" font-size="5" font-weight="bold" fill="#f87171">Vía de Carga</text>
          </g>

          <!-- Cinta -->
          <line x1="88" y1="27" x2="112" y2="27" stroke="#ea580c" stroke-width="3" stroke-dasharray="2 2" />

          <!-- 3. Almacén Local -->
          <g transform="translate(112, 0)" class="bp-node-clickable" onclick="window.openItemModal('${item.id}')" title="${zoneTitleAttr}">
            <rect x="0" y="0" width="80" height="54" rx="5" fill="#0f172a" stroke="${itemColor}" stroke-width="2" />
            <rect x="2" y="2" width="76" height="11" rx="3" fill="${itemColor}" />
            <text x="40" y="10" text-anchor="middle" font-size="6.5" font-weight="900" fill="#ffffff">ALMACÉN LOCAL</text>
            <text x="40" y="20" text-anchor="middle" font-size="6" font-weight="bold" fill="${itemColor}">${item.name.substring(0, 13)}</text>
            <rect x="28" y="23" width="24" height="24" rx="3" fill="#1e293b" stroke="${itemColor}" stroke-width="1" />
            <image href="icons/${item.id}.png" x="29" y="24" width="22" height="22" preserveAspectRatio="xMidYMid meet" />
          </g>

          <!-- Tractor Buffer -->
          <g transform="translate(192, 0)">
            <line x1="0" y1="27" x2="32" y2="27" stroke="#78716c" stroke-width="3" stroke-dasharray="3 2" />
            <text x="16" y="23" text-anchor="middle" font-size="11">🚜</text>
            <text x="16" y="37" text-anchor="middle" font-size="5" font-weight="bold" fill="#94a3b8">Tractor</text>
          </g>

          <!-- 2. Fábrica -->
          <g transform="translate(224, 0)" class="bp-node-clickable" onclick="window.openItemModal('${item.id}')" title="${zoneTitleAttr}">
            <rect x="6" y="-6" width="5" height="6" fill="#334155" />
            <rect x="14" y="-9" width="5" height="9" fill="#334155" />
            <rect x="0" y="0" width="88" height="54" rx="5" fill="#0f172a" stroke="${isProducing ? '#10b981' : '#475569'}" stroke-width="${isProducing ? '2' : '1.5'}" />
            <text x="44" y="10" text-anchor="middle" font-size="6.5" font-weight="900" fill="${isProducing ? '#34d399' : '#94a3b8'}">${machineType.substring(0, 16)}</text>
            <text x="44" y="19" text-anchor="middle" font-size="6.5" font-weight="bold" fill="#f8fafc">${item.name.substring(0, 14)}</text>
            <rect x="6" y="23" width="26" height="26" rx="3" fill="#1e293b" stroke="#334155" stroke-width="1" />
            <image href="icons/${item.id}.png" x="7" y="24" width="24" height="24" preserveAspectRatio="xMidYMid meet" />

            <!-- Rate & Zone -->
            <rect x="35" y="23" width="48" height="12" rx="2" fill="${isProducing ? 'rgba(16, 185, 129, 0.2)' : 'rgba(148, 163, 184, 0.1)'}" />
            <text x="59" y="32" text-anchor="middle" font-size="5.5" font-weight="900" fill="${isProducing ? '#34d399' : '#94a3b8'}">${rateText}</text>
            <text x="59" y="47" text-anchor="middle" font-size="5" font-weight="bold" fill="${zoneColor}">${zoneBadgeText}</text>
          </g>

          <!-- Cinta a Entrada -->
          <line x1="312" y1="27" x2="336" y2="27" stroke="#0284c7" stroke-width="3" stroke-dasharray="2 2" />

          <!-- 1. Estación Entrada -->
          <g transform="translate(336, 0)">
            <rect x="0" y="0" width="85" height="54" rx="5" fill="#0c1829" stroke="#0284c7" stroke-width="1.5" />
            <rect x="2" y="2" width="81" height="11" rx="3" fill="#0284c7" />
            <text x="42.5" y="10" text-anchor="middle" font-size="6.5" font-weight="900" fill="#ffffff">ESTACIÓN ENTRADA</text>
            <text x="42.5" y="22" text-anchor="middle" font-size="5.5" font-weight="bold" fill="#38bdf8">DESCARGA INSUMO</text>
            <text x="42.5" y="34" text-anchor="middle" font-size="8">📤 🚉</text>
            <text x="42.5" y="47" text-anchor="middle" font-size="6" font-weight="bold" fill="#93c5fd">${item.input.substring(0, 16)}</text>
          </g>

          <!-- Entrada Tren Exterior -->
          <line x1="421" y1="27" x2="446" y2="27" stroke="#0284c7" stroke-width="2" stroke-dasharray="3 2" />
          <rect x="432" y="20" width="14" height="14" rx="2" fill="#0369a1" />
          <text x="439" y="30" font-size="8" text-anchor="middle" fill="#ffffff">🚂</text>
        </g>
      `;
    }
  }

  // Generate train tracks curves to Central Mall
  const leftTracks = leftItems.map((_, idx) => {
    const y = startY + idx * rowSpacing + 27;
    const mallTargetY = mallCenterY - 50 + (idx / Math.max(1, leftItems.length - 1)) * 100;
    const d = `M 450 ${y} C 560 ${y}, 610 ${mallTargetY}, ${mallX} ${mallTargetY}`;
    return `<path d="${d}" />`;
  });

  const rightTracks = rightItems.map((_, idx) => {
    const y = startY + idx * rowSpacing + 27;
    const mallTargetY = mallCenterY - 50 + (idx / Math.max(1, rightItems.length - 1)) * 100;
    const d = `M 1310 ${y} C 1200 ${y}, 1150 ${mallTargetY}, ${mallX + mallW} ${mallTargetY}`;
    return `<path d="${d}" />`;
  });

  // Central Mall HTML
  const mallHtml = `
    <!-- Mall Central -->
    <g transform="translate(${mallX}, ${mallY})">
      <rect x="0" y="0" width="${mallW}" height="${mallH}" rx="10" fill="#0b1329" stroke="#38bdf8" stroke-width="2.5" filter="drop-shadow(0 8px 24px rgba(0,0,0,0.6))" />
      <rect x="0" y="0" width="${mallW}" height="42" rx="8" fill="#0f1f38" />
      <text x="${mallW / 2}" y="26" text-anchor="middle" font-size="13" font-weight="900" fill="#38bdf8" letter-spacing="1">
        🏛️ ALMACÉN CENTRAL PERSONAL
      </text>
      <text x="${mallW / 2}" y="56" text-anchor="middle" font-size="10" font-weight="bold" fill="#93c5fd">
        [ MALL LOGÍSTICO DEL PIONERO ]
      </text>
      <rect x="20" y="66" width="${mallW - 40}" height="24" rx="4" fill="rgba(239, 68, 68, 0.18)" stroke="#ef4444" stroke-width="1.5" />
      <text x="${mallW / 2}" y="82" text-anchor="middle" font-size="8" font-weight="900" fill="#fca5a5">
        ⛔ TERMINAL: SOLO ENTRADA DE TRENES (NO SALE A FÁBRICAS)
      </text>

      <!-- Grid of Item Containers in Mall -->
      <g transform="translate(20, 100)">
        <text x="0" y="10" font-size="8" font-weight="900" fill="#94a3b8">CONTENEDORES DISPONIBLES EN ESTA RAMA:</text>
        <g transform="translate(0, 16)">
          ${cat.items.map((item, idx) => {
            const col = idx % 9;
            const row = Math.floor(idx / 9);
            const info = getItemRateInfo(item, zones, globalModeFilter);
            const isProd = info.isProducing;
            return `
              <g transform="translate(${col * 33}, ${row * 34})" class="bp-node-clickable" onclick="window.openItemModal('${item.id}')" title="${item.name}: ${isProd ? '+' + Math.round(info.itemRate * 10) / 10 + '/m' : 'Buffer (0/m)'}">
                <rect x="0" y="0" width="28" height="28" rx="4" fill="#0f172a" stroke="${isProd ? '#10b981' : (item.color || '#38bdf8')}" stroke-width="${isProd ? '2' : '1.5'}" />
                <image href="icons/${item.id}.png" x="3" y="3" width="22" height="22" preserveAspectRatio="xMidYMid meet" />
              </g>
            `;
          }).join('')}
        </g>
      </g>

      <!-- Awesome Sink -->
      <g transform="translate(85, ${mallH - 55})">
        <line x1="85" y1="0" x2="85" y2="18" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="3 2" />
        <g transform="translate(0, 18)">
          <rect x="0" y="0" width="170" height="30" rx="4" fill="rgba(245, 158, 11, 0.15)" stroke="#f59e0b" stroke-width="1.5" />
          <text x="85" y="13" text-anchor="middle" font-size="7.5" font-weight="900" fill="#fbbf24">♻️ AWESOME SINK (TRITURADOR)</text>
          <text x="85" y="23" text-anchor="middle" font-size="6" font-weight="bold" fill="#fde68a">Desbordamiento anti-atasco</text>
        </g>
      </g>
    </g>
  `;

  // Assemble full blueprint SVG stage
  stage.innerHTML = `
    <!-- Vías de Tren Rojas Animadas al Mall -->
    <g stroke="#ef4444" stroke-width="2.5" fill="none" class="train-track" stroke-linecap="round">
      ${leftTracks.join('\n')}
      ${rightTracks.join('\n')}
    </g>

    <!-- Iconos de Locomotoras en tránsito -->
    <g>
      <rect x="540" y="${mallCenterY - 30}" width="24" height="14" rx="3" fill="#0f172a" stroke="#ef4444" stroke-width="1.5" />
      <text x="552" y="${mallCenterY - 20}" font-size="9" text-anchor="middle" fill="#ffffff">🚂</text>

      <rect x="1170" y="${mallCenterY - 30}" width="24" height="14" rx="3" fill="#0f172a" stroke="#ef4444" stroke-width="1.5" />
      <text x="1182" y="${mallCenterY - 20}" font-size="9" text-anchor="middle" fill="#ffffff">🚂</text>
    </g>

    ${mallHtml}

    <!-- Filas Izquierda -->
    ${leftItems.map((item, idx) => renderRow(item, idx, 'left')).join('\n')}

    <!-- Filas Derecha -->
    ${rightItems.map((item, idx) => renderRow(item, idx, 'right')).join('\n')}
  `;

  window.lastRenderedBranch = branchId;
  requestAnimationFrame(() => resetBlueprintZoom());
}
window.renderSchematics = renderSchematics;


function jumpToZone(zoneIdOrName) {
  if (typeof closeAllModals === 'function') closeAllModals();
  else if (typeof closeModal === 'function') closeModal();
  switchMainMode('live_map');
  setTimeout(() => {
    if (!window.tacticalMap) return;
    const zones = window.tacticalMap.zones || window.cachedZonesData || [];
    const z = zones.find(x => x.id === zoneIdOrName || x.name === zoneIdOrName);
    if (z) {
      window.tacticalMap.focusZone(z.id);
    }
  }, 120);
}
window.jumpToZone = jumpToZone;

function jumpToCreateZoneForItem(itemId, itemName) {
  if (typeof closeAllModals === 'function') closeAllModals();
  else if (typeof closeModal === 'function') closeModal();
  switchMainMode('live_map');
  setTimeout(() => {
    if (!window.tacticalMap) return;
    jumpToItemOnMap(itemId);
    setTimeout(() => {
      if (window.tacticalMap) {
        window.tacticalMap.setDrawMode(true);
      }
    }, 400);
  }, 120);
}
window.jumpToCreateZoneForItem = jumpToCreateZoneForItem;

function toggleActiveOnlyFilter(checked) {
  activeOnlyFilter = checked;
  saveAppState();
  renderSchematics(currentBranchId);
}
window.toggleActiveOnlyFilter = toggleActiveOnlyFilter;

function toggleGlobalMode(checked) {
  globalModeFilter = checked;
  saveAppState();
  renderSchematics(currentBranchId);
}
window.toggleGlobalMode = toggleGlobalMode;

function toggleSvgSchematicView() {
  isSvgViewActive = !isSvgViewActive;
  if (typeof saveAppState === 'function') saveAppState();
  const grid = document.getElementById('schematics-cards-grid');
  const svg = document.getElementById('schematics-svg-wrapper');
  const btn = document.getElementById('btn-toggle-svg-view');

  if (isSvgViewActive) {
    if (grid) grid.style.display = 'none';
    if (svg) svg.style.display = 'block';
    if (btn) btn.innerHTML = '<span>🎛️</span> Ver Tarjetas';
    renderAllPanels();
  } else {
    if (grid) grid.style.display = 'grid';
    if (svg) svg.style.display = 'none';
    if (btn) btn.innerHTML = '<span>📐</span> Ver Plano SVG';
  }
}
window.toggleSvgSchematicView = toggleSvgSchematicView;

// ==========================================
// 4. MALL CENTRAL (48 ÍTEMS)
// ==========================================
function renderMallSummary() {
  const container = document.getElementById('mall-grid');
  if (!container) return;

  const allItems = SATISFACTORY_CATEGORIES.flatMap(c => c.items);
  let items = allItems;
  if (globalSearchQuery) {
    const q = globalSearchQuery.toLowerCase();
    items = items.filter(i => i.name.toLowerCase().includes(q) || i.id.toLowerCase().includes(q));
  }

  const zones = window.cachedZonesData || window.tacticalMap?.zones || [];
  container.innerHTML = items.map(item => {
    const info = getItemRateInfo(item, zones, globalModeFilter);
    const isProducing = info.isProducing;
    const rateColor = isProducing ? 'var(--neon-green)' : 'var(--text-dim)';
    const rate = isProducing ? `+${Math.round(info.itemRate * 10) / 10}/m` : '0/m';

    return `
      <div class="mall-item-cell" onclick="openItemModal('${item.id}')" style="border-color: ${isProducing ? item.color : 'var(--border-glass)'};">
        <img src="icons/${item.id}.png" alt="${item.name}" onerror="this.src='icons/Iron_Ingot.png'" />
        <span class="mall-item-name">${item.name}</span>
        <span class="mall-item-rate" style="color: ${rateColor};">${rate}</span>
      </div>
    `;
  }).join('');
}

// ==========================================
// 5. NAVEGACIÓN INSTANTÁNEA: DE ÍTEM A MAPA
// ==========================================
function jumpToItemOnMap(itemId) {
  if (typeof closeAllModals === 'function') closeAllModals();
  else if (typeof closeModal === 'function') closeModal();
  switchMainMode('live_map');

  setTimeout(() => {
    if (!window.tacticalMap) return;

    // 1. Search for machines producing this item in save data
    if (window.tacticalMap.buildings && window.tacticalMap.buildings.length > 0) {
      const matchBld = window.tacticalMap.buildings.find(b => {
        if (!b.outputs || b.outputs.length === 0) return false;
        return b.outputs.some(o => {
          const c1 = (o.item || '').toLowerCase().replace(/_/g, '');
          const c2 = itemId.toLowerCase().replace(/_/g, '');
          return c1 === c2 || c1.includes(c2) || c2.includes(c1);
        });
      });

      if (matchBld) {
        window.tacticalMap.cameraX = matchBld.x;
        window.tacticalMap.cameraY = matchBld.y;
        window.tacticalMap.scale = 32.0;
        window.tacticalMap.hoveredMachine = matchBld;
        window.tacticalMap.render();
        window.tacticalMap.updateZoomIndicator();
        return;
      }
    }

    // 2. Search for zones tagged with this item
    if (window.tacticalMap.zones && window.tacticalMap.zones.length > 0) {
      const matchZone = window.tacticalMap.zones.find(z => {
        if (!z.item) return false;
        const c1 = z.item.toLowerCase().replace(/_/g, '');
        const c2 = itemId.toLowerCase().replace(/_/g, '');
        return c1 === c2;
      });

      if (matchZone) {
        window.tacticalMap.focusZone(matchZone.id);
        return;
      }
    }

    // 3. Fallback: Center on core factory
    window.tacticalMap.centerOnPlayerBase();
  }, 120);
}
window.jumpToItemOnMap = jumpToItemOnMap;

// ==========================================
// 6. MAP DRAWER Y ACCIONES RÁPIDAS
// ==========================================
function toggleMapDrawer() {
  const drawer = document.getElementById('map-drawer');
  const btn = document.getElementById('drawer-toggle-btn');
  if (!drawer) return;

  const isCollapsed = drawer.classList.toggle('collapsed');
  if (btn) btn.textContent = isCollapsed ? '▶' : '◀';

  setTimeout(() => {
    if (window.tacticalMap) {
      window.tacticalMap.resizeCanvas();
      window.tacticalMap.render();
    }
  }, 150);
}
window.toggleMapDrawer = toggleMapDrawer;

function updateQuickZonesBar() {
  const bar = document.getElementById('quick-zones-bar');
  if (!bar) return;

  const zones = window.cachedZonesData || window.tacticalMap?.zones || [];
  if (zones.length === 0) {
    bar.innerHTML = '';
    return;
  }

  bar.innerHTML = zones.map(z => `
    <button class="zone-quick-chip" onclick="window.tacticalMap.focusZone('${z.id}')" title="Centrar ${z.name}">
      <span>🏭</span> ${z.name}
    </button>
  `).join('');
}

function onGlobalSearch(query) {
  globalSearchQuery = (query || '').trim();

  if (currentMode === 'schematics') {
    renderSchematics(currentBranchId);
  } else if (currentMode === 'mall_summary') {
    renderMallSummary();
  } else if (currentMode === 'live_map' && window.tacticalMap) {
    window.tacticalMap.filters.searchQuery = globalSearchQuery;
    window.tacticalMap.render();
  }
}
window.onGlobalSearch = onGlobalSearch;

// ==========================================
// 7. GESTIÓN DE TEMAS Y PANTALLA COMPLETA
// ==========================================
function initTheme() {
  const saved = localStorage.getItem('satisfactory_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('satisfactory_theme', next);
  if (window.tacticalMap) window.tacticalMap.render();
}
window.toggleTheme = toggleTheme;

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
}
window.toggleFullscreen = toggleFullscreen;

// ==========================================
// 8. SINCRONIZACIÓN DE DATOS (.SAV) Y API
// ==========================================
window.liveMetrics = null;
let autosyncSecondsLeft = 300;
window.isSyncPaused = false;

function initSaveAndMetricsSync() {
  fetchMetrics();
  loadMapData();

  setInterval(() => {
    if (window.isSyncPaused) {
      updateSyncCountdownUI();
      return;
    }
    autosyncSecondsLeft--;
    if (autosyncSecondsLeft <= 0) {
      autosyncSecondsLeft = 300;
      forceReloadLatestSave();
    } else {
      updateSyncCountdownUI();
    }
  }, 1000);

  // Poll metrics every 20 seconds to keep live rates fresh (if not paused)
  setInterval(() => {
    if (!window.isSyncPaused) {
      fetchMetrics();
    }
  }, 20000);
}

function updateSyncCountdownUI() {
  const badge = document.getElementById('save-status-text');
  if (!badge) return;
  const saveName = window.liveMetrics?.active_save_file || window.liveMetrics?.session?.sessionName || 'Satisfactory';
  if (window.isSyncPaused) {
    badge.innerHTML = `<span style="color:var(--ficsit-orange)">⏸</span> <strong>${saveName}</strong> &bull; Autosync: <strong style="color:var(--ficsit-orange)">PAUSADO</strong>`;
    return;
  }
  const m = Math.floor(autosyncSecondsLeft / 60);
  const s = autosyncSecondsLeft % 60;
  const timeStr = `${m}:${s < 10 ? '0' : ''}${s}`;
  badge.innerHTML = `🟢 <strong>${saveName}</strong> &bull; Autosync: <strong>${timeStr}</strong>`;
}

function togglePauseSync(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  window.isSyncPaused = !window.isSyncPaused;
  const icon = document.getElementById('icon-pause');
  const btn = document.getElementById('btn-pause-sync');
  if (window.isSyncPaused) {
    if (icon) {
      icon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3" fill="currentColor"></polygon>';
    }
    if (btn) {
      btn.title = 'Reanudar Sincronización Automática';
      btn.style.background = 'var(--ficsit-orange)';
      btn.style.color = '#fff';
    }
  } else {
    if (icon) {
      icon.innerHTML = '<rect x="6" y="4" width="4" height="16" fill="currentColor"></rect><rect x="14" y="4" width="4" height="16" fill="currentColor"></rect>';
    }
    if (btn) {
      btn.title = 'Pausar Sincronización Automática';
      btn.style.background = '#333';
      btn.style.color = '';
    }
    fetchMetrics();
  }
  updateSyncCountdownUI();
}
window.togglePauseSync = togglePauseSync;

function recalculateLiveMetrics() {
  const buildings = window.cachedBuildingsData?.buildings || window.tacticalMap?.buildings || [];
  const nodes = window.cachedNodesData || window.cachedBuildingsData?.nodes || window.tacticalMap?.nodes || [];
  const zones = window.cachedZonesData || window.tacticalMap?.zones || [];

  const globalRates = {};

  // 1. Process all buildings in the save
  for (const b of buildings) {
    if (b.outputs && b.outputs.length > 0) {
      for (const out of b.outputs) {
        if (!out.item) continue;
        if (!globalRates[out.item]) {
          globalRates[out.item] = {
            name: out.name || out.item,
            production_nominal: 0,
            machines_count: 0,
            zones_breakdown: {},
            zone_machines: {}
          };
        }
        globalRates[out.item].production_nominal += (out.rate || 0);
        globalRates[out.item].machines_count += 1;
      }
    }
  }

  // 2. Process all exploited resource nodes (miners/extractors)
  const resMap = (typeof RESOURCE_CLASS_TO_ITEM !== 'undefined') ? RESOURCE_CLASS_TO_ITEM : {};
  for (const n of nodes) {
    if (n.isExploited && n.currentRate > 0) {
      const itemId = resMap[n.resourceClass] || n.resourceClass?.replace('Desc_', '')?.replace('_C', '') || 'RawResource';
      if (!globalRates[itemId]) {
        globalRates[itemId] = {
          name: n.resourceName || itemId,
          production_nominal: 0,
          machines_count: 0,
          zones_breakdown: {},
          zone_machines: {}
        };
      }
      globalRates[itemId].production_nominal += n.currentRate;
      globalRates[itemId].machines_count += 1;
    }
  }

  // 3. Process zone-specific metrics (deduplicated across overlapping zones)
  const assignments = (typeof getZoneAssignments === 'function')
    ? getZoneAssignments(zones, buildings, nodes)
    : (window.getZoneAssignments ? window.getZoneAssignments(zones, buildings, nodes) : null);

  const zoneMetrics = {};

  for (const zone of zones) {
    if (!zone || !zone.bounds) continue;
    const assigned = assignments ? assignments[zone.id] : null;
    const machinesInZone = assigned ? assigned.machines : buildings.filter(b => 
      b.x >= zone.bounds.minX && b.x <= zone.bounds.maxX && b.y >= zone.bounds.minY && b.y <= zone.bounds.maxY
    );
    const nodesInZone = assigned ? assigned.nodes : nodes.filter(n =>
      n.isExploited && n.x >= zone.bounds.minX && n.x <= zone.bounds.maxX && n.y >= zone.bounds.minY && n.y <= zone.bounds.maxY
    );

    const production = {};
    const consumption = {};

    for (const b of machinesInZone) {
      if (b.outputs) {
        for (const out of b.outputs) {
          if (!out.item) continue;
          if (!production[out.item]) {
            production[out.item] = { name: out.name || out.item, rate: 0, count: 0 };
          }
          production[out.item].rate += (out.rate || 0);
          production[out.item].count += 1;

          if (globalRates[out.item]) {
            globalRates[out.item].zones_breakdown[zone.name] = (globalRates[out.item].zones_breakdown[zone.name] || 0) + (out.rate || 0);
            globalRates[out.item].zone_machines[zone.name] = (globalRates[out.item].zone_machines[zone.name] || 0) + 1;
          }
        }
      }
      if (b.inputs) {
        for (const inp of b.inputs) {
          if (!inp.item) continue;
          if (!consumption[inp.item]) {
            consumption[inp.item] = { name: inp.name || inp.item, rate: 0 };
          }
          consumption[inp.item].rate += (inp.rate || 0);
        }
      }
    }

    for (const n of nodesInZone) {
      const itemId = resMap[n.resourceClass] || n.resourceClass?.replace('Desc_', '')?.replace('_C', '') || 'RawResource';
      if (!production[itemId]) {
        production[itemId] = { name: n.resourceName || itemId, rate: 0, count: 0 };
      }
      production[itemId].rate += n.currentRate;
      production[itemId].count += 1;

      if (globalRates[itemId]) {
        globalRates[itemId].zones_breakdown[zone.name] = (globalRates[itemId].zones_breakdown[zone.name] || 0) + n.currentRate;
        globalRates[itemId].zone_machines[zone.name] = (globalRates[itemId].zone_machines[zone.name] || 0) + 1;
      }
    }

    zoneMetrics[zone.id] = {
      zoneId: zone.id,
      zoneName: zone.name,
      assignedItem: zone.item,
      color: zone.color,
      totalMachines: machinesInZone.length + nodesInZone.length,
      overlappingCount: assigned ? assigned.overlappingCount : 0,
      production,
      consumption
    };
  }

  if (!window.liveMetrics) window.liveMetrics = {};
  window.liveMetrics.global = globalRates;
  window.liveMetrics.zones = zoneMetrics;

  return window.liveMetrics;
}
window.recalculateLiveMetrics = recalculateLiveMetrics;
window.recalculateMetricsForZones = recalculateLiveMetrics;

function updateKPITicker(saveData, metricsData) {
  const mCount = document.getElementById('kpi-machines-count');
  if (mCount && saveData?.buildings) mCount.textContent = saveData.buildings.length;

  const pCount = document.getElementById('kpi-power-count');
  if (pCount && saveData?.powerLines) pCount.textContent = saveData.powerLines.length;

  const nMiners = document.getElementById('kpi-miners-count');
  if (nMiners && saveData?.nodes) {
    const mined = saveData.nodes.filter(n => n.isExploited).length;
    nMiners.textContent = `${mined}/${saveData.nodes.length}`;
  }

  updateHeaderPowerWidget();
}

async function fetchMetrics() {
  try {
    const ts = Date.now();
    let res = await fetch(`/api/metrics?t=${ts}`).catch(() => null);
    if (!res || !res.ok) res = await fetch(`data/metrics.json?t=${ts}`);
    if (res && res.ok) {
      const data = await res.json();
      if (!window.liveMetrics) window.liveMetrics = {};
      window.liveMetrics.session = data.session || window.liveMetrics.session;
      window.liveMetrics.last_sync = data.last_sync || window.liveMetrics.last_sync;
      window.liveMetrics.recentSaves = data.recentSaves || window.liveMetrics.recentSaves;
      window.liveMetrics.active_save_file = data.active_save_file || window.liveMetrics.active_save_file;
      if (data.power) {
        window.powerGridData = data.power;
      }
    }
  } catch (err) {
    console.warn('[Sync] Could not fetch metrics:', err.message);
  } finally {
    recalculateLiveMetrics();
    updateSyncCountdownUI();
    updateHeaderPowerWidget();
    if (currentMode === 'schematics') renderSchematics(currentBranchId);
    if (currentMode === 'mall_summary') renderMallSummary();
  }
}

async function loadMapData() {
  try {
    const ts = Date.now();
    let [bldRes, zonesRes] = await Promise.all([
      fetch(`/api/map/buildings?t=${ts}`).catch(() => null),
      fetch(`/api/zones?t=${ts}`).catch(() => null)
    ]);

    if (!bldRes || !bldRes.ok) bldRes = await fetch(`data/buildings.json?t=${ts}`);
    const bldData = await bldRes.json();

    if (bldData && bldData.power) {
      window.powerGridData = bldData.power;
    }

    let zonesData = null;
    try {
      const stored = localStorage.getItem('ficsit_zones');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          zonesData = parsed;
        }
      }
    } catch (e) {}

    if (!zonesData) {
      if (!zonesRes || !zonesRes.ok) zonesRes = await fetch(`data/zones.json?t=${ts}`);
      if (zonesRes && zonesRes.ok) {
        zonesData = await zonesRes.json();
      }
    }
    if (!zonesData) zonesData = [];

    let nodes = bldData.nodes;
    if (!nodes || nodes.length === 0) {
      try {
        const nodesRes = await fetch(`/api/map/nodes?t=${ts}`).catch(() => null) || await fetch(`data/nodes.json?t=${ts}`);
        if (nodesRes && nodesRes.ok) {
          const nData = await nodesRes.json();
          nodes = Array.isArray(nData) ? nData : (nData.nodes || []);
        }
      } catch (e) {
        console.warn('[Map] Fallback to static nodes:', e.message);
      }
    }

    window.cachedBuildingsData = bldData;
    window.cachedZonesData = zonesData;
    window.cachedNodesData = nodes;

    recalculateLiveMetrics();
    updateKPITicker(bldData, window.liveMetrics);
    applyMapData(bldData, zonesData, nodes);
    updateQuickZonesBar();
    updateHeaderPowerWidget();
  } catch (err) {
    console.warn('[Map] Error loading map data:', err.message);
  }
}

function applyMapData(bldData, zonesData, nodes) {
  if (!window.tacticalMap || !bldData) return;
  window.tacticalMap.setData(
    bldData.buildings || [],
    bldData.storages || [],
    bldData.miners || [],
    zonesData || [],
    nodes || bldData.nodes || [],
    bldData.belts || [],
    bldData.pipes || [],
    bldData.attachments || [],
    bldData.powerPoles || [],
    bldData.powerLines || [],
    bldData.specialBuildings || []
  );
  if (bldData.collectables) {
    window.tacticalMap.setCollectedPathNames(bldData.collectables);
  }
  if (typeof renderCollectiblesList === 'function') {
    renderCollectiblesList(currentCollectibleSubTab);
  }
  setTimeout(() => {
    if (window.tacticalMap) {
      window.tacticalMap.resizeCanvas();
      if (!window.tacticalMap._hasRestoredCamera) {
        window.tacticalMap.centerOnPlayerBase();
      }
    }
  }, 100);
}

async function forceReloadLatestSave(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  const spinIcon = document.getElementById('reload-icon-spin');
  const badge = document.getElementById('save-status-text');
  const btn = document.getElementById('btn-force-sync') || document.getElementById('btn-force-reload');
  
  if (spinIcon) spinIcon.classList.add('spinning');
  if (btn) btn.disabled = true;
  if (badge) badge.innerHTML = '⏳ Sincronizando save más reciente en /srv/saved/server...';

  try {
    const triggerHosts = [
      `http://${window.location.hostname}:8086/api/sync/force`,
      'http://localhost:8086/api/sync/force'
    ];
    let triggered = false;
    try {
      await Promise.any(
        triggerHosts.map(url =>
          fetch(url, { method: 'POST', signal: AbortSignal.timeout(1500) }).then(r => {
            if (!r.ok) throw new Error();
            return r;
          })
        )
      );
      triggered = true;
    } catch (e) {}

    if (triggered) {
      await new Promise(r => setTimeout(r, 500));
    }

    await Promise.all([
      loadMapData(),
      fetchMetrics()
    ]);

    autosyncSecondsLeft = 300;
  } catch (err) {
    console.error('[Sync] Error forzando recarga:', err);
  } finally {
    if (spinIcon) spinIcon.classList.remove('spinning');
    if (btn) btn.disabled = false;
    updateSyncCountdownUI();
  }
}
window.forceReloadLatestSave = forceReloadLatestSave;
window.forceSyncNow = forceReloadLatestSave;
window.reloadSaveData = forceReloadLatestSave;

function renderSaveDropdownContent(saves) {
  const dd = document.getElementById('save-dropdown');
  if (!dd) return;

  if (!Array.isArray(saves) || saves.length === 0) {
    dd.innerHTML = `
      <div style="padding: 12px; font-size: 11px; color: #888; text-align: center;">
        No se pudieron detectar partidas en el servidor.
      </div>
    `;
    return;
  }

  const activeSaveName = window.liveMetrics?.active_save_file || '';
  let html = `
    <div style="padding: 6px 12px; background: #181818; border-bottom: 1px solid #333; font-size: 10px; font-weight: 900; color: var(--ficsit-orange); letter-spacing: 0.5px; text-transform: uppercase; display:flex; justify-content:space-between; align-items:center;">
      <span>PARTIDAS EN SERVIDOR (${saves.length})</span>
      <span style="font-size: 9px; color: #777;">Haz clic para cargar</span>
    </div>
    <div style="max-height: 230px; overflow-y: auto;">
  `;

  for (const s of saves) {
    const name = s.name || s;
    const isActive = (name === activeSaveName);
    let timeStr = '';
    if (s.modified) {
      try {
        const d = new Date(s.modified);
        timeStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
      } catch (e) {}
    }
    let sizeStr = '';
    if (s.size) {
      sizeStr = ` • ${(s.size / 1024).toFixed(0)} KB`;
    }

    html += `
      <div class="save-item-row" onclick="selectSaveFile('${name}'); event.stopPropagation();"
           style="padding: 7px 12px; border-bottom: 1px solid #282828; cursor: pointer; display: flex; align-items: center; justify-content: space-between; transition: all 0.15s; ${isActive ? 'background: rgba(250, 149, 73, 0.18); border-left: 3px solid var(--ficsit-orange);' : 'background: #202020;'}"
           onmouseover="if (!${isActive}) this.style.background='#2c2c2c'" 
           onmouseout="if (!${isActive}) this.style.background='#202020'">
        <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; padding-right: 8px;">
          <div style="font-size: 11.5px; font-weight: 700; color: ${isActive ? 'var(--ficsit-orange)' : '#eee'}; display: flex; align-items: center; gap: 6px;">
            <span>${isActive ? '🟢' : '💾'}</span>
            <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${name}</span>
          </div>
          <div style="font-size: 9.5px; color: #888; margin-top: 1px; padding-left: 20px;">${timeStr}${sizeStr}</div>
        </div>
        <span style="font-size: 10px; font-weight: 800; color: ${isActive ? 'var(--neon-green)' : 'var(--ficsit-orange)'}; white-space: nowrap;">
          ${isActive ? 'ACTIVA' : 'CARGAR &rarr;'}
        </span>
      </div>
    `;
  }

  html += `</div>`;
  dd.innerHTML = html;
}

async function toggleSaveDropdown(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  const dd = document.getElementById('save-dropdown');
  if (!dd) return;

  if (dd.style.display === 'block') {
    dd.style.display = 'none';
    return;
  }

  dd.style.display = 'block';

  // 1. Si ya tenemos partidas cargadas en liveMetrics, renderizar de INMEDIATO (0 ms de espera!)
  if (window.liveMetrics?.recentSaves && window.liveMetrics.recentSaves.length > 0) {
    renderSaveDropdownContent(window.liveMetrics.recentSaves);
  } else {
    // Si aún no están, mostrar spinner breve y cargar de data/metrics.json
    dd.innerHTML = `
      <div style="padding: 10px 14px; font-size: 11px; color: var(--text-muted); display: flex; align-items: center; gap: 8px;">
        <span class="reload-icon spinning" style="font-size: 13px; color: var(--ficsit-orange);">⚙</span>
        <span>Cargando partidas disponibles...</span>
      </div>
    `;
    try {
      const mRes = await fetch(`data/metrics.json?t=${Date.now()}`);
      if (mRes.ok) {
        const mData = await mRes.json();
        if (mData.recentSaves && mData.recentSaves.length > 0) {
          window.liveMetrics = window.liveMetrics || {};
          window.liveMetrics.recentSaves = mData.recentSaves;
          window.liveMetrics.active_save_file = mData.active_save_file;
          renderSaveDropdownContent(mData.recentSaves);
        }
      }
    } catch (e) {}
  }

  // 2. En segundo plano (sin bloquear la UI), consultar si el daemon tiene partidas más frescas
  const daemonUrls = [
    `http://${window.location.hostname}:8086/api/saves`,
    'http://localhost:8086/api/saves'
  ];
  Promise.any(
    daemonUrls.map(url =>
      fetch(url, { signal: AbortSignal.timeout(800) }).then(r => {
        if (!r.ok) throw new Error();
        return r.json();
      })
    )
  ).then(freshSaves => {
    if (Array.isArray(freshSaves) && freshSaves.length > 0) {
      window.liveMetrics = window.liveMetrics || {};
      window.liveMetrics.recentSaves = freshSaves;
      if (dd.style.display === 'block') {
        renderSaveDropdownContent(freshSaves);
      }
    }
  }).catch(() => {});
}
window.toggleSaveDropdown = toggleSaveDropdown;

async function selectSaveFile(saveName) {
  const dd = document.getElementById('save-dropdown');
  if (dd) dd.style.display = 'none';

  const spinIcon = document.getElementById('reload-icon-spin');
  const badge = document.getElementById('save-status-text');
  const btn = document.getElementById('btn-force-sync');

  if (spinIcon) spinIcon.classList.add('spinning');
  if (btn) btn.disabled = true;
  if (badge) badge.innerHTML = `⏳ Cargando partida <strong>${saveName}</strong>...`;

  try {
    const triggerHosts = [
      `http://${window.location.hostname}:8086/api/saves/select`,
      'http://localhost:8086/api/saves/select'
    ];
    const body = JSON.stringify({ name: saveName });
    let triggered = false;
    try {
      await Promise.any(
        triggerHosts.map(url =>
          fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
            signal: AbortSignal.timeout(4000)
          }).then(r => {
            if (!r.ok) throw new Error();
            return r;
          })
        )
      );
      triggered = true;
    } catch (e) {}

    if (triggered) {
      await new Promise(r => setTimeout(r, 500));
    }

    await Promise.all([
      loadMapData(),
      fetchMetrics()
    ]);
    autosyncSecondsLeft = 300;
  } catch (err) {
    console.error('[Sync] Error cambiando de partida:', err);
  } finally {
    if (spinIcon) spinIcon.classList.remove('spinning');
    if (btn) btn.disabled = false;
    updateSyncCountdownUI();
  }
}
window.selectSaveFile = selectSaveFile;

// Cerrar dropdown al hacer clic fuera
document.addEventListener('click', (e) => {
  const dd = document.getElementById('save-dropdown');
  if (dd && dd.style.display === 'block') {
    if (!e.target.closest('#save-status-badge') && !e.target.closest('#save-dropdown')) {
      dd.style.display = 'none';
    }
  }
});

// ==========================================
// 9. MODALES Y DIÁLOGOS
// ==========================================
function findMetricForItem(globalMetrics, itemId) {
  if (!globalMetrics || !itemId) return null;
  if (globalMetrics[itemId]) return globalMetrics[itemId];
  const lower = itemId.toLowerCase();
  if (globalMetrics[lower]) return globalMetrics[lower];
  const snake = itemId.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
  if (globalMetrics[snake]) return globalMetrics[snake];
  const clean = lower.replace(/_/g, '');
  for (const [k, v] of Object.entries(globalMetrics)) {
    if (k.replace(/_/g, '') === clean) return v;
  }
  return null;
}

let currentModalItemId = null;

function openItemModal(itemId) {
  if (window.hasDraggedBlueprint) {
    window.hasDraggedBlueprint = false;
    return;
  }
  if (window.currentMode && window.currentMode !== 'schematics' && window.currentMode !== 'mall_summary') {
    return;
  }
  currentModalItemId = itemId;
  const allItems = SATISFACTORY_CATEGORIES.flatMap(c => c.items);
  const item = allItems.find(i => i.id === itemId);
  if (!item) return;

  const iconEl = document.getElementById('modal-icon');
  if (iconEl) iconEl.src = 'icons/' + item.id + '.png';
  document.getElementById('modal-title').textContent = item.name;
  document.getElementById('modal-id').textContent = item.id.replace(/_/g, ' ');
  document.getElementById('modal-input').textContent = item.input;
  document.getElementById('modal-type').textContent = item.type === 'extractor' ? 'Extractor Minero / Pozo' : 'Fábrica / Refinería / Ensambladora';
  
  const liveSection = document.getElementById('modal-live-metrics');
  const liveRateEl = document.getElementById('modal-live-rate');
  const liveZonesEl = document.getElementById('modal-live-zones');
  const btnViewMap = document.getElementById('modal-btn-view-map');

  const zones = window.cachedZonesData || window.tacticalMap?.zones || [];
  const info = getItemRateInfo(item, zones, globalModeFilter);
  const metric = findMetricForItem(window.liveMetrics?.global, itemId);

  const cleanId = itemId.toLowerCase().replace(/_/g, '');
  const allBlds = window.cachedBuildingsData?.buildings || window.tacticalMap?.buildings || [];

  const matchingZones = info.allMatchingZones || [];
  const hasZones = matchingZones.length > 0;
  const isGlobalActive = metric && metric.production_nominal > 0;

  if (info.isProducing || isGlobalActive || hasZones) {
    const displayRate = Math.round(info.itemRate * 10) / 10;
    const modeLabel = globalModeFilter
      ? 'todo el mapa'
      : (matchingZones.length > 1 ? `${matchingZones.length} zonas` : 'zonas activas');

    if (info.isProducing || isGlobalActive) {
      liveRateEl.textContent = `${displayRate}/min (${info.machinesCount} máq. en ${modeLabel})`;
    } else {
      liveRateEl.textContent = `0/min (0 máq. activas en ${matchingZones.length} zonas)`;
    }

    if (hasZones) {
      const zoneCards = matchingZones.map(z => {
        const zm = window.liveMetrics?.zones?.[z.id];
        let zRate = 0;
        let zCount = 0;
        if (zm && zm.production) {
          for (const [k, p] of Object.entries(zm.production)) {
            const ck = k.toLowerCase().replace(/_/g, '');
            if (ck === cleanId || ck.includes(cleanId) || cleanId.includes(ck)) {
              zRate += (p.rate || 0);
              zCount += (p.count || 0);
            }
          }
        }

        // Count machines physically enclosed in this zone
        const enclosedMachines = allBlds.filter(b => 
          z.bounds && b.x >= z.bounds.minX && b.x <= z.bounds.maxX && b.y >= z.bounds.minY && b.y <= z.bounds.maxY &&
          (b.outputs || []).some(o => {
            const co = ((o.item || o.name || '') + '').toLowerCase().replace(/_/g, '');
            return co === cleanId || co.includes(cleanId) || cleanId.includes(co);
          })
        );

        let statusText = '';
        if (zRate > 0) {
          statusText = `+${Math.round(zRate * 10) / 10}/min (${zCount} máq.)`;
          if (zm && zm.overlappingCount > 0) {
            statusText += ` · <span style="color: #fbbf24;">(Compartida con otra zona)</span>`;
          }
        } else if (enclosedMachines.length > 0) {
          statusText = `0/min (${enclosedMachines.length} máq. solapadas con otra zona)`;
        } else {
          statusText = `0/min (Sin máquinas activas)`;
        }

        const zColor = z.color || '#38bdf8';
        const safeZoneId = (z.id || '').replace(/'/g, "\\'");
        const safeZoneName = escapeHtml(z.name || 'Zona');

        return `
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 6px 10px; margin-bottom: 6px; background: rgba(15, 23, 42, 0.7); border: 1px solid var(--border-glass); border-left: 4px solid ${zColor}; border-radius: 4px;">
            <div style="display: flex; flex-direction: column; gap: 2px; overflow: hidden;">
              <div style="font-weight: 800; font-size: 12px; color: #f8fafc; display: flex; align-items: center; gap: 6px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">
                <span>🏭</span> <span title="${safeZoneName}">${safeZoneName}</span>
              </div>
              <div style="font-size: 11px; color: ${zRate > 0 ? '#34d399' : '#94a3b8'}; font-weight: 600;">
                ${statusText}
              </div>
            </div>
            <button type="button" onclick="window.jumpToZone('${safeZoneId}')" class="map-hud-btn" style="padding: 3px 8px; font-size: 10.5px; height: 24px; white-space: nowrap; background: rgba(56, 189, 248, 0.15); border: 1px solid #38bdf8; color: #38bdf8; cursor: pointer; flex-shrink: 0;">
              🎯 Centrar
            </button>
          </div>
        `;
      });

      liveZonesEl.innerHTML = `
        <div style="font-weight: 800; color: #cbd5e1; margin-bottom: 6px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">
          Zonas asignadas / productoras (${matchingZones.length}):
        </div>
        ${zoneCards.join('')}
      `;
    } else {
      liveZonesEl.innerHTML = `
        <div style="padding: 6px 10px; font-size: 11px; color: #94a3b8; font-style: italic; background: rgba(15, 23, 42, 0.4); border-radius: 4px; border: 1px dashed var(--border-glass);">
          ⚠️ No hay zonas delimitadas para este ítem. Puedes crear una zona sobre el mapa para monitorizar esta producción.
        </div>
      `;
    }

    if (btnViewMap) {
      if (matchingZones.length === 1) {
        btnViewMap.innerHTML = `🎯 Ver ${escapeHtml(matchingZones[0].name.substring(0, 20))} en el Mapa`;
      } else if (matchingZones.length > 1) {
        btnViewMap.innerHTML = `🎯 Ver Primera Zona en el Mapa (${escapeHtml(matchingZones[0].name.substring(0, 15))})`;
      } else {
        btnViewMap.innerHTML = `🎯 Buscar Instalación en el Mapa Táctico`;
      }
    }

    if (liveSection) liveSection.style.display = 'block';
  } else {
    if (liveSection) liveSection.style.display = 'none';
  }

  const modal = document.getElementById('item-modal');
  if (modal) modal.classList.add('active');
}
window.openItemModal = openItemModal;

function openItemModalByName(query) {
  if (!query) return;
  const allItems = SATISFACTORY_CATEGORIES.flatMap(c => c.items);
  const q = query.toLowerCase().replace(/^(recipe_|desc_|build_)/, '').replace(/_c$/, '');
  const found = allItems.find(i => {
    const idClean = i.id.toLowerCase().replace(/_/g, '');
    const nameClean = i.name.toLowerCase().replace(/_/g, ' ');
    const qClean = q.replace(/_/g, '');
    return idClean === qClean || nameClean.includes(q.replace(/_/g, ' ')) || qClean.includes(idClean);
  });
  if (found) {
    openItemModal(found.id);
  }
}
window.openItemModalByName = openItemModalByName;

function closeModal() {
  const modal = document.getElementById('item-modal');
  if (modal) modal.classList.remove('active');
  window.hasDraggedBlueprint = false;
  if (window.tacticalMap && typeof window.tacticalMap.clearHover === 'function') {
    window.tacticalMap.clearHover();
  }
}
window.closeModal = closeModal;

function viewItemOnMap() {
  closeAllModals();
  if (currentModalItemId) {
    const zones = window.cachedZonesData || window.tacticalMap?.zones || [];
    const allItems = SATISFACTORY_CATEGORIES.flatMap(c => c.items);
    const item = allItems.find(i => i.id === currentModalItemId);
    if (item) {
      const info = getItemRateInfo(item, zones, globalModeFilter);
      if (info.allMatchingZones && info.allMatchingZones.length > 0) {
        jumpToZone(info.allMatchingZones[0].id);
        return;
      }
    }
    jumpToItemOnMap(currentModalItemId);
  }
}
window.viewItemOnMap = viewItemOnMap;

// ==========================================
// 9.1 OSCILOSCOPIO Y MONITOR DE RED ELÉCTRICA FICSIT
// ==========================================
let currentPowerCircuitId = null;
let powerOscilloscopeAnimId = null;
let powerHistoryBuffer = [];
let powerBreakerTripped = false;
let powerLastTimestamp = 0;

function updateHeaderPowerWidget() {
  const pData = window.powerGridData || window.cachedBuildingsData?.power || window.liveMetrics?.power;
  const consEl = document.getElementById('header-power-cons');
  const prodEl = document.getElementById('header-power-prod');
  const widget = document.getElementById('header-power-widget');
  if (!consEl || !prodEl) return;

  if (pData) {
    const cons = Math.round(pData.consumptionCurrent || 0);
    const prod = Math.round(pData.production || pData.capacity || 0);
    const cap = Math.round(pData.capacity || 0);
    consEl.textContent = `${cons.toLocaleString('es-ES')} MW`;
    prodEl.textContent = `${prod.toLocaleString('es-ES')} MW`;
    if (widget) {
      widget.title = `Red Eléctrica FICSIT: Consumo: ${cons.toLocaleString('es-ES')} MW | Producción: ${prod.toLocaleString('es-ES')} MW | Capacidad: ${cap.toLocaleString('es-ES')} MW. Haz clic para abrir el osciloscopio de potencia.`;
    }
  }
}
window.updateHeaderPowerWidget = updateHeaderPowerWidget;

function getActivePowerCircuit(circuitId) {
  const pData = window.powerGridData || window.cachedBuildingsData?.power || window.liveMetrics?.power;
  if (!pData || !pData.circuits || pData.circuits.length === 0) {
    return {
      circuitId: 1,
      capacity: pData?.capacity || 0,
      production: pData?.production || 0,
      consumptionNominal: pData?.consumptionNominal || 0,
      consumptionCurrent: pData?.consumptionCurrent || 0,
      fuseTriggered: false,
      generators: [],
      consumers: []
    };
  }
  if (circuitId) {
    const found = pData.circuits.find(c => c.circuitId == circuitId);
    if (found) return found;
  }
  if (currentPowerCircuitId) {
    const found = pData.circuits.find(c => c.circuitId == currentPowerCircuitId);
    if (found) return found;
  }
  return pData.circuits[0];
}

function openPowerGridModal(preferredCircuitId) {
  closeAllModals();
  const modal = document.getElementById('power-modal');
  if (!modal) return;

  const pData = window.powerGridData || window.cachedBuildingsData?.power || window.liveMetrics?.power;
  if (pData && pData.circuits && pData.circuits.length > 0) {
    const select = document.getElementById('power-circuit-select');
    const selectWrap = document.getElementById('power-circuit-selector-wrap');
    if (select && selectWrap) {
      if (pData.circuits.length > 1) {
        selectWrap.style.display = 'inline-block';
        select.innerHTML = pData.circuits.map(c => 
          `<option value="${c.circuitId}" ${c.circuitId == (preferredCircuitId || currentPowerCircuitId || pData.primaryCircuitId) ? 'selected' : ''}>
            Circuito #${c.circuitId} (${c.capacity.toLocaleString('es-ES')} MW)
          </option>`
        ).join('');
      } else {
        selectWrap.style.display = 'none';
      }
    }
  }

  currentPowerCircuitId = preferredCircuitId || pData?.primaryCircuitId || (pData?.circuits?.[0]?.circuitId) || 1;
  refreshPowerModalData();
  modal.classList.add('active');

  initPowerOscilloscope();
}
window.openPowerGridModal = openPowerGridModal;

function closePowerModal() {
  const modal = document.getElementById('power-modal');
  if (modal) modal.classList.remove('active');
  stopPowerOscilloscope();
}
window.closePowerModal = closePowerModal;

function switchPowerCircuit(circuitId) {
  currentPowerCircuitId = circuitId;
  refreshPowerModalData();
  initPowerOscilloscope();
}
window.switchPowerCircuit = switchPowerCircuit;

function togglePowerBreaker() {
  powerBreakerTripped = !powerBreakerTripped;
  refreshPowerModalData();
}
window.togglePowerBreaker = togglePowerBreaker;

function refreshPowerModalData() {
  const circuit = getActivePowerCircuit(currentPowerCircuitId);
  const titleEl = document.getElementById('power-modal-title');
  if (titleEl) {
    titleEl.textContent = `CIRCUITO DE ENERGÍA #${circuit.circuitId}`;
  }

  const isTripped = powerBreakerTripped || circuit.fuseTriggered;

  const dispCap = isTripped ? 0 : circuit.capacity;
  const dispProd = isTripped ? 0 : circuit.production;
  const dispCons = isTripped ? 0 : circuit.consumptionCurrent;
  const dispMax = isTripped ? 0 : circuit.consumptionNominal;

  const kpiCons = document.getElementById('pwr-kpi-cons');
  const kpiMax = document.getElementById('pwr-kpi-max');
  const kpiProd = document.getElementById('pwr-kpi-prod');
  const kpiCap = document.getElementById('pwr-kpi-cap');

  if (kpiCons) kpiCons.textContent = `${dispCons.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MW`;
  if (kpiMax) kpiMax.textContent = `${dispMax.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MW`;
  if (kpiProd) kpiProd.textContent = `${dispProd.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MW`;
  if (kpiCap) kpiCap.textContent = `${dispCap.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MW`;

  // Fuse indicator
  const fusePill = document.getElementById('power-fuse-pill');
  const fuseText = document.getElementById('power-fuse-text');
  const breakerBtn = document.getElementById('btn-power-breaker');
  const breakerLabel = document.getElementById('power-breaker-label');

  if (fusePill && fuseText) {
    if (isTripped) {
      fusePill.className = 'power-fuse-pill tripped';
      fuseText.textContent = '✕ FUSIBLE DISPARADO';
    } else {
      fusePill.className = 'power-fuse-pill ok';
      fuseText.textContent = '● FUSIBLE OPERATIVO';
    }
  }

  if (breakerBtn && breakerLabel) {
    if (isTripped) {
      breakerBtn.className = 'power-breaker-btn tripped';
      breakerLabel.textContent = 'RESTABLECER FUSIBLE';
    } else {
      breakerBtn.className = 'power-breaker-btn ok';
      breakerLabel.textContent = 'FUSIBLE CONECTADO';
    }
  }

  // Headroom
  const headroomVal = document.getElementById('power-headroom-val');
  const headroomPct = document.getElementById('power-headroom-pct');
  if (headroomVal && headroomPct) {
    const diff = dispCap - dispCons;
    const pct = dispCap > 0 ? ((diff / dispCap) * 100).toFixed(1) : '0.0';
    headroomVal.textContent = `${diff >= 0 ? '+' : ''}${diff.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MW`;
    headroomVal.style.color = diff >= 0 ? '#4ade80' : '#ef4444';
    headroomPct.textContent = `(${pct}% libre)`;
  }

  // Generators breakdown
  const genCountBadge = document.getElementById('power-gen-total-count');
  const genList = document.getElementById('power-generators-list');
  if (genList) {
    const gens = circuit.generators || [];
    const totalGens = gens.reduce((sum, g) => sum + (g.count || 0), 0);
    if (genCountBadge) genCountBadge.textContent = `${totalGens} máquinas`;
    if (gens.length === 0) {
      genList.innerHTML = `<div style="color:var(--text-muted); font-size:11px; padding:8px;">Sin generadores activos en esta subred.</div>`;
    } else {
      genList.innerHTML = gens.map(g => `
        <div class="power-breakdown-row">
          <div class="power-item-info">
            <img src="icons/${g.icon || 'Fuel.png'}" class="power-item-icon" onerror="this.src='icons/Fuel.png'" />
            <div>
              <span class="power-item-name">${g.nameEs || g.type}</span>
              <span class="power-item-count">(${g.count} uds)</span>
            </div>
          </div>
          <span class="power-item-rate" style="color: #4ade80;">+${(g.capacityTotal || 0).toLocaleString('es-ES')} MW</span>
        </div>
      `).join('');
    }
  }

  // Consumers breakdown
  const consCountBadge = document.getElementById('power-cons-total-count');
  const consList = document.getElementById('power-consumers-list');
  if (consList) {
    const cons = circuit.consumers || [];
    const totalCons = cons.reduce((sum, c) => sum + (c.count || 0), 0);
    if (consCountBadge) consCountBadge.textContent = `${totalCons} máquinas`;
    if (cons.length === 0) {
      consList.innerHTML = `<div style="color:var(--text-muted); font-size:11px; padding:8px;">Sin máquinas consumidoras registradas.</div>`;
    } else {
      consList.innerHTML = cons.map(c => `
        <div class="power-breakdown-row">
          <div class="power-item-info">
            <img src="icons/${c.icon || 'Iron_Plate.png'}" class="power-item-icon" onerror="this.src='icons/Iron_Plate.png'" />
            <div>
              <span class="power-item-name">${c.nameEs || c.type}</span>
              <span class="power-item-count">(${c.count} uds${c.producingCount ? ` · ${c.producingCount} activas` : ''})</span>
            </div>
          </div>
          <span class="power-item-rate" style="color: #fa9549;">-${Math.round(c.powerCurrent || c.powerNominal).toLocaleString('es-ES')} MW</span>
        </div>
      `).join('');
    }
  }
}

function initPowerOscilloscope() {
  stopPowerOscilloscope();
  const circuit = getActivePowerCircuit(currentPowerCircuitId);
  const isTripped = powerBreakerTripped || circuit.fuseTriggered;
  const baseCons = isTripped ? 0 : circuit.consumptionCurrent;

  // Initialize buffer with 120 historical samples
  powerHistoryBuffer = [];
  for (let i = 0; i < 120; i++) {
    const noise = Math.sin(i * 0.28) * 8 + Math.cos(i * 0.15) * 5;
    powerHistoryBuffer.push(Math.max(0, baseCons + noise));
  }

  powerLastTimestamp = performance.now();
  renderPowerOscilloscopeLoop();
}

function stopPowerOscilloscope() {
  if (powerOscilloscopeAnimId) {
    cancelAnimationFrame(powerOscilloscopeAnimId);
    powerOscilloscopeAnimId = null;
  }
}
window.stopPowerOscilloscope = stopPowerOscilloscope;

function renderPowerOscilloscopeLoop() {
  const modal = document.getElementById('power-modal');
  if (!modal || !modal.classList.contains('active')) {
    stopPowerOscilloscope();
    return;
  }

  const canvas = document.getElementById('power-oscilloscope-canvas');
  if (!canvas) return;

  const now = performance.now();
  if (now - powerLastTimestamp >= 60) {
    powerLastTimestamp = now;
    const circuit = getActivePowerCircuit(currentPowerCircuitId);
    const isTripped = powerBreakerTripped || circuit.fuseTriggered;
    const targetCons = isTripped ? 0 : circuit.consumptionCurrent;
    const noise = Math.sin(now * 0.0035) * 9 + Math.cos(now * 0.007) * 6;
    const newPoint = Math.max(0, targetCons + noise);
    powerHistoryBuffer.push(newPoint);
    if (powerHistoryBuffer.length > 120) {
      powerHistoryBuffer.shift();
    }
  }

  drawPowerOscilloscopeFrame(canvas);
  powerOscilloscopeAnimId = requestAnimationFrame(renderPowerOscilloscopeLoop);
}

function drawPowerOscilloscopeFrame(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;

  if (width <= 0 || height <= 0) return;

  if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
  }

  const ctx = canvas.getContext('2d');
  ctx.save();
  ctx.scale(dpr, dpr);

  const circuit = getActivePowerCircuit(currentPowerCircuitId);
  const isTripped = powerBreakerTripped || circuit.fuseTriggered;
  const capacity = isTripped ? 0 : circuit.capacity;
  const production = isTripped ? 0 : circuit.production;
  const maxCons = isTripped ? 0 : circuit.consumptionNominal;
  const curCons = powerHistoryBuffer[powerHistoryBuffer.length - 1] || (isTripped ? 0 : circuit.consumptionCurrent);

  // Layout boundaries
  const padLeft = 68;
  const padRight = 24;
  const padTop = 16;
  const padBottom = 26;
  const plotWidth = width - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;

  // Determine dynamic vertical scale (nearest 1000 MW or 500 MW)
  const peakVal = Math.max(capacity, maxCons, curCons, 100);
  let maxScale = Math.ceil((peakVal * 1.18) / 1000) * 1000;
  if (maxScale < 500) maxScale = 500;

  const valToY = (val) => padTop + plotHeight - (Math.max(0, val) / maxScale) * plotHeight;

  // 1. Clear background
  ctx.fillStyle = '#060910';
  ctx.fillRect(0, 0, width, height);

  // 2. Grid lines & Axis values
  ctx.lineWidth = 1;
  const gridSteps = 4;
  for (let i = 0; i <= gridSteps; i++) {
    const stepVal = Math.round((maxScale / gridSteps) * i);
    const y = valToY(stepVal);

    // Grid horizontal line
    ctx.strokeStyle = i === 0 ? '#334155' : 'rgba(51, 65, 85, 0.45)';
    ctx.setLineDash(i === 0 ? [] : [3, 4]);
    ctx.beginPath();
    ctx.moveTo(padLeft, y);
    ctx.lineTo(width - padRight, y);
    ctx.stroke();

    // MW label
    ctx.fillStyle = '#64748b';
    ctx.font = '10px Oswald, "Roboto Condensed", sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${stepVal.toLocaleString('es-ES')} MW`, padLeft - 8, y);
  }
  ctx.setLineDash([]);

  // Time grid vertical lines (every 15s)
  const timeLabels = ['-60s', '-45s', '-30s', '-15s', 'AHORA'];
  for (let i = 0; i < timeLabels.length; i++) {
    const x = padLeft + (plotWidth / (timeLabels.length - 1)) * i;
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.35)';
    ctx.setLineDash([2, 4]);
    ctx.beginPath();
    ctx.moveTo(x, padTop);
    ctx.lineTo(x, height - padBottom);
    ctx.stroke();

    ctx.fillStyle = i === timeLabels.length - 1 ? 'var(--ficsit-orange)' : '#64748b';
    ctx.font = '10px Oswald, "Roboto Condensed", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(timeLabels[i], x, height - padBottom + 6);
  }
  ctx.setLineDash([]);

  // 3. Draw CAPACITY line (#f8fafc)
  if (capacity > 0) {
    const yCap = valToY(capacity);
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padLeft, yCap);
    ctx.lineTo(width - padRight, yCap);
    ctx.stroke();
  }

  // 4. Draw PRODUCTION line (#94a3b8)
  if (production > 0) {
    const yProd = valToY(production);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.6;
    ctx.setLineDash([4, 2]);
    ctx.beginPath();
    ctx.moveTo(padLeft, yProd);
    ctx.lineTo(width - padRight, yProd);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // 5. Draw MAX CONSUMPTION line (#38bdf8)
  if (maxCons > 0) {
    const yMax = valToY(maxCons);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.8;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(padLeft, yMax);
    ctx.lineTo(width - padRight, yMax);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // 6. Draw CURRENT CONSUMPTION Curve (#fa9549) with area fill
  if (powerHistoryBuffer.length > 1) {
    const n = powerHistoryBuffer.length;
    const stepX = plotWidth / (n - 1);

    // Gradient fill under curve
    ctx.beginPath();
    ctx.moveTo(padLeft, height - padBottom);
    for (let i = 0; i < n; i++) {
      const x = padLeft + i * stepX;
      const y = valToY(powerHistoryBuffer[i]);
      ctx.lineTo(x, y);
    }
    ctx.lineTo(padLeft + (n - 1) * stepX, height - padBottom);
    ctx.closePath();

    const grad = ctx.createLinearGradient(0, padTop, 0, height - padBottom);
    grad.addColorStop(0, 'rgba(250, 149, 73, 0.28)');
    grad.addColorStop(1, 'rgba(250, 149, 73, 0.01)');
    ctx.fillStyle = grad;
    ctx.fill();

    // Vibrant line trace
    ctx.beginPath();
    ctx.strokeStyle = '#fa9549';
    ctx.lineWidth = 2.4;
    ctx.shadowColor = '#fa9549';
    ctx.shadowBlur = 9;

    for (let i = 0; i < n; i++) {
      const x = padLeft + i * stepX;
      const y = valToY(powerHistoryBuffer[i]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Pulsing head circle at right edge
    const lastX = padLeft + (n - 1) * stepX;
    const lastY = valToY(powerHistoryBuffer[n - 1]);
    const pulseRad = 3.5 + Math.sin(performance.now() * 0.008) * 1.5;

    ctx.fillStyle = '#fa9549';
    ctx.shadowColor = '#fa9549';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(lastX, lastY, pulseRad, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  ctx.restore();
}

// ==========================================
// 10. SCIM IN-GAME MACHINE DIALOG
// ==========================================
function formatItemIcon(itemKey) {
  if (!itemKey) return 'Iron_Ingot.png';
  if (itemKey.endsWith('.png')) return itemKey;
  let clean = itemKey.replace('Desc_', '').replace('_C', '');
  if (clean === 'OreIron') return 'Iron_Ore.png';
  if (clean === 'IronIngot') return 'Iron_Ingot.png';
  if (clean === 'IronPlate') return 'Iron_Plate.png';
  if (clean === 'IronRod') return 'Iron_Rod.png';
  if (clean === 'IronScrew') return 'Screw.png';
  if (clean === 'OreCopper') return 'Copper_Ore.png';
  if (clean === 'CopperIngot') return 'Copper_Ingot.png';
  if (clean === 'Wire') return 'Wire.png';
  if (clean === 'Cable') return 'Cable.png';
  if (clean === 'Stone') return 'Limestone.png';
  if (clean === 'Cement') return 'Concrete.png';
  if (clean === 'Coal') return 'Coal.png';
  if (clean === 'SteelIngot') return 'Steel_Ingot.png';
  if (clean === 'SteelPlate') return 'Steel_Beam.png';
  if (clean === 'SteelPipe') return 'Steel_Pipe.png';
  return clean.replace(/ /g, '_') + '.png';
}

function openMachineInGameModal(b) {
  if (!b) return;
  if (window.currentMode && window.currentMode !== 'live_map') return;
  const modal = document.getElementById('scim-machine-modal');
  if (!modal) return;

  const machineName = b.nameEs || (typeof translateBuildingType === 'function' ? translateBuildingType(b.type || b.className) : b.type);
  document.getElementById('scim-m-name').textContent = machineName;
  document.getElementById('scim-m-recipe').textContent = b.recipeName && b.recipeName !== 'Sin receta' ? `(${b.recipeName})` : '';

  // Inputs
  const inputsEl = document.getElementById('scim-m-inputs');
  if (inputsEl) {
    if (b.inputs && b.inputs.length > 0) {
      inputsEl.innerHTML = b.inputs.map(inp => {
        const inpName = (typeof getItemNameEs === 'function') ? getItemNameEs(inp.item || inp.name) : (inp.nameEs || inp.name);
        return `
        <div class="scim-m-slot-row">
          <img src="icons/${formatItemIcon(inp.item)}" onerror="this.src='icons/Iron_Ore.png'" class="scim-m-slot-icon" alt="${inpName}" />
          <div>
            <div style="font-size: 11px; font-weight: 800; color: #fff;">${inpName}</div>
            <div style="font-size: 10px; color: #94a3b8;">${Math.round(inp.rate * 10) / 10}/min</div>
          </div>
        </div>
      `;
      }).join('');
    } else {
      inputsEl.innerHTML = `<div style="color: #94a3b8; font-size: 11px; text-align: center; padding: 8px;">Sin insumos requeridos</div>`;
    }
  }

  // Outputs
  const outputsEl = document.getElementById('scim-m-outputs');
  if (outputsEl) {
    if (b.outputs && b.outputs.length > 0) {
      outputsEl.innerHTML = b.outputs.map(out => {
        const outName = (typeof getItemNameEs === 'function') ? getItemNameEs(out.item || out.name) : (out.nameEs || out.name);
        return `
        <div class="scim-m-slot-row">
          <img src="icons/${formatItemIcon(out.item)}" onerror="this.src='icons/Iron_Ingot.png'" class="scim-m-slot-icon" alt="${outName}" />
          <div>
            <div style="font-size: 11px; font-weight: 800; color: #fff;">${outName}</div>
            <div style="font-size: 10px; color: #34d399;">+${Math.round(out.rate * 10) / 10}/min</div>
          </div>
        </div>
      `;
      }).join('');
    } else {
      outputsEl.innerHTML = `<div style="color: #94a3b8; font-size: 11px; text-align: center; padding: 8px;">Sin producto asignado</div>`;
    }
  }

  // Center Preview Icon
  const centerIcon = document.getElementById('scim-m-center-icon');
  if (centerIcon) {
    const iconName = b.icon || (b.outputs?.[0] ? formatItemIcon(b.outputs[0].item) : 'Iron_Ingot.png');
    centerIcon.src = `icons/${iconName}`;
  }

  // Status Pill
  const statusPill = document.getElementById('scim-m-status-pill');
  const statusText = document.getElementById('scim-m-status-text');
  if (statusPill && statusText) {
    statusPill.className = `scim-m-status-pill ${b.status || 'idle'}`;
    statusText.textContent = b.status === 'producing' ? 'En Producción - 100%' : (b.status === 'idle' ? 'En Espera - 0%' : 'Detenida');
  }

  // Power & Time
  const powerEl = document.getElementById('scim-m-power');
  if (powerEl) powerEl.textContent = `⚡ ${b.power || 4} MW`;
  const timeEl = document.getElementById('scim-m-time');
  if (timeEl) timeEl.textContent = `⏱️ ${b.duration || 2}s`;

  // Clockspeed
  const clockVal = document.getElementById('scim-m-clock-val');
  const clockBar = document.getElementById('scim-m-clock-bar');
  const clockPct = Math.round((b.potential || 1.0) * 100);
  if (clockVal) clockVal.textContent = `${clockPct} %`;
  if (clockBar) clockBar.style.width = `${Math.min(100, clockPct)}%`;

  // Actions
  const btnCenter = document.getElementById('scim-m-btn-center');
  if (btnCenter) btnCenter.onclick = () => {
    closeMachineModal();
    window.tacticalMap.centerOnMachine(b.id);
  };
  const btnCopy = document.getElementById('scim-m-btn-copy');
  if (btnCopy) btnCopy.onclick = () => window.tacticalMap.copyCoords(b.x, b.y, b.z);
  const btnRecipe = document.getElementById('scim-m-btn-recipe');
  if (btnRecipe) btnRecipe.onclick = () => {
    closeMachineModal();
    if (b.outputs?.[0]?.item) window.openItemModalByName(b.outputs[0].item);
  };

  modal.classList.add('active');
}
window.openMachineInGameModal = openMachineInGameModal;

function closeMachineModal() {
  const modal = document.getElementById('scim-machine-modal');
  if (modal) modal.classList.remove('active');
  if (window.tacticalMap && typeof window.tacticalMap.clearHover === 'function') {
    window.tacticalMap.clearHover();
  }
}
window.closeMachineModal = closeMachineModal;

// ==========================================
// 11. GESTIÓN DE ZONAS (CREAR / EDITAR / BORRAR)
// ==========================================
function populateZoneItemSelect() {
  const select = document.getElementById('zone-item-select');
  if (!select) return;
  const allItems = SATISFACTORY_CATEGORIES.flatMap(c => c.items);
  select.innerHTML = '<option value="">-- General / Múltiples Ítems --</option>' + 
    allItems.map(i => `<option value="${i.id}">${i.name} (${i.id.replace(/_/g, ' ')})</option>`).join('');
}

function toggleDrawZoneMode() {
  if (!window.tacticalMap) return;
  window.tacticalMap.setDrawMode(!window.tacticalMap.isDrawMode);
}
window.toggleDrawZoneMode = toggleDrawZoneMode;

function centerMapOnBase() {
  if (!window.tacticalMap) return;
  window.tacticalMap.centerOnPlayerBase();
}
window.centerMapOnBase = centerMapOnBase;

function mapZoomIn() {
  if (!window.tacticalMap) return;
  window.tacticalMap.scale = Math.min(120, window.tacticalMap.scale * 1.3);
  window.tacticalMap.render();
  window.tacticalMap.updateZoomIndicator();
}
window.mapZoomIn = mapZoomIn;

function mapZoomOut() {
  if (!window.tacticalMap) return;
  window.tacticalMap.scale = Math.max(0.08, window.tacticalMap.scale * 0.7);
  window.tacticalMap.render();
  window.tacticalMap.updateZoomIndicator();
}
window.mapZoomOut = mapZoomOut;

function openSCIM() {
  window.open('https://satisfactory-calculator.com/en/interactive-map', '_blank');
}
window.openSCIM = openSCIM;

function switchScimSidebarTab(tabName) {
  currentScimTab = tabName;
  if (typeof saveAppState === 'function') saveAppState();
  const tabs = [
    { id: 'resources', btnId: 'btn_scim_tab_res', paneId: 'scim_tab_pane_resources' },
    { id: 'zones', btnId: 'btn_scim_tab_zones', paneId: 'scim_tab_pane_zones' },
    { id: 'layers', btnId: 'btn_scim_tab_layers', paneId: 'scim_tab_pane_layers' }
  ];

  tabs.forEach(t => {
    const btn = document.getElementById(t.btnId);
    const pane = document.getElementById(t.paneId);
    const isActive = t.id === tabName;
    if (btn) btn.classList.toggle('active', isActive);
    if (pane) {
      pane.classList.toggle('active', isActive);
      pane.style.display = isActive ? 'flex' : 'none';
    }
  });
}
window.switchScimSidebarTab = switchScimSidebarTab;

// === COLLECTIBLES SIDEBAR ===
function switchCollectibleSubTab(tabName) {
  currentCollectibleSubTab = tabName;
  document.querySelectorAll('.collectibles-sub-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });
  renderCollectiblesList(tabName);
  if (typeof saveAppState === 'function') saveAppState();
}
window.switchCollectibleSubTab = switchCollectibleSubTab;

function renderCollectiblesList(subTab) {
  const container = document.getElementById('collectibles-list-container');
  if (!container || typeof MAP_COLLECTIBLE_TABS === 'undefined') return;

  const tabKey = subTab === 'collectibles_items' ? 'collectibles' : subTab;
  const tabData = MAP_COLLECTIBLE_TABS[tabKey];
  if (!tabData) {
    container.innerHTML = '<p style="color: var(--text-muted); font-size: 12px; padding: 4px;">No hay datos.</p>';
    return;
  }

  const collectedSet = window.tacticalMap ? window.tacticalMap.collectedPathNames : new Set();
  let lastGroupLabel = null;
  let html = '';

  for (const group of tabData.groups) {
    const gl = group.groupLabelEs || group.groupLabel || null;
    if (gl && gl !== lastGroupLabel) {
      html += `<div style="font-size: 10px; font-weight: 900; color: var(--text-dim); text-transform: uppercase; margin: 8px 0 3px 2px;">${gl.toUpperCase()}</div>`;
      lastGroupLabel = gl;
    }

    const collected = group.markers.filter(m => collectedSet.has(m.pathName)).length;
    const total = group.count;
    const isActive = window.tacticalMap && window.tacticalMap.collectibleVisibility.has(group.name);
    const isChecked = Boolean(isActive);

    html += `
      <label class="scim-resource-item ${isChecked ? 'active' : ''}">
        <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="toggleCollectibleGroup('${group.name.replace(/'/g, "\\'")}', this.checked)" />
        <img src="icons/${group.icon}" class="scim-res-icon" alt="${group.nameEs || group.name}" onerror="this.style.display='none'" />
        <span class="scim-res-name">${group.nameEs || group.name}</span>
        <span class="scim-res-counter" title="${collected} obtenidos de ${total} totales">
          <span style="color: #F5C04B;">${collected}</span> / <span style="color: #22C55E;">${total - collected}</span>
        </span>
      </label>
    `;
  }

  container.innerHTML = html;
}
window.renderCollectiblesList = renderCollectiblesList;

function toggleCollectibleGroup(groupName, isChecked) {
  if (!window.tacticalMap) return;
  const shouldBeActive = isChecked !== undefined ? isChecked : !window.tacticalMap.collectibleVisibility.has(groupName);
  window.tacticalMap.setCollectibleGroupVisible(groupName, shouldBeActive);
  renderCollectiblesList(currentCollectibleSubTab);
  if (typeof saveAppState === 'function') saveAppState();
}
window.toggleCollectibleGroup = toggleCollectibleGroup;

function closeZoneModal() {
  const modal = document.getElementById('zone-modal');
  if (modal) {
    modal.classList.remove('active');
    delete modal.dataset.editingZoneId;
    const titleEl = document.getElementById('zone-modal-title');
    if (titleEl) titleEl.textContent = 'DELIMITAR NUEVA ZONA';
  }
  if (window.tacticalMap) window.tacticalMap.setDrawMode(false);
}
window.closeZoneModal = closeZoneModal;

function editZone(zoneId) {
  if (!window.tacticalMap || !window.tacticalMap.zones) return;
  const zone = window.tacticalMap.zones.find(z => z.id === zoneId);
  if (!zone) return;

  const modal = document.getElementById('zone-modal');
  if (!modal) return;

  const titleEl = document.getElementById('zone-modal-title');
  if (titleEl) titleEl.textContent = 'CONFIGURAR / EDITAR ZONA';

  document.getElementById('zone-bounds-minx').value = Math.round(zone.bounds.minX);
  document.getElementById('zone-bounds-maxx').value = Math.round(zone.bounds.maxX);
  document.getElementById('zone-bounds-miny').value = Math.round(zone.bounds.minY);
  document.getElementById('zone-bounds-maxy').value = Math.round(zone.bounds.maxY);
  document.getElementById('zone-name-input').value = zone.name;

  const itemSel = document.getElementById('zone-item-select');
  if (itemSel) {
    if (itemSel.options.length <= 1 && typeof populateZoneItemSelect === 'function') {
      populateZoneItemSelect();
    }
    itemSel.value = zone.item || '';
  }
  if (document.getElementById('zone-color-input')) {
    document.getElementById('zone-color-input').value = zone.color || '#38bdf8';
  }

  modal.dataset.editingZoneId = zoneId;

  const inside = window.tacticalMap?.buildings ? window.tacticalMap.buildings.filter(b => 
    b.x >= zone.bounds.minX && b.x <= zone.bounds.maxX && b.y >= zone.bounds.minY && b.y <= zone.bounds.maxY
  ) : [];
  const zm = window.tacticalMap ? window.tacticalMap.getZoneMetrics(zone) : null;
  const count = zm ? zm.machines.length : inside.length;
  let previewText = `Editando zona con ${count} máquina(s) exclusivas activas.`;
  if (zm && zm.overlappingCount > 0) {
    previewText += ` (${zm.overlappingCount} compartida(s) con otra zona prioritaria - sin duplicados).`;
  }
  document.getElementById('zone-machines-preview').textContent = previewText;

  window.tacticalMap.selectedZone = zone;
  window.tacticalMap.render();

  modal.classList.add('active');
}
window.editZone = editZone;

async function submitZoneForm(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  const modal = document.getElementById('zone-modal');
  const name = document.getElementById('zone-name-input')?.value?.trim() || 'Zona';
  const item = document.getElementById('zone-item-select')?.value || '';
  const color = document.getElementById('zone-color-input')?.value || '#38bdf8';
  const minX = parseFloat(document.getElementById('zone-bounds-minx')?.value || 0);
  const maxX = parseFloat(document.getElementById('zone-bounds-maxx')?.value || 0);
  const minY = parseFloat(document.getElementById('zone-bounds-miny')?.value || 0);
  const maxY = parseFloat(document.getElementById('zone-bounds-maxy')?.value || 0);

  const zoneId = modal?.dataset?.editingZoneId || `zone-${Date.now()}`;

  const newZone = {
    id: zoneId,
    name,
    item,
    color,
    bounds: { minX, maxX, minY, maxY }
  };

  if (window.tacticalMap) {
    if (!window.tacticalMap.zones) window.tacticalMap.zones = [];
    const existingIdx = window.tacticalMap.zones.findIndex(z => z.id === zoneId);
    if (existingIdx >= 0) {
      window.tacticalMap.zones[existingIdx] = newZone;
    } else {
      window.tacticalMap.zones.push(newZone);
    }
    window.tacticalMap.selectedZone = newZone;
    window.tacticalMap.persistZones();
    window.tacticalMap.render();
    window.tacticalMap.updateZoneListUI();
    if (window.tacticalMap.isDrawMode) {
      window.tacticalMap.setDrawMode(false);
    }
  }

  window.cachedZonesData = window.tacticalMap ? window.tacticalMap.zones : [newZone];
  try {
    localStorage.setItem('ficsit_zones', JSON.stringify(window.cachedZonesData));
  } catch (err) {}

  if (typeof window.updateQuickZonesBar === 'function') window.updateQuickZonesBar();
  if (typeof recalculateLiveMetrics === 'function') recalculateLiveMetrics();
  if (typeof closeZoneModal === 'function') closeZoneModal();
}
window.submitZoneForm = submitZoneForm;

async function deleteZone(zoneId) {
  if (window.tacticalMap && typeof window.tacticalMap.deleteZone === 'function') {
    window.tacticalMap.deleteZone(zoneId);
  } else {
    if (!confirm('¿Seguro que deseas eliminar esta zona delimitada?')) return;
    let zones = [];
    try {
      const stored = localStorage.getItem('ficsit_zones');
      if (stored) zones = JSON.parse(stored);
    } catch (e) {}
    zones = zones.filter(z => z.id !== zoneId);
    try {
      localStorage.setItem('ficsit_zones', JSON.stringify(zones));
    } catch (e) {}
    window.cachedZonesData = zones;
    if (typeof window.updateQuickZonesBar === 'function') window.updateQuickZonesBar();
  }
  if (typeof recalculateLiveMetrics === 'function') recalculateLiveMetrics();
}
window.deleteZone = deleteZone;

// ==========================================
// 12. PLANOS SVG ALTERNATIVOS (OPCIONAL)
// ==========================================
function renderAllPanels() {
  const container = document.getElementById('panels-container');
  if (!container) return;
  container.innerHTML = '';

  SATISFACTORY_CATEGORIES.forEach((cat, idx) => {
    const panel = document.createElement('div');
    panel.id = 'cat_view_' + cat.id;
    panel.className = 'category-panel ' + (cat.id === currentBranchId ? 'active' : '');
    panel.style.display = cat.id === currentBranchId ? 'block' : 'none';

    const half = Math.ceil(cat.items.length / 2);
    const leftItems = cat.items.slice(0, half);
    const rightItems = cat.items.slice(half);

    const maxRows = Math.max(leftItems.length, rightItems.length);
    const svgHeight = Math.max(520, 60 + maxRows * 82);

    const leftPaths = leftItems.map((_, i) => {
      const y = 30 + i * 82 + 26;
      return `<path d="M 416 ${y} Q 560 ${y} 670 ${Math.min(svgHeight - 100, 240 + i * 25)}" />`;
    }).join('');

    const rightPaths = rightItems.map((_, i) => {
      const y = 30 + i * 82 + 26;
      return `<path d="M 1275 ${y} Q 1120 ${y} 990 ${Math.min(svgHeight - 100, 240 + i * 25)}" />`;
    }).join('');

    panel.innerHTML = `
      <svg viewBox="0 0 1700 ${svgHeight}" style="width: 1700px; height: ${svgHeight}px; user-select: none; background-color: var(--svg-bg); display: block;">
        <defs>
          <pattern id="grid_${cat.id}" width="25" height="25" patternUnits="userSpaceOnUse">
            <path d="M 25 0 L 0 0 0 25" fill="none" stroke="var(--svg-grid)" stroke-width="1"/>
          </pattern>
        </defs>

        <rect width="1700" height="${svgHeight}" fill="url(#grid_${cat.id})" />

        <g stroke="#ef4444" stroke-width="2.5" fill="none" stroke-linecap="round">
          ${leftPaths}
          ${rightPaths}
        </g>

        <!-- Mall Central -->
        <g transform="translate(670, ${Math.max(20, Math.floor(svgHeight / 2) - 130)})">
          <rect x="0" y="0" width="320" height="230" rx="10" fill="var(--svg-mall-bg)" stroke="var(--border-main)" stroke-width="3" />
          <rect x="0" y="0" width="320" height="40" rx="8" fill="#0f172a" />
          <text x="160" y="25" text-anchor="middle" font-size="13" font-weight="900" fill="#ffffff">🏛️ MALL CENTRAL</text>
          <text x="160" y="56" text-anchor="middle" font-size="10" font-weight="bold" fill="#38bdf8">[ MATRIZ DE RECOGIDA ]</text>
        </g>

        ${leftItems.map((item, i) => renderSvgRow(item, i, 'left')).join('')}
        ${rightItems.map((item, i) => renderSvgRow(item, i, 'right')).join('')}
      </svg>
    `;

    container.appendChild(panel);
  });
}

function renderSvgRow(item, index, side) {
  const y = 30 + index * 82;
  const isExtractor = item.type === 'extractor';

  if (side === 'left') {
    return `
      <g transform="translate(10, ${y})">
        <g transform="translate(10, 0)">
          <rect x="0" y="0" width="80" height="52" rx="4" fill="var(--bg-card)" stroke="#0284c7" stroke-width="1.5" />
          <rect x="2" y="2" width="76" height="10" rx="2" fill="#0284c7" />
          <text x="40" y="9" text-anchor="middle" font-size="6" font-weight="900" fill="#ffffff">ENTRADA</text>
          <text x="40" y="44" text-anchor="middle" font-size="5.5" font-weight="bold" fill="#0284c7">${item.input.substring(0, 16)}</text>
        </g>

        <line x1="90" y1="26" x2="120" y2="26" stroke="#0284c7" stroke-width="2" stroke-dasharray="3 2" />

        <g transform="translate(120, 0)" onclick="openItemModal('${item.id}')" style="cursor: pointer;">
          <rect x="0" y="0" width="100" height="52" rx="4" fill="var(--bg-card)" stroke="${item.color}" stroke-width="2" />
          <image href="icons/${item.id}.png" x="8" y="10" width="32" height="32" />
          <text x="44" y="24" font-size="7.5" font-weight="bold" fill="var(--text-main)">${item.name.substring(0, 14)}</text>
        </g>

        <line x1="220" y1="26" x2="250" y2="26" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3 2" />

        <g transform="translate(250, 0)">
          <rect x="0" y="0" width="75" height="52" rx="4" fill="var(--bg-card)" stroke="#f59e0b" stroke-width="1.5" />
          <text x="37" y="30" text-anchor="middle" font-size="6.5" font-weight="bold" fill="var(--text-main)">ALMACÉN</text>
        </g>

        <line x1="325" y1="26" x2="355" y2="26" stroke="#ef4444" stroke-width="2" stroke-dasharray="3 2" />

        <g transform="translate(355, 0)">
          <rect x="0" y="0" width="60" height="52" rx="4" fill="var(--bg-card)" stroke="#ef4444" stroke-width="1.5" />
          <text x="30" y="30" text-anchor="middle" font-size="6" font-weight="bold" fill="#ef4444">SALIDA</text>
        </g>
      </g>
    `;
  } else {
    return `
      <g transform="translate(1275, ${y})">
        <g transform="translate(0, 0)">
          <rect x="0" y="0" width="60" height="52" rx="4" fill="var(--bg-card)" stroke="#ef4444" stroke-width="1.5" />
          <text x="30" y="30" text-anchor="middle" font-size="6" font-weight="bold" fill="#ef4444">SALIDA</text>
        </g>

        <line x1="60" y1="26" x2="90" y2="26" stroke="#ef4444" stroke-width="2" stroke-dasharray="3 2" />

        <g transform="translate(90, 0)">
          <rect x="0" y="0" width="75" height="52" rx="4" fill="var(--bg-card)" stroke="#f59e0b" stroke-width="1.5" />
          <text x="37" y="30" text-anchor="middle" font-size="6.5" font-weight="bold" fill="var(--text-main)">ALMACÉN</text>
        </g>

        <line x1="165" y1="26" x2="195" y2="26" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3 2" />

        <g transform="translate(195, 0)" onclick="openItemModal('${item.id}')" style="cursor: pointer;">
          <rect x="0" y="0" width="100" height="52" rx="4" fill="var(--bg-card)" stroke="${item.color}" stroke-width="2" />
          <image href="icons/${item.id}.png" x="8" y="10" width="32" height="32" />
          <text x="44" y="24" font-size="7.5" font-weight="bold" fill="var(--text-main)">${item.name.substring(0, 14)}</text>
        </g>

        <line x1="295" y1="26" x2="325" y2="26" stroke="#0284c7" stroke-width="2" stroke-dasharray="3 2" />

        <g transform="translate(325, 0)">
          <rect x="0" y="0" width="80" height="52" rx="4" fill="var(--bg-card)" stroke="#0284c7" stroke-width="1.5" />
          <rect x="2" y="2" width="76" height="10" rx="2" fill="#0284c7" />
          <text x="40" y="9" text-anchor="middle" font-size="6" font-weight="900" fill="#ffffff">ENTRADA</text>
          <text x="40" y="44" text-anchor="middle" font-size="5.5" font-weight="bold" fill="#0284c7">${item.input.substring(0, 16)}</text>
        </g>
      </g>
    `;
  }
}
