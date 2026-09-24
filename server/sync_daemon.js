const fs = require('fs');
const path = require('path');
const http = require('http');
const { parseSaveFile, calculateMetrics } = require('./parser');

const ROOT_DIR = path.join(__dirname, '..');
const ZONES_PATH = path.join(ROOT_DIR, 'data', 'zones.json');
const FB_BASE = process.env.FB_BASE || 'http://192.168.1.230:8080';
const FB_USER = process.env.FB_USER || 'admin';
const FB_PASS = process.env.FB_PASS || 'homelab22';
const FB_SOURCE = 'srv';
const SAVES_PATH = '/saved/server';
const PORT = process.env.SYNC_PORT || 8086;
const POLL_INTERVAL_MS = 10000; // 10 seconds

let lastProcessedSave = null;
let lastProcessedTime = null;
let lastSyncTimestamp = null;
let isSyncing = false;
let authToken = null;
let tokenExpiresAt = 0;

async function getAuthHeaders() {
  const now = Date.now();
  if (authToken && now < tokenExpiresAt) {
    return { 'Cookie': `filebrowser_quantum_jwt=${authToken}` };
  }

  const loginRes = await fetch(`${FB_BASE}/api/auth/login?username=${encodeURIComponent(FB_USER)}`, {
    method: 'POST',
    headers: { 'X-Password': encodeURIComponent(FB_PASS), 'X-Secret': '' }
  });

  if (!loginRes.ok) {
    throw new Error(`FileBrowser Auth Failed: ${loginRes.status} ${loginRes.statusText}`);
  }

  authToken = (await loginRes.text()).trim();
  tokenExpiresAt = now + 1000 * 60 * 60; // 1 hour
  return { 'Cookie': `filebrowser_quantum_jwt=${authToken}` };
}

