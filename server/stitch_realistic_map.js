const { Jimp } = require('jimp');
const https = require('https');
const path = require('path');
const fs = require('fs');

async function downloadTile(z, x, y) {
  const url = `https://static.satisfactory-calculator.com/imgMap/realisticLayer/Stable/${z}/${x}/${y}.png`;
  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        console.warn(`Tile ${z}/${x}/${y} status: ${res.statusCode}`);
        return resolve(null);
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', (err) => {
      console.warn(`Tile ${z}/${x}/${y} error:`, err.message);
      resolve(null);
    });
  });
}

async function main() {
  console.log('Downloading and stitching realistic satellite map (zoom 3: 8x8 tiles = 2048x2048)...');
  const z = 3;
  const numTiles = 8;
  const tileSize = 256;
  const canvas = new Jimp({ width: numTiles * tileSize, height: numTiles * tileSize, color: 0x000000ff });

  let doneCount = 0;
  for (let y = 0; y < numTiles; y++) {
    for (let x = 0; x < numTiles; x++) {
      const buf = await downloadTile(z, x, y);
      if (buf) {
        const tile = await Jimp.read(buf);
        canvas.composite(tile, x * tileSize, y * tileSize);
      }
      doneCount++;
      if (doneCount % 8 === 0) {
        process.stdout.write(`Downloaded ${doneCount}/${numTiles * numTiles} tiles...\r`);
      }
    }
  }

  console.log('\nAll tiles downloaded. Saving images/map_realistic.jpg...');
  const outPath = path.join(__dirname, '..', 'images', 'map_realistic.jpg');
  await canvas.write(outPath);
  console.log(`Saved realistic map to ${outPath} (${fs.statSync(outPath).size} bytes)`);

  // Also ensure images/map_topo.jpg exists
  const topoPath = path.join(__dirname, '..', 'images', 'map_topo.jpg');
  const bgPath = path.join(__dirname, '..', 'images', 'map_background.jpg');
  if (fs.existsSync(bgPath) && !fs.existsSync(topoPath)) {
    fs.copyFileSync(bgPath, topoPath);
    console.log('Copied map_background.jpg to images/map_topo.jpg');
  }
}

main().catch(console.error);
