const fs = require('fs');
const path = require('path');
const { Parser } = require('@etothepii/satisfactory-file-parser');
const recipes = require('./recipe_map');

const RAW_NODES_FILE = path.join(__dirname, '..', 'data', 'resource_nodes.json');
let baseResourceNodes = [];
try {
  if (fs.existsSync(RAW_NODES_FILE)) {
    baseResourceNodes = JSON.parse(fs.readFileSync(RAW_NODES_FILE, 'utf8'));
  }
} catch (e) {
  console.warn('[Parser] Error reading resource_nodes.json:', e.message);
}

const ITEM_METADATA = require('./item_metadata.json');

const MACHINE_SPECS = {
  Smelter: { width: 900, length: 1000, color: '#e58837', strokeColor: '#ff3700', power: 4, duration: 2, defaultIcon: 'Iron_Ingot.png', nameEs: 'Fundición' },
  Foundry: { width: 1000, length: 1100, color: '#e58837', strokeColor: '#ff3700', power: 16, duration: 4, defaultIcon: 'Steel_Ingot.png', nameEs: 'Fundición Avanzada' },
  Constructor: { width: 800, length: 1000, color: '#e58837', strokeColor: '#ff3700', power: 4, duration: 4, defaultIcon: 'Iron_Plate.png', nameEs: 'Constructor' },
  Assembler: { width: 1000, length: 1500, color: '#e58837', strokeColor: '#ff3700', power: 15, duration: 12, defaultIcon: 'Reinforced_Iron_Plate.png', nameEs: 'Ensamblador' },
  Manufacturer: { width: 1800, length: 1900, color: '#e58837', strokeColor: '#ff3700', power: 55, duration: 24, defaultIcon: 'Heavy_Modular_Frame.png', nameEs: 'Fabricante' },
  Refinery: { width: 1000, length: 2000, color: '#e58837', strokeColor: '#ff3700', power: 30, duration: 6, defaultIcon: 'Plastic.png', nameEs: 'Refinería' },
  Packager: { width: 800, length: 800, color: '#e58837', strokeColor: '#ff3700', power: 20, duration: 2, defaultIcon: 'Empty_Canister.png', nameEs: 'Empaquetador' },
  Blender: { width: 1800, length: 1600, color: '#e58837', strokeColor: '#ff3700', power: 75, duration: 12, defaultIcon: 'Motor.png', nameEs: 'Mezcladora' },
  GeneratorCoal: { width: 1000, length: 2600, color: '#4b5563', strokeColor: '#1f2937', power: -75, duration: 4, defaultIcon: 'Coal.png', nameEs: 'Generador de Carbón' },
  GeneratorFuel: { width: 2000, length: 2000, color: '#4b5563', strokeColor: '#1f2937', power: -250, duration: 4, defaultIcon: 'Fuel.png', nameEs: 'Generador de Combustible' },
  GeneratorNuclear: { width: 3800, length: 3800, color: '#4b5563', strokeColor: '#1f2937', power: -2500, duration: 4, defaultIcon: 'Uranium_Fuel_Rod.png', nameEs: 'Planta Nuclear' },
  GeneratorBiomass: { width: 800, length: 800, color: '#4b5563', strokeColor: '#1f2937', power: -30, duration: 4, defaultIcon: 'Biomass.png', nameEs: 'Quemador de Biomasa' },
  GeneratorIntegratedBiomass: { width: 800, length: 800, color: '#4b5563', strokeColor: '#1f2937', power: -20, duration: 4, defaultIcon: 'Biomass.png', nameEs: 'Quemador de Biomasa Integrado' },
  MinerMk1: { width: 600, length: 1400, color: '#e58837', strokeColor: '#ff3700', power: 5, defaultIcon: 'Iron_Ore.png', nameEs: 'Minero Mk.1' },
  MinerMk2: { width: 600, length: 1400, color: '#e58837', strokeColor: '#ff3700', power: 12, defaultIcon: 'Iron_Ore.png', nameEs: 'Minero Mk.2' },
  MinerMk3: { width: 600, length: 1400, color: '#e58837', strokeColor: '#ff3700', power: 30, defaultIcon: 'Iron_Ore.png', nameEs: 'Minero Mk.3' },
  OilPump: { width: 800, length: 1600, color: '#e58837', strokeColor: '#ff3700', power: 40, defaultIcon: 'Crude_Oil.png', nameEs: 'Extractor de Petróleo' },
  WaterPump: { width: 1800, length: 1800, color: '#0284c7', strokeColor: '#38bdf8', power: 20, defaultIcon: 'Water.png', nameEs: 'Extractor de Agua' },
  PipelinePump: { width: 600, length: 600, color: '#0284c7', strokeColor: '#38bdf8', power: 4, defaultIcon: 'Water.png', nameEs: 'Bomba de Tubería' },
  PipelinePumpMk2: { width: 800, length: 800, color: '#0284c7', strokeColor: '#38bdf8', power: 8, defaultIcon: 'Water.png', nameEs: 'Bomba de Tubería Mk.2' },
  PipeHyperStart: { width: 400, length: 600, color: '#3b82f6', strokeColor: '#60a5fa', power: 0.3, defaultIcon: null, nameEs: 'Entrada de Hipertubo' },
  ResourceSink: { width: 1200, length: 1200, color: '#e58837', strokeColor: '#ff3700', power: 30, defaultIcon: 'Ficsit_Coupon.png', nameEs: 'Trituradora FICSIT (Sink)' },
  TruckStation: { width: 1000, length: 1600, color: '#e58837', strokeColor: '#ff3700', power: 20, defaultIcon: null, nameEs: 'Estación de Camiones' },
  TrainStation: { width: 1600, length: 2600, color: '#e58837', strokeColor: '#ff3700', power: 50, defaultIcon: null, nameEs: 'Estación de Tren' },
  PowerStorage: { width: 600, length: 600, color: '#0ea5e9', strokeColor: '#38bdf8', power: 0, defaultIcon: null, nameEs: 'Almacenamiento de Energía' },
  StorageContainer: { width: 500, length: 1000, color: '#e58837', strokeColor: '#ff3700', defaultIcon: null, nameEs: 'Contenedor de Almacenamiento' },
  StorageIntegrated: { width: 500, length: 1000, color: '#e58837', strokeColor: '#ff3700', defaultIcon: null, nameEs: 'Contenedor Integrado' },
  StoragePlayer: { width: 500, length: 1000, color: '#e58837', strokeColor: '#ff3700', defaultIcon: null, nameEs: 'Caja del Jugador' }
};

