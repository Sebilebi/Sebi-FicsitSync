<div align="center">
  <h1>Sebi-FicsitSync</h1>
  <p>
    <a href="#--español">🇪🇸 Español</a> &bull; 
    <a href="#--english">🇬🇧 English</a>
  </p>
</div>

---

## 🇪🇸 Español

![FICSIT OS Banner](https://via.placeholder.com/1200x400/1e293b/f97316?text=Sebi-FicsitSync+-+Satisfactory+Live+Dashboard)

Un panel web y mapa interactivo en tiempo real para **Satisfactory 1.2**. Diseñado con la estética inmersiva del sistema operativo de FICSIT, esta herramienta se conecta a tu servidor dedicado para leer automáticamente tus archivos `.sav` y mostrar el progreso de tu mundo en vivo.

### ✨ Características Principales
* **🗺️ Mapa Interactivo en Tiempo Real:** Visualiza todos tus nodos de recursos, fábricas, babosas de energía y cápsulas de evacuación (drop pods).
* **🔄 Sincronización en Vivo:** Se conecta a tu servidor (vía API de Filebrowser) para descargar y procesar automáticamente el último archivo de guardado cada 5 minutos, o de forma manual con un botón.
* **🏭 Gestión de Fábricas (Zonas):** Dibuja los límites exactos de tus fábricas en el mapa interactivo para calcular automáticamente las tasas totales de producción y consumo (+/min) de esos edificios específicos.
* **📊 Panel de Control y Métricas:** Supervisa la producción general de objetos, el inventario de tus almacenes y el estado de la partida.
* **🖥️ Interfaz FICSIT:** Una interfaz elegante y fluida en modo oscuro, diseñada a medida para sentirse como un auténtico terminal corporativo de FICSIT Inc.
* **🔎 Rastreador de Coleccionables:** Descubre al instante qué Babosas y Esferas Mercer has recogido ya, y filtra el mapa para mostrar únicamente lo que te falta por explorar.

### 🏗️ Arquitectura del Proyecto
El proyecto se divide en dos partes principales:
1. **Backend en Node.js (`sync_daemon.js` / `export_metrics.js`):** Se conecta a un servidor remoto para obtener el archivo `.sav` más reciente, descifra los datos de guardado de Unreal Engine y expone las métricas mediante una API REST local.
2. **Frontend en Vanilla JS (`app.js` / `map.js`):** Una interfaz gráfica construida con HTML5 Canvas y CSS Grid que consume los datos de la API y renderiza el sistema operativo de forma fluida.

### 🚀 Instalación y Uso (Desarrollo Local)
1. Clona el repositorio:
   ```bash
   git clone https://github.com/TU_USUARIO/Sebi-FicsitSync.git
   ```
2. Instala las dependencias necesarias:
   ```bash
   pnpm install
   ```
3. Configura las variables de entorno para conectar con tu servidor Filebrowser:
   ```bash
   export FB_BASE="http://TU_IP:8080"
   export FB_USER="admin"
   export FB_PASS="tu_contraseña"
   ```
4. Inicia el demonio de sincronización (Backend):
   ```bash
   node server/sync_daemon.js
   ```
5. Abre el archivo `index.html` en tu navegador (o sírvelo mediante un servidor HTTP local) para acceder a la interfaz.

---

## 🇬🇧 English

![FICSIT OS Banner](https://via.placeholder.com/1200x400/1e293b/f97316?text=Sebi-FicsitSync+-+Satisfactory+Live+Dashboard)

A fully interactive, real-time web dashboard and map for **Satisfactory 1.2**. Designed with an immersive FICSIT OS aesthetic, this tool connects to your dedicated server to automatically parse your `.sav` files and display your world's progress live.

### ✨ Features
* **🗺️ Real-Time Interactive Map:** View all your resource nodes, factories, power slugs, and drop pods.
* **🔄 Live Sync:** Connects to your server via Filebrowser API to auto-download and parse the latest save file every 5 minutes (or on demand).
* **🏭 Factory Management (Zonas):** Draw custom factory bounds on the map and automatically calculate total production/consumption rates for those specific buildings.
* **📊 Dashboard & Metrics:** Track overall item production, storage levels, and power consumption.
* **🖥️ FICSIT UI/UX:** A gorgeous, custom dark-mode interface built to feel like an authentic FICSIT Inc. operating system terminal.
* **🔎 Collectibles Tracker:** Instantly see which Power Slugs and Hard Drives you have already collected and filter the map to show only the remaining ones.

### 🏗️ Architecture
This project consists of two main parts:
1. **Node.js Backend (`sync_daemon.js` / `export_metrics.js`):** Connects to a remote Filebrowser instance to fetch the latest `.sav` file, parses the Unreal Engine save data, and exposes the metrics via a local REST API.
2. **Vanilla JS Frontend (`app.js` / `map.js`):** An HTML5 Canvas and CSS Grid based UI that fetches the API data and renders the interactive FICSIT OS.

### 🚀 How to Run (Local Development)
1. Clone the repository.
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set your environment variables for your server's Filebrowser:
   ```bash
   export FB_BASE="http://YOUR_IP:8080"
   export FB_USER="admin"
   export FB_PASS="your_password"
   ```
4. Start the Sync Daemon:
   ```bash
   node server/sync_daemon.js
   ```
5. Open `index.html` in your browser (or serve it via a simple HTTP server).

---

### 📝 Disclaimer / Aviso Legal
This tool is a fan-made project. Assets, icons, and game data belong to Coffee Stain Studios. / Este es un proyecto creado por un fan. Los recursos visuales, iconos y datos del juego son propiedad de Coffee Stain Studios.
