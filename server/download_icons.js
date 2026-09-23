const https = require('https');
const fs = require('fs');
const path = require('path');

const icons = [
  { name: 'Bauxite.png', url: 'https://satisfactory.wiki.gg/images/0/05/Bauxite.png' },
  { name: 'Uranium.png', url: 'https://satisfactory.wiki.gg/images/7/7b/Uranium.png' },
  { name: 'SAM.png', url: 'https://satisfactory.wiki.gg/images/8/87/SAM.png' },
  { name: 'Nitrogen_Gas.png', url: 'https://satisfactory.wiki.gg/images/4/4f/Nitrogen_Gas.png' },
  { name: 'Water.png', url: 'https://satisfactory.wiki.gg/images/9/9d/Water.png' }
];

function download(item) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, '..', 'icons', item.name);
    if (fs.existsSync(filePath)) {
      console.log(`${item.name} already exists`);
      return resolve();
    }
    const file = fs.createWriteStream(filePath);
    const req = https.get(item.url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = new URL(res.headers.location, item.url).href;
        https.get(redirectUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res2) => {
          res2.pipe(file);
          file.on('finish', () => { file.close(); console.log(`Downloaded ${item.name}`); resolve(); });
        }).on('error', reject);
      } else if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => { file.close(); console.log(`Downloaded ${item.name}`); resolve(); });
      } else {
        reject(new Error(`Failed with status ${res.statusCode}`));
      }
    });
    req.on('error', reject);
  });
}

(async () => {
  for (const item of icons) {
    try {
      await download(item);
    } catch (err) {
      console.error(`Error downloading ${item.name}:`, err.message);
    }
  }
})();