function getMachineSpec(raw) {
  if (!raw) return null;
  const clean = raw.replace('Build_', '').replace('_C', '');
  if (MACHINE_SPECS[clean]) return MACHINE_SPECS[clean];
  for (const [k, v] of Object.entries(MACHINE_SPECS)) {
    if (clean.toLowerCase().includes(k.toLowerCase())) return v;
  }
  return null;
}

const BELT_RATES = {
  Build_ConveyorBeltMk1_C: 60,
  Build_ConveyorBeltMk2_C: 120,
  Build_ConveyorBeltMk3_C: 270,
  Build_ConveyorBeltMk4_C: 480,
  Build_ConveyorBeltMk5_C: 780,
  Build_ConveyorBeltMk6_C: 1200,
  Build_Pipeline_C: 300,
  Build_PipelineMk2_C: 600
};

function getYawFromQuaternion(q) {
  if (!q) return 0;
  const x = q.x || 0, y = q.y || 0, z = q.z || 0, w = q.w ?? 1;
  return Math.atan2(2 * (w * z + x * y), 1 - 2 * (y * y + z * z));
}

function getSplinePoints(obj) {
  const rot = obj.transform?.rotation;
  const base = obj.transform?.translation || { x: 0, y: 0, z: 0 };
  const yaw = getYawFromQuaternion(rot);
  const cos = Math.cos(yaw), sin = Math.sin(yaw);

  const splineRaw = obj.properties?.mSplineData?.values || [];
  const points = [];
  for (const sp of splineRaw) {
    const loc = sp.properties?.Location?.value || { x: 0, y: 0 };
    const wx = base.x + (cos * loc.x - sin * loc.y);
    const wy = base.y + (sin * loc.x + cos * loc.y);
    points.push({ x: Math.round(wx), y: Math.round(wy) });
  }
  return points;
}

