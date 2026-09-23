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
const APP_STATE_KEY = 'ficsit_app_state_v3';

function saveAppState() {
  const state = {
    globalModeFilter,
    activeOnlyFilter,
    currentBranchId,
    currentMode,
    currentScimTab,
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
  renderSchematics(currentBranchId);
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
      closeModal();
      closeMachineModal();
      closeZoneModal();
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
    if (currentMode === 'schematics' && currentSchematicsViewMode === 'flow') {
      requestAnimationFrame(updateFlowGraphConnections);
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
function switchMainMode(modeId) {
  currentMode = modeId;
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
        if (pendingMapState.resources) window.tacticalMap.filters.resources = new Set(pendingMapState.resources);
        if (pendingMapState.cameraX !== undefined) window.tacticalMap.cameraX = pendingMapState.cameraX;
        if (pendingMapState.cameraY !== undefined) window.tacticalMap.cameraY = pendingMapState.cameraY;
        if (pendingMapState.scale !== undefined) window.tacticalMap.scale = pendingMapState.scale;
        
        // Sync DOM Background Pills
        ['realistic', 'topo', 'blueprint'].forEach(bg => {
          const btn = document.getElementById('btn-bg-' + bg);
          if (btn) btn.classList.toggle('active', bg === window.tacticalMap.currentMapBg);
        });
        
        // Sync Status toggles
        document.querySelectorAll('.scim-status-toggle-btn').forEach(btn => {
          btn.classList.toggle('active', btn.dataset.status === window.tacticalMap.filters.status);
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
  } else if (modeId === 'mall_summary') {
    renderMallSummary();
  }
}
window.switchMainMode = switchMainMode;

// Compatibility alias for legacy calls
window.switchTab = (tabId) => {
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
  currentBranchId = branchId;
  saveAppState();
  renderBranchNavRail();
  renderSchematics(branchId);
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
  window.hasDraggedBlueprint = false;

  viewport.addEventListener('mousedown', (e) => {
    if (e.target.closest('button')) return;
    isDragging = true;
    window.hasDraggedBlueprint = false;
    viewport.style.cursor = 'grabbing';
    startX = e.clientX - bpPanX;
    startY = e.clientY - bpPanY;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    window.hasDraggedBlueprint = true;
    bpPanX = e.clientX - startX;
    bpPanY = e.clientY - startY;
    updateBlueprintTransform();
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      viewport.style.cursor = 'grab';
    }
  });

  viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
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

function resetBlueprintZoom(svgW = 1760, svgH = 650) {
  const viewport = document.getElementById('svg-blueprint-viewport');
  if (!viewport) return;
  const vpW = viewport.clientWidth || 1000;
  const vpH = viewport.clientHeight || 700;
  const fitScale = Math.min((vpW - 40) / svgW, (vpH - 40) / svgH, 1.0);
  bpZoom = Math.max(0.35, Math.min(1.0, fitScale));
  bpPanX = Math.round((vpW - svgW * bpZoom) / 2);
  bpPanY = Math.max(20, Math.round((vpH - svgH * bpZoom) / 2));
  updateBlueprintTransform();
}
window.resetBlueprintZoom = resetBlueprintZoom;

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

  let items = cat.items;
  if (activeOnlyFilter && window.liveMetrics?.global) {
    items = items.filter(item => {
      const metric = findMetricForItem(window.liveMetrics.global, item.id);
      let r = 0;
      if (metric) r = globalModeFilter ? metric.production_nominal : Object.values(metric.zones_breakdown || {}).reduce((s, v) => s + v, 0);
      return r > 0;
    });
    if (items.length === 0) items = cat.items;
  }

  const half = Math.ceil(items.length / 2);
  const leftItems = items.slice(0, half);
  const rightItems = items.slice(half);
  const maxRows = Math.max(leftItems.length, rightItems.length, 1);
  const rowSpacing = 88;
  const startY = 50;
  const svgHeight = Math.max(620, startY + maxRows * rowSpacing + 40);
  const svgWidth = 1760;

  const mallW = 340;
  const mallH = 260;
  const mallX = (svgWidth - mallW) / 2; // 710
  const mallY = Math.max(45, Math.floor((svgHeight - mallH) / 2));
  const mallCenterY = mallY + mallH / 2;

  const zones = window.cachedZonesData || window.tacticalMap?.zones || [];

  function getMachineType(item) {
    if (item.type === 'extractor') return 'Extractor Minero';
    if (item.input.includes('Petróleo')) return 'Refinería';
    if (item.input.includes('+')) return 'Ensambladora';
    if (item.input.includes('Mineral') || item.input.includes('Hierro +')) return 'Fundición';
    return 'Constructor';
  }

  function getLinkedZone(item) {
    const cItem = item.id.toLowerCase().replace(/_/g, '');
    const iName = item.name.toLowerCase();
    return zones.find(z => {
      if (!z) return false;
      const zItem = (z.item || '').toLowerCase().replace(/_/g, '');
      if (zItem && (zItem === cItem || zItem.includes(cItem) || cItem.includes(zItem))) return true;
      const zName = (z.name || '').toLowerCase();
      return zName.includes(iName) || iName.includes(zName);
    });
  }

  function renderRow(item, index, side) {
    const y = startY + index * rowSpacing;
    const metric = findMetricForItem(window.liveMetrics?.global, item.id);
    let itemRate = 0;
    if (metric) itemRate = globalModeFilter ? metric.production_nominal : Object.values(metric.zones_breakdown || {}).reduce((s, v) => s + v, 0);
    const isProducing = itemRate > 0;
    const rateText = isProducing ? `+${Math.round(itemRate * 10) / 10}/m` : '0/m (Buffer)';
    const machineType = getMachineType(item);
    const linkedZone = getLinkedZone(item);
    const zoneBadgeText = linkedZone ? `🏭 ${linkedZone.name.substring(0, 14)}` : (globalModeFilter && metric && metric.production_nominal > 0 ? '🌍 Global' : '⚠️ Sin zona');
    const zoneColor = linkedZone ? '#38bdf8' : (globalModeFilter && metric && metric.production_nominal > 0 ? '#10b981' : '#eab308');
    const itemColor = item.color || '#ea580c';

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
          <g transform="translate(118, 0)" class="bp-node-clickable" onclick="window.openItemModal('${item.id}')" title="Clic para ver ficha técnica de ${item.name}">
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
          <g transform="translate(238, 0)" class="bp-node-clickable" onclick="window.openItemModal('${item.id}')">
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
            <text x="44" y="34" text-anchor="middle" font-size="8">🚉 📤</text>
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
          <g transform="translate(112, 0)" class="bp-node-clickable" onclick="window.openItemModal('${item.id}')">
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
          <g transform="translate(224, 0)" class="bp-node-clickable" onclick="window.openItemModal('${item.id}')" title="Clic para ver ficha técnica de ${item.name}">
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
            <text x="42.5" y="34" text-anchor="middle" font-size="8">🚉 📥</text>
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
            const metric = findMetricForItem(window.liveMetrics?.global, item.id);
            let itemRate = 0;
            if (metric) itemRate = globalModeFilter ? metric.production_nominal : Object.values(metric.zones_breakdown || {}).reduce((s, v) => s + v, 0);
            const isProd = itemRate > 0;
            return `
              <g transform="translate(${col * 33}, ${row * 34})" class="bp-node-clickable" onclick="window.openItemModal('${item.id}')" title="${item.name}: ${isProd ? '+' + Math.round(itemRate) + '/m' : 'Buffer'}">
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

  // Auto fit initially if not zoomed by user
  if (window.lastRenderedBranch !== branchId) {
    resetBlueprintZoom(svgWidth, svgHeight);
    window.lastRenderedBranch = branchId;
  }
}
window.renderSchematics = renderSchematics;


function jumpToZone(zoneIdOrName) {
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

  container.innerHTML = items.map(item => {
    const metric = findMetricForItem(window.liveMetrics?.global, item.id);
    const isProducing = metric && metric.production_nominal > 0;
    const rateColor = isProducing ? 'var(--neon-green)' : 'var(--text-dim)';
    const rate = isProducing ? `+${Math.round(metric.production_nominal * 10) / 10}/m` : '0/m';

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

function initSaveAndMetricsSync() {
  fetchMetrics();
  loadMapData();

  setInterval(() => {
    autosyncSecondsLeft--;
    if (autosyncSecondsLeft <= 0) {
      autosyncSecondsLeft = 300;
      forceReloadLatestSave();
    } else {
      updateSyncCountdownUI();
    }
  }, 1000);

  // Poll metrics every 20 seconds to keep live rates fresh
  setInterval(fetchMetrics, 20000);
}

function updateSyncCountdownUI() {
  const badge = document.getElementById('save-status-text');
  if (!badge) return;
  const m = Math.floor(autosyncSecondsLeft / 60);
  const s = autosyncSecondsLeft % 60;
  const timeStr = `${m}:${s < 10 ? '0' : ''}${s}`;
  const saveName = window.liveMetrics?.active_save_file || window.liveMetrics?.session?.sessionName || 'Satisfactory';
  badge.innerHTML = `🟢 <strong>${saveName}</strong> &bull; Autosync: <strong>${timeStr}</strong>`;
}

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
}

async function fetchMetrics() {
  try {
    const ts = Date.now();
    let res = await fetch(`/api/metrics?t=${ts}`).catch(() => null);
    if (!res || !res.ok) res = await fetch(`data/metrics.json?t=${ts}`);
    if (!res.ok) return;
    const data = await res.json();
    window.liveMetrics = data;
    updateSyncCountdownUI();
    if (currentMode === 'schematics') renderSchematics(currentBranchId);
    if (currentMode === 'mall_summary') renderMallSummary();
  } catch (err) {
    console.warn('[Sync] Could not fetch metrics:', err.message);
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
    if (!zonesRes || !zonesRes.ok) zonesRes = await fetch(`data/zones.json?t=${ts}`);

    const bldData = await bldRes.json();
    const zonesData = await zonesRes.json();

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

    updateKPITicker(bldData, window.liveMetrics);
    applyMapData(bldData, zonesData, nodes);
    updateQuickZonesBar();
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
  setTimeout(() => {
    if (window.tacticalMap) {
      window.tacticalMap.resizeCanvas();
      window.tacticalMap.centerOnPlayerBase();
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
  const btn = document.getElementById('btn-force-reload');
  
  if (spinIcon) spinIcon.classList.add('spinning');
  if (btn) btn.disabled = true;
  if (badge) badge.innerHTML = '⏳ Leyendo save más reciente en /srv/saved/server...';

  try {
    // 1. Intentar activar la sincronización forzada en el daemon local o remoto
    const triggerHosts = [
      'http://localhost:8086',
      `http://${window.location.hostname}:8086`,
      'http://192.168.1.230:8086',
      'http://100.109.149.10:8086'
    ];
    let triggered = false;
    for (const host of triggerHosts) {
      try {
        const tr = await fetch(`${host}/api/sync/force`, {
          method: 'POST',
          signal: AbortSignal.timeout(4000)
        });
        if (tr.ok) {
          triggered = true;
          console.log('[Sync] Disparada sincronización vía daemon en:', host);
          break;
        }
      } catch (e) {}
    }

    // Esperar brevemente para asegurar que los archivos se escribieron
    if (triggered) {
      await new Promise(r => setTimeout(r, 600));
    }

    // 2. Recargar datos con timestamp anti-caché
    await loadMapData();
    await fetchMetrics();

    // 3. Reiniciar contador de autosync a 300s (5 minutos)
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
window.reloadSaveData = forceReloadLatestSave;

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
  if (window.hasDraggedBlueprint) return;
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

  const metric = findMetricForItem(window.liveMetrics?.global, itemId);
  if (metric && metric.production_nominal > 0) {
    const rate = Math.round(metric.production_nominal * 10) / 10;
    liveRateEl.textContent = `${rate}/min (${metric.machines_count} máq.)`;

    const breakdowns = Object.entries(metric.zones_breakdown || {});
    if (breakdowns.length > 0) {
      liveZonesEl.innerHTML = `<strong>Zonas productoras:</strong><br>` + 
        breakdowns.map(([zName, zRate]) => `&bull; 🏭 <em>${zName}</em>: <strong>${Math.round(zRate * 10) / 10}/min</strong>`).join('<br>');
    } else {
      liveZonesEl.innerHTML = `<em>Instalaciones fuera de zonas delimitadas.</em>`;
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
}
window.closeModal = closeModal;

function viewItemOnMap() {
  closeModal();
  if (currentModalItemId) jumpToItemOnMap(currentModalItemId);
}
window.viewItemOnMap = viewItemOnMap;

// ==========================================
// 10. SCIM IN-GAME MACHINE DIALOG
// ==========================================
function formatItemIcon(itemKey) {
  if (!itemKey) return 'Iron_Ingot.png';
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
  return clean + '.png';
}

function openMachineInGameModal(b) {
  if (!b) return;
  const modal = document.getElementById('scim-machine-modal');
  if (!modal) return;

  document.getElementById('scim-m-name').textContent = b.nameEs || b.type;
  document.getElementById('scim-m-recipe').textContent = `(${b.recipeName || 'Sin receta'})`;

  // Inputs
  const inputsEl = document.getElementById('scim-m-inputs');
  if (inputsEl) {
    if (b.inputs && b.inputs.length > 0) {
      inputsEl.innerHTML = b.inputs.map(inp => `
        <div class="scim-m-slot-row">
          <img src="icons/${formatItemIcon(inp.item)}" onerror="this.src='icons/Iron_Ore.png'" class="scim-m-slot-icon" alt="${inp.name}" />
          <div>
            <div style="font-size: 11px; font-weight: 800; color: #fff;">${inp.name}</div>
            <div style="font-size: 10px; color: #94a3b8;">${Math.round(inp.rate * 10) / 10}/min</div>
          </div>
        </div>
      `).join('');
    } else {
      inputsEl.innerHTML = `<div style="color: #94a3b8; font-size: 11px; text-align: center; padding: 8px;">Sin insumos requeridos</div>`;
    }
  }

  // Outputs
  const outputsEl = document.getElementById('scim-m-outputs');
  if (outputsEl) {
    if (b.outputs && b.outputs.length > 0) {
      outputsEl.innerHTML = b.outputs.map(out => `
        <div class="scim-m-slot-row">
          <img src="icons/${formatItemIcon(out.item)}" onerror="this.src='icons/Iron_Ingot.png'" class="scim-m-slot-icon" alt="${out.name}" />
          <div>
            <div style="font-size: 11px; font-weight: 800; color: #fff;">${out.name}</div>
            <div style="font-size: 10px; color: #34d399;">+${Math.round(out.rate * 10) / 10}/min</div>
          </div>
        </div>
      `).join('');
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
    if (btn) btn.classList.toggle('active', t.id === tabName);
    if (pane) pane.classList.toggle('active', t.id === tabName);
  });
}
window.switchScimSidebarTab = switchScimSidebarTab;

function closeZoneModal() {
  const modal = document.getElementById('zone-modal');
  if (modal) {
    modal.classList.remove('active');
    delete modal.dataset.editingZoneId;
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

  document.getElementById('zone-bounds-minx').value = Math.round(zone.bounds.minX);
  document.getElementById('zone-bounds-maxx').value = Math.round(zone.bounds.maxX);
  document.getElementById('zone-bounds-miny').value = Math.round(zone.bounds.minY);
  document.getElementById('zone-bounds-maxy').value = Math.round(zone.bounds.maxY);
  document.getElementById('zone-name-input').value = zone.name;

  if (document.getElementById('zone-item-select')) {
    document.getElementById('zone-item-select').value = zone.item || '';
  }
  if (document.getElementById('zone-color-input')) {
    document.getElementById('zone-color-input').value = zone.color || '#38bdf8';
  }

  modal.dataset.editingZoneId = zoneId;

  const inside = window.tacticalMap.buildings.filter(b => 
    b.x >= zone.bounds.minX && b.x <= zone.bounds.maxX && b.y >= zone.bounds.minY && b.y <= zone.bounds.maxY
  );
  document.getElementById('zone-machines-preview').textContent = 
    `Editando zona con ${inside.length} máquina(s) detectadas.`;

  modal.classList.add('active');
}
window.editZone = editZone;

async function submitZoneForm(e) {
  e.preventDefault();
  const modal = document.getElementById('zone-modal');
  const name = document.getElementById('zone-name-input').value;
  const item = document.getElementById('zone-item-select').value;
  const color = document.getElementById('zone-color-input').value;
  const minX = parseFloat(document.getElementById('zone-bounds-minx').value);
  const maxX = parseFloat(document.getElementById('zone-bounds-maxx').value);
  const minY = parseFloat(document.getElementById('zone-bounds-miny').value);
  const maxY = parseFloat(document.getElementById('zone-bounds-maxy').value);

  const zoneId = modal?.dataset?.editingZoneId || `zone-${Date.now()}`;

  const newZone = {
    id: zoneId,
    name,
    item,
    color,
    bounds: { minX, maxX, minY, maxY }
  };

  try {
    // Llamar al endpoint del demonio local usando la IP de Tailscale del PC del usuario
    const syncRes = await fetch('http://100.109.149.10:8086/api/sync/force', { method: 'POST' });
    const result = await syncRes.json();

    const res = await fetch('/api/zones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newZone)
    });

    if (res.ok) {
      closeZoneModal();
      await loadMapData();
      await fetchMetrics();
    } else {
      alert('Error guardando la zona en el servidor');
    }
  } catch (err) {
    alert('No se pudo conectar con el servidor: ' + err.message);
  }
}
window.submitZoneForm = submitZoneForm;

async function deleteZone(zoneId) {
  if (!confirm('¿Deseas eliminar esta zona delimitada?')) return;
  try {
    const res = await fetch(`/api/zones/${zoneId}`, { method: 'DELETE' });
    if (res.ok) {
      await loadMapData();
      await fetchMetrics();
    }
  } catch (err) {
    alert('Error al eliminar la zona: ' + err.message);
  }
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
