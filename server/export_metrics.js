const fs = require('fs');
const path = require('path');
const { parseSaveFile, calculateMetrics } = require('./parser');

const ROOT_DIR = path.join(__dirname, '..');
const zonesPath = path.join(ROOT_DIR, 'data', 'zones.json');
const outMetricsPath = path.join(ROOT_DIR, 'data', 'metrics.json');
const outBuildingsPath = path.join(ROOT_DIR, 'data', 'buildings.json');
const outNodesPath = path.join(ROOT_DIR, 'data', 'nodes.json');

// FileBrowser config — same creds as deploy_to_server.js
const FB_BASE = 'http://192.168.1.230:8080';
const FB_USER = 'admin';
const FB_PASS = 'homelab22';
const FB_SOURCE = 'srv';
const SAVES_PATH = '/saved/server';

async function fetchLatestSave() {
  // 1. Auth
  console.log('[Export] Autenticando con FileBrowser...');
  const loginRes = await fetch(`${FB_BASE}/api/auth/login?username=${encodeURIComponent(FB_USER)}`, {
    method: 'POST',
    headers: { 'X-Password': encodeURIComponent(FB_PASS), 'X-Secret': '' }
  });
  if (!loginRes.ok) throw new Error(`Auth failed: ${loginRes.status}`);
  const token = (await loginRes.text()).trim();
  const headers = { 'Cookie': `filebrowser_quantum_jwt=${token}` };

  // 2. List saves, pick newest .sav by modified date
  console.log('[Export] Listando saves en el servidor...');
  const listRes = await fetch(`${FB_BASE}/api/resources?source=${FB_SOURCE}&path=${encodeURIComponent(SAVES_PATH)}`, { headers });
  if (!listRes.ok) throw new Error(`List failed: ${listRes.status}`);
  const data = await listRes.json();
  const savFiles = (data.files || [])
    .filter(f => f.name.endsWith('.sav'))
    .sort((a, b) => new Date(b.modified) - new Date(a.modified));

    if (savFiles.length === 0) throw new Error('No .sav files found on server');

  let newest = savFiles[0];
  if (process.env.TARGET_SAVE_FILE) {
    const target = savFiles.find(f => f.name === process.env.TARGET_SAVE_FILE);
    if (target) {
      newest = target;
      console.log(`[Export] Forzando save seleccionado: ${newest.name}`);
    } else {
      console.warn(`[Export] Target save ${process.env.TARGET_SAVE_FILE} no encontrado, usando el más reciente.`);
    }
  }

  console.log(`[Export] Descargando save: ${newest.name} (${(newest.size / 1024).toFixed(0)} KB, mod: ${newest.modified})`);

  // 3. Download the raw file via /api/resources/download?file=<fullpath>
  const dlPath = `${SAVES_PATH}/${newest.name}`;
  console.log(`[Export] Descargando ${newest.name}...`);
  const dlRes = await fetch(`${FB_BASE}/api/resources/download?source=${FB_SOURCE}&file=${encodeURIComponent(dlPath)}`, { headers });
  if (!dlRes.ok) throw new Error(`Download failed: ${dlRes.status}`);
  const buf = Buffer.from(await dlRes.arrayBuffer());

  const localPath = path.join(ROOT_DIR, newest.name);
  fs.writeFileSync(localPath, buf);
  console.log(`[Export] Guardado localmente: ${localPath} (${buf.length} bytes)`);
  return localPath;
}

async function main() {
  let savePath;

  if (process.env.SAV_PATH) {
    // Manual override via env var
    savePath = process.env.SAV_PATH;
    console.log('[Export] Usando SAV_PATH del entorno:', savePath);
  } else {
    // Auto-fetch from server
    try {
      savePath = await fetchLatestSave();
    } catch (err) {
      // Fallback to local file if server unreachable
      savePath = path.join(ROOT_DIR, 'test_autosave_0.sav');
      console.warn(`[Export] ⚠️ No se pudo descargar del servidor: ${err.message}`);
      console.warn(`[Export] Usando fallback local: ${savePath}`);
    }
  }

  console.log('[Export] Parsing save:', savePath);
  const save = parseSaveFile(savePath);

  let zones = [];
  if (fs.existsSync(zonesPath)) {
    zones = JSON.parse(fs.readFileSync(zonesPath, 'utf8'));
  }

  const metrics = calculateMetrics(save, zones);
  fs.writeFileSync(outMetricsPath, JSON.stringify(metrics, null, 2), 'utf8');
  console.log('[Export] Wrote static metrics to:', outMetricsPath);

  const buildingsData = {
    buildings: save.buildings || [],
    storages: save.storages || [],
    miners: save.miners || [],
    belts: save.belts || [],
    pipes: save.pipes || [],
    attachments: save.attachments || [],
    powerPoles: save.powerPoles || [],
    powerLines: save.powerLines || [],
    specialBuildings: save.specialBuildings || [],
    nodes: save.nodes || [],
    collectables: save.collectables || []
  };
  fs.writeFileSync(outBuildingsPath, JSON.stringify(buildingsData, null, 2), 'utf8');
  console.log('[Export] Wrote static buildings to:', outBuildingsPath);

  fs.writeFileSync(outNodesPath, JSON.stringify(save.nodes || [], null, 2), 'utf8');
  console.log('[Export] Wrote static nodes to:', outNodesPath);
  console.log('[Export] Done!');
}

main().catch(err => {
  console.error('[Export] ❌ ERROR:', err.message);
  process.exit(1);
});
