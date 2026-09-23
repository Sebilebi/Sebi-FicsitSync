const fs = require('fs');

const FB_BASE = 'http://192.168.1.230:8080';
const FB_USER = 'admin';
const FB_PASS = 'homelab22';

const filesToUpload = [
  { local: 'js/items.js', remote: '/web/js/items.js' },
  { local: 'js/collectibles.js', remote: '/web/js/collectibles.js' },
  { local: 'js/map.js', remote: '/web/js/map.js' },
  { local: 'js/app.js', remote: '/web/js/app.js' },
  { local: 'index.html', remote: '/web/index.html' },
  { local: 'css/style.css', remote: '/web/css/style.css' },
  { local: 'server/parser.js', remote: '/web/server/parser.js' },
  { local: 'server/export_metrics.js', remote: '/web/server/export_metrics.js' },
  { local: 'server/sync_daemon.js', remote: '/web/server/sync_daemon.js' },
  { local: 'server/recipe_map.js', remote: '/web/server/recipe_map.js' },
  { local: 'server/item_metadata.json', remote: '/web/server/item_metadata.json' }
];

async function deploy() {
  const loginRes = await fetch(FB_BASE + '/api/auth/login?username=' + FB_USER, { method: 'POST', headers: { 'X-Password': FB_PASS, 'X-Secret': '' } });
  const authToken = (await loginRes.text()).trim();
  const headers = { 'Cookie': 'filebrowser_quantum_jwt=' + authToken };

  for (const f of filesToUpload) {
    const content = fs.readFileSync(f.local);
    const contentType = f.local.endsWith('.json') ? 'application/json' : 'application/javascript';
    const upRes = await fetch(FB_BASE + '/api/resources?source=srv&path=' + f.remote + '&override=true', {
      method: 'POST',
      headers: { ...headers, 'Content-Type': contentType },
      body: content
    });
    console.log(`Uploaded ${f.local} -> ${f.remote}: ${upRes.status}`);
  }
}
deploy();
