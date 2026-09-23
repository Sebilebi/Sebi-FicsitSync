const fs = require('fs');
const path = require('path');
const { Parser } = require('@etothepii/satisfactory-file-parser');

const savePath = path.join(__dirname, '..', 'test_autosave_0.sav');
console.log('Reading save from:', savePath);

try {
  const fileBuffer = fs.readFileSync(savePath);
  console.log('File read successfully. Size:', fileBuffer.byteLength, 'bytes');

  console.log('Parsing save file...');
  const startTime = Date.now();
  const parsed = Parser.ParseSave('test_autosave_0', fileBuffer.buffer);
  console.log(`Parsed in ${Date.now() - startTime}ms!`);

  console.log('Save Header:');
  console.log({
    saveHeaderType: parsed.header?.saveHeaderType,
    saveVersion: parsed.header?.saveVersion,
    buildVersion: parsed.header?.buildVersion,
    mapName: parsed.header?.mapName,
    mapOptions: parsed.header?.mapOptions,
    sessionName: parsed.header?.sessionName,
    playDurationSeconds: parsed.header?.playDurationSeconds,
    saveDateTime: parsed.header?.saveDateTime
  });

  console.log('Parsed keys:', Object.keys(parsed));
  if (parsed.levels) {
    console.log('Levels count:', Object.keys(parsed.levels).length);
    for (const lvl of Object.keys(parsed.levels)) {
      console.log('  Level:', lvl, 'objects:', parsed.levels[lvl]?.objects?.length);
    }
  }


  let allObjects = [];
  for (const [lvlName, lvl] of Object.entries(parsed.levels || {})) {
    if (lvl && Array.isArray(lvl.objects)) {
      allObjects.push(...lvl.objects);
    }
  }
  if (Array.isArray(parsed.objects)) {
    allObjects.push(...parsed.objects);
  }

  console.log(`\n=== Total Objects across ALL levels: ${allObjects.length} ===`);

  const typeCounts = {};
  const buildables = [];

  for (const obj of allObjects) {
    const type = obj.typePath || obj.className || 'unknown';
    typeCounts[type] = (typeCounts[type] || 0) + 1;
    if (type.includes('Build_') || type.includes('Buildable') || type.includes('FGBuildable')) {
      buildables.push(obj);
    }
  }

  console.log(`\nTotal Buildables found: ${buildables.length}`);

  console.log('\nTop 30 object types:');
  const sorted = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]).slice(0, 30);
  for (const [t, c] of sorted) {
    console.log(`  ${c}: ${t}`);
  }

  console.log('\n=== Summary of Production Buildings in test_autosave_0.sav ===');
  const recipeCounts = {};
  const machineLocations = [];

  for (const b of buildables) {
    const type = b.typePath || '';
    if (type.includes('Smelter') || type.includes('Constructor') || type.includes('Assembler') || 
        type.includes('Manufacturer') || type.includes('Refinery') || type.includes('Foundry') ||
        type.includes('Packager') || type.includes('OilRefinery') || type.includes('Miner')) {
      
      const recipePath = b.properties?.mCurrentRecipe?.value?.pathName || 'No Recipe Configured';
      const recipeName = recipePath.split('.').pop() || recipePath;
      
      recipeCounts[recipeName] = (recipeCounts[recipeName] || 0) + 1;

      const pos = b.transform?.translation || b.translation;
      if (pos) {
        machineLocations.push({
          type: type.split('.').pop(),
          recipe: recipeName,
          x: pos.x,
          y: pos.y,
          z: pos.z,
          potential: b.properties?.mCurrentPotential?.value || 1.0
        });
      }
    }
  }

  console.log('\nRecipes in the save:');
  for (const [rec, count] of Object.entries(recipeCounts).sort((a,b) => b[1] - a[1])) {
    console.log(`  ${count}x ${rec}`);
  }

  console.log('\n=== Summary of Storage Containers in test_autosave_0.sav ===');
  const storages = buildables.filter(b => (b.typePath || '').includes('Storage'));
  console.log(`Found ${storages.length} storage objects.`);

  for (const s of storages.slice(0, 10)) {
    const pos = s.transform?.translation || s.translation;
    console.log(`\nStorage: ${s.typePath.split('.').pop()}`);
    console.log(`  Position: X: ${pos?.x?.toFixed(0)}, Y: ${pos?.y?.toFixed(0)}, Z: ${pos?.z?.toFixed(0)}`);
    console.log('  Properties:', Object.keys(s.properties || {}));
    if (s.properties?.mStorageInventory) {
      console.log('  mStorageInventory ref:', s.properties.mStorageInventory.value);
    }
  }

  // Let's find inventory components
  const inventories = allObjects.filter(o => (o.typePath || '').includes('FGInventoryComponent'));
  console.log(`\nTotal FGInventoryComponent objects: ${inventories.length}`);
  // Inspect a few inventory components
  for (const inv of inventories.slice(0, 5)) {
    if (inv.properties?.mInventoryStacks) {
      console.log('Inventory stacks sample:', JSON.stringify(inv.properties.mInventoryStacks, null, 2).slice(0, 300));
      break;
    }
  }




} catch (err) {
  console.error('Error parsing save:', err);
}
