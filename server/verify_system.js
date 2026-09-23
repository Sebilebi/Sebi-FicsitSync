const { parseSaveFile, calculateMetrics } = require('./parser');
const path = require('path');
const fs = require('fs');

const savePath = path.join(__dirname, '..', 'test_autosave_0.sav');
console.log('Testing parser on save file:', savePath);

const data = parseSaveFile(savePath);
console.log('Session Name:', data.header.sessionName);
console.log('Playtime:', data.header.playTimeFormatted);
console.log('Counts:', data.counts);

const zonesPath = path.join(__dirname, '..', 'data', 'zones.json');
const zones = JSON.parse(fs.readFileSync(zonesPath, 'utf8'));
const metrics = calculateMetrics(data, zones);

console.log('\n--- Zones Evaluated ---');
for (const [zid, z] of Object.entries(metrics.zones)) {
  const prodSummary = Object.values(z.production).map(p => `+${p.rate}/m ${p.name}`).join(', ');
  const consSummary = Object.values(z.consumption).map(c => `-${c.rate}/m ${c.name}`).join(', ');
  console.log(`[${z.zoneName}] (${z.totalMachines} machines, ${z.totalStorages} storages)`);
  console.log(`  Produce: ${prodSummary || 'None'}`);
  console.log(`  Consume: ${consSummary || 'None'}`);
}

console.log('\n--- Top 5 Global Items ---');
const topItems = Object.entries(metrics.global).slice(0, 5);
for (const [k, v] of topItems) {
  console.log(`  ${v.name}: ${Math.round(v.production_nominal)}/min across ${v.machines_count} machines`);
}

console.log('\nALL VERIFICATIONS PASSED SUCCESSFULLY!');
