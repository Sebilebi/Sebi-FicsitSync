// Catálogo Completo de Satisfactory (Versión 1.0 - 1.2) - Todos los Ítems del Juego
const SATISFACTORY_CATEGORIES = [
  {
    "id": "iron",
    "name": "Hierro y Derivados",
    "icon": `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14l8-8 8 8M4 10l8-8 8 8M12 2v20"/></svg>`,
    "color": "#ea580c",
    "items": [
      {
        "id": "Iron_Ore",
        "name": "MINERAL DE HIERRO",
        "input": "Extractor Minero",
        "machine": "Extractor Minero",
        "color": "#7c2d12",
        "bg": "#ffedd5",
        "type": "extractor"
      },
      {
        "id": "Iron_Ingot",
        "name": "LINGOTE DE HIERRO",
        "input": "Mineral de hierro",
        "machine": "Horno",
        "color": "#ea580c",
        "bg": "#ffedd5"
      },
      {
        "id": "Iron_Plate",
        "name": "PLANCHA DE HIERRO",
        "input": "Lingotes de hierro",
        "machine": "Constructor",
        "color": "#c2410c",
        "bg": "#ffedd5"
      },
      {
        "id": "Iron_Rod",
        "name": "VARILLA DE HIERRO",
        "input": "Lingotes de hierro",
        "machine": "Constructor",
        "color": "#9a3412",
        "bg": "#ffedd5"
      },
      {
        "id": "Screw",
        "name": "TORNILLO",
        "input": "Varillas de hierro",
        "machine": "Constructor",
        "color": "#78350f",
        "bg": "#fef3c7"
      },
      {
        "id": "Reinforced_Iron_Plate",
        "name": "PLANCHA REFORZADA",
        "input": "Planchas + Tornillos",
        "machine": "Ensambladora",
        "color": "#b45309",
        "bg": "#ffedd5"
      },
      {
        "id": "Rotor",
        "name": "ROTOR",
        "input": "Varillas + Tornillos",
        "machine": "Ensambladora",
        "color": "#d97706",
        "bg": "#fef3c7"
      },
      {
        "id": "Modular_Frame",
        "name": "ESTRUCTURA MODULAR",
        "input": "Planchas ref. + Varillas",
        "machine": "Ensambladora",
        "color": "#92400e",
        "bg": "#fef3c7"
      }
    ]
  },
  {
    "id": "copper",
    "name": "Cobre y Electrónica",
    "icon": `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/></svg>`,
    "color": "#f97316",
    "items": [
      {
        "id": "Copper_Ore",
        "name": "MINERAL DE COBRE",
        "input": "Extractor Minero",
        "machine": "Extractor Minero",
        "color": "#9a3412",
        "bg": "#ffedd5",
        "type": "extractor"
      },
      {
        "id": "Copper_Ingot",
        "name": "LINGOTE DE COBRE",
        "input": "Mineral de cobre",
        "machine": "Horno",
        "color": "#ea580c",
        "bg": "#ffedd5"
      },
      {
        "id": "Wire",
        "name": "ALAMBRE",
        "input": "Lingotes de cobre",
        "machine": "Constructor",
        "color": "#c2410c",
        "bg": "#ffedd5"
      },
      {
        "id": "Cable",
        "name": "CABLE",
        "input": "Alambre de cobre",
        "machine": "Constructor",
        "color": "#b45309",
        "bg": "#fef3c7"
      },
      {
        "id": "Copper_Sheet",
        "name": "LÁMINA DE COBRE",
        "input": "Lingotes de cobre",
        "machine": "Constructor",
        "color": "#c2410c",
        "bg": "#ffedd5"
      },
      {
        "id": "Copper_Powder",
        "name": "POLVO DE COBRE",
        "input": "Lingotes de cobre",
        "machine": "Constructor",
        "color": "#d97706",
        "bg": "#fef3c7"
      },
      {
        "id": "Circuit_Board",
        "name": "PLACA DE CIRCUITOS",
        "input": "Lámina cobre + Plástico",
        "machine": "Ensambladora",
        "color": "#0d9488",
        "bg": "#ccfbf1"
      },
      {
        "id": "AI_Limiter",
        "name": "LIMITADOR DE IA",
        "input": "Cable rápido + Lámina cobre",
        "machine": "Ensambladora",
        "color": "#059669",
        "bg": "#d1fae5"
      },
      {
        "id": "High_Speed_Connector",
        "name": "CONECTOR ALTA VEL.",
        "input": "Cable rápido + Cable + Circuitos",
        "machine": "Fabricadora",
        "color": "#0284c7",
        "bg": "#e0f2fe"
      }
    ]
  },
  {
    "id": "steel",
    "name": "Acero y Construcción Pesada",
    "icon": `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3v18h12V3zM6 8h12M6 13h12M6 18h12"/></svg>`,
    "color": "#94a3b8",
    "items": [
      {
        "id": "Limestone",
        "name": "PIEDRA CALIZA",
        "input": "Extractor Minero",
        "machine": "Extractor Minero",
        "color": "#64748b",
        "bg": "#f1f5f9",
        "type": "extractor"
      },
      {
        "id": "Concrete",
        "name": "HORMIGÓN",
        "input": "Piedra caliza",
        "machine": "Constructor",
        "color": "#475569",
        "bg": "#f1f5f9"
      },
      {
        "id": "Coal",
        "name": "CARBÓN",
        "input": "Extractor Minero",
        "machine": "Extractor Minero",
        "color": "#1e293b",
        "bg": "#e2e8f0",
        "type": "extractor"
      },
      {
        "id": "Compacted_Coal",
        "name": "CARBÓN COMPACTADO",
        "input": "Carbón + Azufre",
        "machine": "Ensambladora",
        "color": "#0f172a",
        "bg": "#e2e8f0"
      },
      {
        "id": "Steel_Ingot",
        "name": "LINGOTE DE ACERO",
        "input": "Mineral hierro + Carbón",
        "machine": "Fundición",
        "color": "#334155",
        "bg": "#f1f5f9"
      },
      {
        "id": "Steel_Beam",
        "name": "VIGA DE ACERO",
        "input": "Lingotes de acero",
        "machine": "Constructor",
        "color": "#475569",
        "bg": "#f1f5f9"
      },
      {
        "id": "Steel_Pipe",
        "name": "TUBERÍA DE ACERO",
        "input": "Lingotes de acero",
        "machine": "Constructor",
        "color": "#475569",
        "bg": "#f1f5f9"
      },
      {
        "id": "Encased_Industrial_Beam",
        "name": "VIGA IND. CUBIERTA",
        "input": "Vigas acero + Hormigón",
        "machine": "Ensambladora",
        "color": "#334155",
        "bg": "#e2e8f0"
      },
      {
        "id": "Stator",
        "name": "ESTATOR",
        "input": "Tubería acero + Alambre",
        "machine": "Ensambladora",
        "color": "#d97706",
        "bg": "#fef3c7"
      },
      {
        "id": "Motor",
        "name": "MOTOR",
        "input": "Rotor + Estator",
        "machine": "Ensambladora",
        "color": "#b45309",
        "bg": "#fef3c7"
      },
      {
        "id": "Heavy_Modular_Frame",
        "name": "ESTRUCTURA PESADA",
        "input": "Estructura mod. + Viga ind. + Horm.",
        "machine": "Fabricadora",
        "color": "#1e293b",
        "bg": "#e2e8f0"
      }
    ]
  },
  {
    "id": "oil",
    "name": "Petróleo, Combustibles y Fluidos",
    "icon": `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`,
    "color": "#0284c7",
    "items": [
      {
        "id": "Crude_Oil",
        "name": "PETRÓLEO CRUDO",
        "input": "Extractor de petróleo",
        "machine": "Extractor de petróleo",
        "color": "#0f172a",
        "bg": "#f1f5f9",
        "type": "extractor",
        "liquid": true
      },
      {
        "id": "Heavy_Oil_Residue",
        "name": "RESIDUO PESADO",
        "input": "Petróleo crudo",
        "machine": "Refinería",
        "color": "#475569",
        "bg": "#e2e8f0",
        "liquid": true
      },
      {
        "id": "Polymer_Resin",
        "name": "RESINA DE POLÍMERO",
        "input": "Subproducto de refinería",
        "machine": "Refinería",
        "color": "#0284c7",
        "bg": "#e0f2fe"
      },
      {
        "id": "Petroleum_Coke",
        "name": "COQUE DE PETRÓLEO",
        "input": "Residuo de petróleo pesado",
        "machine": "Refinería",
        "color": "#334155",
        "bg": "#f1f5f9"
      },
      {
        "id": "Plastic",
        "name": "PLÁSTICO",
        "input": "Petróleo crudo",
        "machine": "Refinería",
        "color": "#0284c7",
        "bg": "#e0f2fe"
      },
      {
        "id": "Rubber",
        "name": "GOMA",
        "input": "Petróleo crudo",
        "machine": "Refinería",
        "color": "#0f766e",
        "bg": "#ccfbf1"
      },
      {
        "id": "Fuel",
        "name": "COMBUSTIBLE",
        "input": "Petróleo crudo / Residuo",
        "machine": "Refinería",
        "color": "#ea580c",
        "bg": "#ffedd5",
        "liquid": true
      },
      {
        "id": "Turbofuel",
        "name": "TURBOCOMBUSTIBLE",
        "input": "Combustible + Carbón comp.",
        "machine": "Refinería",
        "color": "#dc2626",
        "bg": "#fee2e2",
        "liquid": true
      },
      {
        "id": "Rocket_Fuel",
        "name": "COMBUSTIBLE COHETE",
        "input": "Turbocombustible + Gas nitrógeno",
        "machine": "Mezcladora",
        "color": "#e11d48",
        "bg": "#ffe4e6",
        "liquid": true
      },
      {
        "id": "Ionized_Fuel",
        "name": "COMBUSTIBLE IONIZADO",
        "input": "Combustible cohete + Materia oscura",
        "machine": "Refinería",
        "color": "#7c3aed",
        "bg": "#ede9fe",
        "liquid": true
      },
      {
        "id": "Empty_Canister",
        "name": "RECIPIENTE VACÍO",
        "input": "Plástico",
        "machine": "Constructor",
        "color": "#0284c7",
        "bg": "#e0f2fe"
      },
      {
        "id": "Empty_Fluid_Tank",
        "name": "TANQUE FLUIDO VACÍO",
        "input": "Carcasa de aluminio",
        "machine": "Constructor",
        "color": "#475569",
        "bg": "#f1f5f9"
      },
      {
        "id": "Packaged_Water",
        "name": "AGUA ENVASADA",
        "input": "Agua + Recipiente",
        "machine": "Empaquetadora",
        "color": "#0284c7",
        "bg": "#e0f2fe"
      },
      {
        "id": "Packaged_Oil",
        "name": "PETRÓLEO ENVASADO",
        "input": "Petróleo + Recipiente",
        "machine": "Empaquetadora",
        "color": "#0f172a",
        "bg": "#f1f5f9"
      },
      {
        "id": "Packaged_Fuel",
        "name": "COMBUSTIBLE ENVASADO",
        "input": "Combustible + Recipiente",
        "machine": "Empaquetadora",
        "color": "#ea580c",
        "bg": "#ffedd5"
      },
      {
        "id": "Packaged_Turbofuel",
        "name": "TURBOCOMB. ENVASADO",
        "input": "Turbocombustible + Recipiente",
        "machine": "Empaquetadora",
        "color": "#dc2626",
        "bg": "#fee2e2"
      }
    ]
  },
  {
    "id": "mam",
    "name": "Caterio, Cuarzo y Azufre (MAM)",
    "icon": `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    "color": "#eab308",
    "items": [
      {
        "id": "Caterium_Ore",
        "name": "MINERAL DE CATERIO",
        "input": "Extractor Minero",
        "machine": "Extractor Minero",
        "color": "#ca8a04",
        "bg": "#fef9c3",
        "type": "extractor"
      },
      {
        "id": "Caterium_Ingot",
        "name": "LINGOTE DE CATERIO",
        "input": "Mineral de caterio",
        "machine": "Horno",
        "color": "#eab308",
        "bg": "#fef9c3"
      },
      {
        "id": "Quickwire",
        "name": "CABLE RÁPIDO",
        "input": "Lingotes de caterio",
        "machine": "Constructor",
        "color": "#eab308",
        "bg": "#fef9c3"
      },
      {
        "id": "Raw_Quartz",
        "name": "CUARZO PURO",
        "input": "Extractor Minero",
        "machine": "Extractor Minero",
        "color": "#db2777",
        "bg": "#fce7f3",
        "type": "extractor"
      },
      {
        "id": "Quartz_Crystal",
        "name": "CRISTAL DE CUARZO",
        "input": "Cuarzo puro",
        "machine": "Constructor",
        "color": "#ec4899",
        "bg": "#fce7f3"
      },
      {
        "id": "Silica",
        "name": "SÍLICE",
        "input": "Cuarzo puro",
        "machine": "Constructor",
        "color": "#0284c7",
        "bg": "#e0f2fe"
      },
      {
        "id": "Crystal_Oscillator",
        "name": "OSCILADOR DE CRISTAL",
        "input": "Cristal cuarzo + Cable + Plancha",
        "machine": "Fabricadora",
        "color": "#be185d",
        "bg": "#fce7f3"
      },
      {
        "id": "Sulfur",
        "name": "AZUFRE",
        "input": "Extractor Minero",
        "machine": "Extractor Minero",
        "color": "#ca8a04",
        "bg": "#fef9c3",
        "type": "extractor"
      },
      {
        "id": "Black_Powder",
        "name": "PÓLVORA NEGRA",
        "input": "Azufre + Carbón",
        "machine": "Ensambladora",
        "color": "#1e293b",
        "bg": "#f1f5f9"
      },
      {
        "id": "Smokeless_Powder",
        "name": "PÓLVORA SIN HUMO",
        "input": "Pólvora negra + Residuo pesado",
        "machine": "Refinería",
        "color": "#0f172a",
        "bg": "#e2e8f0"
      }
    ]
  },
  {
    "id": "aluminum",
    "name": "Aluminio y Componentes Avanzados",
    "icon": `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7h10M7 12h10M7 17h10"/></svg>`,
    "color": "#38bdf8",
    "items": [
      {
        "id": "Bauxite",
        "name": "BAUXITA",
        "input": "Extractor Minero",
        "machine": "Extractor Minero",
        "color": "#ea580c",
        "bg": "#ffedd5",
        "type": "extractor"
      },
      {
        "id": "Water",
        "name": "AGUA",
        "input": "Extractor de agua",
        "machine": "Extractor de agua",
        "color": "#0284c7",
        "bg": "#e0f2fe",
        "type": "extractor",
        "liquid": true
      },
      {
        "id": "Alumina_Solution",
        "name": "SOLUCIÓN DE ALÚMINA",
        "input": "Bauxita + Agua",
        "machine": "Refinería",
        "color": "#0284c7",
        "bg": "#e0f2fe",
        "liquid": true
      },
      {
        "id": "Aluminum_Scrap",
        "name": "DESECHO DE ALUMINIO",
        "input": "Solución alúmina + Coque petróleo",
        "machine": "Refinería",
        "color": "#64748b",
        "bg": "#f1f5f9"
      },
      {
        "id": "Aluminum_Ingot",
        "name": "LINGOTE DE ALUMINIO",
        "input": "Desecho aluminio + Sílice",
        "machine": "Fundición",
        "color": "#38bdf8",
        "bg": "#e0f2fe"
      },
      {
        "id": "Alclad_Aluminum_Sheet",
        "name": "LÁMINA ALCLAD",
        "input": "Lingotes aluminio + Cobre",
        "machine": "Ensambladora",
        "color": "#0284c7",
        "bg": "#e0f2fe"
      },
      {
        "id": "Aluminum_Casing",
        "name": "CARCASA DE ALUMINIO",
        "input": "Lingotes de aluminio",
        "machine": "Constructor",
        "color": "#0284c7",
        "bg": "#e0f2fe"
      },
      {
        "id": "Heat_Sink",
        "name": "DISIPADOR TÉRMICO",
        "input": "Lámina alclad + Carcasa aluminio",
        "machine": "Ensambladora",
        "color": "#0369a1",
        "bg": "#e0f2fe"
      },
      {
        "id": "Cooling_System",
        "name": "SISTEMA REFRIGERACIÓN",
        "input": "Disipador + Motor + Nitrógeno",
        "machine": "Mezcladora",
        "color": "#0284c7",
        "bg": "#e0f2fe"
      },
      {
        "id": "Radio_Control_Unit",
        "name": "UNIDAD RADIOCONTROL",
        "input": "Carcasa aluminio + Circuitos + Comp.",
        "machine": "Fabricadora",
        "color": "#4338ca",
        "bg": "#e0e7ff"
      },
      {
        "id": "Computer",
        "name": "ORDENADOR",
        "input": "Circuitos + Cable + Plástico",
        "machine": "Fabricadora",
        "color": "#2563eb",
        "bg": "#dbeafe"
      },
      {
        "id": "Supercomputer",
        "name": "SUPERORDENADOR",
        "input": "Ordenador + Limitador IA + Conector",
        "machine": "Fabricadora",
        "color": "#4f46e5",
        "bg": "#e0e7ff"
      },
      {
        "id": "Turbo_Motor",
        "name": "TURBOMOTOR",
        "input": "Motor + Sistema refrig. + Radiocontrol",
        "machine": "Fabricadora",
        "color": "#7c3aed",
        "bg": "#ede9fe"
      },
      {
        "id": "Fused_Modular_Frame",
        "name": "ESTRUCTURA FUSIONADA",
        "input": "Estructura pesada + Carcasa + Nitrógeno",
        "machine": "Mezcladora",
        "color": "#312e81",
        "bg": "#e0e7ff"
      }
    ]
  },
  {
    "id": "nuclear",
    "name": "Energía y Tecnología Nuclear",
    "icon": `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2a10 10 0 0 0-8.66 5l4.33 2.5A5 5 0 0 1 12 7V2zM20.66 7A10 10 0 0 0 12 2v5a5 5 0 0 1 4.33 2.5l4.33-2.5zM12 17a5 5 0 0 1-4.33-2.5l-4.33 2.5A10 10 0 0 0 12 22v-5zM16.33 14.5A5 5 0 0 1 12 17v5a10 10 0 0 0 8.66-5l-4.33-2.5z"/></svg>`,
    "color": "#10b981",
    "items": [
      {
        "id": "Uranium",
        "name": "URANIO",
        "input": "Extractor Minero",
        "machine": "Extractor Minero",
        "color": "#059669",
        "bg": "#d1fae5",
        "type": "extractor"
      },
      {
        "id": "Sulfuric_Acid",
        "name": "ÁCIDO SULFÚRICO",
        "input": "Azufre + Agua",
        "machine": "Refinería",
        "color": "#ca8a04",
        "bg": "#fef9c3",
        "liquid": true
      },
      {
        "id": "Encased_Uranium_Cell",
        "name": "CÉLULA DE URANIO",
        "input": "Uranio + Hormigón + Ácido sulfúrico",
        "machine": "Mezcladora",
        "color": "#059669",
        "bg": "#d1fae5"
      },
      {
        "id": "Electromagnetic_Control_Rod",
        "name": "BARRA CONTROL ELECT.",
        "input": "Estator + Conector alta vel.",
        "machine": "Ensambladora",
        "color": "#0284c7",
        "bg": "#e0f2fe"
      },
      {
        "id": "Uranium_Fuel_Rod",
        "name": "BARRA COMB. URANIO",
        "input": "Célula uranio + Barra electromagnética",
        "machine": "Fabricadora",
        "color": "#10b981",
        "bg": "#d1fae5"
      },
      {
        "id": "Uranium_Waste",
        "name": "RESIDUO DE URANIO",
        "input": "Barra uranio (Central Nuclear)",
        "machine": "Central Nuclear",
        "color": "#047857",
        "bg": "#a7f3d0"
      },
      {
        "id": "Non_Fissile_Uranium",
        "name": "URANIO NO FISIONABLE",
        "input": "Residuo uranio + Ácido nítrico + Sílice",
        "machine": "Mezcladora",
        "color": "#059669",
        "bg": "#d1fae5"
      },
      {
        "id": "Nitric_Acid",
        "name": "ÁCIDO NÍTRICO",
        "input": "Gas nitrógeno + Agua + Plancha hierro",
        "machine": "Mezcladora",
        "color": "#0284c7",
        "bg": "#e0f2fe",
        "liquid": true
      },
      {
        "id": "Plutonium_Pellet",
        "name": "PELLET DE PLUTONIO",
        "input": "Uranio no fisionable + Residuo pesado",
        "machine": "Acelerador de partículas",
        "color": "#0284c7",
        "bg": "#e0f2fe"
      },
      {
        "id": "Encased_Plutonium_Cell",
        "name": "CÉLULA DE PLUTONIO",
        "input": "Pellet plutonio + Viga ind.",
        "machine": "Ensambladora",
        "color": "#0284c7",
        "bg": "#e0f2fe"
      },
      {
        "id": "Plutonium_Fuel_Rod",
        "name": "BARRA COMB. PLUTONIO",
        "input": "Célula plutonio + Barra electromagnética",
        "machine": "Fabricadora",
        "color": "#0284c7",
        "bg": "#e0f2fe"
      },
      {
        "id": "Plutonium_Waste",
        "name": "RESIDUO DE PLUTONIO",
        "input": "Barra plutonio (Central Nuclear)",
        "machine": "Central Nuclear",
        "color": "#0369a1",
        "bg": "#e0f2fe"
      },
      {
        "id": "Battery",
        "name": "BATERÍA",
        "input": "Ácido sulfúrico + Alúmina + Carcasa",
        "machine": "Mezcladora",
        "color": "#eab308",
        "bg": "#fef9c3"
      }
    ]
  },
  {
    "id": "quantum",
    "name": "Tecnología FICSITE y Cuántica (1.0+)",
    "icon": `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(30 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(-30 12 12)"/></svg>`,
    "color": "#8b5cf6",
    "items": [
      {
        "id": "SAM",
        "name": "SAM",
        "input": "Extractor Minero",
        "machine": "Extractor Minero",
        "color": "#7c3aed",
        "bg": "#ede9fe",
        "type": "extractor"
      },
      {
        "id": "Reanimated_SAM",
        "name": "SAM REANIMADO",
        "input": "SAM",
        "machine": "Constructor",
        "color": "#8b5cf6",
        "bg": "#ede9fe"
      },
      {
        "id": "SAM_Fluctuator",
        "name": "FLUCTUADOR SAM",
        "input": "SAM reanimado + Alambre + Carcasa",
        "machine": "Fabricadora",
        "color": "#a855f7",
        "bg": "#f3e8ff"
      },
      {
        "id": "Ficsite_Ingot",
        "name": "LINGOTE DE FICSITA",
        "input": "SAM reanimado + Mineral",
        "machine": "Fundición",
        "color": "#d946ef",
        "bg": "#fae8ff"
      },
      {
        "id": "Ficsite_Trigon",
        "name": "TRÍGONO DE FICSITA",
        "input": "Lingotes de ficsita",
        "machine": "Constructor",
        "color": "#c026d3",
        "bg": "#fae8ff"
      },
      {
        "id": "Dark_Matter_Residue",
        "name": "RESIDUO MATERIA OSCURA",
        "input": "SAM reanimado",
        "machine": "Acelerador de partículas",
        "color": "#4c1d95",
        "bg": "#ede9fe"
      },
      {
        "id": "Diamonds",
        "name": "DIAMANTES",
        "input": "Carbón",
        "machine": "Acelerador de partículas",
        "color": "#06b6d4",
        "bg": "#cffafe"
      },
      {
        "id": "Dark_Matter_Crystal",
        "name": "CRISTAL MATERIA OSCURA",
        "input": "Residuo materia oscura + Diamantes",
        "machine": "Acelerador de partículas",
        "color": "#5b21b6",
        "bg": "#ede9fe"
      },
      {
        "id": "Time_Crystal",
        "name": "CRISTAL TEMPORAL",
        "input": "Diamantes",
        "machine": "Convertidor",
        "color": "#0891b2",
        "bg": "#cffafe"
      },
      {
        "id": "Singularity_Cell",
        "name": "CÉLULA SINGULARIDAD",
        "input": "Cristal temporal + Estructura nuclear",
        "machine": "Acelerador de partículas",
        "color": "#312e81",
        "bg": "#e0e7ff"
      },
      {
        "id": "Superposition_Oscillator",
        "name": "OSCILADOR SUPERPOSICIÓN",
        "input": "Cristal materia oscura + Oscilador",
        "machine": "Fabricadora",
        "color": "#9333ea",
        "bg": "#f3e8ff"
      },
      {
        "id": "Neural_Quantum_Processor",
        "name": "PROCESADOR NEURAL",
        "input": "Ordenador + Fluctuador SAM",
        "machine": "Fabricadora",
        "color": "#6366f1",
        "bg": "#e0e7ff"
      },
      {
        "id": "Quantum_Computer",
        "name": "ORDENADOR CUÁNTICO",
        "input": "Superordenador + Procesador neural",
        "machine": "Codificador cuántico",
        "color": "#4f46e5",
        "bg": "#e0e7ff"
      },
      {
        "id": "AI_Expansion_Server",
        "name": "SERVIDOR EXPANSIÓN IA",
        "input": "Superordenador + Conector + Goma",
        "machine": "Fabricadora",
        "color": "#3b82f6",
        "bg": "#dbeafe"
      },
      {
        "id": "Ficsonium",
        "name": "FICSONIO",
        "input": "SAM + Residuo de plutonio",
        "machine": "Acelerador de partículas",
        "color": "#c026d3",
        "bg": "#fae8ff"
      },
      {
        "id": "Ficsonium_Fuel_Rod",
        "name": "BARRA COMB. FICSONIO",
        "input": "Ficsonio + Célula singularidad",
        "machine": "Fabricadora",
        "color": "#a21caf",
        "bg": "#fae8ff"
      }
    ]
  },
  {
    "id": "munitions",
    "name": "Armas, Munición y Biomasa",
    "icon": `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
    "color": "#ef4444",
    "items": [
      {
        "id": "Solid_Biofuel",
        "name": "BIODIESEL SÓLIDO",
        "input": "Biomasa",
        "machine": "Constructor",
        "color": "#15803d",
        "bg": "#dcfce7"
      },
      {
        "id": "Liquid_Biofuel",
        "name": "BIODIESEL LÍQUIDO",
        "input": "Biocombustible sólido + Agua",
        "machine": "Refinería",
        "color": "#16a34a",
        "bg": "#dcfce7",
        "liquid": true
      },
      {
        "id": "Fabric",
        "name": "TELA",
        "input": "Micelio + Hojas / Resina",
        "machine": "Ensambladora",
        "color": "#f59e0b",
        "bg": "#fef3c7"
      },
      {
        "id": "Color_Cartridge",
        "name": "CARTUCHO DE COLOR",
        "input": "Pétalos de flores",
        "machine": "Constructor",
        "color": "#d97706",
        "bg": "#fef3c7"
      },
      {
        "id": "Medicinal_Inhaler",
        "name": "INHALADOR MEDICINAL",
        "input": "Micelio + Nuez berilo / Champiñón",
        "machine": "Fabricadora",
        "color": "#dc2626",
        "bg": "#fee2e2"
      },
      {
        "id": "Alien_Protein",
        "name": "PROTEÍNA ALIENÍGENA",
        "input": "Restos de criaturas",
        "machine": "Constructor",
        "color": "#b91c1c",
        "bg": "#fee2e2"
      },
      {
        "id": "Alien_Dna_Capsule",
        "name": "CÁPSULA ADN ALIEN",
        "input": "Proteína alienígena",
        "machine": "Constructor",
        "color": "#991b1b",
        "bg": "#fee2e2"
      },
      {
        "id": "Iron_Rebar",
        "name": "ARMADURA DE HIERRO",
        "input": "Varillas de hierro",
        "machine": "Constructor",
        "color": "#475569",
        "bg": "#f1f5f9"
      },
      {
        "id": "Stun_Rebar",
        "name": "ARMADURA ATURDIDORA",
        "input": "Armadura hierro + Cable rápido",
        "machine": "Ensambladora",
        "color": "#eab308",
        "bg": "#fef9c3"
      },
      {
        "id": "Explosive_Rebar",
        "name": "ARMADURA EXPLOSIVA",
        "input": "Armadura hierro + Pólvora negra",
        "machine": "Ensambladora",
        "color": "#ea580c",
        "bg": "#ffedd5"
      },
      {
        "id": "Shatter_Rebar",
        "name": "ARMADURA METRALLA",
        "input": "Armadura hierro + Cuarzo",
        "machine": "Ensambladora",
        "color": "#db2777",
        "bg": "#fce7f3"
      },
      {
        "id": "Rifle_Ammo",
        "name": "MUNICIÓN DE RIFLE",
        "input": "Lámina cobre + Pólvora sin humo",
        "machine": "Ensambladora",
        "color": "#b45309",
        "bg": "#fef3c7"
      },
      {
        "id": "Homing_Rifle_Ammo",
        "name": "MUNICIÓN GUIADA RIFLE",
        "input": "Munición rifle + Oscilador cristal",
        "machine": "Ensambladora",
        "color": "#0284c7",
        "bg": "#e0f2fe"
      },
      {
        "id": "Turbo_Rifle_Ammo",
        "name": "MUNICIÓN TURBO RIFLE",
        "input": "Munición rifle + Turbocombustible + Carcasa",
        "machine": "Fabricadora",
        "color": "#e11d48",
        "bg": "#ffe4e6"
      },
      {
        "id": "Nobelisk",
        "name": "NOBELISK",
        "input": "Tubería acero + Pólvora negra",
        "machine": "Ensambladora",
        "color": "#ea580c",
        "bg": "#ffedd5"
      },
      {
        "id": "Gas_Nobelisk",
        "name": "NOBELISK DE GAS",
        "input": "Nobelisk + Biomasa",
        "machine": "Ensambladora",
        "color": "#16a34a",
        "bg": "#dcfce7"
      },
      {
        "id": "Pulse_Nobelisk",
        "name": "NOBELISK DE PULSO",
        "input": "Nobelisk + Cristal cuarzo",
        "machine": "Ensambladora",
        "color": "#0284c7",
        "bg": "#e0f2fe"
      },
      {
        "id": "Cluster_Nobelisk",
        "name": "NOBELISK RACIMO",
        "input": "Nobelisk + Pólvora sin humo",
        "machine": "Ensambladora",
        "color": "#c026d3",
        "bg": "#fae8ff"
      },
      {
        "id": "Nuke_Nobelisk",
        "name": "NOBELISK NUCLEAR",
        "input": "Nobelisk + Célula uranio",
        "machine": "Fabricadora",
        "color": "#10b981",
        "bg": "#d1fae5"
      },
      {
        "id": "Gas_Filter",
        "name": "FILTRO DE GAS",
        "input": "Tela + Carbón + Goma",
        "machine": "Fabricadora",
        "color": "#059669",
        "bg": "#d1fae5"
      },
      {
        "id": "Iodine_Infused_Filter",
        "name": "FILTRO DE YODO",
        "input": "Filtro gas + Cable rápido + Carcasa",
        "machine": "Fabricadora",
        "color": "#4338ca",
        "bg": "#e0e7ff"
      }
    ]
  },
  {
    "id": "space",
    "name": "Ascensor Espacial (Fases 1 a 5)",
    "icon": `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 21L14 3h-4L3 21"/><path d="M6 16h12"/><path d="M9 10h6"/></svg>`,
    "color": "#ec4899",
    "items": [
      {
        "id": "Smart_Plating",
        "name": "BLINDAJE INTELIGENTE",
        "input": "Plancha ref. + Rotor (Fase 1)",
        "machine": "Ensambladora",
        "color": "#d97706",
        "bg": "#fef3c7"
      },
      {
        "id": "Versatile_Framework",
        "name": "ESTRUCTURA VERSÁTIL",
        "input": "Estructura modular + Vigas acero (Fase 2)",
        "machine": "Ensambladora",
        "color": "#b45309",
        "bg": "#ffedd5"
      },
      {
        "id": "Automated_Wiring",
        "name": "CABLEADO AUTOMATIZADO",
        "input": "Estator + Cable (Fase 2)",
        "machine": "Ensambladora",
        "color": "#ea580c",
        "bg": "#ffedd5"
      },
      {
        "id": "Modular_Engine",
        "name": "MOTOR MODULAR",
        "input": "Motor + Caucho + Plancha ref. (Fase 3)",
        "machine": "Fabricadora",
        "color": "#ea580c",
        "bg": "#ffedd5"
      },
      {
        "id": "Adaptive_Control_Unit",
        "name": "CONTROL ADAPTABLE",
        "input": "Cableado aut. + Circuito + HMF + Comp. (Fase 3)",
        "machine": "Fabricadora",
        "color": "#4338ca",
        "bg": "#e0e7ff"
      },
      {
        "id": "Assembly_Director_System",
        "name": "DIR. DE ENSAMBLADO",
        "input": "Control adaptable + Superordenador (Fase 4)",
        "machine": "Fabricadora",
        "color": "#2563eb",
        "bg": "#dbeafe"
      },
      {
        "id": "Magnetic_Field_Generator",
        "name": "GEN. CAMPO MAGNÉTICO",
        "input": "Estructura versátil + Barra elect. + Batería (Fase 4)",
        "machine": "Fabricadora",
        "color": "#7c3aed",
        "bg": "#ede9fe"
      },
      {
        "id": "Thermal_Propulsion_Rocket",
        "name": "COHETE PROP. TÉRMICA",
        "input": "Motor modular + Turbomotor + Estructura fus. (Fase 4)",
        "machine": "Fabricadora",
        "color": "#dc2626",
        "bg": "#fee2e2"
      },
      {
        "id": "Nuclear_Pasta",
        "name": "PASTA NUCLEAR",
        "input": "Polvo de cobre + Hormigón (Fase 4)",
        "machine": "Acelerador de partículas",
        "color": "#059669",
        "bg": "#d1fae5"
      },
      {
        "id": "Biochemical_Sculptor",
        "name": "ESCULTOR BIOQUÍMICO",
        "input": "Dir. ensamblado + Materia oscura (Fase 5)",
        "machine": "Ensambladora",
        "color": "#db2777",
        "bg": "#fce7f3"
      },
      {
        "id": "Ballistic_Warp_Drive",
        "name": "MOTOR DISTORSIÓN",
        "input": "Cohete térmico + Célula singularidad (Fase 5)",
        "machine": "Fabricadora",
        "color": "#9333ea",
        "bg": "#f3e8ff"
      },
      {
        "id": "Pressure_Conversion_Cube",
        "name": "CUBO CONV. PRESIÓN",
        "input": "Estructura fusionada + Cable rápido (Fase 5)",
        "machine": "Ensambladora",
        "color": "#4f46e5",
        "bg": "#e0e7ff"
      }
    ]
  }
];

