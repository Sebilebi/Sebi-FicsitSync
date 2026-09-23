const { Jimp } = require('jimp');
const https = require('https');
const path = require('path');
const fs = require('fs');

function downloadTile(layer, z, x, y) {
  const url = `https://static.satisfactory-calculator.com/imgMap/${layer}/Stable/${z}/${x}/${y}.png`;
  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return resolve(null);
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });
    req.on('error', () => resolve(null));
    req.setTimeout(8000, () => { req.destroy(); resolve(null); });
  });
}

async function stitchLayerZ4(layerName, outFilename) {
  console.log(`\n=== Stitching ${layerName} (z=4, 10x10 tiles = 2560x2560) ===`);
  const z = 4;
  const grid = 10;
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
  const concurrency = 10;
  for (let i = 0; i < tasks.length; i += concurrency) {
    const batch = tasks.slice(i, i + concurrency);
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
  await stitchLayerZ4('realisticLayer', 'map_realistic.jpg');
  await stitchLayerZ4('gameLayer', 'map_topo.jpg');
  console.log('Finished updating both base maps to 2560x2560!');
}

main().catch(console.error);
