const fs = require('fs');
const path = require('path');

const FB_BASE = 'http://192.168.1.230:8080';
const USERNAME = 'admin';
const PASSWORD = 'homelab22';
const SOURCE = 'srv';
const TARGET_PATH = '/web';
const ZIP_LOCAL = path.resolve(__dirname, '..', '..', 'satisfactory_web.zip');

async function deploy() {
  console.log('====================================================');
  console.log('🚀 INICIANDO DESPLIEGUE EN EL SERVIDOR FILEBROWSER');
  console.log(`📡 URL: ${FB_BASE}`);
  console.log(`📁 Destino: /files/${SOURCE}${TARGET_PATH}/`);
  console.log(`📦 Archivo ZIP local: ${ZIP_LOCAL}`);
  console.log('====================================================\n');

  // 1. Autenticación
  console.log('[1/5] Autenticando con FileBrowser Quantum...');
  const loginRes = await fetch(`${FB_BASE}/api/auth/login?username=${encodeURIComponent(USERNAME)}`, {
    method: 'POST',
    headers: {
      'X-Password': encodeURIComponent(PASSWORD),
      'X-Secret': ''
    }
  });

  if (!loginRes.ok) {
    throw new Error(`Fallo de autenticación: ${loginRes.status} ${loginRes.statusText}`);
  }

  const token = (await loginRes.text()).trim();
  const authHeaders = {
    'Cookie': `filebrowser_quantum_jwt=${token}`
  };
  console.log('✅ Sesión iniciada correctamente.');

  // 2. Listar y borrar todo lo que hay dentro de /web
  console.log(`\n[2/5] Inspeccionando contenido actual en ${TARGET_PATH}...`);
  const listRes = await fetch(`${FB_BASE}/api/resources?source=${SOURCE}&path=${encodeURIComponent(TARGET_PATH)}`, {
    headers: authHeaders
  });

  if (!listRes.ok) {
    throw new Error(`Error al listar carpeta ${TARGET_PATH}: ${listRes.status}`);
  }

  const currentData = await listRes.json();
  const filesToDelete = currentData.files || [];
  const foldersToDelete = currentData.folders || [];

  console.log(`Encontrados: ${filesToDelete.length} archivos y ${foldersToDelete.length} carpetas.`);

  for (const f of filesToDelete) {
    const itemPath = `${TARGET_PATH}/${f.name}`;
    console.log(`  🗑️ Borrando archivo: ${itemPath}...`);
    const del = await fetch(`${FB_BASE}/api/resources?source=${SOURCE}&path=${encodeURIComponent(itemPath)}`, {
      method: 'DELETE',
      headers: authHeaders
    });
    if (!del.ok) console.warn(`    ⚠️ Aviso al borrar ${itemPath}: ${del.status}`);
  }

  for (const d of foldersToDelete) {
    const folderPath = `${TARGET_PATH}/${d.name}`;
    console.log(`  🗑️ Borrando carpeta: ${folderPath}...`);
    const del = await fetch(`${FB_BASE}/api/resources?source=${SOURCE}&path=${encodeURIComponent(folderPath)}`, {
      method: 'DELETE',
      headers: authHeaders
    });
    if (!del.ok) console.warn(`    ⚠️ Aviso al borrar ${folderPath}: ${del.status}`);
  }

  console.log('✅ Carpeta /web vaciada por completo.');

  // 3. Subir el ZIP
  console.log(`\n[3/5] Subiendo ${path.basename(ZIP_LOCAL)} (${(fs.statSync(ZIP_LOCAL).size / 1024 / 1024).toFixed(2)} MB)...`);
  const zipBuffer = fs.readFileSync(ZIP_LOCAL);
  const targetZipPath = `${TARGET_PATH}/satisfactory_web.zip`;

  const uploadRes = await fetch(`${FB_BASE}/api/resources?source=${SOURCE}&path=${encodeURIComponent(targetZipPath)}&override=true`, {
    method: 'POST',
    headers: {
      ...authHeaders,
      'Content-Type': 'application/zip'
    },
    body: zipBuffer
  });

  if (!uploadRes.ok) {
    throw new Error(`Error al subir el ZIP: ${uploadRes.status} ${await uploadRes.text()}`);
  }
  console.log('✅ ZIP subido exitosamente a FileBrowser.');

  // 4. Extraer el ZIP con auto-borrado
  console.log('\n[4/5] Descomprimiendo satisfactory_web.zip en /web y eliminando archivo ZIP...');
  const unarchivePayload = {
    fromSource: SOURCE,
    toSource: SOURCE,
    path: targetZipPath,
    destination: TARGET_PATH,
    deleteAfter: true
  };

  const unarchiveRes = await fetch(`${FB_BASE}/api/resources/unarchive`, {
    method: 'POST',
    headers: {
      ...authHeaders,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(unarchivePayload)
  });

  const unarchiveText = await unarchiveRes.text();
  if (!unarchiveRes.ok) {
    console.error('Respuesta de extracción:', unarchiveText);
    throw new Error(`Error al descomprimir: ${unarchiveRes.status} ${unarchiveText}`);
  }
  console.log('✅ Extracción completada correctamente.');

  // 5. Verificar estado final
  console.log('\n[5/5] Verificando contenido final extraído en /web...');
  const verifyRes = await fetch(`${FB_BASE}/api/resources?source=${SOURCE}&path=${encodeURIComponent(TARGET_PATH)}`, {
    headers: authHeaders
  });

  const finalData = await verifyRes.json();
  const finalFiles = (finalData.files || []).map(f => f.name);
  const finalFolders = (finalData.folders || []).map(d => d.name);

  console.log('📁 Archivos en la raíz de /web:', finalFiles);
  console.log('📂 Carpetas en /web:', finalFolders);

  // Asegurar que el zip no quedó residualmente
  if (finalFiles.includes('satisfactory_web.zip')) {
    console.log('Eliminando residuo de satisfactory_web.zip...');
    await fetch(`${FB_BASE}/api/resources?source=${SOURCE}&path=${encodeURIComponent(targetZipPath)}`, {
      method: 'DELETE',
      headers: authHeaders
    });
    console.log('satisfactory_web.zip eliminado.');
  }

  console.log('\n====================================================');
  console.log('🎉 DESPLIEGUE FINALIZADO CON ÉXITO');
  console.log('====================================================\n');
}

deploy().catch(err => {
  console.error('\n❌ ERROR DURANTE EL DESPLIEGUE:', err.message);
  process.exit(1);
});