async function performSync(force = false, targetSaveName = null) {
  if (isSyncing) {
    console.log('[Sync Daemon] Ya hay una sincronización en curso. Esperando...');
    return { status: 'busy' };
  }

  isSyncing = true;
  const startTime = Date.now();

  try {
    const headers = await getAuthHeaders();

    // 1. Listar archivos en /srv/saved/server
    const listRes = await fetch(`${FB_BASE}/api/resources?source=${FB_SOURCE}&path=${encodeURIComponent(SAVES_PATH)}`, { headers });
    if (!listRes.ok) throw new Error(`Error listando saves: ${listRes.status}`);

    const listData = await listRes.json();
    const savFiles = (listData.files || [])
      .filter(f => f.name.endsWith('.sav'))
      .sort((a, b) => new Date(b.modified) - new Date(a.modified));

    if (savFiles.length === 0) {
      console.warn('[Sync Daemon] No se encontraron archivos .sav en', SAVES_PATH);
      return { status: 'no_saves_found' };
    }

    global.recentSaves = savFiles.map(f => ({ name: f.name, modified: f.modified, size: f.size }));

    console.log('[Sync Daemon] Archivos más recientes encontrados:');
    savFiles.slice(0, 3).forEach((f, i) => {
      console.log(`  ${i+1}. ${f.name} (Modificado: ${new Date(f.modified).toLocaleString()})`);
    });

    const targetSave = targetSaveName ? savFiles.find(f => f.name === targetSaveName) : null;
    if (targetSaveName && !targetSave) {
      console.warn(`[Sync Daemon] Save solicitado "${targetSaveName}" no encontrado.`);
      return { status: 'not_found', error: `Save "${targetSaveName}" no encontrado` };
    }

    const newest = targetSave || savFiles[0];

    // Comprobar si ya fue procesado y no es forzado ni dirigido
    if (!force && !targetSaveName && lastProcessedSave === newest.name && lastProcessedTime === newest.modified) {
      // Sin cambios
      return { status: 'unchanged', save: newest.name };
    }

    console.log(`\n======================================================`);
    console.log(`[Sync Daemon] 🔄 ${force ? 'FORZANDO' : 'DETECTADO'} NUEVO SAVE: ${newest.name}`);
    console.log(`📅 Modificado: ${newest.modified} | Tamaño: ${(newest.size / 1024).toFixed(0)} KB`);
    console.log(`======================================================`);

    // 2. Descargar el archivo .sav
    const savRemotePath = `${SAVES_PATH}/${newest.name}`;
    const dlRes = await fetch(`${FB_BASE}/api/resources/download?source=${FB_SOURCE}&file=${encodeURIComponent(savRemotePath)}`, { headers });
    if (!dlRes.ok) throw new Error(`Error descargando ${newest.name}: ${dlRes.status}`);

    const savBuffer = Buffer.from(await dlRes.arrayBuffer());
    const localSavPath = path.join(ROOT_DIR, newest.name);
    fs.writeFileSync(localSavPath, savBuffer);
    console.log(`[Sync Daemon] Descargado localmente (${savBuffer.length} bytes)`);

    // 3. Parsear
    console.log(`[Sync Daemon] Parseando partida con @etothepii/satisfactory-file-parser...`);
    const parsedSave = parseSaveFile(localSavPath);

    let zones = [];
    if (fs.existsSync(ZONES_PATH)) {
      try {
        zones = JSON.parse(fs.readFileSync(ZONES_PATH, 'utf8'));
      } catch (e) {}
    }

    const syncDate = new Date().toISOString();
    const metrics = calculateMetrics(parsedSave, zones);
    metrics.active_save_file = newest.name;
    metrics.save_modified = newest.modified;
    metrics.last_sync = syncDate;
    metrics.recentSaves = savFiles.slice(0, 20).map(f => ({ name: f.name, modified: f.modified, size: f.size }));

    const buildingsData = {
      active_save_file: newest.name,
      save_modified: newest.modified,
      last_sync: syncDate,
      recentSaves: savFiles.slice(0, 20).map(f => ({ name: f.name, modified: f.modified, size: f.size })),
      buildings: parsedSave.buildings || [],
      storages: parsedSave.storages || [],
      miners: parsedSave.miners || [],
      belts: parsedSave.belts || [],
      pipes: parsedSave.pipes || [],
      attachments: parsedSave.attachments || [],
      powerPoles: parsedSave.powerPoles || [],
      powerLines: parsedSave.powerLines || [],
      specialBuildings: parsedSave.specialBuildings || [],
      nodes: parsedSave.nodes || [],
      collectables: parsedSave.collectables || [],
      power: parsedSave.power || null
    };

    const nodesData = parsedSave.nodes || [];

    // Guardar copia local en data/
    fs.writeFileSync(path.join(ROOT_DIR, 'data', 'metrics.json'), JSON.stringify(metrics, null, 2), 'utf8');
    fs.writeFileSync(path.join(ROOT_DIR, 'data', 'buildings.json'), JSON.stringify(buildingsData, null, 2), 'utf8');
    fs.writeFileSync(path.join(ROOT_DIR, 'data', 'nodes.json'), JSON.stringify(nodesData, null, 2), 'utf8');

    // 4. Subir directamente a /srv/web/data/ en el servidor
    console.log(`[Sync Daemon] Subiendo JSONs actualizados a /srv/web/data/...`);
    const uploads = [
      { path: '/web/data/metrics.json', content: JSON.stringify(metrics) },
      { path: '/web/data/buildings.json', content: JSON.stringify(buildingsData) },
      { path: '/web/data/nodes.json', content: JSON.stringify(nodesData) }
    ];

    for (const u of uploads) {
      const upRes = await fetch(`${FB_BASE}/api/resources?source=${FB_SOURCE}&path=${encodeURIComponent(u.path)}&override=true`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: u.content
      });
      if (!upRes.ok) {
        console.warn(`[Sync Daemon] Aviso al subir ${u.path}: ${upRes.status}`);
      }
    }

    lastProcessedSave = newest.name;
    lastProcessedTime = newest.modified;
    lastSyncTimestamp = syncDate;

    const elapsed = Date.now() - startTime;
    console.log(`[Sync Daemon] ✅ Sincronización exitosa en ${elapsed}ms!`);
    console.log(`📊 Máquinas: ${buildingsData.buildings.length} | Cintas: ${buildingsData.belts.length} | Red eléctrica: ${buildingsData.powerLines.length}\n`);

    return {
      status: 'synced',
      save: newest.name,
      modified: newest.modified,
      machines: buildingsData.buildings.length,
      elapsedMs: elapsed
    };
  } catch (err) {
    console.error('[Sync Daemon] ❌ Error durante la sincronización:', err.message);
    return { status: 'error', error: err.message };
  } finally {
    isSyncing = false;
  }
}

