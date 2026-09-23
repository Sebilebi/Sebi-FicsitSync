const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const scratchDir = path.resolve(__dirname, '..', '..');
const webDir = path.resolve(__dirname, '..');
const stagingDir = path.join(scratchDir, 'staging_web');
const zipFile = path.join(scratchDir, 'satisfactory_web.zip');

console.log('Preparing clean staging directory:', stagingDir);
if (fs.existsSync(stagingDir)) {
  fs.rmSync(stagingDir, { recursive: true, force: true });
}
fs.mkdirSync(stagingDir, { recursive: true });

// Copy essential folders and files
const itemsToCopy = [
  'index.html',
  '404.html',
  '50x.html',
  'README.md',
  'test_autosave_0.sav',
  'css',
  'js',
  'icons',
  'images',
  'data'
];

for (const item of itemsToCopy) {
  const src = path.join(webDir, item);
  const dst = path.join(stagingDir, item);
  if (fs.existsSync(src)) {
    fs.cpSync(src, dst, { recursive: true });
  }
}

// Copy server folder excluding node_modules and temp test files
const serverStaging = path.join(stagingDir, 'server');
fs.mkdirSync(serverStaging, { recursive: true });
const serverFiles = [
  'package.json',
  'package-lock.json',
  'server.js',
  'parser.js',
  'recipe_map.js',
  'export_metrics.js',
  'sync_daemon.js',
  'resourcePurity.py'
];

for (const f of serverFiles) {
  const src = path.join(webDir, 'server', f);
  const dst = path.join(serverStaging, f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
  }
}

if (fs.existsSync(zipFile)) {
  fs.rmSync(zipFile, { force: true });
}

console.log('Compressing with PowerShell .NET ZipFile (includeBaseDirectory=false)...');
const psCommand = `powershell -Command "Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::CreateFromDirectory('${stagingDir}', '${zipFile}', [System.IO.Compression.CompressionLevel]::Optimal, $false)"`;
execSync(psCommand);

console.log('Done! Generated zip at:', zipFile);
const stat = fs.statSync(zipFile);
console.log('Zip size:', stat.size, 'bytes');

// Clean staging directory
fs.rmSync(stagingDir, { recursive: true, force: true });
