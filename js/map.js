/**
 * Satisfactory Interactive Tactical Map & SCIM Engine (v1.2)
 * Features:
 *  - Mathematically zero-drift smooth camera & zoom engine (centered on cursor).
 *  - Multi-layer switchable background (Realistic Satellite Color, Official In-Game Topo, Dark Blueprint).
 *  - Authentic SCIM building geometries & footprints with orientation yaw and status LED dots.
 *  - Full Conveyor Belts & Pipelines spline rendering with item flow telemetry & hover inspection.
 *  - All 14 vanilla resource node types with 100% official high-res icons and purity indicators.
 *  - Factory zone bounding boxes with realtime production and consumption balances.
 */

// World boundaries for Massage-2(A-B)b in Satisfactory (UE5 centimeters)
const WORLD_BOUNDS = {
  minX: -324600,
  maxX: 425300,
  minY: -375000,
  maxY: 375000
};

// Exact SCIM raster tile boundaries (z=3, 5x5 grid = 1280x1280 seamless)
// Exact SCIM raster tile boundaries (z=3, 5x5 grid = 1280x1280 seamless)
const SCIM_MAP_BOUNDS = {
  minX: -418449,
  maxX: 519052,
  minY: -468750,
  maxY: 468750
};

// Polyfill for CanvasRenderingContext2D.roundRect
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    if (typeof r === 'undefined') r = 0;
    if (typeof r === 'number') r = { tl: r, tr: r, br: r, bl: r };
    const tl = Math.min(r.tl || 0, Math.abs(w) / 2, Math.abs(h) / 2);
    const tr = Math.min(r.tr || 0, Math.abs(w) / 2, Math.abs(h) / 2);
    const br = Math.min(r.br || 0, Math.abs(w) / 2, Math.abs(h) / 2);
    const bl = Math.min(r.bl || 0, Math.abs(w) / 2, Math.abs(h) / 2);
    this.beginPath();
    this.moveTo(x + tl, y);
    this.lineTo(x + w - tr, y);
    this.quadraticCurveTo(x + w, y, x + w, y + tr);
    this.lineTo(x + w, y + h - br);
    this.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
    this.lineTo(x + bl, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - bl);
    this.lineTo(x, y + tl);
    this.quadraticCurveTo(x, y, x + tl, y);
    this.closePath();
    return this;
  };
}

function translateBuildingType(type) {
  if (!type) return 'Máquina';
  const t = type.toLowerCase();
  if (t.includes('smelter')) return 'Fundición';
  if (t.includes('foundry')) return 'Fundición Avanzada';
  if (t.includes('constructor')) return 'Constructor';
  if (t.includes('assembler')) return 'Ensambladora';
  if (t.includes('manufacturer')) return 'Fabricante';
  if (t.includes('oilrefinery') || t.includes('refinery')) return 'Refinería';
  if (t.includes('minermk1')) return 'Taladradora / Minero Mk.1';
  if (t.includes('minermk2')) return 'Taladradora / Minero Mk.2';
  if (t.includes('minermk3')) return 'Taladradora / Minero Mk.3';
  if (t.includes('resourceminer') || t.includes('miner')) return 'Taladradora / Minero';
  if (t.includes('waterextractor')) return 'Extractor de Agua';
  if (t.includes('oilextractor')) return 'Extractor de Petróleo';
  if (t.includes('generatorbiomass')) return 'Quemador de Biomasa';
  if (t.includes('generatorcoal')) return 'Generador de Carbón';
  if (t.includes('generatorfuel')) return 'Generador de Combustible';
  if (t.includes('generatornuclear')) return 'Planta de Energía Nuclear';
  if (t.includes('storageintegrated') || t.includes('storageplayer')) return 'Caja de Almacén Personal';
  if (t.includes('storage') && t.includes('mk2')) return 'Contenedor Industrial Mk.2';
  if (t.includes('storage')) return 'Contenedor de Almacenamiento';
  if (t.includes('spaceelevator')) return 'Ascensor Espacial';
  if (t.includes('splitter')) return 'Divisor de Cintas';
  if (t.includes('merger')) return 'Compactador de Cintas';
  if (t.includes('powerpole')) return 'Poste Eléctrico';
  if (t.includes('powerline')) return 'Línea de Alta Tensión';
  if (t.includes('conveyorbelt')) return 'Cinta Transportadora';
  if (t.includes('pipeline')) return 'Tubería de Fluidos';
  return type;
}
if (typeof window !== 'undefined') window.translateBuildingType = translateBuildingType;

class TacticalMap {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    // Camera state in WORLD coordinates (cm)
    this.cameraX = -45000;
    this.cameraY = 206000;
    this.scale = 18.0;

    // Dragging state
    this.isDragging = false;
    this.dragMouseStartX = 0;
    this.dragMouseStartY = 0;
    this.dragCameraStartX = 0;
    this.dragCameraStartY = 0;
    this.hasDragged = false;

    // Background Mode: 'realistic' | 'topo' | 'blueprint'
    this.currentMapBg = 'realistic';

    // Preload background images
    this.bgRealistic = new Image();
    this.bgRealisticLoaded = false;
    this.bgRealistic.src = 'images/map_realistic.jpg';
    this.bgRealistic.onload = () => {
      this.bgRealisticLoaded = true;
      if (this.currentMapBg === 'realistic') this.render();
    };

    this.bgTopo = new Image();
    this.bgTopoLoaded = false;
    this.bgTopo.src = 'images/map_topo.jpg';
    this.bgTopo.onload = () => {
      this.bgTopoLoaded = true;
      if (this.currentMapBg === 'topo') this.render();
    };

    // Data collections
    this.buildings = [];
    this.storages = [];
    this.miners = [];
    this.zones = [];
    this.nodes = [];
    this.belts = [];
    this.pipes = [];
    this.attachments = [];
    this.powerPoles = [];
    this.powerLines = [];
    this.specialBuildings = [];

    // Detailed vector models from SCIM
    this.detailedModels = null;
    this.loadDetailedModels();

    // Conveyor flow animation loop
    this.lineDashOffset = 0;
    this.startAnimationLoop();

    // Filter & Layer state (SCIM style)
    this.filters = {
      resources: new Set(),
      resourcesInitialized: false,
      purity: { PURE: true, NORMAL: true, IMPURE: true },
      status: 'all', // 'all', 'available', 'exploited'
      layers: {
        terrain: true,
        grid: false,
        belts: true,
        pipes: true,
        attachments: true,
        powerLines: true,
        powerPoles: true,
        nodes: true,
        machines: true,
        zones: true,
        storages: true,
        collectibles: true
      },
      searchQuery: ''
    };

    // Collectibles state
    this.collectibleVisibility = new Set(); // set of group names to show
    this.collectedPathNames = new Set(); // pathNames of collected items from save
    this.hoveredCollectible = null;

    // Hover & Selection state
    this.hoveredNode = null;
    this.selectedNode = null;
    this.hoveredMachine = null;
    this.selectedMachine = null;
    this.selectedZone = null;
    this.hoveredBelt = null;
    this.hoveredPipe = null;
    this.hoveredAttachment = null;
    this.hoveredPowerPole = null;
    this.hoveredSpecialBuilding = null;
    this.hoveredStorage = null;
    this.hoveredMiner = null;
    this.hoverPos = null;

    // Drawing tool state for new zones
    this.isDrawMode = false;
    this.drawStart = null;
    this.drawCurrent = null;

    // Interaction mode: 'pan' (free navigation) | 'transform_zone' (select/move/resize/delete zones)
    this.interactionMode = 'pan';
    this.transformAction = null; // 'move' | 'nw' | 'ne' | 'se' | 'sw' | 'n' | 's' | 'e' | 'w'
    this.transformMouseStart = null;
    this.transformZoneStartBounds = null;
    this.zoneDeleteBtnRect = null;

    // SCIM dynamic tile cache (ultra high-res satellite engine)
    this.tileCache = new Map();

    // Splitter/Merger & PowerPole connection sets for dynamic live flow highlights
    this.connectedInBelts = new Set();
    this.connectedOutBelts = new Set();
    this.connectedPowerLines = new Set();
    this.connectedPowerNodes = new Set();

    // Cache resource and item icons
    this.iconCache = new Map();

    this.initEvents();
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  loadDetailedModels() {
    fetch('data/detailed_models.json')
      .then(r => r.json())
      .then(data => {
        this.detailedModels = data;
        this.render();
      })
      .catch(err => console.warn('[Map] Could not load detailed_models.json:', err.message));
  }