const RESOURCE_CLASS_TO_ITEM = {
  'Desc_OreIron_C': 'Iron_Ore',
  'Desc_OreCopper_C': 'Copper_Ore',
  'Desc_Stone_C': 'Limestone',
  'Desc_Coal_C': 'Coal',
  'Desc_RawQuartz_C': 'Raw_Quartz',
  'Desc_LiquidOil_C': 'Crude_Oil',
  'Desc_OreGold_C': 'Caterium_Ore',
  'Desc_Sulfur_C': 'Sulfur',
  'Desc_Water_C': 'Water',
  'Desc_OreBauxite_C': 'Bauxite',
  'Desc_OreUranium_C': 'Uranium',
  'Desc_NitrogenGas_C': 'Nitrogen_Gas',
  'Desc_SAM_C': 'SAM'
};

// Synchronize item names with official Spanish translations
if (typeof getItemNameEs === 'function') {
  for (const cat of SATISFACTORY_CATEGORIES) {
    for (const item of cat.items) {
      const official = getItemNameEs(item.id);
      if (official && official !== item.id) {
        item.name = official.toUpperCase();
        item.nameEs = official;
      }
    }
  }
}

if (typeof window !== 'undefined') {
  window.SATISFACTORY_CATEGORIES = SATISFACTORY_CATEGORIES;
  window.RESOURCE_CLASS_TO_ITEM = RESOURCE_CLASS_TO_ITEM;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SATISFACTORY_CATEGORIES, RESOURCE_CLASS_TO_ITEM };
}
