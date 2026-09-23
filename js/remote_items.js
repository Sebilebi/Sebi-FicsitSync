const SATISFACTORY_CATEGORIES = [
  {
    "id": "ores",
    "name": "Recursos Naturales",
    "icon": "⛏️",
    "color": "#a8a29e",
    "items": [
      {
        "id": "Iron_Ore",
        "name": "IRON ORE",
        "input": "Extractor Minero",
        "color": "#a8a29e",
        "bg": "#1e293b",
        "type": "extractor",
        "liquid": false
      },
      {
        "id": "Copper_Ore",
        "name": "COPPER ORE",
        "input": "Extractor Minero",
        "color": "#a8a29e",
        "bg": "#1e293b",
        "type": "extractor",
        "liquid": false
      },
      {
        "id": "Coal",
        "name": "COAL",
        "input": "Extractor Minero",
        "color": "#a8a29e",
        "bg": "#1e293b",
        "type": "extractor",
        "liquid": false
      },
      {
        "id": "Limestone",
        "name": "LIMESTONE",
        "input": "Extractor Minero",
        "color": "#a8a29e",
        "bg": "#1e293b",
        "type": "extractor",
        "liquid": false
      },
      {
        "id": "Caterium_Ore",
        "name": "CATERIUM ORE",
        "input": "Extractor Minero",
        "color": "#a8a29e",
        "bg": "#1e293b",
        "type": "extractor",
        "liquid": false
      },
      {
        "id": "Bauxite",
        "name": "BAUXITE",
        "input": "Extractor Minero",
        "color": "#a8a29e",
        "bg": "#1e293b",
        "type": "extractor",
        "liquid": false
      },
      {
        "id": "Raw_Quartz",
        "name": "RAW QUARTZ",
        "input": "Extractor Minero",
        "color": "#a8a29e",
        "bg": "#1e293b",
        "type": "extractor",
        "liquid": false
      },
      {
        "id": "Sulfur",
        "name": "SULFUR",
        "input": "Extractor Minero",
        "color": "#a8a29e",
        "bg": "#1e293b",
        "type": "extractor",
        "liquid": false
      },
      {
        "id": "Uranium",
        "name": "URANIUM",
        "input": "Extractor Minero",
        "color": "#a8a29e",
        "bg": "#1e293b",
        "type": "extractor",
        "liquid": false
      },
      {
        "id": "Sam",
        "name": "Sam",
        "input": "Variable",
        "color": "#a8a29e",
        "bg": "#1e293b"
      }
    ]
  },
  {
    "id": "liquids",
    "name": "Fluidos y Gases",
    "icon": "💧",
    "color": "#38bdf8",
    "items": [
      {
        "id": "Water",
        "name": "WATER",
        "input": "Packaged Water",
        "color": "#38bdf8",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": true
      },
      {
        "id": "Crude_Oil",
        "name": "CRUDE OIL",
        "input": "Packaged Oil",
        "color": "#38bdf8",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": true
      },
      {
        "id": "Heavy_Oil_Residue",
        "name": "HEAVY OIL RESIDUE",
        "input": "Packaged Heavy Oil Residue",
        "color": "#38bdf8",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": true
      },
      {
        "id": "Fuel",
        "name": "FUEL",
        "input": "Crude Oil",
        "color": "#38bdf8",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": true
      },
      {
        "id": "Turbofuel",
        "name": "TURBOFUEL",
        "input": "Packaged Turbofuel",
        "color": "#38bdf8",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": true
      },
      {
        "id": "Liquid_Biofuel",
        "name": "LIQUID BIOFUEL",
        "input": "Solid Biofuel + Water",
        "color": "#38bdf8",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": true
      },
      {
        "id": "Alumina_Solution",
        "name": "ALUMINA SOLUTION",
        "input": "Bauxite + Water",
        "color": "#38bdf8",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": true
      },
      {
        "id": "Sulfuric_Acid",
        "name": "SULFURIC ACID",
        "input": "Sulfur + Water",
        "color": "#38bdf8",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": true
      },
      {
        "id": "Nitric_Acid",
        "name": "NITRIC ACID",
        "input": "Nitrogen Gas + Water + Iron Plate",
        "color": "#38bdf8",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": true
      },
      {
        "id": "Nitrogen_Gas",
        "name": "NITROGEN GAS",
        "input": "Packaged Nitrogen Gas",
        "color": "#38bdf8",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": true
      },
      {
        "id": "Dissolved_Silica",
        "name": "Dissolved Silica",
        "input": "Variable",
        "color": "#38bdf8",
        "bg": "#1e293b"
      }
    ]
  },
  {
    "id": "ingots",
    "name": "Fundición",
    "icon": "🔥",
    "color": "#ea580c",
    "items": [
      {
        "id": "Iron_Ingot",
        "name": "IRON INGOT",
        "input": "Iron Ore",
        "color": "#ea580c",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Copper_Ingot",
        "name": "COPPER INGOT",
        "input": "Copper Ore",
        "color": "#ea580c",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Steel_Ingot",
        "name": "STEEL INGOT",
        "input": "Iron Ore + Coal",
        "color": "#ea580c",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Caterium_Ingot",
        "name": "CATERIUM INGOT",
        "input": "Caterium Ore",
        "color": "#ea580c",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Aluminum_Ingot",
        "name": "ALUMINUM INGOT",
        "input": "Aluminum Scrap + Silica",
        "color": "#ea580c",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Ficsite_Ingot",
        "name": "Ficsite Ingot",
        "input": "Variable",
        "color": "#ea580c",
        "bg": "#1e293b"
      }
    ]
  },
  {
    "id": "t1",
    "name": "Componentes T1",
    "icon": "⚙️",
    "color": "#94a3b8",
    "items": [
      {
        "id": "Iron_Plate",
        "name": "IRON PLATE",
        "input": "Iron Ingot",
        "color": "#94a3b8",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Iron_Rod",
        "name": "IRON ROD",
        "input": "Iron Ingot",
        "color": "#94a3b8",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Wire",
        "name": "WIRE",
        "input": "Copper Ingot",
        "color": "#94a3b8",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Cable",
        "name": "CABLE",
        "input": "Wire",
        "color": "#94a3b8",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Screw",
        "name": "SCREW",
        "input": "Iron Rod",
        "color": "#94a3b8",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Concrete",
        "name": "CONCRETE",
        "input": "Limestone",
        "color": "#94a3b8",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Copper_Sheet",
        "name": "COPPER SHEET",
        "input": "Copper Ingot",
        "color": "#94a3b8",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Quartz_Crystal",
        "name": "QUARTZ CRYSTAL",
        "input": "Raw Quartz",
        "color": "#94a3b8",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Silica",
        "name": "SILICA",
        "input": "Raw Quartz",
        "color": "#94a3b8",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Polymer_Resin",
        "name": "POLYMER RESIN",
        "input": "Extractor Minero",
        "color": "#94a3b8",
        "bg": "#1e293b",
        "type": "extractor",
        "liquid": false
      },
      {
        "id": "Petroleum_Coke",
        "name": "PETROLEUM COKE",
        "input": "Heavy Oil Residue",
        "color": "#94a3b8",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      }
    ]
  },
  {
    "id": "t2",
    "name": "Componentes T2",
    "icon": "🔩",
    "color": "#64748b",
    "items": [
      {
        "id": "Reinforced_Iron_Plate",
        "name": "REINFORCED IRON PLATE",
        "input": "Iron Plate + Screw",
        "color": "#64748b",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Rotor",
        "name": "ROTOR",
        "input": "Iron Rod + Screw",
        "color": "#64748b",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Stator",
        "name": "STATOR",
        "input": "Steel Pipe + Wire",
        "color": "#64748b",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Motor",
        "name": "MOTOR",
        "input": "Rotor + Stator",
        "color": "#64748b",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Modular_Frame",
        "name": "MODULAR FRAME",
        "input": "Reinforced Iron Plate + Iron Rod",
        "color": "#64748b",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Steel_Pipe",
        "name": "STEEL PIPE",
        "input": "Steel Ingot",
        "color": "#64748b",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Steel_Beam",
        "name": "STEEL BEAM",
        "input": "Steel Ingot",
        "color": "#64748b",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Encased_Industrial_Beam",
        "name": "ENCASED INDUSTRIAL BEAM",
        "input": "Steel Beam + Concrete",
        "color": "#64748b",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Empty_Canister",
        "name": "EMPTY CANISTER",
        "input": "Plastic",
        "color": "#64748b",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Plastic",
        "name": "PLASTIC",
        "input": "Crude Oil",
        "color": "#64748b",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Rubber",
        "name": "RUBBER",
        "input": "Crude Oil",
        "color": "#64748b",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Aluminum_Casing",
        "name": "ALUMINUM CASING",
        "input": "Aluminum Ingot",
        "color": "#64748b",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Alclad_Aluminum_Sheet",
        "name": "ALCLAD ALUMINUM SHEET",
        "input": "Aluminum Ingot + Copper Ingot",
        "color": "#64748b",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Copper_Powder",
        "name": "COPPER POWDER",
        "input": "Copper Ingot",
        "color": "#64748b",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      }
    ]
  },
  {
    "id": "t3",
    "name": "Electrónica y T3",
    "icon": "💻",
    "color": "#3b82f6",
    "items": [
      {
        "id": "Quickwire",
        "name": "QUICKWIRE",
        "input": "Caterium Ingot",
        "color": "#3b82f6",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Circuit_Board",
        "name": "CIRCUIT BOARD",
        "input": "Copper Sheet + Plastic",
        "color": "#3b82f6",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Ai_Limiter",
        "name": "AI LIMITER",
        "input": "Copper Sheet + Quickwire",
        "color": "#3b82f6",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "High_Speed_Connector",
        "name": "HIGH-SPEED CONNECTOR",
        "input": "Quickwire + Cable + Circuit Board",
        "color": "#3b82f6",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Computer",
        "name": "COMPUTER",
        "input": "Circuit Board + Cable + Plastic + Screw",
        "color": "#3b82f6",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Supercomputer",
        "name": "SUPERCOMPUTER",
        "input": "Computer + Ai Limiter + High Speed Connector + Plastic",
        "color": "#3b82f6",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Crystal_Oscillator",
        "name": "CRYSTAL OSCILLATOR",
        "input": "Quartz Crystal + Cable + Reinforced Iron Plate",
        "color": "#3b82f6",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Radio_Control_Unit",
        "name": "RADIO CONTROL UNIT",
        "input": "Aluminum Casing + Crystal Oscillator + Computer",
        "color": "#3b82f6",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Heavy_Modular_Frame",
        "name": "HEAVY MODULAR FRAME",
        "input": "Modular Frame + Steel Pipe + Encased Industrial Beam + Screw",
        "color": "#3b82f6",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Fused_Modular_Frame",
        "name": "FUSED MODULAR FRAME",
        "input": "Heavy Modular Frame + Aluminum Casing + Nitrogen Gas",
        "color": "#3b82f6",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Cooling_System",
        "name": "COOLING SYSTEM",
        "input": "Heat Sink + Rubber + Water + Nitrogen Gas",
        "color": "#3b82f6",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Battery",
        "name": "BATTERY",
        "input": "Sulfuric Acid + Alumina Solution + Aluminum Casing",
        "color": "#3b82f6",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Electromagnetic_Control_Rod",
        "name": "ELECTROMAGNETIC CONTROL ROD",
        "input": "Stator + Ai Limiter",
        "color": "#3b82f6",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      }
    ]
  },
  {
    "id": "space",
    "name": "Proyecto Espacial",
    "icon": "🚀",
    "color": "#f59e0b",
    "items": [
      {
        "id": "Smart_Plating",
        "name": "SMART PLATING",
        "input": "Reinforced Iron Plate + Rotor",
        "color": "#f59e0b",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Versatile_Framework",
        "name": "VERSATILE FRAMEWORK",
        "input": "Modular Frame + Steel Beam",
        "color": "#f59e0b",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Automated_Wiring",
        "name": "AUTOMATED WIRING",
        "input": "Stator + Cable",
        "color": "#f59e0b",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Modular_Engine",
        "name": "MODULAR ENGINE",
        "input": "Motor + Rubber + Smart Plating",
        "color": "#f59e0b",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Adaptive_Control_Unit",
        "name": "ADAPTIVE CONTROL UNIT",
        "input": "Automated Wiring + Circuit Board + Heavy Modular Frame + Computer",
        "color": "#f59e0b",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Assembly_Director_System",
        "name": "ASSEMBLY DIRECTOR SYSTEM",
        "input": "Adaptive Control Unit + Supercomputer",
        "color": "#f59e0b",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Magnetic_Field_Generator",
        "name": "MAGNETIC FIELD GENERATOR",
        "input": "Versatile Framework + Electromagnetic Control Rod + Battery",
        "color": "#f59e0b",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Thermal_Propulsion_Rocket",
        "name": "THERMAL PROPULSION ROCKET",
        "input": "Modular Engine + Turbo Motor + Cooling System + Fused Modular Frame",
        "color": "#f59e0b",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Nuclear_Pasta",
        "name": "NUCLEAR PASTA",
        "input": "Copper Powder + Pressure Conversion Cube",
        "color": "#f59e0b",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      }
    ]
  },
  {
    "id": "nuclear",
    "name": "Energía Nuclear",
    "icon": "☢️",
    "color": "#22c55e",
    "items": [
      {
        "id": "Encased_Uranium_Cell",
        "name": "ENCASED URANIUM CELL",
        "input": "Uranium + Concrete + Sulfuric Acid",
        "color": "#22c55e",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Uranium_Fuel_Rod",
        "name": "URANIUM FUEL ROD",
        "input": "Encased Uranium Cell + Encased Industrial Beam + Electromagnetic Control Rod",
        "color": "#22c55e",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Uranium_Waste",
        "name": "URANIUM WASTE",
        "input": "Extractor Minero",
        "color": "#22c55e",
        "bg": "#1e293b",
        "type": "extractor",
        "liquid": false
      },
      {
        "id": "Non_Fissile_Uranium",
        "name": "NON-FISSILE URANIUM",
        "input": "Uranium Waste + Silica + Nitric Acid + Sulfuric Acid",
        "color": "#22c55e",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Plutonium_Pellet",
        "name": "PLUTONIUM PELLET",
        "input": "Non Fissile Uranium + Uranium Waste",
        "color": "#22c55e",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Encased_Plutonium_Cell",
        "name": "ENCASED PLUTONIUM CELL",
        "input": "Plutonium Pellet + Concrete",
        "color": "#22c55e",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Plutonium_Fuel_Rod",
        "name": "PLUTONIUM FUEL ROD",
        "input": "Encased Plutonium Cell + Steel Beam + Electromagnetic Control Rod + Heat Sink",
        "color": "#22c55e",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Plutonium_Waste",
        "name": "PLUTONIUM WASTE",
        "input": "Extractor Minero",
        "color": "#22c55e",
        "bg": "#1e293b",
        "type": "extractor",
        "liquid": false
      }
    ]
  },
  {
    "id": "otros",
    "name": "Otros Materiales",
    "icon": "📦",
    "color": "#a855f7",
    "items": [
      {
        "id": "Color_Cartridge",
        "name": "COLOR CARTRIDGE",
        "input": "Flower Petals",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Power_Shard",
        "name": "POWER SHARD",
        "input": "Purple Power Slug",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Packaged_Turbofuel",
        "name": "PACKAGED TURBOFUEL",
        "input": "Turbofuel + Empty Canister",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Packaged_Fuel",
        "name": "PACKAGED FUEL",
        "input": "Fuel + Empty Canister",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Packaged_Oil",
        "name": "PACKAGED OIL",
        "input": "Crude Oil + Empty Canister",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Packaged_Heavy_Oil_Residue",
        "name": "PACKAGED HEAVY OIL RESIDUE",
        "input": "Heavy Oil Residue + Empty Canister",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Packaged_Water",
        "name": "PACKAGED WATER",
        "input": "Water + Empty Canister",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Aluminum_Scrap",
        "name": "ALUMINUM SCRAP",
        "input": "Alumina Solution + Coal",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Heat_Sink",
        "name": "HEAT SINK",
        "input": "Alclad Aluminum Sheet + Copper Sheet",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Turbo_Motor",
        "name": "TURBO MOTOR",
        "input": "Cooling System + Radio Control Unit + Motor + Rubber",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Pressure_Conversion_Cube",
        "name": "PRESSURE CONVERSION CUBE",
        "input": "Fused Modular Frame + Radio Control Unit",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Empty_Fluid_Tank",
        "name": "EMPTY FLUID TANK",
        "input": "Aluminum Ingot",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Black_Powder",
        "name": "BLACK POWDER",
        "input": "Coal + Sulfur",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Gas_Filter",
        "name": "GAS FILTER",
        "input": "Coal + Rubber + Fabric",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Iodine_Infused_Filter",
        "name": "IODINE INFUSED FILTER",
        "input": "Gas Filter + Quickwire + Aluminum Casing",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Alien_Protein",
        "name": "ALIEN PROTEIN",
        "input": "Stinger Remains",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Alien_Dna_Capsule",
        "name": "ALIEN DNA CAPSULE",
        "input": "Alien Protein",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Purple_Power_Slug",
        "name": "PURPLE POWER SLUG",
        "input": "Recolección/Extractor",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "extractor",
        "liquid": false
      },
      {
        "id": "Yellow_Power_Slug",
        "name": "YELLOW POWER SLUG",
        "input": "Recolección/Extractor",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "extractor",
        "liquid": false
      },
      {
        "id": "Blue_Power_Slug",
        "name": "BLUE POWER SLUG",
        "input": "Recolección/Extractor",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "extractor",
        "liquid": false
      },
      {
        "id": "Smokeless_Powder",
        "name": "SMOKELESS POWDER",
        "input": "Black Powder + Heavy Oil Residue",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Xeno_Zapper",
        "name": "XENO-ZAPPER",
        "input": "Iron Rod + Reinforced Iron Plate + Cable + Wire",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Xeno_Basher",
        "name": "XENO-BASHER",
        "input": "Modular Frame + Xeno Zapper + Cable + Wire",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Portable_Miner",
        "name": "PORTABLE MINER",
        "input": "Iron Plate + Iron Rod",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Hover_Pack",
        "name": "HOVER PACK",
        "input": "Motor + Heavy Modular Frame + Computer + Alclad Aluminum Sheet",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Hazmat_Suit",
        "name": "HAZMAT SUIT",
        "input": "Rubber + Plastic + Alclad Aluminum Sheet + Fabric",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Gas_Mask",
        "name": "GAS MASK",
        "input": "Rubber + Plastic + Fabric",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Jetpack",
        "name": "JETPACK",
        "input": "Plastic + Rubber + Circuit Board + Motor",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Chainsaw",
        "name": "CHAINSAW",
        "input": "Reinforced Iron Plate + Iron Rod + Screw + Cable",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Object_Scanner",
        "name": "OBJECT SCANNER",
        "input": "Reinforced Iron Plate + Wire + Screw",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Rebar_Gun",
        "name": "REBAR GUN",
        "input": "Reinforced Iron Plate + Iron Rod + Screw",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Rifle",
        "name": "RIFLE",
        "input": "Motor + Rubber + Steel Pipe + Screw",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Blade_Runners",
        "name": "BLADE RUNNERS",
        "input": "Silica + Modular Frame + Rotor",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Zipline",
        "name": "ZIPLINE",
        "input": "Xeno Zapper + Quickwire + Iron Rod + Cable",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Nobelisk_Detonator",
        "name": "NOBELISK DETONATOR",
        "input": "Object Scanner + Steel Beam + Cable",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Factory_Carttm",
        "name": "FACTORY CART™",
        "input": "Reinforced Iron Plate + Iron Rod + Rotor",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Golden_Factory_Carttm",
        "name": "GOLDEN FACTORY CART™",
        "input": "Caterium Ingot + Iron Rod + Rotor",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Flower_Petals",
        "name": "FLOWER PETALS",
        "input": "Recolección/Extractor",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "extractor",
        "liquid": false
      },
      {
        "id": "Wood",
        "name": "WOOD",
        "input": "Recolección/Extractor",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "extractor",
        "liquid": false
      },
      {
        "id": "Biomass",
        "name": "BIOMASS",
        "input": "Alien Protein",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Solid_Biofuel",
        "name": "SOLID BIOFUEL",
        "input": "Biomass",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Packaged_Liquid_Biofuel",
        "name": "PACKAGED LIQUID BIOFUEL",
        "input": "Liquid Biofuel + Empty Canister",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Packaged_Alumina_Solution",
        "name": "PACKAGED ALUMINA SOLUTION",
        "input": "Alumina Solution + Empty Canister",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Packaged_Nitrogen_Gas",
        "name": "PACKAGED NITROGEN GAS",
        "input": "Nitrogen Gas + Empty Fluid Tank",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Packaged_Nitric_Acid",
        "name": "PACKAGED NITRIC ACID",
        "input": "Nitric Acid + Empty Fluid Tank",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Packaged_Sulfuric_Acid",
        "name": "PACKAGED SULFURIC ACID",
        "input": "Sulfuric Acid + Empty Canister",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Fabric",
        "name": "FABRIC",
        "input": "Mycelia + Biomass",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Stinger_Remains",
        "name": "STINGER REMAINS",
        "input": "Recolección/Extractor",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "extractor",
        "liquid": false
      },
      {
        "id": "Plasma_Spitter_Remains",
        "name": "PLASMA SPITTER REMAINS",
        "input": "Recolección/Extractor",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "extractor",
        "liquid": false
      },
      {
        "id": "Hog_Remains",
        "name": "HOG REMAINS",
        "input": "Recolección/Extractor",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "extractor",
        "liquid": false
      },
      {
        "id": "Hatcher_Remains",
        "name": "HATCHER REMAINS",
        "input": "Recolección/Extractor",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "extractor",
        "liquid": false
      },
      {
        "id": "Mycelia",
        "name": "MYCELIA",
        "input": "Recolección/Extractor",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "extractor",
        "liquid": false
      },
      {
        "id": "Leaves",
        "name": "LEAVES",
        "input": "Recolección/Extractor",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "extractor",
        "liquid": false
      },
      {
        "id": "Beacon",
        "name": "BEACON",
        "input": "Iron Plate + Iron Rod + Wire + Cable",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Medicinal_Inhaler",
        "name": "MEDICINAL INHALER",
        "input": "Alien Protein + Beryl Nut",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Beryl_Nut",
        "name": "BERYL NUT",
        "input": "Recolección/Extractor",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "extractor",
        "liquid": false
      },
      {
        "id": "Bacon_Agaric",
        "name": "BACON AGARIC",
        "input": "Recolección/Extractor",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "extractor",
        "liquid": false
      },
      {
        "id": "Paleberry",
        "name": "PALEBERRY",
        "input": "Recolección/Extractor",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "extractor",
        "liquid": false
      },
      {
        "id": "Parachute",
        "name": "PARACHUTE",
        "input": "Fabric + Cable",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Explosive_Rebar",
        "name": "EXPLOSIVE REBAR",
        "input": "Iron Rebar + Smokeless Powder + Steel Pipe",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Stun_Rebar",
        "name": "STUN REBAR",
        "input": "Iron Rebar + Quickwire",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Iron_Rebar",
        "name": "IRON REBAR",
        "input": "Iron Rod",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Homing_Rifle_Ammo",
        "name": "HOMING RIFLE AMMO",
        "input": "Rifle Ammo + High Speed Connector",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Nobelisk",
        "name": "NOBELISK",
        "input": "Black Powder + Steel Pipe",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Cluster_Nobelisk",
        "name": "CLUSTER NOBELISK",
        "input": "Nobelisk + Smokeless Powder",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Gas_Nobelisk",
        "name": "GAS NOBELISK",
        "input": "Nobelisk + Biomass",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Nuke_Nobelisk",
        "name": "NUKE NOBELISK",
        "input": "Nobelisk + Encased Uranium Cell + Smokeless Powder + Ai Limiter",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Pulse_Nobelisk",
        "name": "PULSE NOBELISK",
        "input": "Nobelisk + Crystal Oscillator",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Shatter_Rebar",
        "name": "SHATTER REBAR",
        "input": "Iron Rebar + Quartz Crystal",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Turbo_Rifle_Ammo",
        "name": "TURBO RIFLE AMMO",
        "input": "Rifle Ammo + Aluminum Casing + Packaged Turbofuel",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      },
      {
        "id": "Rifle_Ammo",
        "name": "RIFLE AMMO",
        "input": "Copper Sheet + Smokeless Powder",
        "color": "#a855f7",
        "bg": "#1e293b",
        "type": "machine",
        "liquid": false
      }
    ]
  }
];
const FLOW_ITEM_DEPENDENCIES = {
  "Iron_Plate": [
    "Iron_Ingot"
  ],
  "Iron_Rod": [
    "Iron_Ingot"
  ],
  "Xeno_Zapper": [
    "Iron_Rod",
    "Reinforced_Iron_Plate",
    "Cable",
    "Wire"
  ],
  "Iron_Ingot": [
    "Iron_Ore"
  ],
  "Color_Cartridge": [
    "Flower_Petals"
  ],
  "Packaged_Turbofuel": [
    "Turbofuel",
    "Empty_Canister"
  ],
  "Turbofuel": [
    "Packaged_Turbofuel"
  ],
  "Circuit_Board": [
    "Copper_Sheet",
    "Plastic"
  ],
  "Fuel": [
    "Crude_Oil"
  ],
  "Petroleum_Coke": [
    "Heavy_Oil_Residue"
  ],
  "Plastic": [
    "Crude_Oil"
  ],
  "Rubber": [
    "Crude_Oil"
  ],
  "Steel_Beam": [
    "Steel_Ingot"
  ],
  "Steel_Pipe": [
    "Steel_Ingot"
  ],
  "Steel_Ingot": [
    "Iron_Ore",
    "Coal"
  ],
  "Versatile_Framework": [
    "Modular_Frame",
    "Steel_Beam"
  ],
  "Empty_Canister": [
    "Plastic"
  ],
  "Packaged_Fuel": [
    "Fuel",
    "Empty_Canister"
  ],
  "Liquid_Biofuel": [
    "Solid_Biofuel",
    "Water"
  ],
  "Packaged_Liquid_Biofuel": [
    "Liquid_Biofuel",
    "Empty_Canister"
  ],
  "Packaged_Oil": [
    "Crude_Oil",
    "Empty_Canister"
  ],
  "Packaged_Heavy_Oil_Residue": [
    "Heavy_Oil_Residue",
    "Empty_Canister"
  ],
  "Packaged_Water": [
    "Water",
    "Empty_Canister"
  ],
  "Crude_Oil": [
    "Packaged_Oil"
  ],
  "Heavy_Oil_Residue": [
    "Packaged_Heavy_Oil_Residue"
  ],
  "Water": [
    "Packaged_Water"
  ],
  "Quartz_Crystal": [
    "Raw_Quartz"
  ],
  "Encased_Uranium_Cell": [
    "Uranium",
    "Concrete",
    "Sulfuric_Acid"
  ],
  "Cooling_System": [
    "Heat_Sink",
    "Rubber",
    "Water",
    "Nitrogen_Gas"
  ],
  "Nitric_Acid": [
    "Nitrogen_Gas",
    "Water",
    "Iron_Plate"
  ],
  "Non_Fissile_Uranium": [
    "Uranium_Waste",
    "Silica",
    "Nitric_Acid",
    "Sulfuric_Acid"
  ],
  "Aluminum_Casing": [
    "Aluminum_Ingot"
  ],
  "Alclad_Aluminum_Sheet": [
    "Aluminum_Ingot",
    "Copper_Ingot"
  ],
  "Radio_Control_Unit": [
    "Aluminum_Casing",
    "Crystal_Oscillator",
    "Computer"
  ],
  "Alumina_Solution": [
    "Bauxite",
    "Water"
  ],
  "Aluminum_Scrap": [
    "Alumina_Solution",
    "Coal"
  ],
  "Packaged_Alumina_Solution": [
    "Alumina_Solution",
    "Empty_Canister"
  ],
  "Aluminum_Ingot": [
    "Aluminum_Scrap",
    "Silica"
  ],
  "Silica": [
    "Raw_Quartz"
  ],
  "Crystal_Oscillator": [
    "Quartz_Crystal",
    "Cable",
    "Reinforced_Iron_Plate"
  ],
  "Encased_Industrial_Beam": [
    "Steel_Beam",
    "Concrete"
  ],
  "Motor": [
    "Rotor",
    "Stator"
  ],
  "Stator": [
    "Steel_Pipe",
    "Wire"
  ],
  "Heavy_Modular_Frame": [
    "Modular_Frame",
    "Steel_Pipe",
    "Encased_Industrial_Beam",
    "Screw"
  ],
  "Automated_Wiring": [
    "Stator",
    "Cable"
  ],
  "Ai_Limiter": [
    "Copper_Sheet",
    "Quickwire"
  ],
  "Computer": [
    "Circuit_Board",
    "Cable",
    "Plastic",
    "Screw"
  ],
  "Modular_Engine": [
    "Motor",
    "Rubber",
    "Smart_Plating"
  ],
  "Adaptive_Control_Unit": [
    "Automated_Wiring",
    "Circuit_Board",
    "Heavy_Modular_Frame",
    "Computer"
  ],
  "Modular_Frame": [
    "Reinforced_Iron_Plate",
    "Iron_Rod"
  ],
  "Rotor": [
    "Iron_Rod",
    "Screw"
  ],
  "Copper_Sheet": [
    "Copper_Ingot"
  ],
  "Smart_Plating": [
    "Reinforced_Iron_Plate",
    "Rotor"
  ],
  "Encased_Plutonium_Cell": [
    "Plutonium_Pellet",
    "Concrete"
  ],
  "Pressure_Conversion_Cube": [
    "Fused_Modular_Frame",
    "Radio_Control_Unit"
  ],
  "Copper_Powder": [
    "Copper_Ingot"
  ],
  "Plutonium_Pellet": [
    "Non_Fissile_Uranium",
    "Uranium_Waste"
  ],
  "Plutonium_Fuel_Rod": [
    "Encased_Plutonium_Cell",
    "Steel_Beam",
    "Electromagnetic_Control_Rod",
    "Heat_Sink"
  ],
  "Packaged_Nitric_Acid": [
    "Nitric_Acid",
    "Empty_Fluid_Tank"
  ],
  "Nuclear_Pasta": [
    "Copper_Powder",
    "Pressure_Conversion_Cube"
  ],
  "Battery": [
    "Sulfuric_Acid",
    "Alumina_Solution",
    "Aluminum_Casing"
  ],
  "Supercomputer": [
    "Computer",
    "Ai_Limiter",
    "High_Speed_Connector",
    "Plastic"
  ],
  "Sulfuric_Acid": [
    "Sulfur",
    "Water"
  ],
  "Packaged_Sulfuric_Acid": [
    "Sulfuric_Acid",
    "Empty_Canister"
  ],
  "Assembly_Director_System": [
    "Adaptive_Control_Unit",
    "Supercomputer"
  ],
  "High_Speed_Connector": [
    "Quickwire",
    "Cable",
    "Circuit_Board"
  ],
  "Electromagnetic_Control_Rod": [
    "Stator",
    "Ai_Limiter"
  ],
  "Uranium_Fuel_Rod": [
    "Encased_Uranium_Cell",
    "Encased_Industrial_Beam",
    "Electromagnetic_Control_Rod"
  ],
  "Magnetic_Field_Generator": [
    "Versatile_Framework",
    "Electromagnetic_Control_Rod",
    "Battery"
  ],
  "Heat_Sink": [
    "Alclad_Aluminum_Sheet",
    "Copper_Sheet"
  ],
  "Fused_Modular_Frame": [
    "Heavy_Modular_Frame",
    "Aluminum_Casing",
    "Nitrogen_Gas"
  ],
  "Empty_Fluid_Tank": [
    "Aluminum_Ingot"
  ],
  "Packaged_Nitrogen_Gas": [
    "Nitrogen_Gas",
    "Empty_Fluid_Tank"
  ],
  "Nitrogen_Gas": [
    "Packaged_Nitrogen_Gas"
  ],
  "Caterium_Ingot": [
    "Caterium_Ore"
  ],
  "Turbo_Motor": [
    "Cooling_System",
    "Radio_Control_Unit",
    "Motor",
    "Rubber"
  ],
  "Thermal_Propulsion_Rocket": [
    "Modular_Engine",
    "Turbo_Motor",
    "Cooling_System",
    "Fused_Modular_Frame"
  ],
  "Hover_Pack": [
    "Motor",
    "Heavy_Modular_Frame",
    "Computer",
    "Alclad_Aluminum_Sheet"
  ],
  "Iodine_Infused_Filter": [
    "Gas_Filter",
    "Quickwire",
    "Aluminum_Casing"
  ],
  "Hazmat_Suit": [
    "Rubber",
    "Plastic",
    "Alclad_Aluminum_Sheet",
    "Fabric"
  ],
  "Gas_Filter": [
    "Coal",
    "Rubber",
    "Fabric"
  ],
  "Gas_Mask": [
    "Rubber",
    "Plastic",
    "Fabric"
  ],
  "Jetpack": [
    "Plastic",
    "Rubber",
    "Circuit_Board",
    "Motor"
  ],
  "Xeno_Basher": [
    "Modular_Frame",
    "Xeno_Zapper",
    "Cable",
    "Wire"
  ],
  "Solid_Biofuel": [
    "Biomass"
  ],
  "Chainsaw": [
    "Reinforced_Iron_Plate",
    "Iron_Rod",
    "Screw",
    "Cable"
  ],
  "Beacon": [
    "Iron_Plate",
    "Iron_Rod",
    "Wire",
    "Cable"
  ],
  "Object_Scanner": [
    "Reinforced_Iron_Plate",
    "Wire",
    "Screw"
  ],
  "Alien_Protein": [
    "Stinger_Remains"
  ],
  "Alien_Dna_Capsule": [
    "Alien_Protein"
  ],
  "Biomass": [
    "Alien_Protein"
  ],
  "Medicinal_Inhaler": [
    "Alien_Protein",
    "Beryl_Nut"
  ],
  "Iron_Rebar": [
    "Iron_Rod"
  ],
  "Rebar_Gun": [
    "Reinforced_Iron_Plate",
    "Iron_Rod",
    "Screw"
  ],
  "Homing_Rifle_Ammo": [
    "Rifle_Ammo",
    "High_Speed_Connector"
  ],
  "Blade_Runners": [
    "Silica",
    "Modular_Frame",
    "Rotor"
  ],
  "Stun_Rebar": [
    "Iron_Rebar",
    "Quickwire"
  ],
  "Zipline": [
    "Xeno_Zapper",
    "Quickwire",
    "Iron_Rod",
    "Cable"
  ],
  "Quickwire": [
    "Caterium_Ingot"
  ],
  "Gas_Nobelisk": [
    "Nobelisk",
    "Biomass"
  ],
  "Parachute": [
    "Fabric",
    "Cable"
  ],
  "Fabric": [
    "Mycelia",
    "Biomass"
  ],
  "Power_Shard": [
    "Purple_Power_Slug"
  ],
  "Pulse_Nobelisk": [
    "Nobelisk",
    "Crystal_Oscillator"
  ],
  "Shatter_Rebar": [
    "Iron_Rebar",
    "Quartz_Crystal"
  ],
  "Turbo_Rifle_Ammo": [
    "Rifle_Ammo",
    "Aluminum_Casing",
    "Packaged_Turbofuel"
  ],
  "Nuke_Nobelisk": [
    "Nobelisk",
    "Encased_Uranium_Cell",
    "Smokeless_Powder",
    "Ai_Limiter"
  ],
  "Rifle_Ammo": [
    "Copper_Sheet",
    "Smokeless_Powder"
  ],
  "Explosive_Rebar": [
    "Iron_Rebar",
    "Smokeless_Powder",
    "Steel_Pipe"
  ],
  "Rifle": [
    "Motor",
    "Rubber",
    "Steel_Pipe",
    "Screw"
  ],
  "Cluster_Nobelisk": [
    "Nobelisk",
    "Smokeless_Powder"
  ],
  "Nobelisk": [
    "Black_Powder",
    "Steel_Pipe"
  ],
  "Nobelisk_Detonator": [
    "Object_Scanner",
    "Steel_Beam",
    "Cable"
  ],
  "Smokeless_Powder": [
    "Black_Powder",
    "Heavy_Oil_Residue"
  ],
  "Black_Powder": [
    "Coal",
    "Sulfur"
  ],
  "Factory_Carttm": [
    "Reinforced_Iron_Plate",
    "Iron_Rod",
    "Rotor"
  ],
  "Golden_Factory_Carttm": [
    "Caterium_Ingot",
    "Iron_Rod",
    "Rotor"
  ],
  "Reinforced_Iron_Plate": [
    "Iron_Plate",
    "Screw"
  ],
  "Concrete": [
    "Limestone"
  ],
  "Screw": [
    "Iron_Rod"
  ],
  "Cable": [
    "Wire"
  ],
  "Wire": [
    "Copper_Ingot"
  ],
  "Copper_Ingot": [
    "Copper_Ore"
  ],
  "Portable_Miner": [
    "Iron_Plate",
    "Iron_Rod"
  ]
};