function getDecoratedNodes(minersList = []) {
  const minersByTarget = new Map();
  for (const m of minersList) {
    if (m.targetResource) {
      minersByTarget.set(m.targetResource, m);
      const cleanId = m.targetResource.split('.').pop();
      if (cleanId) minersByTarget.set(cleanId, m);
    }
  }

  return baseResourceNodes.map(node => {
    let matched = minersByTarget.get(node.fullPath) || minersByTarget.get(node.id);

    // Proximity fallback < 25m
    if (!matched) {
      for (const m of minersList) {
        const dx = m.x - node.x;
        const dy = m.y - node.y;
        if (dx * dx + dy * dy < 2500 * 2500) {
          matched = m;
          break;
        }
      }
    }

    const isExploited = !!matched;
    let currentRate = 0;
    let minerInfo = null;

    if (matched) {
      minerInfo = {
        type: matched.type,
        potential: matched.potential,
        x: matched.x,
        y: matched.y
      };

      let tierMult = 1.0;
      if (matched.type.includes('MinerMk2')) tierMult = 2.0;
      else if (matched.type.includes('MinerMk3')) tierMult = 4.0;
      else if (matched.type.includes('OilPump')) tierMult = 1.0;

      currentRate = Math.round(node.baseRate * tierMult * (matched.potential || 1.0));
      if (currentRate > 780 && node.type === 'solid') currentRate = 780;
    }

    return {
      ...node,
      isExploited,
      currentRate,
      miner: minerInfo
    };
  });
}

let cachedSave = null;
let lastMtime = 0;

/**
 * Safely parse the Satisfactory .sav file in READ-ONLY mode.
 */