// Servidor HTTP para recibir solicitudes de forzar recarga desde el navegador
const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (url.pathname === '/api/sync/force' || url.pathname === '/sync') {
    console.log(`[HTTP API] Recibida petición de FORZAR RECARGA desde ${req.socket.remoteAddress}`);
    const result = await performSync(true);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
    return;
  }

  
  if (url.pathname === "/api/saves") {
    try {
      const headers = await getAuthHeaders();
      const listRes = await fetch(`${FB_BASE}/api/resources?source=${FB_SOURCE}&path=${encodeURIComponent(SAVES_PATH)}`, { headers });
      if (!listRes.ok) throw new Error(`Error listando saves: ${listRes.status}`);
      const listData = await listRes.json();
      const savFiles = (listData.files || [])
        .filter(f => f.name.endsWith('.sav'))
        .sort((a, b) => new Date(b.modified) - new Date(a.modified))
        .map(f => ({ name: f.name, modified: f.modified, size: f.size }));
      
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(savFiles.length > 0 ? savFiles : (global.recentSaves || [{name: lastProcessedSave}])));
    } catch(err) {
      console.error("[HTTP API] Error fetching saves:", err.message);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(global.recentSaves || [{name: lastProcessedSave}]));
    }
    return;
  }

  if (url.pathname === '/api/saves/select' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const data = JSON.parse(body || '{}');
        const saveName = data.name;
        console.log(`[HTTP API] Recibida solicitud para cargar save específico: ${saveName}`);
        const result = await performSync(true, saveName);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err) {
        console.error('[HTTP API] Error seleccionando save:', err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', error: err.message }));
      }
    });
    return;
  }

  if (url.pathname === '/api/zones') {
    if (req.method === 'GET') {
      let zones = [];
      if (fs.existsSync(ZONES_PATH)) {
        try { zones = JSON.parse(fs.readFileSync(ZONES_PATH, 'utf8')); } catch (e) {}
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(zones));
      return;
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          const zonesData = JSON.parse(body || '[]');
          console.log(`[HTTP API] Guardando ${zonesData.length} zonas en ${ZONES_PATH}...`);
          fs.writeFileSync(ZONES_PATH, JSON.stringify(zonesData, null, 2), 'utf8');

          // Subir a FileBrowser en /web/data/zones.json
          try {
            const headers = await getAuthHeaders();
            await fetch(`${FB_BASE}/api/resources?source=${FB_SOURCE}&path=/web/data/zones.json&override=true`, {
              method: 'POST',
              headers: { ...headers, 'Content-Type': 'application/json' },
              body: JSON.stringify(zonesData, null, 2)
            });
            console.log('[Sync Daemon] Subido /web/data/zones.json a FileBrowser correctamente.');
          } catch (e) {
            console.warn('[Sync Daemon] Aviso al subir zones.json a FileBrowser:', e.message);
          }

          // Recalcular métricas de inmediato para que reflejen las nuevas zonas
          performSync(true).catch(e => console.warn('[Sync Daemon] Error recalculando tras guardar zonas:', e.message));

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'saved', count: zonesData.length }));
        } catch (err) {
          console.error('[HTTP API] Error guardando zonas:', err.message);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'error', error: err.message }));
        }
      });
      return;
    }
  }

  if (url.pathname === '/api/sync/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      activeSave: lastProcessedSave,
      modified: lastProcessedTime,
      lastSync: lastSyncTimestamp,
      isSyncing
    }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint no encontrado' }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`======================================================`);
  console.log(`🚀 Satisfactory Auto-Sync Daemon & Trigger API`);
  console.log(`📡 HTTP Trigger en: http://0.0.0.0:${PORT}/api/sync/force`);
  console.log(`⏱️ Intervalo de sondeo: ${POLL_INTERVAL_MS / 1000}s`);
  console.log(`📁 Directorio de saves: ${SAVES_PATH}`);
  console.log(`======================================================\n`);

  // Ejecución inicial inmediata
  performSync(false);

  // Bucle periódico cada 10 segundos
  setInterval(() => {
    performSync(false);
  }, POLL_INTERVAL_MS);
});
