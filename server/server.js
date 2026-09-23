const express = require('express');
const path = require('path');
const fs = require('fs');
const { parseSaveFile, calculateMetrics } = require('./parser');

const app = express();
const PORT = process.env.PORT || 3000;
const ZONES_FILE = path.join(__dirname, '..', 'data', 'zones.json');
const ROOT_DIR = path.join(__dirname, '..');

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

/**
 * Resolves the active .sav file.
 * Supports direct file path, or scanning a directory for the newest .sav file.
 */
function getActiveSavePath() {
  const customPath = process.env.SAV_PATH || path.join(ROOT_DIR, 'test_autosave_0.sav');
  
  if (fs.existsSync(customPath)) {
    const stat = fs.statSync(customPath);
    if (stat.isDirectory()) {
      // Find the latest .sav in the directory
      const files = fs.readdirSync(customPath)
        .filter(f => f.endsWith('.sav'))
        .map(f => ({ name: f, time: fs.statSync(path.join(customPath, f)).mtimeMs }))
        .sort((a, b) => b.time - a.time);
      if (files.length > 0) {
        return path.join(customPath, files[0].name);
      }
    } else {
      return customPath;
    }
  }

  // Fallback to test_autosave_0.sav in project root
  return path.join(ROOT_DIR, 'test_autosave_0.sav');
}

/**
 * Loads zones from data/zones.json
 */
function loadZones() {
  try {
    if (fs.existsSync(ZONES_FILE)) {
      return JSON.parse(fs.readFileSync(ZONES_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('[Zones] Error reading zones.json:', err.message);
  }
  return [];
}

/**
 * Saves zones to data/zones.json
 */
function saveZones(zones) {
  try {
    const dataDir = path.dirname(ZONES_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(ZONES_FILE, JSON.stringify(zones, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('[Zones] Error saving zones.json:', err.message);
    return false;
  }
}

// === API ROUTES ===

// 1. Save Session Info & Meta
app.get('/api/save/info', (req, res) => {
  const savePath = getActiveSavePath();
  const data = parseSaveFile(savePath);
  if (data.error) {
    return res.status(404).json({ error: data.error });
  }
  res.json({
    activeSaveFile: path.basename(savePath),
    header: data.header,
    counts: data.counts
  });
});

// 2. Map Buildings & Infrastructure
app.get('/api/map/buildings', (req, res) => {
  const savePath = getActiveSavePath();
  const data = parseSaveFile(savePath);
  if (data.error) {
    return res.status(404).json({ error: data.error });
  }
  res.json({
    buildings: data.buildings || [],
    storages: data.storages || [],
    miners: data.miners || [],
    belts: data.belts || [],
    pipes: data.pipes || [],
    attachments: data.attachments || [],
    powerPoles: data.powerPoles || [],
    powerLines: data.powerLines || [],
    specialBuildings: data.specialBuildings || [],
    nodes: data.nodes || []
  });
});

// 2b. Map Resource Nodes (Purity, Exploited/Available Status)
app.get('/api/map/nodes', (req, res) => {
  const savePath = getActiveSavePath();
  const data = parseSaveFile(savePath);
  if (data.error) {
    return res.status(404).json({ error: data.error });
  }
  res.json({
    total: data.nodes ? data.nodes.length : 0,
    exploitedCount: data.counts?.resourceNodesExploited || 0,
    availableCount: data.counts?.resourceNodesAvailable || 0,
    nodes: data.nodes || []
  });
});

// 3. Get Defined Zones
app.get('/api/zones', (req, res) => {
  res.json(loadZones());
});

// 4. Create or Update a Zone
app.post('/api/zones', (req, res) => {
  const { id, name, item, color, bounds } = req.body;
  if (!name || !bounds) {
    return res.status(400).json({ error: 'Name and bounds {minX, maxX, minY, maxY} are required' });
  }

  const zones = loadZones();
  const zoneId = id || `zone-${Date.now()}`;
  const existingIdx = zones.findIndex(z => z.id === zoneId);

  const zoneData = {
    id: zoneId,
    name: name.trim(),
    item: item || '',
    color: color || '#61afef',
    bounds: {
      minX: Math.min(bounds.minX, bounds.maxX),
      maxX: Math.max(bounds.minX, bounds.maxX),
      minY: Math.min(bounds.minY, bounds.maxY),
      maxY: Math.max(bounds.minY, bounds.maxY)
    },
    updatedAt: new Date().toISOString()
  };

  if (existingIdx >= 0) {
    zones[existingIdx] = zoneData;
  } else {
    zones.push(zoneData);
  }

  if (saveZones(zones)) {
    res.json({ success: true, zone: zoneData, total: zones.length });
  } else {
    res.status(500).json({ error: 'Failed to write to zones.json' });
  }
});

// 5. Delete a Zone
app.delete('/api/zones/:id', (req, res) => {
  const { id } = req.params;
  let zones = loadZones();
  const initialLen = zones.length;
  zones = zones.filter(z => z.id !== id);

  if (zones.length === initialLen) {
    return res.status(404).json({ error: 'Zone not found' });
  }

  if (saveZones(zones)) {
    res.json({ success: true, deletedId: id, total: zones.length });
  } else {
    res.status(500).json({ error: 'Failed to save zones file' });
  }
});

// 6. Metrics Endpoint (Integrated Game Save + Zones)
app.get('/api/metrics', (req, res) => {
  const savePath = getActiveSavePath();
  const data = parseSaveFile(savePath);
  if (data.error) {
    return res.status(404).json({ error: data.error });
  }
  const zones = loadZones();
  const metrics = calculateMetrics(data, zones);
  res.json(metrics);
});

// 7. Force Reload
app.post('/api/save/reload', (req, res) => {
  const savePath = getActiveSavePath();
  // Force reload by clearing lastMtime in memory
  const data = parseSaveFile(savePath);
  res.json({ success: true, session: data.header, counts: data.counts });
});

// Static files (Web dashboard)
app.use(express.static(ROOT_DIR));

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Satisfactory Web Dashboard & Save Engine (v1.2)`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`📁 Active Save File: ${getActiveSavePath()}`);
  console.log(`🏷️ Zones File: ${ZONES_FILE}`);
  console.log(`======================================================\n`);
});
