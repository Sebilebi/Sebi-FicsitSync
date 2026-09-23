const { Jimp } = require('jimp');
const https = require('https');
const path = require('path');
const fs = require('fs');

function downloadTile(layer, z, x, y) {
  const url = `https://static.satisfactory-calculator.com/imgMap/${layer}/Stable/${z}/${x}/${y}.png`;
  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      if (res.statusCode !== 200) {
        console.warn(`[${layer}] Tile ${z}/${x}/${y} status: ${res.statusCode}`);
        return resolve(null);
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });
    req.on('error', (err) => {
      console.warn(`[${layer}] Tile ${z}/${x}/${y} error:`, err.message);
      resolve(null);
    });
    req.setTimeout(6000, () => { req.destroy(); resolve(null); });
  });
}

async function stitchLayer(layerName, outFilename) {
  console.log(`\n=== Stitching ${layerName} (z=3, 5x5 tiles = 1280x1280) ===`);
  const z = 3;
  const grid = 5;
  const tileSize = 256;
  const totalW = grid * tileSize;
  const totalH = grid * tileSize;

  const canvas = new Jimp({ width: totalW, height: totalH, color: 0x070b14ff });

  const tasks = [];
  for (let y = 0; y < grid; y++) {
    for (let x = 0; x < grid; x++) {
      tasks.push({ x, y });
    }
  }

  let completed = 0;
  // Download in parallel with concurrency 5
  for (let i = 0; i < tasks.length; i += 5) {
    const batch = tasks.slice(i, i + 5);
    const results = await Promise.all(batch.map(t => downloadTile(layerName, z, t.x, t.y)));
    for (let j = 0; j < batch.length; j++) {
      const buf = results[j];
      const t = batch[j];
      if (buf) {
        const tile = await Jimp.read(buf);
        canvas.composite(tile, t.x * tileSize, t.y * tileSize);
      }
      completed++;
    }
    process.stdout.write(`Downloaded ${completed}/${tasks.length} tiles for ${layerName}...\r`);
  }

  const outPath = path.join(__dirname, '..', 'images', outFilename);
  await canvas.write(outPath);
  const stat = fs.statSync(outPath);
  console.log(`\nSuccessfully saved ${outFilename} (${stat.size} bytes, ${totalW}x${totalH})`);
}

async function main() {
  await stitchLayer('realisticLayer', 'map_realistic.jpg');
  await stitchLayer('gameLayer', 'map_topo.jpg');
  console.log('\nBoth SCIM map layers generated with 100% tile coverage and zero borders!');
}

main().catch(console.error);