function parseSaveFile(saveFilePath) {
  if (!fs.existsSync(saveFilePath)) {
    return { error: 'Save file not found at: ' + saveFilePath };
  }

  const stat = fs.statSync(saveFilePath);
  if (cachedSave && stat.mtimeMs === lastMtime) {
    return cachedSave;
  }

  const startTime = Date.now();
  console.log(`[Parser] Reading save file (${stat.size} bytes)...`);

  const fileBuffer = fs.readFileSync(saveFilePath);
  const parsed = Parser.ParseSave(path.basename(saveFilePath, '.sav'), fileBuffer.buffer);

  lastMtime = stat.mtimeMs;

  const allObjects = [];
  const collectables = [];
  
  for (const lvl of Object.values(parsed.levels || {})) {
    if (lvl) {
      if (Array.isArray(lvl.objects)) {
        allObjects.push(...lvl.objects);
      }
      if (Array.isArray(lvl.collectables)) {
        for (const c of lvl.collectables) {
          if (c && c.pathName) collectables.push(c.pathName);
        }
      }
    }
  }
  
  if (Array.isArray(parsed.objects)) {
    allObjects.push(...parsed.objects);
  }

  // 1. Map Conveyor Chains to Belt Paths
  const beltItemsMap = new Map();
  for (const obj of allObjects) {
    if ((obj.typePath || obj.className || '').includes('ConveyorChainActor')) {
      const spec = obj.specialProperties;
      if (!spec) continue;
      const items = (spec.items || []).map(i => i.item?.itemReference?.pathName?.split('.').pop()).filter(Boolean);
      const primaryItem = items.length > 0 ? items[0] : null;
      const count = items.length;
      for (const b of (spec.beltsInChain || [])) {
        if (b.beltRef?.pathName) {
          beltItemsMap.set(b.beltRef.pathName, { item: primaryItem, count });
        }
      }
    }
  }

  // 2. Extract Objects
  const buildings = [];
  const storages = [];
  const miners = [];
  const belts = [];
  const pipes = [];
  const attachments = [];
  const powerPoles = [];
  const powerLines = [];
  const specialBuildings = [];
  const rawCircuits = [];
  const powerConnections = new Map();
  const powerInfos = new Map();
  const entityMap = new Map();

  for (const obj of allObjects) {
    const rawType = obj.typePath || obj.className || '';
    const pos = obj.transform?.translation || obj.translation;
    const className = rawType.split('.').pop() || '';
    const shortType = className.replace('Build_', '').replace('_C', '');
    const yaw = getYawFromQuaternion(obj.transform?.rotation);

    if (rawType.includes('FGPowerCircuit')) {
      rawCircuits.push(obj);
      continue;
    }
    if (rawType.includes('FGPowerConnectionComponent')) {
      if (obj.instanceName && obj.parentEntityName) {
        powerConnections.set(obj.instanceName, obj.parentEntityName);
      }
      continue;
    }
    if (rawType.includes('FGPowerInfoComponent')) {
      if (obj.instanceName) {
        powerInfos.set(obj.instanceName, obj.properties || {});
      }
      continue;
    }

    const machSpec = getMachineSpec(rawType);
    if (machSpec && obj.instanceName) {
      const isGen = machSpec.power < 0;
      const pot = obj.properties?.mCurrentPotential?.value ?? obj.properties?.mPendingPotential?.value ?? 1.0;
      const isProd = obj.properties?.mIsProducing?.value !== false;
      entityMap.set(obj.instanceName, {
        id: obj.instanceName,
        className,
        type: shortType,
        spec: machSpec,
        isGenerator: isGen,
        potential: Number(Number(pot).toFixed(2)),
        isProducing: isProd
      });
    }

    // Power Lines
    if (rawType.includes('Build_PowerLine_C')) {
      const locs = obj.properties?.mWireInstances?.values?.[0]?.properties?.Locations;
      if (locs && locs.length >= 2) {
        const p1 = locs[0].value;
        const p2 = locs[1].value;
        if (p1 && p2) {
          powerLines.push({
            id: obj.instanceName || `pwr_${powerLines.length}`,
            p1: { x: Math.round(p1.x), y: Math.round(p1.y), z: Math.round(p1.z) },
            p2: { x: Math.round(p2.x), y: Math.round(p2.y), z: Math.round(p2.z) }
          });
        }
      }
      continue;
    }

    if (!pos) continue;

    // Splitters, Mergers & Pipeline Cross Junctions
    if (rawType.includes('ConveyorAttachmentSplitter') || rawType.includes('ConveyorAttachmentMerger') ||
        rawType.includes('PipelineJunction') || rawType.includes('PipelinePump') || rawType.includes('Valve')) {
      const isSplitter = rawType.includes('Splitter');
      const isMerger = rawType.includes('Merger');
      const isCross = rawType.includes('PipelineJunction');
      attachments.push({
        id: obj.instanceName || `att_${attachments.length}`,
        className,
        type: isSplitter ? 'Splitter' : (isMerger ? 'Merger' : (isCross ? 'PipelineJunction' : shortType)),
        x: Math.round(pos.x),
        y: Math.round(pos.y),
        z: Math.round(pos.z),
        yaw: Number(yaw.toFixed(3))
      });
    }

    // Power Poles & Outlets
    else if (rawType.includes('PowerPole') || rawType.includes('PowerPoleWall')) {
      powerPoles.push({
        id: obj.instanceName || `pole_${powerPoles.length}`,
        className,
        type: shortType,
        x: Math.round(pos.x),
        y: Math.round(pos.y),
        z: Math.round(pos.z)
      });
    }

    // Space Elevator
    else if (rawType.includes('SpaceElevator')) {
      specialBuildings.push({
        id: obj.instanceName || 'SpaceElevator',
        className,
        type: 'SpaceElevator',
        nameEs: 'Ascensor Espacial',
        x: Math.round(pos.x),
        y: Math.round(pos.y),
        z: Math.round(pos.z),
        yaw: Number(yaw.toFixed(3))
      });
    }

    // Production Machines
    else if (rawType.includes('Smelter') || rawType.includes('Constructor') || rawType.includes('Assembler') || 
        rawType.includes('Manufacturer') || rawType.includes('Refinery') || rawType.includes('Foundry') ||
        rawType.includes('Packager') || rawType.includes('Blender') || rawType.includes('Generator')) {
      
      const recipePath = obj.properties?.mCurrentRecipe?.value?.pathName || '';
      const recipeKey = recipePath.split('.').pop() || '';
      const recipeData = recipes[recipeKey] || null;

      const potential = obj.properties?.mCurrentPotential?.value ?? obj.properties?.mPendingPotential?.value ?? 1.0;
      const isProducing = obj.properties?.mIsProducing?.value !== false;
      const spec = MACHINE_SPECS[shortType] || { width: 1000, length: 1200, color: '#e58837', strokeColor: '#ff3700', power: 4, duration: 2, defaultIcon: null, nameEs: shortType };

      // Determine output icon
      let icon = spec.defaultIcon;
      if (recipeData && recipeData.outputs && recipeData.outputs.length > 0) {
        const outItem = recipeData.outputs[0].item;
        const formatted = outItem.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('_') + '.png';
        icon = formatted;
      }

      const status = isProducing ? 'producing' : (potential > 0 ? 'idle' : 'stopped');

      buildings.push({
        id: obj.instanceName || `bld_${buildings.length}`,
        className,
        type: shortType,
        nameEs: spec.nameEs,
        recipeKey,
        recipeName: recipeData ? recipeData.name : (recipeKey ? recipeKey.replace('Recipe_', '').replace('_C', '') : 'Sin receta'),
        x: Math.round(pos.x),
        y: Math.round(pos.y),
        z: Math.round(pos.z),
        yaw: Number(yaw.toFixed(3)),
        width: spec.width,
        length: spec.length,
        color: spec.color,
        strokeColor: spec.strokeColor || '#ff3700',
        power: spec.power || 4,
        duration: spec.duration || 4,
        icon,
        potential: Number(Number(potential).toFixed(2)),
        isProducing,
        status,
        inputs: recipeData ? recipeData.inputs.map(inp => ({ ...inp, rate: inp.rate * potential })) : [],
        outputs: recipeData ? recipeData.outputs.map(out => ({ ...out, rate: out.rate * potential })) : []
      });
    }

    // Storage containers
    else if (rawType.includes('StorageContainer') || rawType.includes('StorageIntegrated') || rawType.includes('StoragePlayer')) {
      const spec = MACHINE_SPECS[shortType] || { width: 500, length: 1000, color: '#e58837', strokeColor: '#ff3700', nameEs: 'Almacén' };
      storages.push({
        id: obj.instanceName || `str_${storages.length}`,
        className,
        type: shortType,
        nameEs: spec.nameEs,
        x: Math.round(pos.x),
        y: Math.round(pos.y),
        z: Math.round(pos.z),
        yaw: Number(yaw.toFixed(3)),
        width: spec.width,
        length: spec.length,
        color: spec.color,
        strokeColor: spec.strokeColor || '#ff3700'
      });
    }

    // Resource Extractors
    else if (rawType.includes('Miner') || rawType.includes('OilPump') || rawType.includes('WaterPump')) {
      const resPath = obj.properties?.mExtractableResource?.value?.pathName || '';
      const potential = obj.properties?.mCurrentPotential?.value ?? obj.properties?.mPendingPotential?.value ?? 1.0;
      const spec = MACHINE_SPECS[shortType] || { width: 800, length: 1400, color: '#e58837', strokeColor: '#ff3700', power: 10, nameEs: 'Extractor' };
      miners.push({
        id: obj.instanceName || `mnr_${miners.length}`,
        className,
        type: shortType,
        nameEs: spec.nameEs,
        x: Math.round(pos.x),
        y: Math.round(pos.y),
        z: Math.round(pos.z),
        yaw: Number(yaw.toFixed(3)),
        width: spec.width,
        length: spec.length,
        color: spec.color,
        strokeColor: spec.strokeColor || '#ff3700',
        targetResource: resPath,
        potential: Number(Number(potential).toFixed(2))
      });
    }

    // Conveyor Belts
    else if (rawType.includes('ConveyorBelt')) {
      const fullPath = obj.instanceName || obj.pathName || '';
      const itemInfo = beltItemsMap.get(fullPath) || null;
      const points = getSplinePoints(obj);
      if (points.length >= 2) {
        const classKey = rawType.split('.').pop();
        const maxRate = BELT_RATES[classKey] || 60;
        const meta = itemInfo?.item ? ITEM_METADATA[itemInfo.item] : null;

        belts.push({
          id: fullPath,
          className,
          type: shortType,
          maxRate,
          item: itemInfo ? itemInfo.item : null,
          itemName: meta ? meta.name : (itemInfo?.item ? itemInfo.item.replace('Desc_', '').replace('_C', '') : null),
          itemNameEs: meta ? meta.nameEs : (itemInfo?.item ? itemInfo.item.replace('Desc_', '').replace('_C', '') : null),
          itemIcon: meta ? meta.icon : null,
          itemColor: '#ffbca3',
          itemCount: itemInfo ? itemInfo.count : 0,
          rate: itemInfo && itemInfo.count > 0 ? maxRate : 0,
          points
        });
      }
    }

    // Pipelines
    else if (rawType.includes('Pipeline')) {
      const fullPath = obj.instanceName || obj.pathName || '';
      const points = getSplinePoints(obj);
      if (points.length >= 2) {
        const classKey = rawType.split('.').pop();
        const maxRate = BELT_RATES[classKey] || 300;
        pipes.push({
          id: fullPath,
          className,
          type: shortType,
          maxRate,
          item: 'Desc_Water_C',
          itemName: 'Water',
          itemNameEs: 'Agua',
          itemIcon: 'Water.png',
          itemColor: '#38bdf8',
          rate: maxRate,
          points
        });
      }
    }
  }

  const durationSec = parsed.header?.playDurationSeconds || 0;
  const hours = Math.floor(durationSec / 3600);
  const mins = Math.floor((durationSec % 3600) / 60);

  // Cross-reference miners with 607 vanilla resource nodes
  const nodes = getDecoratedNodes(miners);
  const exploitedNodesCount = nodes.filter(n => n.isExploited).length;

  // Resolve Power Circuits & Factory Grid
  const resolvedCircuits = [];
  for (const c of rawCircuits) {
    const circuitId = c.properties?.mCircuitID?.value || 1;
    const comps = c.properties?.mComponents?.values || [];
    
    let capacity = 0;
    let production = 0;
    let consumptionNominal = 0;
    let consumptionCurrent = 0;
    const gensMap = new Map();
    const consMap = new Map();
    const processed = new Set();

    for (const comp of comps) {
      const parentName = powerConnections.get(comp.pathName);
      if (!parentName || processed.has(parentName)) continue;
      processed.add(parentName);

      const ent = entityMap.get(parentName);
      if (!ent) continue;

      if (ent.isGenerator) {
        const pInfo = powerInfos.get(parentName + '.powerInfo') || powerInfos.get(parentName + '.PowerInfo');
        const dynCap = pInfo?.mDynamicProductionCapacity?.value;
        const cap = dynCap || Math.abs(ent.spec.power);
        capacity += cap;
        const prod = ent.type.includes('Biomass') ? 0 : cap;
        production += prod;

        if (!gensMap.has(ent.type)) {
          gensMap.set(ent.type, { type: ent.type, nameEs: ent.spec.nameEs, icon: ent.spec.defaultIcon || 'Fuel.png', count: 0, capacityTotal: 0 });
        }
        const g = gensMap.get(ent.type);
        g.count++;
        g.capacityTotal += cap;
      } else {
        const basePower = ent.spec.power || 4;
        const adjusted = basePower * Math.pow(ent.potential || 1.0, 1.321928);
        consumptionNominal += adjusted;
        if (ent.isProducing) {
          consumptionCurrent += adjusted;
        }

        if (!consMap.has(ent.type)) {
          consMap.set(ent.type, { type: ent.type, nameEs: ent.spec.nameEs, icon: ent.spec.defaultIcon || 'Iron_Plate.png', count: 0, powerNominal: 0, powerCurrent: 0, producingCount: 0 });
        }
        const cn = consMap.get(ent.type);
        cn.count++;
        cn.powerNominal += adjusted;
        if (ent.isProducing) {
          cn.powerCurrent += adjusted;
          cn.producingCount++;
        }
      }
    }

    resolvedCircuits.push({
      circuitId,
      capacity: Math.round(capacity * 10) / 10,
      production: Math.round(production * 10) / 10,
      consumptionNominal: Math.round(consumptionNominal * 10) / 10,
      consumptionCurrent: Math.round(consumptionCurrent * 10) / 10,
      fuseTriggered: consumptionCurrent > capacity,
      generators: Array.from(gensMap.values()).sort((a,b) => b.capacityTotal - a.capacityTotal),
      consumers: Array.from(consMap.values()).sort((a,b) => b.powerNominal - a.powerNominal)
    });
  }

  resolvedCircuits.sort((a, b) => b.capacity - a.capacity);
  const primaryCircuit = resolvedCircuits[0] || null;

  const powerGrid = {
    capacity: primaryCircuit ? primaryCircuit.capacity : 0,
    production: primaryCircuit ? primaryCircuit.production : 0,
    consumptionNominal: primaryCircuit ? primaryCircuit.consumptionNominal : 0,
    consumptionCurrent: primaryCircuit ? primaryCircuit.consumptionCurrent : 0,
    fuseTriggered: primaryCircuit ? primaryCircuit.fuseTriggered : false,
    primaryCircuitId: primaryCircuit ? primaryCircuit.circuitId : 1,
    circuits: resolvedCircuits
  };

  cachedSave = {
    header: {
      sessionName: parsed.header?.sessionName || 'Satisfactory',
      saveVersion: parsed.header?.saveVersion || 60,
      buildVersion: parsed.header?.buildVersion || 502094,
      playTimeFormatted: `${hours}h ${mins}m`,
      playDurationSeconds: durationSec,
      saveDateTime: stat.mtime,
      fileSizeBytes: stat.size
    },
    counts: {
      totalObjects: allObjects.length,
      productionMachines: buildings.length,
      storages: storages.length,
      miners: miners.length,
      conveyorBelts: belts.length,
      pipelines: pipes.length,
      attachments: attachments.length,
      powerPoles: powerPoles.length,
      powerLines: powerLines.length,
      resourceNodesTotal: nodes.length,
      resourceNodesExploited: exploitedNodesCount,
      resourceNodesAvailable: nodes.length - exploitedNodesCount
    },
    buildings,
    storages,
    miners,
    belts,
    pipes,
    attachments,
    powerPoles,
    powerLines,
    specialBuildings,
    nodes,
    collectables,
    power: powerGrid
  };

  console.log(`[Parser] Parsed in ${Date.now() - startTime}ms! ${buildings.length} machines, ${attachments.length} splitters/mergers, ${powerLines.length} power lines, ${belts.length} belts, ${pipes.length} pipes, ${exploitedNodesCount}/${nodes.length} nodes mined.`);
  return cachedSave;
}

