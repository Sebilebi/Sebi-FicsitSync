const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'resourcePurity.py'), 'utf8');

const RESOURCE_META = {
  'Desc_OreIron_C': { name: 'Iron Ore', nameEs: 'Mineral de Hierro', color: '#5D6D7E', icon: 'Iron_Ore.png', type: 'solid' },
  'Desc_OreCopper_C': { name: 'Copper Ore', nameEs: 'Mineral de Cobre', color: '#E67E22', icon: 'Copper_Ore.png', type: 'solid' },
  'Desc_Stone_C': { name: 'Limestone', nameEs: 'Piedra Caliza', color: '#BDC3C7', icon: 'Limestone.png', type: 'solid' },
  'Desc_Coal_C': { name: 'Coal', nameEs: 'Carbón', color: '#2C3E50', icon: 'Coal.png', type: 'solid' },
  'Desc_LiquidOil_C': { name: 'Crude Oil', nameEs: 'Petróleo Crudo', color: '#1A252F', icon: 'Crude_Oil.png', type: 'liquid' },
  'Desc_OreGold_C': { name: 'Caterium Ore', nameEs: 'Mineral de Caterio', color: '#F1C40F', icon: 'Caterium_Ore.png', type: 'solid' },
  'Desc_RawQuartz_C': { name: 'Raw Quartz', nameEs: 'Cuarzo Puro', color: '#E74C3C', icon: 'Raw_Quartz.png', type: 'solid' },
  'Desc_Sulfur_C': { name: 'Sulfur', nameEs: 'Azufre', color: '#F39C12', icon: 'Sulfur.png', type: 'solid' },
  'Desc_OreBauxite_C': { name: 'Bauxite', nameEs: 'Bauxita', color: '#BA4A00', icon: 'Bauxite.png', type: 'solid' },
  'Desc_OreUranium_C': { name: 'Uranium', nameEs: 'Uranio', color: '#2ECC71', icon: 'Uranium.png', type: 'solid' },
  'Desc_SAM_C': { name: 'SAM', nameEs: 'Mineral SAM', color: '#9B59B6', icon: 'SAM.png', type: 'solid' },
  'Desc_NitrogenGas_C': { name: 'Nitrogen Gas', nameEs: 'Gas Nitrógeno', color: '#3498DB', icon: 'Nitrogen_Gas.png', type: 'gas' },
  'Desc_Water_C': { name: 'Water Well', nameEs: 'Agua de Pozo', color: '#2980B9', icon: 'Water.png', type: 'liquid' },
  'Desc_Geyser_C': { name: 'Steam Geyser', nameEs: 'Géiser de Vapor', color: '#16A085', icon: 'Geyser.png', type: 'gas' }
};

const lines = content.split(/\r?\n/);
const nodes = [];

// Regex: "path": ("resource_class", Purity.PURITY, (x, y, z))
const regex = /"([^"]+)":\s*\(\s*"([^"]+)",\s*Purity\.([A-Z]+),\s*\(\s*([-\d.]+),\s*([-\d.]+),\s*([-\d.]+)\s*\)/;

for (const line of lines) {
  const match = line.match(regex);
  if (match) {
    const fullPath = match[1];
    const resourceClass = match[2];
    const purity = match[3];
    const x = parseFloat(match[4]);
    const y = parseFloat(match[5]);
    const z = parseFloat(match[6]);

    // Extract clean ID from full path, e.g. "BP_ResourceNode100"
    const idMatch = fullPath.match(/([A-Za-z0-9_]+)$/);
    const id = idMatch ? idMatch[1] : fullPath;

    const meta = RESOURCE_META[resourceClass] || {
      name: resourceClass.replace('Desc_', '').replace('_C', ''),
      nameEs: resourceClass.replace('Desc_', '').replace('_C', ''),
      color: '#95A5A6',
      icon: 'Iron_Ore.png',
      type: 'solid'
    };

    // Calculate base yield per minute (for normal miner Mk1 at 100%)
    let baseRate = 60;
    if (purity === 'IMPURE') baseRate = 30;
    else if (purity === 'PURE') baseRate = 120;

    if (meta.type === 'liquid') {
      // Oil: Impure 60 m3, Normal 120 m3, Pure 240 m3
      baseRate *= 2;
    }

    nodes.push({
      id,
      fullPath,
      resourceClass,
      resourceName: meta.name,
      resourceNameEs: meta.nameEs,
      color: meta.color,
      icon: meta.icon,
      type: meta.type,
      purity,
      baseRate,
      x: Math.round(x),
      y: Math.round(y),
      z: Math.round(z),
      isExploited: false,
      miner: null
    });
  }
}

console.log(`Parsed ${nodes.length} total resource nodes.`);

// Write to data/resource_nodes.json
const outPath = path.join(__dirname, '..', 'data', 'resource_nodes.json');
fs.writeFileSync(outPath, JSON.stringify(nodes, null, 2), 'utf8');
console.log(`Saved to ${outPath}`);

// Summary by resource
const summary = {};
for (const n of nodes) {
  summary[n.resourceName] = (summary[n.resourceName] || 0) + 1;
}
console.log('Summary:', summary);
