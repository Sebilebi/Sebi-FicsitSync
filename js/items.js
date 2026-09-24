// Catálogo Completo de Satisfactory (Fase 3) - 48 Ítems
const SATISFACTORY_CATEGORIES = [
  {
    "id": "iron",
    "name": "Hierro y Derivados",
    "icon": `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14l8-8 8 8M4 10l8-8 8 8M12 2v20"/></svg>`,
    "color": "#ea580c",
    "items": [
      {
        "id": "Iron_Ore",
        "name": "MINERAL HIERRO",
        "input": "Extractor Minero",
        "color": "#7c2d12",
        "bg": "#ffedd5",
        "type": "extractor"
      },
      {
        "id": "Iron_Ingot",
        "name": "LINGOTE HIERRO",
        "input": "Mineral de Hierro",
        "color": "#ea580c",
        "bg": "#ffedd5"
      },
      {
        "id": "Iron_Plate",
        "name": "PLACA DE HIERRO",
        "input": "Lingotes de Hierro",
        "color": "#c2410c",
        "bg": "#ffedd5"
      },
      {
        "id": "Iron_Rod",
        "name": "VARILLA HIERRO",
        "input": "Lingotes de Hierro",
        "color": "#9a3412",
        "bg": "#ffedd5"
      },
      {
        "id": "Screw",
        "name": "TORNILLOS",
        "input": "Varillas de Hierro",
        "color": "#78350f",
        "bg": "#fef3c7"
      },
      {
        "id": "Reinforced_Iron_Plate",
        "name": "PLACA REFORZADA",
        "input": "Placas + Tornillos",
        "color": "#b45309",
        "bg": "#ffedd5"
      },
      {
        "id": "Rotor",
        "name": "ROTOR",
        "input": "Varillas + Tornillos",
        "color": "#d97706",
        "bg": "#fef3c7"
      },
      {
        "id": "Modular_Frame",
        "name": "MARCO MODULAR",
        "input": "Placas Ref. + Varillas",
        "color": "#475569",
        "bg": "#f1f5f9"
      }
    ]
  },
  {
    "id": "copper",
    "name": "Cobre y Electrónica",
    "icon": `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/></svg>`,
    "color": "#c2410c",
    "items": [
      {
        "id": "Copper_Ore",
        "name": "MINERAL COBRE",
        "input": "Extractor Minero",
        "color": "#7c2d12",
        "bg": "#fed7aa",
        "type": "extractor"
      },
      {
        "id": "Copper_Ingot",
        "name": "LINGOTE COBRE",
        "input": "Mineral de Cobre",
        "color": "#c2410c",
        "bg": "#fed7aa"
      },
      {
        "id": "Wire",
        "name": "ALAMBRE",
        "input": "Lingote de Cobre",
        "color": "#ea580c",
        "bg": "#ffedd5"
      },
      {
        "id": "Cable",
        "name": "CABLE",
        "input": "Alambre de Cobre",
        "color": "#10b981",
        "bg": "#ecfdf5"
      },
      {
        "id": "Copper_Sheet",
        "name": "LÁMINA COBRE",
        "input": "Lingote de Cobre",
        "color": "#b45309",
        "bg": "#fed7aa"
      },
      {
        "id": "Circuit_Board",
        "name": "PLACA CIRCUITO",
        "input": "Plástico + Lámina Cobre",
        "color": "#16a34a",
        "bg": "#dcfce7"
      },
      {
        "id": "Computer",
        "name": "COMPUTADORA",
        "input": "Circuitos + Plástico + Cable",
        "color": "#2563eb",
        "bg": "#dbeafe"
      },
      {
        "id": "AI_Limiter",
        "name": "LIMITADOR IA",
        "input": "Quickwire + Lámina Cobre",
        "color": "#eab308",
        "bg": "#fef9c3"
      }
    ]
  },
  {
    "id": "steel",
    "name": "Acero y Construcción",
    "icon": `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3v18h12V3zM6 8h12M6 13h12M6 18h12"/></svg>`,
    "color": "#334155",
    "items": [
      {
        "id": "Limestone",
        "name": "PIEDRA CALIZA",
        "input": "Extractor Minero",
        "color": "#64748b",
        "bg": "#f1f5f9",
        "type": "extractor"
      },
      {
        "id": "Concrete",
        "name": "HORMIGÓN",
        "input": "Piedra Caliza",
        "color": "#475569",
        "bg": "#f1f5f9"
      },
      {
        "id": "Coal",
        "name": "CARBÓN",
        "input": "Extractor Minero",
        "color": "#0f172a",
        "bg": "#e2e8f0",
        "type": "extractor"
      },
      {
        "id": "Steel_Ingot",
        "name": "LINGOTE ACERO",
        "input": "Hierro + Carbón",
        "color": "#334155",
        "bg": "#e2e8f0"
      },
      {
        "id": "Steel_Beam",
        "name": "VIGA DE ACERO",
        "input": "Lingote de Acero",
        "color": "#1e293b",
        "bg": "#e2e8f0"
      },
      {
        "id": "Steel_Pipe",
        "name": "TUBO DE ACERO",
        "input": "Lingote de Acero",
        "color": "#334155",
        "bg": "#e2e8f0"
      },
      {
        "id": "Encased_Industrial_Beam",
        "name": "VIGA ENCASILLADA",
        "input": "Viga Acero + Hormigón",
        "color": "#475569",
        "bg": "#f8fafc"
      },
      {
        "id": "Stator",
        "name": "ESTÁTOR",
        "input": "Tubo Acero + Alambre",
        "color": "#6366f1",
        "bg": "#e0e7ff"
      },
      {
        "id": "Motor",
        "name": "MOTOR",
        "input": "Rotor + Estátor",
        "color": "#dc2626",
        "bg": "#fee2e2"
      },
      {
        "id": "Heavy_Modular_Frame",
        "name": "MARCO PESADO HMF",
        "input": "Marco Mod. + Viga Enc. + Horm.",
        "color": "#3f6212",
        "bg": "#ecfccb"
      }
    ]
  },
  {
    "id": "oil",
    "name": "Petróleo y Fluidos (Fase 3)",
    "icon": `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`,
    "color": "#0891b2",
    "items": [
      {
        "id": "Crude_Oil",
        "name": "PETRÓLEO CRUDO",
        "input": "Extractor de Petróleo",
        "color": "#0f172a",
        "bg": "#e2e8f0",
        "type": "extractor"
      },
      {
        "id": "Plastic",
        "name": "PLÁSTICO",
        "input": "Petróleo Crudo",
        "color": "#0891b2",
        "bg": "#cffafe"
      },
      {
        "id": "Rubber",
        "name": "CAUCHO / GOMA",
        "input": "Petróleo Crudo",
        "color": "#0f172a",
        "bg": "#f1f5f9"
      },
      {
        "id": "Fuel",
        "name": "COMBUSTIBLE",
        "input": "Petróleo Crudo",
        "color": "#f59e0b",
        "bg": "#fef3c7"
      },
      {
        "id": "Petroleum_Coke",
        "name": "COQUE PETRÓLEO",
        "input": "Residuo Petróleo Pesado",
        "color": "#334155",
        "bg": "#e2e8f0"
      },
      {
        "id": "Polymer_Resin",
        "name": "RESINA POLÍMERO",
        "input": "Subproducto Refinería",
        "color": "#8b5cf6",
        "bg": "#ede9fe"
      },
      {
        "id": "Empty_Canister",
        "name": "ENVASE VACÍO",
        "input": "Plástico",
        "color": "#0284c7",
        "bg": "#e0f2fe"
      }
    ]
  },
  {
    "id": "mam",
    "name": "Caterio, Cuarzo, Azufre (MAM)",
    "icon": `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    "color": "#eab308",
    "items": [
      {
        "id": "Caterium_Ore",
        "name": "MINERAL CATERIO",
        "input": "Extractor Minero",
        "color": "#854d0e",
        "bg": "#fef9c3",
        "type": "extractor"
      },
      {
        "id": "Caterium_Ingot",
        "name": "LINGOTE CATERIO",
        "input": "Mineral Caterio",
        "color": "#eab308",
        "bg": "#fef9c3"
      },
      {
        "id": "Quickwire",
        "name": "ALAMBRE RÁPIDO",
        "input": "Lingote Caterio",
        "color": "#ca8a04",
        "bg": "#fef9c3"
      },
      {
        "id": "Raw_Quartz",
        "name": "CUARZO BRUTO",
        "input": "Extractor Minero",
        "color": "#9d174d",
        "bg": "#fdf2f8",
        "type": "extractor"
      },
      {
        "id": "Quartz_Crystal",
        "name": "CRISTAL CUARZO",
        "input": "Cuarzo Bruto",
        "color": "#db2777",
        "bg": "#fdf2f8"
      },
      {
        "id": "Silica",
        "name": "SÍLICE",
        "input": "Cuarzo Bruto",
        "color": "#be185d",
        "bg": "#fdf2f8"
      },
      {
        "id": "Crystal_Oscillator",
        "name": "OSCILADOR CRISTAL",
        "input": "Cristal + Cable + Placa Ref.",
        "color": "#be185d",
        "bg": "#fdf2f8"
      },
      {
        "id": "Sulfur",
        "name": "AZUFRE",
        "input": "Extractor Minero",
        "color": "#a16207",
        "bg": "#fef9c3",
        "type": "extractor"
      },
      {
        "id": "Black_Powder",
        "name": "PÓLVORA NEGRA",
        "input": "Azufre + Carbón",
        "color": "#1e293b",
        "bg": "#e2e8f0"
      },
      {
        "id": "Solid_Biofuel",
        "name": "BIOCOMBUSTIBLE SÓLIDO",
        "input": "Biomasa",
        "color": "#15803d",
        "bg": "#dcfce7"
      }
    ]
  },
  {
    "id": "space",
    "name": "Ascensor Espacial (Fases 1, 2 y 3)",
    "icon": `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 21L14 3h-4L3 21"/><path d="M6 16h12"/><path d="M9 10h6"/></svg>`,
    "color": "#d97706",
    "items": [
      {
        "id": "Smart_Plating",
        "name": "REVESTIMIENTO INTELIGENTE",
        "input": "Placa Reforzada + Rotor (Fase 1)",
        "color": "#b45309",
        "bg": "#ffedd5"
      },
      {
        "id": "Versatile_Framework",
        "name": "ESTRUCTURA VERSÁTIL",
        "input": "Marco Modular + Vigas Acero (Fase 2)",
        "color": "#1e293b",
        "bg": "#e2e8f0"
      },
      {
        "id": "Automated_Wiring",
        "name": "CABLEADO AUTOMATIZADO",
        "input": "Estátor + Cable (Fase 2)",
        "color": "#047857",
        "bg": "#ecfdf5"
      },
      {
        "id": "Modular_Engine",
        "name": "MOTOR MODULAR",
        "input": "Motor + Caucho + Placa Ref. (Fase 3)",
        "color": "#ea580c",
        "bg": "#ffedd5"
      },
      {
        "id": "Adaptive_Control_Unit",
        "name": "CONTROL ADAPTATIVO",
        "input": "Cableado Aut. + Circuito + HMF + Comp. (Fase 3)",
        "color": "#4338ca",
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

if (typeof window !== 'undefined') {
  window.RESOURCE_CLASS_TO_ITEM = RESOURCE_CLASS_TO_ITEM;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SATISFACTORY_CATEGORIES, RESOURCE_CLASS_TO_ITEM };
}