/**
 * Deduplicates machine and storage assignments across overlapping zones.
 */
function getZoneAssignments(zones, buildings = [], storages = []) {
  const validZones = (zones || []).filter(z => z && z.bounds);
  const zoneMap = {};
  for (const z of validZones) {
    zoneMap[z.id] = { machines: [], storages: [], overlappingCount: 0 };
  }
  if (validZones.length === 0) return zoneMap;

  const zoneMeta = validZones.map((z, idx) => {
    const w = Math.max(0, (z.bounds.maxX || 0) - (z.bounds.minX || 0));
    const h = Math.max(0, (z.bounds.maxY || 0) - (z.bounds.minY || 0));
    return {
      zone: z,
      id: z.id,
      index: idx,
      area: w * h,
      cleanItem: (z.item || '').toLowerCase().replace(/_/g, '')
    };
  });

  function findBestZone(x, y, entityOutputs = []) {
    const candidates = zoneMeta.filter(zm => {
      const b = zm.zone.bounds;
      return x >= b.minX && x <= b.maxX && y >= b.minY && y <= b.maxY;
    });

    if (candidates.length === 0) return null;
    if (candidates.length === 1) return candidates[0].zone;

    candidates.sort((a, b) => {
      let aAffinity = 1;
      let bAffinity = 1;

      if (a.cleanItem) {
        const matchesA = entityOutputs.some(out => {
          const cOut = ((out.item || out.name || '') + '').toLowerCase().replace(/_/g, '');
          return cOut === a.cleanItem || cOut.includes(a.cleanItem) || a.cleanItem.includes(cOut);
        });
        aAffinity = matchesA ? 2 : 0;
      }

      if (b.cleanItem) {
        const matchesB = entityOutputs.some(out => {
          const cOut = ((out.item || out.name || '') + '').toLowerCase().replace(/_/g, '');
          return cOut === b.cleanItem || cOut.includes(b.cleanItem) || b.cleanItem.includes(cOut);
        });
        bAffinity = matchesB ? 2 : 0;
      }

      if (aAffinity !== bAffinity) return bAffinity - aAffinity;
      if (a.area !== b.area) return a.area - b.area;
      return a.index - b.index;
    });

    const chosen = candidates[0].zone;
    for (let i = 1; i < candidates.length; i++) {
      if (zoneMap[candidates[i].id]) {
        zoneMap[candidates[i].id].overlappingCount++;
      }
    }
    return chosen;
  }

  for (const b of buildings) {
    if (b.x === undefined || b.y === undefined) continue;
    const best = findBestZone(b.x, b.y, b.outputs || []);
    if (best && zoneMap[best.id]) {
      zoneMap[best.id].machines.push(b);
    }
  }

  for (const s of storages) {
    if (s.x === undefined || s.y === undefined) continue;
    const best = findBestZone(s.x, s.y, []);
    if (best && zoneMap[best.id]) {
      zoneMap[best.id].storages.push(s);
    }
  }

  return zoneMap;
}