  startAnimationLoop() {
    const loop = () => {
      if (this.hoveredBelt || this.hoveredMachine || this.hoveredPipe || this.hoveredAttachment || this.hoveredPowerPole || this.connectedInBelts.size > 0 || this.connectedPowerLines.size > 0) {
        this.lineDashOffset = -(Date.now() / 25) % 14;
        this.render();
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  getIconImage(iconName) {
    if (!iconName) return null;
    if (this.iconCache.has(iconName)) {
      return this.iconCache.get(iconName);
    }
    const img = new Image();
    img.src = 'icons/' + iconName;
    img.onload = () => {
      this.render();
    };
    this.iconCache.set(iconName, img);
    return img;
  }

  resizeCanvas() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    if (w === 0 || h === 0) return;
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.render();
  }

  // === COORDINATE TRANSFORMS (Zero-drift world projection) ===
  worldToScreen(wx, wy) {
    const rect = this.canvas.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const baseScale = 0.001 * this.scale;
    return {
      x: cx + (wx - this.cameraX) * baseScale,
      y: cy + (wy - this.cameraY) * baseScale
    };
  }

  screenToWorld(sx, sy) {
    const rect = this.canvas.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const baseScale = 0.001 * this.scale;
    return {
      x: this.cameraX + (sx - cx) / baseScale,
      y: this.cameraY + (sy - cy) / baseScale
    };
  }

  drawRoundedRect(ctx, x, y, w, h, r = 0) {
    if (typeof ctx.roundRect === 'function') {
      ctx.rect(x, y, w, h, r);
      return;
    }
    const radius = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
  }

  initEvents() {
    const c = this.canvas;

    c.addEventListener('mousedown', (e) => this.onMouseDown(e));
    c.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('mouseup', (e) => this.onMouseUp(e));
    c.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });

    // Touch support for tablets/mobile
    let touchStartDist = 0;
    c.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        const t = e.touches[0];
        const rect = c.getBoundingClientRect();
        this.isDragging = true;
        this.hasDragged = false;
        this.dragMouseStartX = t.clientX - rect.left;
        this.dragMouseStartY = t.clientY - rect.top;
        this.dragCameraStartX = this.cameraX;
        this.dragCameraStartY = this.cameraY;
      } else if (e.touches.length === 2) {
        touchStartDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    });

    c.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1 && this.isDragging) {
        const t = e.touches[0];
        const rect = c.getBoundingClientRect();
        const mouseX = t.clientX - rect.left;
        const mouseY = t.clientY - rect.top;
        const dx = mouseX - this.dragMouseStartX;
        const dy = mouseY - this.dragMouseStartY;
        this.cameraX = this.dragCameraStartX - dx / (0.001 * this.scale);
        this.cameraY = this.dragCameraStartY - dy / (0.001 * this.scale);
        this.render();
      } else if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const factor = dist / (touchStartDist || dist);
        this.scale = Math.max(0.08, Math.min(120, this.scale * factor));
        touchStartDist = dist;
        this.render();
      }
    });

    c.addEventListener('touchend', () => {
      this.isDragging = false;
    });
  }

  setInteractionMode(mode) {
    this.interactionMode = mode;
    const btnPan = document.getElementById('tool-pan-mode');
    const btnTransform = document.getElementById('tool-transform-zone-mode');
    if (btnPan) btnPan.classList.toggle('active', mode === 'pan');
    if (btnTransform) btnTransform.classList.toggle("active", mode === "transform_zone");
    const tools = document.getElementById("zone-edit-tools");
    if (tools) tools.style.display = (mode === "transform_zone") ? "flex" : "none";

    if (mode === 'transform_zone') {
      this.initialZonesState = JSON.stringify(this.zones);
      this.history = [];
      this.redoStack = [];
      this.updateUndoRedoUI();
      const btnSave = document.getElementById("btn-save-zone-edits");
      if (btnSave) { btnSave.disabled = true; btnSave.style.opacity = "0.5"; }
      const btnRevert = document.getElementById("btn-revert-zone-edits");
      if (btnRevert) { btnRevert.disabled = true; btnRevert.style.opacity = "0.5"; }
    } else {
      this.selectedZone = null;
      this.transformAction = null;
      this.canvas.style.cursor = 'grab';
    }
    this.render();
  }

  getZoneScreenRect(zone) {
    if (!zone || !zone.bounds) return null;
    const p1 = this.worldToScreen(zone.bounds.minX, zone.bounds.minY);
    const p2 = this.worldToScreen(zone.bounds.maxX, zone.bounds.maxY);
    return {
      x: Math.min(p1.x, p2.x),
      y: Math.min(p1.y, p2.y),
      w: Math.abs(p2.x - p1.x),
      h: Math.abs(p2.y - p1.y)
    };
  }

  getZoneHandleAtPos(zone, mx, my) {
    const r = this.getZoneScreenRect(zone);
    if (!r) return null;
    const handleHitDist = 10;
    const handles = {
      nw: { x: r.x, y: r.y },
      ne: { x: r.x + r.w, y: r.y },
      se: { x: r.x + r.w, y: r.y + r.h },
      sw: { x: r.x, y: r.y + r.h },
      n: { x: r.x + r.w / 2, y: r.y },
      s: { x: r.x + r.w / 2, y: r.y + r.h },
      e: { x: r.x + r.w, y: r.y + r.h / 2 },
      w: { x: r.x, y: r.y + r.h / 2 }
    };
    for (const [name, pt] of Object.entries(handles)) {
      if (Math.hypot(mx - pt.x, my - pt.y) <= handleHitDist) {
        return name;
      }
    }
    return null;
  }

  deleteZone(zoneId) {
    if (!confirm('¿Seguro que deseas eliminar esta zona delimitada?')) return;
    this.zones = this.zones.filter(z => z.id !== zoneId);
    if (this.selectedZone && this.selectedZone.id === zoneId) {
      this.selectedZone = null;
    }
    this.persistZones();
    this.render();
    this.updateZoneListUI();
    if (typeof window.updateQuickZonesBar === 'function') window.updateQuickZonesBar();
    if (typeof window.recalculateMetricsForZones === 'function') window.recalculateMetricsForZones();
  }

  saveZoneChanges(zone) {
    this.persistZones();
    this.updateZoneListUI();
    if (typeof window.updateQuickZonesBar === 'function') window.updateQuickZonesBar();
    if (typeof window.recalculateMetricsForZones === 'function') window.recalculateMetricsForZones();
  }

  persistZones() {
    try {
      localStorage.setItem('ficsit_zones', JSON.stringify(this.zones));
    } catch (e) {}
    fetch('/api/zones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.zones)
    }).catch(() => null);
  }

  onMouseDown(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (this.isDrawMode) {
      const worldPos = this.screenToWorld(mouseX, mouseY);
      this.drawStart = worldPos;
      this.drawCurrent = worldPos;
      this.render();
      return;
    }

    if (this.interactionMode === 'transform_zone') {
      // 1. Check if clicking on delete button
      if (this.zoneDeleteBtnRect && 
          mouseX >= this.zoneDeleteBtnRect.x && mouseX <= this.zoneDeleteBtnRect.x + this.zoneDeleteBtnRect.w &&
          mouseY >= this.zoneDeleteBtnRect.y && mouseY <= this.zoneDeleteBtnRect.y + this.zoneDeleteBtnRect.h) {
        if (this.selectedZone) {
          this.deleteZone(this.selectedZone.id);
          return;
        }
      }

      // 2. Check if clicking on resize handles of selected zone
      if (this.selectedZone) {
        const handle = this.getZoneHandleAtPos(this.selectedZone, mouseX, mouseY);
        if (handle) {
          this.transformPreZonesSnapshot = JSON.stringify(this.zones);
          this.transformAction = handle;
          this.transformMouseStart = { x: mouseX, y: mouseY };
          this.transformZoneStartBounds = Object.assign({}, this.selectedZone.bounds);
          return;
        }
      }

      // 3. Check if clicking inside any zone
      const worldMouse = this.screenToWorld(mouseX, mouseY);
      let clickedZone = null;
      for (let i = this.zones.length - 1; i >= 0; i--) {
        const z = this.zones[i];
        if (!z.bounds) continue;
        if (worldMouse.x >= z.bounds.minX && worldMouse.x <= z.bounds.maxX &&
            worldMouse.y >= z.bounds.minY && worldMouse.y <= z.bounds.maxY) {
          clickedZone = z;
          break;
        }
      }

      if (clickedZone) {
        this.selectedZone = clickedZone;
        this.transformPreZonesSnapshot = JSON.stringify(this.zones);
        this.transformAction = 'move';
        this.transformMouseStart = { x: mouseX, y: mouseY };
        this.transformZoneStartBounds = Object.assign({}, clickedZone.bounds);
        this.render();
        return;
      } else {
        this.selectedZone = null;
        this.transformAction = null;
        this.transformPreZonesSnapshot = null;
      }
    }

    // Default pan behavior
    this.isDragging = true;
    this.hasDragged = false;
    this.dragMouseStartX = mouseX;
    this.dragMouseStartY = mouseY;
    this.dragCameraStartX = this.cameraX;
    this.dragCameraStartY = this.cameraY;
  }

  onMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (this.isDrawMode && this.drawStart) {
      this.drawCurrent = this.screenToWorld(mouseX, mouseY);
      this.render();
      return;
    }

    if (this.interactionMode === 'transform_zone' && this.transformAction && this.selectedZone && this.transformZoneStartBounds) {
      const dWorldX = (mouseX - this.transformMouseStart.x) / (0.001 * this.scale);
      const dWorldY = (mouseY - this.transformMouseStart.y) / (0.001 * this.scale);
      const b = this.transformZoneStartBounds;

      if (this.transformAction === 'move') {
        this.selectedZone.bounds.minX = b.minX + dWorldX;
        this.selectedZone.bounds.maxX = b.maxX + dWorldX;
        this.selectedZone.bounds.minY = b.minY + dWorldY;
        this.selectedZone.bounds.maxY = b.maxY + dWorldY;
      } else {
        let minX = b.minX;
        let maxX = b.maxX;
        let minY = b.minY;
        let maxY = b.maxY;

        if (this.transformAction.includes('w')) minX = Math.min(b.maxX - 500, b.minX + dWorldX);
        if (this.transformAction.includes('e')) maxX = Math.max(b.minX + 500, b.maxX + dWorldX);
        if (this.transformAction.includes('n')) minY = Math.min(b.maxY - 500, b.minY + dWorldY);
        if (this.transformAction.includes('s')) maxY = Math.max(b.minY + 500, b.maxY + dWorldY);

        this.selectedZone.bounds.minX = minX;
        this.selectedZone.bounds.maxX = maxX;
        this.selectedZone.bounds.minY = minY;
        this.selectedZone.bounds.maxY = maxY;
      }
      this.render();
      return;
    }

    if (this.isDragging) {
      const dx = mouseX - this.dragMouseStartX;
      const dy = mouseY - this.dragMouseStartY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        this.hasDragged = true;
      }
      this.cameraX = this.dragCameraStartX - dx / (0.001 * this.scale);
      this.cameraY = this.dragCameraStartY - dy / (0.001 * this.scale);
      this.render();
      return;
    }

    // Hover detection: Check nodes, machines, belts, and pipes
    this.checkHover(mouseX, mouseY);
  }

  onMouseUp(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (this.isDrawMode && this.drawStart && this.drawCurrent) {
      const minX = Math.min(this.drawStart.x, this.drawCurrent.x);
      const maxX = Math.max(this.drawStart.x, this.drawCurrent.x);
      const minY = Math.min(this.drawStart.y, this.drawCurrent.y);
      const maxY = Math.max(this.drawStart.y, this.drawCurrent.y);

      const widthWorld = maxX - minX;
      const heightWorld = maxY - minY;

      if (widthWorld > 500 && heightWorld > 500) {
        this.openCreateZoneModal({ minX, maxX, minY, maxY });
      }

      this.drawStart = null;
      this.drawCurrent = null;
      this.render();
    } else if (this.interactionMode === 'transform_zone' && this.transformAction && this.selectedZone) {
      const b = this.transformZoneStartBounds;
      const cur = this.selectedZone.bounds;
      const hasChanged = b && cur && (b.minX !== cur.minX || b.maxX !== cur.maxX || b.minY !== cur.minY || b.maxY !== cur.maxY);
      
      if (hasChanged && this.transformPreZonesSnapshot) {
        if (!this.history) this.history = [];
        this.history.push(this.transformPreZonesSnapshot);
        if (this.history.length > 50) this.history.shift();
        this.redoStack = [];
        this.updateUndoRedoUI();

        // Enable save button and revert button
        const btnSave = document.getElementById("btn-save-zone-edits");
        if (btnSave) { btnSave.disabled = false; btnSave.style.opacity = "1"; }
        const btnRevert = document.getElementById("btn-revert-zone-edits");
        if (btnRevert) { btnRevert.disabled = false; btnRevert.style.opacity = "1"; }

        if (typeof window.updateQuickZonesBar === 'function') window.updateQuickZonesBar();
        if (typeof window.recalculateMetricsForZones === 'function') window.recalculateMetricsForZones();
      }

      this.transformAction = null;
      this.transformPreZonesSnapshot = null;
      this.transformZoneStartBounds = null;
      this.render();
    } else if (!this.hasDragged) {
      this.handleClick(mouseX, mouseY);
    }

    if (this.isDragging && this.hasDragged) {
      if (typeof saveAppState === 'function') saveAppState();
    }

    this.isDragging = false;
  }

  onWheel(e) {
    e.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // 1. Point in world under cursor before zoom
    const worldBefore = this.screenToWorld(mouseX, mouseY);

    // 2. Symmetric exponential zoom factor
    const zoomFactor = e.deltaY < 0 ? 1.15 : (1 / 1.15);
    const newScale = Math.max(0.08, Math.min(120, this.scale * zoomFactor));

    // 3. Update scale
    this.scale = newScale;

    // 4. Point in world under cursor after scale changed
    const worldAfter = this.screenToWorld(mouseX, mouseY);

    // 5. Shift camera so the exact point under cursor stays completely stationary
    this.cameraX += (worldBefore.x - worldAfter.x);
    this.cameraY += (worldBefore.y - worldAfter.y);

    this.checkHover(mouseX, mouseY);
    this.render();
    this.updateZoomIndicator();
    
    if (this._wheelSaveTimeout) clearTimeout(this._wheelSaveTimeout);
    this._wheelSaveTimeout = setTimeout(() => {
      if (typeof saveAppState === 'function') saveAppState();
    }, 500);
  }

  checkHover(mouseX, mouseY) {
    const worldMouse = this.screenToWorld(mouseX, mouseY);

    // 1. Check miners (highest priority over raw nodes so they get true SCIM machine outline)
    let closestMiner = null;
    if (this.miners.length > 0 && (this.filters.layers.machines || this.filters.layers.storages)) {
      for (const m of this.miners) {
        const dx = worldMouse.x - m.x;
        const dy = worldMouse.y - m.y;
        const yaw = m.yaw || 0;
        const cos = Math.cos(-yaw);
        const sin = Math.sin(-yaw);
        const localX = cos * dx - sin * dy;
        const localY = sin * dx + cos * dy;
        const hw = (m.width || 800) / 2 + (14 / (0.001 * this.scale));
        const hl = (m.length || 1400) / 2 + (14 / (0.001 * this.scale));
        if (Math.abs(localX) <= hw && Math.abs(localY) <= hl) {
          closestMiner = m;
          break;
        }
      }
    }

    // 2. Check resource nodes (only if not hovering over a built miner)
    let closestNode = null;
    if (!closestMiner && this.filters.layers.nodes) {
      let minNodeDist = 18 / (0.001 * this.scale);
      for (const node of this.nodes) {
        if (!this.isNodeVisible(node)) continue;
        const d = Math.hypot(node.x - worldMouse.x, node.y - worldMouse.y);
        if (d < minNodeDist) {
          minNodeDist = d;
          closestNode = node;
        }
      }
    }

    // 3. Check production machines (oriented rectangle hit testing)
    let closestMachine = null;
    if (!closestMiner && !closestNode && this.filters.layers.machines) {
      for (const b of this.buildings) {
        const dx = worldMouse.x - b.x;
        const dy = worldMouse.y - b.y;
        const yaw = b.yaw || 0;
        const cos = Math.cos(-yaw);
        const sin = Math.sin(-yaw);
        const localX = cos * dx - sin * dy;
        const localY = sin * dx + cos * dy;

        const hw = (b.width || 1000) / 2 + (12 / (0.001 * this.scale));
        const hl = (b.length || 1200) / 2 + (12 / (0.001 * this.scale));

        if (Math.abs(localX) <= hw && Math.abs(localY) <= hl) {
          closestMachine = b;
          break;
        }
      }
    }

    // 4. Check attachments (splitters & mergers)
    let closestAttachment = null;
    if (!closestMiner && !closestNode && !closestMachine && this.filters.layers.attachments) {
      const maxDistScreen = 14;
      for (const att of this.attachments) {
        const s = this.worldToScreen(att.x, att.y);
        const d = Math.hypot(mouseX - s.x, mouseY - s.y);
        if (d < maxDistScreen) {
          closestAttachment = att;
          break;
        }
      }
    }

    // 5. Check power poles
    let closestPole = null;
    if (!closestMiner && !closestNode && !closestMachine && !closestAttachment && this.filters.layers.powerPoles) {
      const maxDistScreen = 10;
      for (const pole of this.powerPoles) {
        const s = this.worldToScreen(pole.x, pole.y);
        const d = Math.hypot(mouseX - s.x, mouseY - s.y);
        if (d < maxDistScreen) {
          closestPole = pole;
          break;
        }
      }
    }

    // 6. Check storages
    let closestStorage = null;
    if (!closestMiner && !closestNode && !closestMachine && !closestAttachment && !closestPole && this.filters.layers.storages) {
      for (const s of this.storages) {
        const dx = worldMouse.x - s.x;
        const dy = worldMouse.y - s.y;
        const yaw = s.yaw || 0;
        const cos = Math.cos(-yaw);
        const sin = Math.sin(-yaw);
        const localX = cos * dx - sin * dy;
        const localY = sin * dx + cos * dy;
        const hw = (s.width || 500) / 2 + (10 / (0.001 * this.scale));
        const hl = (s.length || 1000) / 2 + (10 / (0.001 * this.scale));
        if (Math.abs(localX) <= hw && Math.abs(localY) <= hl) {
          closestStorage = s;
          break;
        }
      }
    }

    // 7. Check conveyor belts
    let closestBelt = null;
    if (!closestMiner && !closestNode && !closestMachine && !closestAttachment && !closestPole && !closestStorage && this.filters.layers.belts) {
      const maxScreenDist = 8;
      for (const belt of this.belts) {
        const pts = belt.points;
        for (let i = 0; i < pts.length - 1; i++) {
          const s1 = this.worldToScreen(pts[i].x, pts[i].y);
          const s2 = this.worldToScreen(pts[i + 1].x, pts[i + 1].y);
          const d = this.distToSegment(mouseX, mouseY, s1.x, s1.y, s2.x, s2.y);
          if (d < maxScreenDist) {
            closestBelt = belt;
            break;
          }
        }
        if (closestBelt) break;
      }
    }

    // 8. Check pipelines
    let closestPipe = null;
    if (!closestMiner && !closestNode && !closestMachine && !closestAttachment && !closestPole && !closestStorage && !closestBelt && this.filters.layers.pipes) {
      const maxScreenDist = 8;
      for (const pipe of this.pipes) {
        const pts = pipe.points;
        for (let i = 0; i < pts.length - 1; i++) {
          const s1 = this.worldToScreen(pts[i].x, pts[i].y);
          const s2 = this.worldToScreen(pts[i + 1].x, pts[i + 1].y);
          const d = this.distToSegment(mouseX, mouseY, s1.x, s1.y, s2.x, s2.y);
          if (d < maxScreenDist) {
            closestPipe = pipe;
            break;
          }
        }
        if (closestPipe) break;
      }
    }

    // 9. Check collectible markers
    let closestCollectible = null;
    if (!closestMiner && !closestNode && !closestMachine && !closestAttachment && !closestPole && !closestStorage && !closestBelt && !closestPipe && this.filters.layers.collectibles) {
      const markers = this.getVisibleCollectibleMarkers();
      const hitR = Math.max(10, 12 * Math.pow(this.scale, 0.3));
      for (const m of markers) {
        const p = this.worldToScreen(m.x, m.y);
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        if (dx * dx + dy * dy < hitR * hitR) {
          closestCollectible = m;
          break;
        }
      }
    }

    let needsRender = false;
    if (closestMiner !== this.hoveredMiner) { this.hoveredMiner = closestMiner; needsRender = true; }
    if (closestNode !== this.hoveredNode) { this.hoveredNode = closestNode; needsRender = true; }
    if (closestMachine !== this.hoveredMachine) { this.hoveredMachine = closestMachine; needsRender = true; }
    if (closestStorage !== this.hoveredStorage) { this.hoveredStorage = closestStorage; needsRender = true; }
    if (closestBelt !== this.hoveredBelt) { this.hoveredBelt = closestBelt; needsRender = true; }
    if (closestPipe !== this.hoveredPipe) { this.hoveredPipe = closestPipe; needsRender = true; }
    if (closestCollectible !== this.hoveredCollectible) { this.hoveredCollectible = closestCollectible; needsRender = true; }

    // Dynamic connection calculation for splitters/mergers
    if (closestAttachment !== this.hoveredAttachment) {
      this.hoveredAttachment = closestAttachment;
      this.connectedInBelts.clear();
      this.connectedOutBelts.clear();
      if (this.hoveredAttachment) {
        const att = this.hoveredAttachment;
        for (const belt of this.belts) {
          if (!belt.points || belt.points.length < 2) continue;
          const p0 = belt.points[0];
          const pN = belt.points[belt.points.length - 1];
          if (Math.hypot(pN.x - att.x, pN.y - att.y) < 650) {
            this.connectedInBelts.add(belt);
          }
          if (Math.hypot(p0.x - att.x, p0.y - att.y) < 650) {
            this.connectedOutBelts.add(belt);
          }
        }
      }
      needsRender = true;
    }

    // Dynamic connection calculation for power poles
    if (closestPole !== this.hoveredPowerPole) {
      this.hoveredPowerPole = closestPole;
      this.connectedPowerLines.clear();
      this.connectedPowerNodes.clear();
      if (this.hoveredPowerPole) {
        const pole = this.hoveredPowerPole;
        for (const line of this.powerLines) {
          if (!line.p1 || !line.p2) continue;
          const d1 = Math.hypot(line.p1.x - pole.x, line.p1.y - pole.y);
          const d2 = Math.hypot(line.p2.x - pole.x, line.p2.y - pole.y);
          if (d1 < 250) {
            this.connectedPowerLines.add(line);
            this.connectedPowerNodes.add(line.p2);
          } else if (d2 < 250) {
            this.connectedPowerLines.add(line);
            this.connectedPowerNodes.add(line.p1);
          }
        }
      }
      needsRender = true;
    }

    this.canvas.style.cursor = (closestMiner || closestNode || closestMachine || closestAttachment || closestPole || closestStorage || closestBelt || closestPipe) 
      ? 'pointer' 
      : (this.interactionMode === 'transform_zone' ? 'default' : (this.isDrawMode ? 'crosshair' : 'grab'));

    if (needsRender) {
      this.hoverPos = { x: mouseX, y: mouseY };
      this.render();
    }
  }

  distToSegment(px, py, x1, y1, x2, y2) {
    const l2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
    if (l2 === 0) return Math.hypot(px - x1, py - y1);
    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
  }

  handleClick(mouseX, mouseY) {
    if (this.hoveredMiner) {
      if (typeof window.openMachineInGameModal === 'function') {
        window.openMachineInGameModal(this.hoveredMiner);
      } else {
        this.selectMachine(this.hoveredMiner);
      }
      return;
    }
    if (this.hoveredNode) {
      this.selectNode(this.hoveredNode);
      return;
    }
    if (this.hoveredMachine) {
      if (typeof window.openMachineInGameModal === 'function') {
        window.openMachineInGameModal(this.hoveredMachine);
      } else {
        this.selectMachine(this.hoveredMachine);
      }
      return;
    }
    if (this.selectedNode) {
      this.closeInspector();
    }
  }

  isNodeVisible(node) {
    if (this.filters.resourcesInitialized && !this.filters.resources.has(node.resourceClass)) {
      return false;
    }
    if (!this.filters.purity[node.purity]) {
      return false;
    }
    if (this.filters.status === 'available' && node.isExploited) {
      return false;
    }
    if (this.filters.status === 'exploited' && !node.isExploited) {
      return false;
    }
    if (this.filters.searchQuery) {
      const q = this.filters.searchQuery.toLowerCase();
      const match = node.resourceName.toLowerCase().includes(q) ||
                    (node.resourceNameEs && node.resourceNameEs.toLowerCase().includes(q)) ||
                    node.purity.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  }

  selectNode(node) {
    this.selectedNode = node;
    this.render();
    this.showNodeInspector(node);
  }

  selectMachine(b) {
    this.selectedMachine = b;
    this.selectedNode = null;
    this.render();
    this.showMachineInspector(b);
  }

  showMachineInspector(b) {
    const card = document.getElementById('scim-node-inspector');
    if (!card) return;

    const clockPct = Math.round((b.potential || 1.0) * 100);
    const statusColor = b.status === 'producing' ? '#22c55e' : (b.status === 'idle' ? '#eab308' : '#ef4444');
    const statusText = b.status === 'producing' 
      ? ' EN PRODUCCIÓN ACTIVA' 
      : (b.status === 'idle' ? ' EN ESPERA (Falta Insumo / Salida Llena)' : ' DETENIDA');

    // Find zone if inside one
    const zone = this.zones.find(z => 
      z.bounds && b.x >= z.bounds.minX && b.x <= z.bounds.maxX && b.y >= z.bounds.minY && b.y <= z.bounds.maxY
    );

    const inputsHtml = (b.inputs && b.inputs.length > 0)
      ? b.inputs.map(inp => `
        <div class="scim-rate-row">
          <span> ${inp.name}:</span>
          <strong>${inp.rate}/min</strong>
        </div>
      `).join('')
      : `<div class="scim-rate-row" style="color: var(--text-muted);">Sin insumos requeridos</div>`;

    const outputsHtml = (b.outputs && b.outputs.length > 0)
      ? b.outputs.map(out => `
        <div class="scim-rate-row">
          <span> ${out.name}:</span>
          <strong style="color: #34d399;">${out.rate}/min</strong>
        </div>
      `).join('')
      : `<div class="scim-rate-row" style="color: var(--text-muted);">Sin producto configurado</div>`;

    const machineIcon = b.icon || 'Iron_Ingot.png';

    card.innerHTML = `
      <div class="scim-inspector-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <img src="icons/${machineIcon}" class="scim-inspector-icon" alt="${b.recipeName}" />
          <div>
            <div class="scim-inspector-title">${b.nameEs || b.type}</div>
            <div class="scim-inspector-subtitle" style="color: #FA9549;">
               Receta: <strong>${b.recipeName}</strong>
            </div>
          </div>
        </div>
        <button class="scim-inspector-close" onclick="window.tacticalMap.closeInspector()"></button>
      </div>

      <div class="scim-inspector-body">
        <div class="scim-status-badge" style="border-left: 4px solid ${statusColor};">
          <span class="status-icon" style="font-size: 16px;"></span>
          <div>
            <div style="font-weight: 800; color: ${statusColor}; font-size: 11px;">${statusText}</div>
            <div style="font-size: 11px; color: var(--text-muted);">
              Reloj al <strong>${clockPct}%</strong> ${zone ? `&bull;  <em>${zone.name}</em>` : ''}
            </div>
          </div>
        </div>

        <div style="margin-top: 10px; font-size: 10.5px; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">
          Insumos Consumidos:
        </div>
        <div class="scim-rate-table">
          ${inputsHtml}
        </div>

        <div style="margin-top: 8px; font-size: 10.5px; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">
          Productos Generados:
        </div>
        <div class="scim-rate-table">
          ${outputsHtml}
        </div>

        <div class="scim-coords-box">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: var(--text-muted); font-size: 11px;">Ubicación:</span>
            <span style="font-family: monospace; font-size: 11px; color: var(--text-main);">
              X: ${Math.round(b.x / 100)}m, Y: ${Math.round(b.y / 100)}m, Z: ${Math.round(b.z / 100)}m
            </span>
          </div>
        </div>

        <div style="display: flex; gap: 6px; margin-top: 10px; flex-wrap: wrap;">
          <button class="scim-action-btn primary" onclick="window.tacticalMap.centerOnMachine('${b.id}')">
             Centrar
          </button>
          <button class="scim-action-btn secondary" onclick="window.tacticalMap.copyCoords(${b.x}, ${b.y}, ${b.z})">
             Coords
          </button>
          ${b.outputs?.[0]?.item ? `
            <button class="scim-action-btn" style="background: #FA9549; color: #fff;" onclick="window.openItemModalByName('${b.outputs[0].item}')">
               Ver Ítem
            </button>
          ` : ''}
        </div>
      </div>
    `;

    card.classList.add('active');
  }

  showNodeInspector(node) {
    const card = document.getElementById('scim-node-inspector');
    if (!card) return;

    const purityColors = {
      PURE: '#22C55E',
      NORMAL: '#FA9549',
      IMPURE: '#A3A3A3'
    };
    const purityStars = {
      PURE: '⭐⭐⭐ PURA',
      NORMAL: '⭐⭐ NORMAL',
      IMPURE: '⭐ IMPURA'
    };

    let mk1Rate = node.baseRate;
    let mk2Rate = node.baseRate * 2;
    let mk3Rate = node.baseRate * 4;
    if (node.type === 'solid' && mk3Rate > 780) mk3Rate = 780;

    const unit = node.type === 'liquid' || node.type === 'gas' ? 'm³/min' : '/min';

    let statusHtml = '';
    if (node.isExploited) {
      const minerName = (node.miner?.type || 'Minero').replace('Build_', '').replace('_C', '');
      const clockPct = Math.round((node.miner?.potential || 1.0) * 100);
      statusHtml = `
        <div class="scim-status-badge exploited">
          <span class="status-icon"></span>
          <div>
            <div style="font-weight: 800; color: #F5C04B;">EXPLOTADO EN TU PARTIDA</div>
            <div style="font-size: 11px; color: var(--text-muted);">
              ${minerName} al ${clockPct}% de velocidad
            </div>
          </div>
        </div>
      `;
    } else {
      statusHtml = `
        <div class="scim-status-badge available">
          <span class="status-icon"></span>
          <div>
            <div style="font-weight: 800; color: #22C55E;">NODO LIBRE (NO MINADO)</div>
            <div style="font-size: 11px; color: var(--text-muted);">Disponible para nueva fábrica</div>
          </div>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="scim-inspector-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <img src="icons/${node.icon}" class="scim-inspector-icon" alt="${node.resourceNameEs}" />
          <div>
            <div class="scim-inspector-title">${node.resourceNameEs || node.resourceName}</div>
            <div class="scim-inspector-subtitle" style="color: ${purityColors[node.purity]};">
              ${purityStars[node.purity]}
            </div>
          </div>
        </div>
        <button class="scim-inspector-close" onclick="window.tacticalMap.closeInspector()"></button>
      </div>

      <div class="scim-inspector-body">
        ${statusHtml}

        <div style="margin-top: 10px; font-size: 11px; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">
          Rendimiento por Minero (100%):
        </div>
        <div class="scim-rate-table">
          <div class="scim-rate-row">
            <span>Minero Mk.1:</span>
            <strong>${mk1Rate} ${unit}</strong>
          </div>
          <div class="scim-rate-row">
            <span>Minero Mk.2:</span>
            <strong>${mk2Rate} ${unit}</strong>
          </div>
          <div class="scim-rate-row">
            <span>Minero Mk.3:</span>
            <strong>${mk3Rate} ${unit}</strong>
          </div>
        </div>

        <div class="scim-coords-box">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: var(--text-muted); font-size: 11px;">Coordenadas:</span>
            <span style="font-family: monospace; font-size: 11px; color: var(--text-main);">
              X: ${Math.round(node.x / 100)}m, Y: ${Math.round(node.y / 100)}m, Z: ${Math.round(node.z / 100)}m
            </span>
          </div>
        </div>

        <div style="display: flex; gap: 6px; margin-top: 10px;">
          <button class="scim-action-btn primary" onclick="window.tacticalMap.centerOnNode('${node.id}')">
             Centrar Mapa
          </button>
          <button class="scim-action-btn secondary" onclick="window.tacticalMap.copyCoords(${node.x}, ${node.y}, ${node.z})">
             Copiar Coords
          </button>
        </div>
      </div>
    `;

    card.classList.add('active');
  }

  closeInspector() {
    this.selectedNode = null;
    this.selectedMachine = null;
    const card = document.getElementById('scim-node-inspector');
    if (card) card.classList.remove('active');
    this.render();
  }

  centerOnNode(nodeId) {
    const node = this.nodes.find(n => n.id === nodeId);
    if (!node) return;

    this.scale = Math.max(3.0, this.scale);
    this.cameraX = node.x;
    this.cameraY = node.y;
    this.render();
    this.updateZoomIndicator();
  }

  centerOnMachine(machineId) {
    const b = this.buildings.find(m => m.id === machineId);
    if (!b) return;

    this.scale = Math.max(4.0, this.scale);
    this.cameraX = b.x;
    this.cameraY = b.y;
    this.render();
    this.updateZoomIndicator();
  }

  copyCoords(x, y, z) {
    const text = `/teleport ${Math.round(x)} ${Math.round(y)} ${Math.round(z)}`;
    navigator.clipboard?.writeText(text);
    alert(`Coordenadas copiadas al portapapeles:\n${text}`);
  }

  setDrawMode(enabled) {
    this.isDrawMode = enabled;
    this.canvas.style.cursor = enabled ? 'crosshair' : 'grab';
    const btn = document.getElementById('btn-toggle-draw-zone');
    if (btn) {
      if (enabled) {
        btn.classList.add('active');
        btn.innerHTML = '<span></span> Cancelar Dibujo';
      } else {
        btn.classList.remove('active');
        btn.innerHTML = '<span></span> Nueva Zona';
      }
    }
    this.render();
  }

  // Set switchable map background layer
  setMapBackground(mode) {
    this.currentMapBg = mode;
    if (typeof saveAppState === 'function') saveAppState();

    // Update toolbar active button
    const modes = ['realistic', 'topo', 'blueprint'];
    modes.forEach(m => {
      const btn = document.getElementById(`btn-bg-${m}`);
      if (btn) btn.classList.toggle('active', m === mode);
    });

    // Update radio inputs in sidebar
    document.querySelectorAll('input[name="sidebar_map_bg"]').forEach(r => {
      if (r.value === mode) r.checked = true;
    });

    this.render();
  }

  setData(buildings, storages, miners, zones, nodes, belts, pipes, attachments, powerPoles, powerLines, specialBuildings) {
    this.buildings = buildings || [];
    this.storages = storages || [];
    this.miners = miners || [];
    this.zones = zones || [];
    this.nodes = nodes || [];
    this.belts = belts || [];
    this.pipes = pipes || [];
    this.attachments = attachments || [];
    this.powerPoles = powerPoles || [];
    this.powerLines = powerLines || [];
    this.specialBuildings = specialBuildings || [];

    if (!this.filters.resourcesInitialized && this.nodes.length > 0) {
      for (const n of this.nodes) {
        this.filters.resources.add(n.resourceClass);
      }
      this.filters.resourcesInitialized = true;
    }

    this.render();
    this.updateZoneListUI();
    this.updateSCIMFilterSidebarUI();
  }

  centerOnPlayerBase() {
    if (this.buildings.length === 0 && this.nodes.length === 0) return;
    const targets = this.buildings.length > 0 ? this.buildings : this.nodes;
    
    // Sort coordinates to find median/cluster without distant isolated outposts skewing the camera
    const sortedX = targets.map(b => b.x).sort((a, b) => a - b);
    const sortedY = targets.map(b => b.y).sort((a, b) => a - b);
    
    // Use 10th and 90th percentile to frame the core factory complex smoothly
    const p10Idx = Math.floor(sortedX.length * 0.1);
    const p90Idx = Math.max(0, Math.ceil(sortedX.length * 0.9) - 1);
    const minX = sortedX[p10Idx >= 0 ? p10Idx : 0];
    const maxX = sortedX[p90Idx < sortedX.length ? p90Idx : sortedX.length - 1];
    const minY = sortedY[p10Idx >= 0 ? p10Idx : 0];
    const maxY = sortedY[p90Idx < sortedY.length ? p90Idx : sortedY.length - 1];

    this.cameraX = (minX + maxX) / 2;
    this.cameraY = (minY + maxY) / 2;

    const spanX = Math.max(12000, maxX - minX);
    const spanY = Math.max(12000, maxY - minY);

    const rect = this.canvas.getBoundingClientRect();
    const w = rect.width || 1200;
    const h = rect.height || 800;
    const fitScaleX = (w * 0.65) / (spanX * 0.001);
    const fitScaleY = (h * 0.65) / (spanY * 0.001);

    // Give a generous, crystal-clear zoom level where buildings and belts are distinctly visible (12-28)
    this.scale = Math.max(4.0, Math.min(28, Math.min(fitScaleX, fitScaleY)));

    this.render();
    this.updateZoomIndicator();
  }

  focusZone(zoneId) {
    const zone = this.zones.find(z => z.id === zoneId);
    if (!zone || !zone.bounds) return;

    this.selectedZone = zone;
    const { minX, maxX, minY, maxY } = zone.bounds;
    this.cameraX = (minX + maxX) / 2;
    this.cameraY = (minY + maxY) / 2;

    const spanX = Math.max(5000, maxX - minX);
    const spanY = Math.max(5000, maxY - minY);

    const rect = this.canvas.getBoundingClientRect();
    const fitScaleX = (rect.width * 0.6) / (spanX * 0.001);
    const fitScaleY = (rect.height * 0.6) / (spanY * 0.001);

    this.scale = Math.max(1.0, Math.min(15, Math.min(fitScaleX, fitScaleY)));

    this.render();
    this.updateZoomIndicator();
  }

  updateZoomIndicator() {
    const el = document.getElementById('map-zoom-level');
    if (el) el.textContent = `${Math.round(this.scale * 100)}%`;
  }

  // === RENDERING PIPELINE ===
  render() {
    const ctx = this.ctx;
    const rect = this.canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    if (w === 0 || h === 0) return;

    ctx.clearRect(0, 0, w, h);

    // 1. Terrain Map Background
    if (this.filters.layers.terrain) {
      this.renderTerrainBackground(ctx, w, h);
    } else {
      ctx.fillStyle = '#111111';
      ctx.fillRect(0, 0, w, h);
    }

    // 2. Blueprint Grid
    if (this.filters.layers.grid) {
      this.renderBackgroundGrid(ctx, w, h);
    }

    // 3. User Defined Zones (Bounding Boxes)
    if (this.filters.layers.zones) {
      this.renderZones(ctx);
    }

    // 4. Drawing Preview (Zone Creation)
    if (this.isDrawMode && this.drawStart && this.drawCurrent) {
      this.renderDrawingPreview(ctx);
    }

    // 5. Special Buildings (Space Elevator)
    this.renderSpecialBuildings(ctx);

    // 6. Power Lines
    if (this.filters.layers.powerLines) {
      this.renderPowerLines(ctx);
    }

    // 7. Conveyor Belts (Splines with item flow)
    if (this.filters.layers.belts) {
      this.renderBelts(ctx);
    }

    // 8. Conveyor Attachments (Splitters & Mergers)
    if (this.filters.layers.attachments) {
      this.renderAttachments(ctx);
    }

    // 9. Fluid Pipelines
    if (this.filters.layers.pipes) {
      this.renderPipes(ctx);
    }

    // 10. Vanilla Resource Nodes (SCIM Layer)
    if (this.filters.layers.nodes) {
      this.renderResourceNodes(ctx, w, h);
    }

    // 11. Infrastructure (Storages & Miners)
    if (this.filters.layers.storages) {
      this.renderInfrastructure(ctx);
    }

    // 12. Power Poles
    if (this.filters.layers.powerPoles) {
      this.renderPowerPoles(ctx);
    }

    // 13. Production Machines (SCIM Footprints & Status LEDs)
    if (this.filters.layers.machines) {
      this.renderMachines(ctx);
    }

    // 14. Map Collectibles (Power Slugs, Artifacts, Consumables)
    if (this.filters.layers.collectibles) {
      this.renderCollectibles(ctx, w, h);
    }

    // 15. Floating Tooltips on Hover
    if (this.hoveredMiner && this.hoverPos) {
      this.renderMinerTooltip(ctx, this.hoveredMiner, this.hoverPos);
    } else if (this.hoveredNode && this.hoverPos) {
      this.renderNodeTooltip(ctx, this.hoveredNode, this.hoverPos);
    } else if (this.hoveredMachine && this.hoverPos) {
      this.renderMachineTooltip(ctx, this.hoveredMachine, this.hoverPos);
    } else if (this.hoveredAttachment && this.hoverPos) {
      this.renderAttachmentTooltip(ctx, this.hoveredAttachment, this.hoverPos);
    } else if (this.hoveredCollectible && this.hoverPos) {
      this.renderCollectibleTooltip(ctx, this.hoveredCollectible, this.hoverPos);
    } else if (this.hoveredPowerPole && this.hoverPos) {
      this.renderPowerPoleTooltip(ctx, this.hoveredPowerPole, this.hoverPos);
    } else if (this.hoveredBelt && this.hoverPos) {
      this.renderBeltTooltip(ctx, this.hoveredBelt, this.hoverPos);
    } else if (this.hoveredPipe && this.hoverPos) {
      this.renderPipeTooltip(ctx, this.hoveredPipe, this.hoverPos);
    }
  }

  renderDynamicTiles(ctx, w, h) {
    if (this.currentMapBg === 'blueprint') return;
    if (this.scale < 2.5) return; // 2560x2560 base image is plenty sharp below scale 2.5

    // Choose tile zoom level based on camera zoom scale
    let z = 4;
    let grid = 10;
    if (this.scale >= 12.0) {
      z = 6;
      grid = 40;
    } else if (this.scale >= 4.0) {
      z = 5;
      grid = 20;
    }

    const layer = this.currentMapBg === 'topo' ? 'gameLayer' : 'realisticLayer';
    const totalW = SCIM_MAP_BOUNDS.maxX - SCIM_MAP_BOUNDS.minX;
    const totalH = SCIM_MAP_BOUNDS.maxY - SCIM_MAP_BOUNDS.minY;
    const tileW = totalW / grid;
    const tileH = totalH / grid;

    const tl = this.screenToWorld(0, 0);
    const br = this.screenToWorld(w, h);

    const minX = Math.min(tl.x, br.x);
    const maxX = Math.max(tl.x, br.x);
    const minY = Math.min(tl.y, br.y);
    const maxY = Math.max(tl.y, br.y);

    const minTx = Math.max(0, Math.floor((minX - SCIM_MAP_BOUNDS.minX) / tileW));
    const maxTx = Math.min(grid - 1, Math.floor((maxX - SCIM_MAP_BOUNDS.minX) / tileW));
    const minTy = Math.max(0, Math.floor((minY - SCIM_MAP_BOUNDS.minY) / tileH));
    const maxTy = Math.min(grid - 1, Math.floor((maxY - SCIM_MAP_BOUNDS.minY) / tileH));

    for (let ty = minTy; ty <= maxTy; ty++) {
      for (let tx = minTx; tx <= maxTx; tx++) {
        const key = `${layer}/${z}/${tx}/${ty}`;
        const cached = this.tileCache.get(key);

        const tileWorldMinX = SCIM_MAP_BOUNDS.minX + tx * tileW;
        const tileWorldMaxX = tileWorldMinX + tileW;
        const tileWorldMinY = SCIM_MAP_BOUNDS.minY + ty * tileH;
        const tileWorldMaxY = tileWorldMinY + tileH;

        const s1 = this.worldToScreen(tileWorldMinX, tileWorldMinY);
        const s2 = this.worldToScreen(tileWorldMaxX, tileWorldMaxY);
        const sw = s2.x - s1.x;
        const sh = s2.y - s1.y;

        if (cached && cached instanceof HTMLImageElement && cached.complete && cached.naturalWidth > 0) {
          ctx.drawImage(cached, s1.x, s1.y, sw, sh);
        } else if (!cached) {
          this.tileCache.set(key, 'loading');
          const img = new Image();
          img.onload = () => {
            this.tileCache.set(key, img);
            this.render();
          };
          img.onerror = () => {
            this.tileCache.set(key, 'error');
          };
          img.src = `https://static.satisfactory-calculator.com/imgMap/${layer}/Stable/${z}/${tx}/${ty}.png`;
        }
      }
    }
  }

  renderTerrainBackground(ctx, w, h) {
    if (this.currentMapBg === 'blueprint') {
      ctx.fillStyle = "#111111";
      ctx.fillRect(0, 0, w, h);
      return;
    }

    let activeImg = null;
    if (this.currentMapBg === 'realistic' && this.bgRealisticLoaded) {
      activeImg = this.bgRealistic;
    } else if (this.currentMapBg === 'topo' && this.bgTopoLoaded) {
      activeImg = this.bgTopo;
    } else if (this.bgRealisticLoaded) {
      activeImg = this.bgRealistic;
    } else if (this.bgTopoLoaded) {
      activeImg = this.bgTopo;
    }

    if (activeImg) {
      const p1 = this.worldToScreen(SCIM_MAP_BOUNDS.minX, SCIM_MAP_BOUNDS.minY);
      const p2 = this.worldToScreen(SCIM_MAP_BOUNDS.maxX, SCIM_MAP_BOUNDS.maxY);

      const imgW = p2.x - p1.x;
      const imgH = p2.y - p1.y;

      ctx.save();
      ctx.drawImage(activeImg, p1.x, p1.y, imgW, imgH);

      // Render native high-res SCIM viewport tiles when zoomed in
      this.renderDynamicTiles(ctx, w, h);

      // Playable world boundary (SCIM official boundary)
      const b1 = this.worldToScreen(WORLD_BOUNDS.minX, WORLD_BOUNDS.minY);
      const b2 = this.worldToScreen(WORLD_BOUNDS.maxX, WORLD_BOUNDS.maxY);
      ctx.strokeStyle = this.currentMapBg === 'realistic' ? 'rgba(250, 149, 73, 0.45)' : 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      ctx.strokeRect(b1.x, b1.y, b2.x - b1.x, b2.y - b1.y);
      ctx.setLineDash([]);
      ctx.restore();
    } else {
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, w, h);
    }
  }

  renderBackgroundGrid(ctx, w, h) {
    const gridSizeWorld = 20000; // 200m grid lines
    const stepScreen = gridSizeWorld * 0.001 * this.scale;

    if (stepScreen < 15) return;

    ctx.save();
    ctx.strokeStyle = this.currentMapBg === 'blueprint' ? 'rgba(250, 149, 73, 0.12)' : 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;

    const topLeft = this.screenToWorld(0, 0);
    const bottomRight = this.screenToWorld(w, h);

    const startX = Math.floor(topLeft.x / gridSizeWorld) * gridSizeWorld;
    const endX = Math.ceil(bottomRight.x / gridSizeWorld) * gridSizeWorld;
    const startY = Math.floor(topLeft.y / gridSizeWorld) * gridSizeWorld;
    const endY = Math.ceil(bottomRight.y / gridSizeWorld) * gridSizeWorld;

    ctx.beginPath();
    for (let wx = startX; wx <= endX; wx += gridSizeWorld) {
      const p1 = this.worldToScreen(wx, topLeft.y);
      const p2 = this.worldToScreen(wx, bottomRight.y);
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
    }
    for (let wy = startY; wy <= endY; wy += gridSizeWorld) {
      const p1 = this.worldToScreen(topLeft.x, wy);
      const p2 = this.worldToScreen(bottomRight.x, wy);
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
    }
    ctx.stroke();
    ctx.restore();
  }

  renderZones(ctx) {
    ctx.save();
    this.zoneDeleteBtnRect = null;

    for (const zone of this.zones) {
      if (!zone.bounds) continue;
      const p1 = this.worldToScreen(zone.bounds.minX, zone.bounds.minY);
      const p2 = this.worldToScreen(zone.bounds.maxX, zone.bounds.maxY);

      const x = Math.min(p1.x, p2.x);
      const y = Math.min(p1.y, p2.y);
      const width = Math.abs(p2.x - p1.x);
      const height = Math.abs(p2.y - p1.y);

      const color = zone.color || '#FA9549';
      const isSelected = this.selectedZone === zone;

      // 1. Subtle translucent tint fill
      ctx.beginPath();
      ctx.fillStyle = isSelected ? color + '22' : color + '0d';
      ctx.fillRect(x, y, width, height);

      // 2. Dashed boundary
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = isSelected ? 2.5 : 1.5;
      ctx.setLineDash([8, 6]);
      if (isSelected) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
      }
      ctx.strokeRect(x, y, width, height);
      ctx.shadowBlur = 0;
      ctx.setLineDash([]);

      // 3. Clean HUD title pill (inside or on top of zone)
      const labelText = ` ${zone.name}`;
      ctx.font = 'bold 11px Inter, system-ui, sans-serif';
      const tw = ctx.measureText(labelText).width;
      const pillW = tw + 20;
      const pillH = 22;

      const pillX = x + 4;
      const pillY = y > 30 ? y - pillH - 3 : y + 4;

      ctx.beginPath();
      ctx.fillStyle = 'rgba(44, 44, 44, 0.92)';
      ctx.rect(pillX, pillY, pillW, pillH);
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Inter, system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(labelText, pillX + 8, pillY + pillH / 2);

      // If selected in transform mode: draw handles and delete button
      if (this.interactionMode === 'transform_zone' && isSelected) {
        const handles = [
          { x: x, y: y },
          { x: x + width / 2, y: y },
          { x: x + width, y: y },
          { x: x + width, y: y + height / 2 },
          { x: x + width, y: y + height },
          { x: x + width / 2, y: y + height },
          { x: x, y: y + height },
          { x: x, y: y + height / 2 }
        ];

        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        for (const h of handles) {
          ctx.beginPath();
          ctx.rect(h.x - 4, h.y - 4, 8, 8);
          ctx.fill();
          ctx.stroke();
        }

        // Delete button next to top pill
        const delX = pillX + pillW + 6;
        const delY = pillY;
        const delW = 56;
        const delH = pillH;
        this.zoneDeleteBtnRect = { x: delX, y: delY, w: delW, h: delH };

        ctx.beginPath();
        ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
        ctx.rect(delX, delY, delW, delH);
        ctx.fill();
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.fillStyle = '#f87171';
        ctx.font = 'bold 10.5px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(' Borrar', delX + 6, delY + pillH / 2);
      }
    }
    ctx.restore();
  }

  renderDrawingPreview(ctx) {
    ctx.save();
    const p1 = this.worldToScreen(this.drawStart.x, this.drawStart.y);
    const p2 = this.worldToScreen(this.drawCurrent.x, this.drawCurrent.y);

    const x = Math.min(p1.x, p2.x);
    const y = Math.min(p1.y, p2.y);
    const width = Math.abs(p2.x - p1.x);
    const height = Math.abs(p2.y - p1.y);

    ctx.fillStyle = 'rgba(250, 149, 73, 0.25)';
    ctx.fillRect(x, y, width, height);

    ctx.strokeStyle = '#FA9549';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(x, y, width, height);

    const worldW = Math.round(Math.abs(this.drawCurrent.x - this.drawStart.x) / 100);
    const worldH = Math.round(Math.abs(this.drawCurrent.y - this.drawStart.y) / 100);
    ctx.fillStyle = '#FA9549';
    ctx.font = '11px monospace';
    ctx.fillText(`${worldW}m x ${worldH}m`, x + 6, y + 16);

    ctx.restore();
  }

  renderResourceNodes(ctx, w, h) {
    const baseRadius = Math.max(9, Math.min(18, 10 * Math.pow(this.scale, 0.3)));
    const iconSize = Math.max(14, Math.min(26, baseRadius * 1.5));

    for (const node of this.nodes) {
      if (!this.isNodeVisible(node)) continue;

      const p = this.worldToScreen(node.x, node.y);
      if (p.x < -30 || p.x > w + 30 || p.y < -30 || p.y > h + 30) continue;

      const isSelected = this.selectedNode === node;
      const isHovered = this.hoveredNode === node;

      ctx.save();

      // Opacity Rule: Mined/Exploited nodes are 35% opacity unless focused
      if (node.isExploited && !isSelected && !isHovered) {
        ctx.globalAlpha = 0.35;
      } else {
        ctx.globalAlpha = 1.0;
      }

      // Purity color ring
      let ringColor = '#A3A3A3'; // Impure
      let ringWidth = 2;
      if (node.purity === 'PURE') {
        ringColor = '#22C55E'; // Pure
        ringWidth = 3;
      } else if (node.purity === 'NORMAL') {
        ringColor = '#FA9549'; // Normal
        ringWidth = 2.5;
      }

      // Glow on select/hover
      if (isSelected || isHovered) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, baseRadius + 5, 0, Math.PI * 2);
        ctx.strokeStyle = isSelected ? '#f59e0b' : '#FA9549';
        ctx.lineWidth = 3;
        ctx.shadowColor = isSelected ? '#f59e0b' : '#FA9549';
        ctx.shadowBlur = 10;
        ctx.stroke();
      }

      // Outer badge circle
      ctx.beginPath();
      ctx.arc(p.x, p.y, baseRadius, 0, Math.PI * 2);
      ctx.fillStyle = node.color || '#3A3A3A';
      ctx.fill();
      ctx.strokeStyle = ringColor;
      ctx.lineWidth = ringWidth;
      ctx.stroke();

      // Draw resource icon
      const img = this.getIconImage(node.icon);
      if (img && img.complete && img.naturalWidth > 0) {
        const half = iconSize / 2;
        ctx.drawImage(img, p.x - half, p.y - half, iconSize, iconSize);
      }

      // Mined badge
      if (node.isExploited) {
        const badgeR = Math.max(5, baseRadius * 0.45);
        const bx = p.x + baseRadius * 0.65;
        const by = p.y + baseRadius * 0.65;

        ctx.beginPath();
        ctx.arc(bx, by, badgeR, 0, Math.PI * 2);
        ctx.fillStyle = '#7c3aed';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.round(badgeR * 1.3)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('', bx, by + 1);
      }

      ctx.restore();
    }
  }

  renderBelts(ctx) {
    if (this.belts.length === 0) return;
    ctx.save();

    const strokeW = Math.max(3, Math.min(8, 4.5 * 0.001 * this.scale));

    for (const belt of this.belts) {
      const pts = belt.points;
      if (!pts || pts.length < 2) continue;

      const isDirectHover = this.hoveredBelt === belt;
      const isConnectedIn = this.connectedInBelts.has(belt);
      const isConnectedOut = this.connectedOutBelts.has(belt);

      ctx.beginPath();
      const p0 = this.worldToScreen(pts[0].x, pts[0].y);
      ctx.moveTo(p0.x, p0.y);
      for (let i = 1; i < pts.length; i++) {
        const pt = this.worldToScreen(pts[i].x, pts[i].y);
        ctx.lineTo(pt.x, pt.y);
      }

      let strokeColor = '#ffbca3'; // Authentic SCIM peach color
      let lineWidth = strokeW;
      let lineDash = [];
      let dashOffset = 0;
      let shadowColor = null;

      if (isDirectHover) {
        strokeColor = '#22c55e';
        lineWidth = strokeW + 2;
        lineDash = [8, 6];
        dashOffset = this.lineDashOffset;
        shadowColor = '#22c55e';
      } else if (isConnectedIn) {
        // Cintas que entran al divisor/compactador: Resaltado Cyan con flujo hacia el divisor
        strokeColor = '#FA9549';
        lineWidth = strokeW + 2.5;
        lineDash = [8, 6];
        dashOffset = -(Date.now() / 25) % 14;
        shadowColor = '#FA9549';
      } else if (isConnectedOut) {
        // Cintas que salen del divisor/compactador: Resaltado Verde Esmeralda con flujo saliente
        strokeColor = '#22C55E';
        lineWidth = strokeW + 2.5;
        lineDash = [8, 6];
        dashOffset = (Date.now() / 25) % 14;
        shadowColor = '#22C55E';
      }

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      if (lineDash.length > 0) {
        ctx.save();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.setLineDash(lineDash);
        ctx.lineDashOffset = dashOffset;
        if (shadowColor) {
          ctx.shadowColor = shadowColor;
          ctx.shadowBlur = 10;
        }
        ctx.stroke();
        ctx.restore();
      }
    }

    ctx.restore();
  }

  renderAttachments(ctx) {
    if (this.attachments.length === 0) return;
    ctx.save();

    for (const att of this.attachments) {
      const isHovered = this.hoveredAttachment === att;
      const p = this.worldToScreen(att.x, att.y);

      // Cull if offscreen
      if (p.x < -30 || p.x > this.canvas.width + 30 || p.y < -30 || p.y > this.canvas.height + 30) continue;

      const model = this.detailedModels?.[att.className] || this.detailedModels?.[`Build_ConveyorAttachment${att.type}_C`];
      if (model && model.forms && model.forms.length > 0) {
        const rawScale = (model.scale || 1.0) * 0.001 * this.scale;
        const scale = Math.max(0.012, rawScale);
        ctx.save();
        ctx.translate(p.x, p.y);
        if (att.yaw) ctx.rotate(att.yaw);

        ctx.fillStyle = isHovered ? '#ffffff' : '#ffbca3';
        ctx.strokeStyle = isHovered ? '#FA9549' : '#e58837';
        ctx.lineWidth = isHovered ? 2.5 : Math.max(1.2, 1.5 * Math.min(this.scale, 2));

        if (isHovered) {
          ctx.shadowColor = '#FA9549';
          ctx.shadowBlur = 8;
        }

        for (const form of model.forms) {
          if (!form.points || form.points.length === 0) continue;
          ctx.beginPath();
          for (let i = 0; i < form.points.length; i++) {
            const px = form.points[i][0] * scale;
            const py = form.points[i][1] * scale;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }

        // SCIM iconic inner cross (+) mark
        const arm = Math.max(3, 80 * scale);
        ctx.beginPath();
        ctx.moveTo(-arm, 0); ctx.lineTo(arm, 0);
        ctx.moveTo(0, -arm); ctx.lineTo(0, arm);
        ctx.strokeStyle = '#e58837';
        ctx.lineWidth = Math.max(1, 1.5 * Math.min(this.scale, 2));
        ctx.stroke();

        ctx.restore();
      } else {
        // Octagonal badge fallback
        const r = Math.max(4, Math.min(10, 5 * Math.pow(this.scale, 0.3)));
        ctx.save();
        ctx.translate(p.x, p.y);
        if (att.yaw) ctx.rotate(att.yaw);

        ctx.fillStyle = isHovered ? '#ffffff' : '#ffbca3';
        ctx.strokeStyle = isHovered ? '#FA9549' : '#e58837';
        ctx.lineWidth = 1.5;
        ctx.fillRect(-r, -r, r * 2, r * 2);
        ctx.strokeRect(-r, -r, r * 2, r * 2);

        ctx.beginPath();
        ctx.moveTo(-r * 0.6, 0); ctx.lineTo(r * 0.6, 0);
        ctx.moveTo(0, -r * 0.6); ctx.lineTo(0, r * 0.6);
        ctx.strokeStyle = '#e58837';
        ctx.stroke();
        ctx.restore();
      }
    }

    ctx.restore();
  }

  renderPipes(ctx) {
    if (this.pipes.length === 0) return;
    ctx.save();

    const strokeW = Math.max(3.5, Math.min(9, 5 * 0.001 * this.scale));

    for (const pipe of this.pipes) {
      const pts = pipe.points;
      if (!pts || pts.length < 2) continue;

      const isHovered = this.hoveredPipe === pipe;

      ctx.beginPath();
      const p0 = this.worldToScreen(pts[0].x, pts[0].y);
      ctx.moveTo(p0.x, p0.y);
      for (let i = 1; i < pts.length; i++) {
        const pt = this.worldToScreen(pts[i].x, pts[i].y);
        ctx.lineTo(pt.x, pt.y);
      }

      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = strokeW;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      if (isHovered) {
        ctx.save();
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = strokeW + 2;
        ctx.setLineDash([8, 6]);
        ctx.lineDashOffset = this.lineDashOffset;
        ctx.shadowColor = '#22d3ee';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.restore();
      }
    }

    ctx.restore();
  }

  renderSpecialBuildings(ctx) {
    if (this.specialBuildings.length === 0) return;
    for (const sb of this.specialBuildings) {
      const isHovered = this.hoveredSpecialBuilding === sb;
      this.drawDetailedBuilding(ctx, sb, 'rgba(229, 136, 55, 0.45)', '#e58837', isHovered);

      // White circular pin with rocket icon
      const p = this.worldToScreen(sb.x, sb.y);
      const pinR = Math.max(14, Math.min(24, 18 * Math.pow(this.scale, 0.2)));
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, pinR, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, pinR - 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#475569';
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.round(pinR * 1.05)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('', p.x, p.y + 1);
      ctx.restore();
    }
  }

  renderPowerLines(ctx) {
    if (this.powerLines.length === 0) return;
    ctx.save();
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.7)';
    ctx.lineWidth = Math.max(1, 1.2 * Math.min(2, this.scale));
    ctx.beginPath();

    for (const line of this.powerLines) {
      if (!line.p1 || !line.p2) continue;
      const s1 = this.worldToScreen(line.p1.x, line.p1.y);
      const s2 = this.worldToScreen(line.p2.x, line.p2.y);

      if ((s1.x < 0 && s2.x < 0) || (s1.x > this.canvas.width && s2.x > this.canvas.width) ||
          (s1.y < 0 && s2.y < 0) || (s1.y > this.canvas.height && s2.y > this.canvas.height)) {
        continue;
      }

      ctx.moveTo(s1.x, s1.y);
      ctx.lineTo(s2.x, s2.y);
    }
    ctx.stroke();

    // Resaltado de líneas de alta tensión conectadas al poste con hover
    if (this.connectedPowerLines.size > 0) {
      for (const line of this.connectedPowerLines) {
        const s1 = this.worldToScreen(line.p1.x, line.p1.y);
        const s2 = this.worldToScreen(line.p2.x, line.p2.y);
        ctx.save();
        ctx.strokeStyle = '#e879f9';
        ctx.lineWidth = Math.max(3, 3.5 * Math.min(2, this.scale));
        ctx.shadowColor = '#c084fc';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.moveTo(s1.x, s1.y);
        ctx.lineTo(s2.x, s2.y);
        ctx.stroke();

        // Pulso eléctrico animado a lo largo del cable
        const t = (Date.now() / 600) % 1;
        const px = s1.x + (s2.x - s1.x) * t;
        const py = s1.y + (s2.y - s1.y) * t;
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 8;
        ctx.fill();

        // Marcador terminal en los extremos conectados
        ctx.beginPath();
        ctx.arc(s1.x, s1.y, 5, 0, Math.PI * 2);
        ctx.arc(s2.x, s2.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#e879f9';
        ctx.fill();
        ctx.restore();
      }
    }

    ctx.restore();
  }

  renderPowerPoles(ctx) {
    if (this.powerPoles.length === 0) return;
    ctx.save();
    const size = Math.max(3.5, Math.min(8, 4 * Math.pow(this.scale, 0.3)));

    for (const pole of this.powerPoles) {
      const s = this.worldToScreen(pole.x, pole.y);
      if (s.x < -10 || s.x > this.canvas.width + 10 || s.y < -10 || s.y > this.canvas.height + 10) continue;

      const isHovered = this.hoveredPowerPole === pole;
      ctx.fillStyle = isHovered ? '#60a5fa' : '#2563eb';
      ctx.strokeStyle = isHovered ? '#ffffff' : '#1e3a8a';
      ctx.lineWidth = 1;

      if (isHovered) {
        ctx.shadowColor = '#60a5fa';
        ctx.shadowBlur = 8;
      }
      ctx.fillRect(s.x - size / 2, s.y - size / 2, size, size);
      ctx.strokeRect(s.x - size / 2, s.y - size / 2, size, size);
      ctx.shadowBlur = 0;
    }
    ctx.restore();
  }

  drawDetailedBuilding(ctx, b, defaultFill, defaultStroke, isHovered, customScale = 1.0) {
    const modelKey = b.className || b.type;
    let model = this.detailedModels?.[modelKey] || this.detailedModels?.['Build_' + b.type + '_C'];

    if (!model && this.detailedModels) {
      for (const k in this.detailedModels) {
        if (k.toLowerCase().includes(b.type.toLowerCase())) {
          model = this.detailedModels[k];
          break;
        }
      }
    }

    const p = this.worldToScreen(b.x, b.y);

    if (model && model.forms && model.forms.length > 0) {
      const rawScale = (model.scale || 1.0) * 0.001 * this.scale * customScale;
      const scale = Math.max(0.0035, rawScale);
      const ox = (model.xOffset || 0) * scale;
      const oy = (model.yOffset || 0) * scale;

      ctx.save();
      ctx.translate(p.x, p.y);
      if (b.yaw) ctx.rotate(b.yaw);

      ctx.fillStyle = isHovered ? '#fb923c' : (defaultFill || b.color || '#e58837');
      ctx.strokeStyle = isHovered ? '#ffffff' : (defaultStroke || b.strokeColor || '#ff3700');
      ctx.lineWidth = isHovered ? 2.5 : Math.max(1.2, Math.min(2.5, 1.5 * Math.pow(this.scale, 0.2)));

      if (isHovered) {
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 8;
      }

      for (const form of model.forms) {
        if (!form.points || form.points.length === 0) continue;
        ctx.beginPath();
        for (let i = 0; i < form.points.length; i++) {
          const px = form.points[i][0] * scale + ox;
          const py = form.points[i][1] * scale + oy;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();

        if (form.holes && form.holes.length > 0) {
          for (const hole of form.holes) {
            for (let j = 0; j < hole.length; j++) {
              const hx = hole[j][0] * scale + ox;
              const hy = hole[j][1] * scale + oy;
              if (j === 0) ctx.moveTo(hx, hy);
              else ctx.lineTo(hx, hy);
            }
            ctx.closePath();
          }
        }

        ctx.fill('evenodd');
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      // Status LED dot in the corner
      if (b.status) {
        const statusColor = b.status === 'producing' ? '#22c55e' : (b.status === 'idle' ? '#eab308' : '#ef4444');
        const ledR = Math.max(2, Math.min(5, 3 * Math.pow(this.scale, 0.3)));

        let minX = Infinity, minY = Infinity;
        for (const pt of model.forms[0].points) {
          if (pt[0] < minX) minX = pt[0];
          if (pt[1] < minY) minY = pt[1];
        }
        const ledX = (minX + 70) * scale + ox;
        const ledY = (minY + 70) * scale + oy;
        ctx.beginPath();
        ctx.arc(ledX, ledY, ledR, 0, Math.PI * 2);
        ctx.fillStyle = statusColor;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      ctx.restore();
      return true;
    } else {
      // Fallback: rounded rectangle / distinct equipment badge
      const wScreen = Math.max(8, (b.width || 1000) * 0.001 * this.scale);
      const lScreen = Math.max(10, (b.length || 1200) * 0.001 * this.scale);

      ctx.save();
      ctx.translate(p.x, p.y);
      if (b.yaw) ctx.rotate(b.yaw);

      ctx.beginPath();
      const radius = Math.min(3, wScreen * 0.15);
      if (typeof ctx.roundRect === 'function') {
        ctx.rect(-wScreen / 2, -lScreen / 2, wScreen, lScreen, radius);
      } else {
        ctx.rect(-wScreen / 2, -lScreen / 2, wScreen, lScreen);
      }
      ctx.fillStyle = isHovered ? '#fb923c' : (defaultFill || b.color || '#e58837');
      ctx.fill();
      ctx.strokeStyle = isHovered ? '#ffffff' : (defaultStroke || b.strokeColor || '#ff3700');
      ctx.lineWidth = isHovered ? 2.5 : 1.5;
      if (isHovered) {
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 8;
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      if (b.type && b.type.includes('Miner')) {
        ctx.fillStyle = '#ffffff';
        ctx.font = `${Math.max(8, Math.min(14, wScreen * 0.6))}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('', 0, 0);
      }

      ctx.restore();
      return false;
    }
  }

  renderInfrastructure(ctx) {
    // 1. Storages
    if (this.filters.layers.storages && this.storages.length > 0) {
      for (const s of this.storages) {
        const isHovered = this.hoveredStorage === s;
        this.drawDetailedBuilding(ctx, s, '#e58837', '#ff3700', isHovered);
      }
    }

    // 2. Miners
    if (this.miners.length > 0) {
      for (const m of this.miners) {
        const isHovered = this.hoveredMiner === m;
        const clone = Object.assign({}, m);
        if (clone.className === 'Equip_ResourceMiner_C' || !clone.className) {
          clone.className = 'Build_MinerMk1_C';
        }
        this.drawDetailedBuilding(ctx, clone, '#e58837', '#ff3700', isHovered);
      }
    }
  }

  // SCIM Authentic Building Geometries with Yaw Rotation and Status LEDs
  renderMachines(ctx) {
    if (this.buildings.length === 0 || !this.filters.layers.machines) return;

    for (const b of this.buildings) {
      const isHovered = this.hoveredMachine === b;
      this.drawDetailedBuilding(ctx, b, '#e58837', '#ff3700', isHovered);
    }
  }

  renderNodeTooltip(ctx, node, pos) {
    ctx.save();
    const title = `${node.resourceNameEs || node.resourceName} (${node.purity})`;
    const minerType = node.miner?.type ? translateBuildingType(node.miner.type) : 'Taladradora / Minero';
    const status = node.isExploited 
      ? ` Explotado: ${node.currentRate}/min (${minerType})`
      : ` Disponible: Base ${node.baseRate}/min`;
    const coords = `Coord: X: ${Math.round(node.x / 100)}m, Y: ${Math.round(node.y / 100)}m`;

    ctx.font = 'bold 12px Inter, sans-serif';
    const w1 = ctx.measureText(title).width;
    ctx.font = '11px Inter, sans-serif';
    const w2 = ctx.measureText(status).width;
    const boxW = Math.max(w1, w2, 180) + 24;
    const boxH = 68;

    const x = Math.min(pos.x + 12, this.canvas.width - boxW - 10);
    const y = Math.max(pos.y - boxH - 10, 10);

    ctx.fillStyle = 'rgba(44, 44, 44, 0.95)';
    ctx.strokeStyle = node.isExploited ? '#F5C04B' : '#22C55E';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.rect(x, y, boxW, boxH);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillText(title, x + 10, y + 20);

    ctx.fillStyle = node.isExploited ? '#c084fc' : '#34d399';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText(status, x + 10, y + 38);

    ctx.fillStyle = '#A3A3A3';
    ctx.font = '10px monospace';
    ctx.fillText(coords, x + 10, y + 54);

    ctx.restore();
  }

  renderMachineTooltip(ctx, obj, pos) {
    ctx.save();
    const typeEs = translateBuildingType(obj.type || obj.className);
    const title = ` ${obj.nameEs || typeEs}${obj.recipeName ? `: ${obj.recipeName}` : ''}`;
    const rateText = obj.outputs && obj.outputs.length > 0 
      ? `Producción: ${obj.outputs.map(o => `+${o.rate}/min ${o.name}`).join(', ')}` 
      : 'Sin salida activa';
    const clockText = `Velocidad: ${Math.round((obj.potential || 1.0) * 100)}%  ${obj.status === 'producing' ? ' En Producción' : ' En Espera'}`;

    ctx.font = 'bold 12px Inter, sans-serif';
    const w1 = ctx.measureText(title).width;
    ctx.font = '11px Inter, sans-serif';
    const w2 = ctx.measureText(rateText).width;
    const boxW = Math.max(w1, w2, 170) + 20;
    const boxH = 70;

    const x = Math.min(pos.x + 12, this.canvas.width - boxW - 10);
    const y = Math.max(pos.y - boxH - 10, 10);

    ctx.fillStyle = 'rgba(44, 44, 44, 0.95)';
    ctx.strokeStyle = obj.color || '#FA9549';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.rect(x, y, boxW, boxH);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillText(title, x + 10, y + 20);

    ctx.fillStyle = '#34d399';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText(rateText, x + 10, y + 38);

    ctx.fillStyle = '#A3A3A3';
    ctx.font = '10px monospace';
    ctx.fillText(clockText, x + 10, y + 54);

    ctx.restore();
  }

  renderBeltTooltip(ctx, belt, pos) {
    ctx.save();
    const title = ` ${belt.type} (Máx: ${belt.maxRate}/min)`;
    const itemText = belt.itemNameEs || belt.itemName 
      ? ` Ítem: ${belt.itemNameEs || belt.itemName}` 
      : ' Cinta Vacía (Sin ítems)';
    const rateText = belt.rate > 0 
      ? ` Flujo: ${belt.rate} / min (${belt.itemCount} uds. en tránsito)` 
      : ' Flujo: 0 / min';

    ctx.font = 'bold 12px Inter, sans-serif';
    const w1 = ctx.measureText(title).width;
    ctx.font = '11px Inter, sans-serif';
    const w2 = ctx.measureText(itemText).width;
    const boxW = Math.max(w1, w2, 180) + 20;
    const boxH = 68;

    const x = Math.min(pos.x + 12, this.canvas.width - boxW - 10);
    const y = Math.max(pos.y - boxH - 10, 10);

    ctx.fillStyle = 'rgba(44, 44, 44, 0.95)';
    ctx.strokeStyle = belt.itemColor || '#f97316';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.rect(x, y, boxW, boxH);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillText(title, x + 10, y + 20);

    ctx.fillStyle = belt.itemColor || '#fb923c';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText(itemText, x + 10, y + 38);

    ctx.fillStyle = '#34d399';
    ctx.font = '10px monospace';
    ctx.fillText(rateText, x + 10, y + 54);

    ctx.restore();
  }

  renderPipeTooltip(ctx, pipe, pos) {
    ctx.save();
    const title = ` Tubería ${pipe.type} (Máx: ${pipe.maxRate} m³/min)`;
    const itemText = ` Fluido: ${pipe.itemNameEs || pipe.itemName}`;
    const rateText = ` Capacidad: ${pipe.rate} m³/min`;

    ctx.font = 'bold 12px Inter, sans-serif';
    const w1 = ctx.measureText(title).width;
    const boxW = Math.max(w1, 180) + 20;
    const boxH = 68;

    const x = Math.min(pos.x + 12, this.canvas.width - boxW - 10);
    const y = Math.max(pos.y - boxH - 10, 10);

    ctx.fillStyle = 'rgba(44, 44, 44, 0.95)';
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.rect(x, y, boxW, boxH);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillText(title, x + 10, y + 20);

    ctx.fillStyle = '#FA9549';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText(itemText, x + 10, y + 38);

    ctx.fillStyle = '#34d399';
    ctx.font = '10px monospace';
    ctx.fillText(rateText, x + 10, y + 54);

    ctx.restore();
  }

  renderAttachmentTooltip(ctx, att, pos) {
    ctx.save();
    const isSplitter = att.type === 'Splitter' || (att.className && att.className.includes('Splitter'));
    const title = isSplitter ? ' Divisor de Cinta (Splitter)' : ' Compactador de Cinta (Merger)';

    const inCount = this.connectedInBelts.size;
    const outCount = this.connectedOutBelts.size;

    const inText = isSplitter 
      ? ` Entrada: ${inCount} cinta(s) alimentando (Cyan)`
      : ` Entradas: ${inCount} cinta(s) convergiendo (Cyan)`;
    const outText = isSplitter 
      ? ` Salidas: ${outCount} cinta(s) divididas (Verde)`
      : ` Salida: ${outCount} cinta(s) unificada(s) (Verde)`;

    ctx.font = 'bold 12px Inter, sans-serif';
    const w1 = ctx.measureText(title).width;
    ctx.font = '11px Inter, sans-serif';
    const w2 = Math.max(ctx.measureText(inText).width, ctx.measureText(outText).width);
    const boxW = Math.max(w1, w2, 220) + 24;
    const boxH = 76;

    const x = Math.min(pos.x + 12, this.canvas.width - boxW - 10);
    const y = Math.max(pos.y - boxH - 10, 10);

    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.strokeStyle = isSplitter ? '#FA9549' : '#f97316';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.rect(x, y, boxW, boxH);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillText(title, x + 10, y + 20);

    ctx.fillStyle = '#FA9549';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText(inText, x + 10, y + 38);

    ctx.fillStyle = '#34d399';
    ctx.fillText(outText, x + 10, y + 56);

    ctx.restore();
  }

  renderPowerPoleTooltip(ctx, pole, pos) {
    ctx.save();
    const title = ' Poste Eléctrico de Alta Tensión';
    const linesCount = this.connectedPowerLines.size;
    const desc = ` ${linesCount} cable(s) de alta tensión conectado(s)`;
    const coords = `Coord: X: ${Math.round(pole.x / 100)}m, Y: ${Math.round(pole.y / 100)}m`;

    ctx.font = 'bold 12px Inter, sans-serif';
    const w1 = ctx.measureText(title).width;
    const boxW = Math.max(w1, 220) + 20;
    const boxH = 68;

    const x = Math.min(pos.x + 12, this.canvas.width - boxW - 10);
    const y = Math.max(pos.y - boxH - 10, 10);

    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.rect(x, y, boxW, boxH);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillText(title, x + 10, y + 20);

    ctx.fillStyle = '#e879f9';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText(desc, x + 10, y + 38);

    ctx.fillStyle = '#A3A3A3';
    ctx.font = '10px monospace';
    ctx.fillText(coords, x + 10, y + 54);

    ctx.restore();
  }

  renderMinerTooltip(ctx, miner, pos) {
    ctx.save();
    const minerName = miner.nameEs || (miner.className || 'Build_MinerMk1_C').replace('Build_', '').replace('_C', '');
    const title = ` ${minerName}`;
    const clockPct = Math.round((miner.potential || 1.0) * 100);
    const rateText = `Velocidad: ${clockPct}%  Extracción de recursos activa`;
    const coords = `Coord: X: ${Math.round(miner.x / 100)}m, Y: ${Math.round(miner.y / 100)}m`;

    ctx.font = 'bold 12px Inter, sans-serif';
    const w1 = ctx.measureText(title).width;
    const boxW = Math.max(w1, 200) + 20;
    const boxH = 68;

    const x = Math.min(pos.x + 12, this.canvas.width - boxW - 10);
    const y = Math.max(pos.y - boxH - 10, 10);

    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.strokeStyle = '#e58837';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.rect(x, y, boxW, boxH);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillText(title, x + 10, y + 20);

    ctx.fillStyle = '#fb923c';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText(rateText, x + 10, y + 38);

    ctx.fillStyle = '#A3A3A3';
    ctx.font = '10px monospace';
    ctx.fillText(coords, x + 10, y + 54);

    ctx.restore();
  }

  openCreateZoneModal(bounds) {
    const inside = this.buildings.filter(b => 
      b.x >= bounds.minX && b.x <= bounds.maxX && b.y >= bounds.minY && b.y <= bounds.maxY
    );

    const modal = document.getElementById('zone-modal');
    if (!modal) return;

    document.getElementById('zone-bounds-minx').value = Math.round(bounds.minX);
    document.getElementById('zone-bounds-maxx').value = Math.round(bounds.maxX);
    document.getElementById('zone-bounds-miny').value = Math.round(bounds.minY);
    document.getElementById('zone-bounds-maxy').value = Math.round(bounds.maxY);

    document.getElementById('zone-machines-preview').textContent = 
      `${inside.length} máquina(s) detectada(s) dentro de este recuadro.`;

    document.getElementById('zone-name-input').value = `Fábrica #${this.zones.length + 1}`;
    modal.classList.add('active');
  }

  getZoneMetrics(zone) {
    if (!zone || !zone.bounds) return { machines: [], storages: [], production: {}, consumption: {} };
    const { minX, maxX, minY, maxY } = zone.bounds;
    const machines = this.buildings.filter(b => b.x >= minX && b.x <= maxX && b.y >= minY && b.y <= maxY);
    const storages = this.storages.filter(s => s.x >= minX && s.x <= maxX && s.y >= minY && s.y <= maxY);

    const production = {};
    const consumption = {};

    for (const b of machines) {
      if (b.outputs) {
        for (const out of b.outputs) {
          if (!production[out.item]) {
            production[out.item] = { name: out.name, rate: 0, count: 0 };
          }
          production[out.item].rate += out.rate || 0;
          production[out.item].count += 1;
        }
      }
      if (b.inputs) {
        for (const inp of b.inputs) {
          if (!consumption[inp.item]) {
            consumption[inp.item] = { name: inp.name, rate: 0 };
          }
          consumption[inp.item].rate += inp.rate || 0;
        }
      }
    }

    return { machines, storages, production, consumption };
  }

  updateZoneListUI() {
    const listEl = document.getElementById('zones-list-container');
    if (!listEl) return;

    if (this.zones.length === 0) {
      listEl.innerHTML = `<div style="padding: 12px; color: var(--text-muted); font-size: 12px; text-align: center;">No hay zonas creadas aún.<br>Haz clic en "Nueva Zona" para delimitar una.</div>`;
      return;
    }

    listEl.innerHTML = this.zones.map(z => {
      const metrics = this.getZoneMetrics(z);
      const machineCount = metrics.machines.length;
      const storageCount = metrics.storages.length;

      const prodItems = Object.values(metrics.production);
      const consItems = Object.values(metrics.consumption);

      const prodHtml = prodItems.length > 0
        ? `<div class="zone-rate-group">
            <span class="zone-rate-header prod"> Produce:</span>
            <div class="zone-pills-wrap">
              ${prodItems.map(p => `
                <span class="zone-rate-pill prod" title="${p.count} máquina(s) produciendo ${p.name}">
                  +${Math.round(p.rate * 10) / 10}/m ${p.name}
                </span>
              `).join('')}
            </div>
           </div>`
        : `<div style="font-size: 10px; color: var(--text-muted);">Sin máquinas de producción activas</div>`;

      const consHtml = consItems.length > 0
        ? `<div class="zone-rate-group">
            <span class="zone-rate-header cons"> Consume:</span>
            <div class="zone-pills-wrap">
              ${consItems.map(c => `
                <span class="zone-rate-pill cons" title="Consumo requerido de ${c.name}">
                  -${Math.round(c.rate * 10) / 10}/m ${c.name}
                </span>
              `).join('')}
            </div>
           </div>`
        : '';

      return `
        <div class="zone-card" style="border-left: 4px solid ${z.color || '#61afef'};">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
            <div>
              <div style="font-weight: 800; font-size: 13px; color: var(--text-main);">${z.name}</div>
              <div style="font-size: 11px; color: var(--text-muted); margin-top: 1px;">
                 ${machineCount} máquina(s) &bull;  ${storageCount} almacén(es)
              </div>
            </div>
            <div style="display: flex; gap: 3px;">
              <button class="zone-action-btn" onclick="window.tacticalMap.focusZone('${z.id}')" title="Centrar mapa en esta fábrica"></button>
              <button class="zone-action-btn" onclick="window.editZone('${z.id}')" title="Editar zona"></button>
              <button class="zone-action-btn delete" onclick="window.deleteZone('${z.id}')" title="Eliminar zona"></button>
            </div>
          </div>
          ${prodHtml}
          ${consHtml}
        </div>
      `;
    }).join('');
  }

  updateSCIMFilterSidebarUI() {
    const container = document.getElementById('scim-resource-list');
    if (!container) return;

    const groups = new Map();
    for (const n of this.nodes) {
      if (!groups.has(n.resourceClass)) {
        groups.set(n.resourceClass, {
          resourceClass: n.resourceClass,
          name: n.resourceNameEs || n.resourceName,
          icon: n.icon,
          color: n.color,
          total: 0,
          exploited: 0
        });
      }
      const g = groups.get(n.resourceClass);
      g.total++;
      if (n.isExploited) g.exploited++;
    }

    const sortedGroups = Array.from(groups.values()).sort((a, b) => b.total - a.total);

    const totalExploited = this.nodes.filter(n => n.isExploited).length;
    const totalAvailable = this.nodes.length - totalExploited;

    

    container.innerHTML = sortedGroups.map(g => {
      const isChecked = this.filters.resources.has(g.resourceClass);
      return `
        <label class="scim-resource-item ${isChecked ? 'active' : ''}">
          <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="window.tacticalMap.toggleResourceFilter('${g.resourceClass}', this.checked)" />
          <img src="icons/${g.icon}" class="scim-res-icon" alt="${g.name}" />
          <span class="scim-res-name">${g.name}</span>
          <span class="scim-res-counter" title="${g.exploited} minadas de ${g.total} totales">
            <span style="color: #F5C04B;">${g.exploited}</span> / <span style="color: #22C55E;">${g.total - g.exploited}</span>
          </span>
        </label>
      `;
    }).join('');
  }

  toggleResourceFilter(resourceClass, enabled) {
    this.filters.resourcesInitialized = true;
    if (enabled) {
      this.filters.resources.add(resourceClass);
    } else {
      this.filters.resources.delete(resourceClass);
    }
    if (typeof saveAppState === 'function') saveAppState();
    this.render();
    this.updateSCIMFilterSidebarUI();
  }

  setAllResources(enabled) {
    this.filters.resourcesInitialized = true;
    if (enabled) {
      for (const n of this.nodes) {
        this.filters.resources.add(n.resourceClass);
      }
    } else {
      this.filters.resources.clear();
    }
    if (typeof saveAppState === 'function') saveAppState();
    this.render();
    this.updateSCIMFilterSidebarUI();
  }

  setPurityFilter(purity, enabled) {
    this.filters.purity[purity] = enabled;
    if (typeof saveAppState === 'function') saveAppState();
    this.render();
  }

  setStatusFilter(status) {
    this.filters.status = status;
    if (typeof saveAppState === 'function') saveAppState();
    document.querySelectorAll('.scim-status-toggle-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.status === status);
    });
    this.render();
  }

  setLayerVisible(layer, visible) {
    this.filters.layers[layer] = visible;
    if (typeof saveAppState === 'function') saveAppState();
    this.render();
  }

  // === COLLECTIBLES ===
  
  setCollectibleGroupVisible(groupName, visible) {
    if (visible) {
      this.collectibleVisibility.add(groupName);
    } else {
      this.collectibleVisibility.delete(groupName);
    }
    this.render();
  }

  setCollectedPathNames(pathNames) {
    this.collectedPathNames = new Set(pathNames);
    this.render();
  }

    getVisibleCollectibleMarkers() {
    if (typeof MAP_COLLECTIBLE_TABS === "undefined") return [];
    const markers = [];
    for (const tab of Object.values(MAP_COLLECTIBLE_TABS)) {
      for (const group of tab.groups) {
        if (!this.collectibleVisibility.has(group.name)) continue;
        for (const m of group.markers) {
          const isCollected = this.collectedPathNames.has(m.pathName);
          if (this.filters.status === "available" && isCollected) continue;
          if (this.filters.status === "exploited" && !isCollected) continue;

          markers.push({
            ...m,
            groupName: group.name,
            groupNameEs: group.nameEs,
            icon: group.icon,
            color: group.color
          });
        }
      }
    }
    return markers;
  }

  renderCollectibles(ctx, w, h) {
    const markers = this.getVisibleCollectibleMarkers();
    if (markers.length === 0) return;

    const baseRadius = Math.max(7, Math.min(14, 8 * Math.pow(this.scale, 0.3)));
    const iconSize = Math.max(12, Math.min(22, baseRadius * 1.4));

    for (const m of markers) {
      const p = this.worldToScreen(m.x, m.y);
      if (p.x < -30 || p.x > w + 30 || p.y < -30 || p.y > h + 30) continue;

      const isCollected = this.collectedPathNames.has(m.pathName);
      const isHovered = this.hoveredCollectible === m;

      ctx.save();
      ctx.globalAlpha = isCollected ? 0.25 : 1.0;

      // Outer circle
      ctx.beginPath();
      ctx.arc(p.x, p.y, baseRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#2C2C2C';
      ctx.fill();
      ctx.strokeStyle = m.color || '#737373';
      ctx.lineWidth = isHovered ? 3 : 2;
      ctx.stroke();

      // Hover glow
      if (isHovered) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, baseRadius + 4, 0, Math.PI * 2);
        ctx.strokeStyle = m.color || '#FA9549';
        ctx.lineWidth = 2;
        ctx.shadowColor = m.color || '#FA9549';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Icon
      const img = this.getIconImage(m.icon);
      if (img && img.complete && img.naturalWidth > 0) {
        const half = iconSize / 2;
        ctx.drawImage(img, p.x - half, p.y - half, iconSize, iconSize);
      }

      // Collected checkmark
      if (isCollected) {
        const badgeR = Math.max(4, baseRadius * 0.4);
        const bx = p.x + baseRadius * 0.6;
        const by = p.y - baseRadius * 0.6;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(bx, by, badgeR, 0, Math.PI * 2);
        ctx.fillStyle = '#22C55E';
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.round(badgeR * 1.4)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('', bx, by);
      }

      ctx.restore();
    }
  }

  renderCollectibleTooltip(ctx, marker, pos) {
    const isCollected = this.collectedPathNames.has(marker.pathName);
    const lines = [
      marker.groupNameEs || marker.groupName,
      isCollected ? ' Recogido' : ' No recogido',
      `Coords: ${Math.round(marker.x)}, ${Math.round(marker.y)}`
    ];

    const lineH = 18;
    const pad = 10;
    ctx.font = '12px sans-serif';
    const maxW = Math.max(...lines.map(l => ctx.measureText(l).width));
    const tw = maxW + pad * 2;
    const th = lines.length * lineH + pad * 2;

    let tx = pos.x + 16;
    let ty = pos.y - th / 2;
    const rect = this.canvas.getBoundingClientRect();
    if (tx + tw > rect.width) tx = pos.x - tw - 16;
    if (ty < 0) ty = 4;
    if (ty + th > rect.height) ty = rect.height - th - 4;

    ctx.save();
    ctx.globalAlpha = 0.92;
    ctx.fillStyle = '#2C2C2C';
    ctx.beginPath();
    if (ctx.roundRect) ctx.rect(tx, ty, tw, th, 6);
    else { ctx.rect(tx, ty, tw, th); }
    ctx.fill();
    ctx.strokeStyle = marker.color || '#FA9549';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.globalAlpha = 1;

    ctx.fillStyle = '#e2e8f0';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    for (let i = 0; i < lines.length; i++) {
      ctx.font = i === 0 ? 'bold 12px sans-serif' : '11px sans-serif';
      ctx.fillStyle = i === 0 ? (marker.color || '#e2e8f0') : '#A3A3A3';
      ctx.fillText(lines[i], tx + pad, ty + pad + i * lineH);
    }
    ctx.restore();
  }
}

// Global hook
window.TacticalMap = TacticalMap;

// Added function to commit zone changes
TacticalMap.prototype.commitZoneChanges = function() {
  this.persistZones();
  this.updateZoneListUI();
  if (typeof window.updateQuickZonesBar === "function") window.updateQuickZonesBar();
  if (typeof window.recalculateMetricsForZones === "function") window.recalculateMetricsForZones();
  this.initialZonesState = JSON.stringify(this.zones);
  this.history = [];
  this.redoStack = [];
  this.updateUndoRedoUI();
  const btnSave = document.getElementById("btn-save-zone-edits");
  if (btnSave) { btnSave.disabled = true; btnSave.style.opacity = "0.5"; }
  const btnRevert = document.getElementById("btn-revert-zone-edits");
  if (btnRevert) { btnRevert.disabled = true; btnRevert.style.opacity = "0.5"; }
  alert("Zonas guardadas correctamente.");
};

TacticalMap.prototype.revertZoneChanges = function() {
  if (!this.initialZonesState) return;
  if (!confirm("¿Deseas descartar todos los cambios y volver al estado inicial?")) return;
  this.zones = JSON.parse(this.initialZonesState);
  this.selectedZone = null;
  this.transformAction = null;
  this.history = [];
  this.redoStack = [];
  this.updateUndoRedoUI();
  this.render();
  this.updateZoneListUI();
  if (typeof window.updateQuickZonesBar === "function") window.updateQuickZonesBar();
  if (typeof window.recalculateMetricsForZones === "function") window.recalculateMetricsForZones();
  const btnSave = document.getElementById("btn-save-zone-edits");
  if (btnSave) { btnSave.disabled = true; btnSave.style.opacity = "0.5"; }
  const btnRevert = document.getElementById("btn-revert-zone-edits");
  if (btnRevert) { btnRevert.disabled = true; btnRevert.style.opacity = "0.5"; }
};

TacticalMap.prototype.pushHistory = function() {
  if (!this.history) this.history = [];
  if (!this.redoStack) this.redoStack = [];
  this.history.push(JSON.stringify(this.zones));
  if (this.history.length > 50) this.history.shift();
  this.redoStack = [];
  this.updateUndoRedoUI();
};

TacticalMap.prototype.undo = function() {
  if (!this.history || this.history.length === 0) return;
  if (!this.redoStack) this.redoStack = [];
  this.redoStack.push(JSON.stringify(this.zones));
  const prevState = this.history.pop();
  this.zones = JSON.parse(prevState);
  this.selectedZone = null;
  this.updateUndoRedoUI();
  this.render();
  this.updateZoneListUI();
  if (typeof window.updateQuickZonesBar === "function") window.updateQuickZonesBar();
  if (typeof window.recalculateMetricsForZones === "function") window.recalculateMetricsForZones();
  const btnSave = document.getElementById("btn-save-zone-edits");
  if (btnSave) { btnSave.disabled = false; btnSave.style.opacity = "1"; }
  const btnRevert = document.getElementById("btn-revert-zone-edits");
  if (btnRevert) { btnRevert.disabled = false; btnRevert.style.opacity = "1"; }
};

TacticalMap.prototype.redo = function() {
  if (!this.redoStack || this.redoStack.length === 0) return;
  if (!this.history) this.history = [];
  this.history.push(JSON.stringify(this.zones));
  const nextState = this.redoStack.pop();
  this.zones = JSON.parse(nextState);
  this.selectedZone = null;
  this.updateUndoRedoUI();
  this.render();
  this.updateZoneListUI();
  if (typeof window.updateQuickZonesBar === "function") window.updateQuickZonesBar();
  if (typeof window.recalculateMetricsForZones === "function") window.recalculateMetricsForZones();
  const btnSave = document.getElementById("btn-save-zone-edits");
  if (btnSave) { btnSave.disabled = false; btnSave.style.opacity = "1"; }
  const btnRevert = document.getElementById("btn-revert-zone-edits");
  if (btnRevert) { btnRevert.disabled = false; btnRevert.style.opacity = "1"; }
};

TacticalMap.prototype.updateUndoRedoUI = function() {
  const btnUndo = document.getElementById("btn-undo-zone");
  const btnRedo = document.getElementById("btn-redo-zone");
  if (btnUndo) {
    btnUndo.disabled = !this.history || this.history.length === 0;
    btnUndo.style.opacity = btnUndo.disabled ? "0.5" : "1";
    btnUndo.style.cursor = btnUndo.disabled ? "not-allowed" : "pointer";
  }
  if (btnRedo) {
    btnRedo.disabled = !this.redoStack || this.redoStack.length === 0;
    btnRedo.style.opacity = btnRedo.disabled ? "0.5" : "1";
    btnRedo.style.cursor = btnRedo.disabled ? "not-allowed" : "pointer";
  }
};
window.addEventListener("keydown", (e) => {
  if (window.tacticalMap && window.tacticalMap.interactionMode === "transform_zone") {
    if (e.ctrlKey && e.key === "z") { e.preventDefault(); window.tacticalMap.undo(); }
    if (e.ctrlKey && e.key === "y") { e.preventDefault(); window.tacticalMap.redo(); }
  }
});