/**
 * Cross-references all buildings in the save with the user's defined zones without duplicate machine counts.
 */
function calculateMetrics(saveData, zones = []) {
  if (!saveData || !saveData.buildings) return { global: {}, zones: {} };

  const globalRates = {};
  for (const b of saveData.buildings) {
    for (const out of b.outputs) {
      if (!globalRates[out.item]) {
        globalRates[out.item] = {
          name: out.name,
          production_nominal: 0,
          machines_count: 0,
          zones_breakdown: {}
        };
      }
      globalRates[out.item].production_nominal += out.rate;
      globalRates[out.item].machines_count += 1;
    }
  }

  const assignments = getZoneAssignments(zones, saveData.buildings || [], saveData.storages || []);
  const zoneMetrics = {};

  for (const zone of zones) {
    if (!zone || !zone.bounds) continue;
    const assigned = assignments[zone.id] || { machines: [], storages: [], overlappingCount: 0 };
    const machinesInZone = assigned.machines;
    const storagesInZone = assigned.storages;

    const production = {};
    const consumption = {};

    for (const b of machinesInZone) {
      for (const out of b.outputs) {
        if (!production[out.item]) {
          production[out.item] = { name: out.name, rate: 0, count: 0 };
        }
        production[out.item].rate += out.rate;
        production[out.item].count += 1;

        if (globalRates[out.item]) {
          globalRates[out.item].zones_breakdown[zone.name] = (globalRates[out.item].zones_breakdown[zone.name] || 0) + out.rate;
        }
      }

      for (const inp of b.inputs) {
        if (!consumption[inp.item]) {
          consumption[inp.item] = { name: inp.name, rate: 0 };
        }
        consumption[inp.item].rate += inp.rate;
      }
    }

    zoneMetrics[zone.id] = {
      zoneId: zone.id,
      zoneName: zone.name,
      assignedItem: zone.item,
      color: zone.color,
      totalMachines: machinesInZone.length,
      totalStorages: storagesInZone.length,
      overlappingCount: assigned.overlappingCount,
      production,
      consumption
    };
  }

  return {
    last_sync: new Date().toISOString(),
    session: saveData.header,
    global: globalRates,
    zones: zoneMetrics,
    power: saveData.power || null
  };
}

module.exports = {
  parseSaveFile,
  calculateMetrics,
  getDecoratedNodes
};
