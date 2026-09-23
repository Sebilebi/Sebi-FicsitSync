module.exports = {
  "Recipe_IronPlate_C": {
    "name": "Iron Plate",
    "building": "Desc_ConstructorMk1_C",
    "inputs": [
      {
        "item": "Iron_Ingot",
        "name": "Iron Ingot",
        "rate": 30
      }
    ],
    "outputs": [
      {
        "item": "Iron_Plate",
        "name": "Iron Plate",
        "rate": 20
      }
    ]
  },
  "Recipe_IronRod_C": {
    "name": "Iron Rod",
    "building": "Desc_ConstructorMk1_C",
    "inputs": [
      {
        "item": "Iron_Ingot",
        "name": "Iron Ingot",
        "rate": 15
      }
    ],
    "outputs": [
      {
        "item": "Iron_Rod",
        "name": "Iron Rod",
        "rate": 15
      }
    ]
  },
  "Recipe_XenoZapper_C": {
    "name": "Xeno-Zapper",
    "building": "Unknown",
    "inputs": [
      {
        "item": "Iron_Rod",
        "name": "Iron Rod",
        "rate": 15
      },
      {
        "item": "Reinforced_Iron_Plate",
        "name": "Reinforced Iron Plate",
        "rate": 3
      },
      {
        "item": "Cable",
        "name": "Cable",
        "rate": 22.5
      },
      {
        "item": "Wire",
        "name": "Wire",
        "rate": 75
      }
    ],
    "outputs": [
      {
        "item": "Xeno_Zapper",
        "name": "Xeno-Zapper",
        "rate": 1.5
      }
    ]
  },
  "Recipe_IngotIron_C": {
    "name": "Iron Ingot",
    "building": "Desc_SmelterMk1_C",
    "inputs": [
      {
        "item": "Iron_Ore",
        "name": "Iron Ore",
        "rate": 30
      }
    ],
    "outputs": [
      {
        "item": "Iron_Ingot",
        "name": "Iron Ingot",
        "rate": 30
      }
    ]
  },
  "Recipe_ColorCartridge_C": {
    "name": "Color Cartridge",
    "building": "Desc_ConstructorMk1_C",
    "inputs": [
      {
        "item": "Flower_Petals",
        "name": "Flower Petals",
        "rate": 50
      }
    ],
    "outputs": [
      {
        "item": "Color_Cartridge",
        "name": "Color Cartridge",
        "rate": 100
      }
    ]
  },
  "Recipe_PackagedTurboFuel_C": {
    "name": "Packaged Turbofuel",
    "building": "Desc_Packager_C",
    "inputs": [
      {
        "item": "Turbofuel",
        "name": "Turbofuel",
        "rate": 20
      },
      {
        "item": "Empty_Canister",
        "name": "Empty Canister",
        "rate": 20
      }
    ],
    "outputs": [
      {
        "item": "Packaged_Turbofuel",
        "name": "Packaged Turbofuel",
        "rate": 20
      }
    ]
  },
  "Recipe_UnpackageTurboFuel_C": {
    "name": "Unpackage Turbofuel",
    "building": "Desc_Packager_C",
    "inputs": [
      {
        "item": "Packaged_Turbofuel",
        "name": "Packaged Turbofuel",
        "rate": 20
      }
    ],
    "outputs": [
      {
        "item": "Turbofuel",
        "name": "Turbofuel",
        "rate": 20
      },
      {
        "item": "Empty_Canister",
        "name": "Empty Canister",
        "rate": 20
      }
    ]
  },
  "Recipe_CircuitBoard_C": {
    "name": "Circuit Board",
    "building": "Desc_AssemblerMk1_C",
    "inputs": [
      {
        "item": "Copper_Sheet",
        "name": "Copper Sheet",
        "rate": 15
      },
      {
        "item": "Plastic",
        "name": "Plastic",
        "rate": 30
      }
    ],
    "outputs": [
      {
        "item": "Circuit_Board",
        "name": "Circuit Board",
        "rate": 7.5
      }
    ]
  },
  "Recipe_LiquidFuel_C": {
    "name": "Fuel",
    "building": "Desc_OilRefinery_C",
    "inputs": [
      {
        "item": "Crude_Oil",
        "name": "Crude Oil",
        "rate": 60
      }
    ],
    "outputs": [
      {
        "item": "Fuel",
        "name": "Fuel",
        "rate": 40
      },
      {
        "item": "Polymer_Resin",
        "name": "Polymer Resin",
        "rate": 30
      }
    ]
  },
  "Recipe_PetroleumCoke_C": {
    "name": "Petroleum Coke",
    "building": "Desc_OilRefinery_C",
    "inputs": [
      {
        "item": "Heavy_Oil_Residue",
        "name": "Heavy Oil Residue",
        "rate": 40
      }
    ],
    "outputs": [
      {
        "item": "Petroleum_Coke",
        "name": "Petroleum Coke",
        "rate": 120
      }
    ]
  },
  "Recipe_Plastic_C": {
    "name": "Plastic",
    "building": "Desc_OilRefinery_C",
    "inputs": [
      {
        "item": "Crude_Oil",
        "name": "Crude Oil",
        "rate": 30
      }
    ],
    "outputs": [
      {
        "item": "Plastic",
        "name": "Plastic",
        "rate": 20
      },
      {
        "item": "Heavy_Oil_Residue",
        "name": "Heavy Oil Residue",
        "rate": 10
      }
    ]
  },
  "Recipe_Rubber_C": {
    "name": "Rubber",
    "building": "Desc_OilRefinery_C",
    "inputs": [
      {
        "item": "Crude_Oil",
        "name": "Crude Oil",
        "rate": 30
      }
    ],
    "outputs": [
      {
        "item": "Rubber",
        "name": "Rubber",
        "rate": 20
      },
      {
        "item": "Heavy_Oil_Residue",
        "name": "Heavy Oil Residue",
        "rate": 20
      }
    ]
  },
  "Recipe_ResidualFuel_C": {
    "name": "Residual Fuel",
    "building": "Desc_OilRefinery_C",
    "inputs": [
      {
        "item": "Heavy_Oil_Residue",
        "name": "Heavy Oil Residue",
        "rate": 60
      }
    ],
    "outputs": [
      {
        "item": "Fuel",
        "name": "Fuel",
        "rate": 40
      }
    ]
  },
  "Recipe_ResidualPlastic_C": {
    "name": "Residual Plastic",
    "building": "Desc_OilRefinery_C",
    "inputs": [
      {
        "item": "Polymer_Resin",
        "name": "Polymer Resin",
        "rate": 60
      },
      {
        "item": "Water",
        "name": "Water",
        "rate": 20
      }
    ],
    "outputs": [
      {
        "item": "Plastic",
        "name": "Plastic",
        "rate": 20
      }
    ]
  },
  "Recipe_ResidualRubber_C": {
    "name": "Residual Rubber",
    "building": "Desc_OilRefinery_C",
    "inputs": [
      {
        "item": "Polymer_Resin",
        "name": "Polymer Resin",
        "rate": 40
      },
      {
        "item": "Water",
        "name": "Water",
        "rate": 40
      }
    ],
    "outputs": [
      {
        "item": "Rubber",
        "name": "Rubber",
        "rate": 20
      }
    ]
  },
  "Recipe_SteelBeam_C": {
    "name": "Steel Beam",
    "building": "Desc_ConstructorMk1_C",
    "inputs": [
      {
        "item": "Steel_Ingot",
        "name": "Steel Ingot",
        "rate": 60
      }
    ],
    "outputs": [
      {
        "item": "Steel_Beam",
        "name": "Steel Beam",
        "rate": 15
      }
    ]
  },
  "Recipe_SteelPipe_C": {
    "name": "Steel Pipe",
    "building": "Desc_ConstructorMk1_C",
    "inputs": [
      {
        "item": "Steel_Ingot",
        "name": "Steel Ingot",
        "rate": 30
      }
    ],
    "outputs": [
      {
        "item": "Steel_Pipe",
        "name": "Steel Pipe",
        "rate": 20
      }
    ]
  },
  "Recipe_IngotSteel_C": {
    "name": "Steel Ingot",
    "building": "Desc_FoundryMk1_C",
    "inputs": [
      {
        "item": "Iron_Ore",
        "name": "Iron Ore",
        "rate": 45
      },
      {
        "item": "Coal",
        "name": "Coal",
        "rate": 45
      }
    ],
    "outputs": [
      {
        "item": "Steel_Ingot",
        "name": "Steel Ingot",
        "rate": 45
      }
    ]
  },
  "Recipe_SpaceElevatorPart_2_C": {
    "name": "Versatile Framework",
    "building": "Desc_AssemblerMk1_C",
    "inputs": [
      {
        "item": "Modular_Frame",
        "name": "Modular Frame",
        "rate": 2.5
      },
      {
        "item": "Steel_Beam",
        "name": "Steel Beam",
        "rate": 30
      }
    ],
    "outputs": [
      {
        "item": "Versatile_Framework",
        "name": "Versatile Framework",
        "rate": 5
      }
    ]
  },
  "Recipe_FluidCanister_C": {
    "name": "Empty Canister",
    "building": "Desc_ConstructorMk1_C",
    "inputs": [
      {
        "item": "Plastic",
        "name": "Plastic",
        "rate": 30
      }
    ],
    "outputs": [
      {
        "item": "Empty_Canister",
        "name": "Empty Canister",
        "rate": 60
      }
    ]
  },
  "Recipe_Fuel_C": {
    "name": "Packaged Fuel",
    "building": "Desc_Packager_C",
    "inputs": [
      {
        "item": "Fuel",
        "name": "Fuel",
        "rate": 40
      },
      {
        "item": "Empty_Canister",
        "name": "Empty Canister",
        "rate": 40
      }
    ],
    "outputs": [
      {
        "item": "Packaged_Fuel",
        "name": "Packaged Fuel",
        "rate": 40
      }
    ]
  },
  "Recipe_LiquidBiofuel_C": {
    "name": "Liquid Biofuel",
    "building": "Desc_OilRefinery_C",
    "inputs": [
      {
        "item": "Solid_Biofuel",
        "name": "Solid Biofuel",
        "rate": 90
      },
      {
        "item": "Water",
        "name": "Water",
        "rate": 45
      }
    ],
    "outputs": [
      {
        "item": "Liquid_Biofuel",
        "name": "Liquid Biofuel",
        "rate": 60
      }
    ]
  },
  "Recipe_PackagedBiofuel_C": {
    "name": "Packaged Liquid Biofuel",
    "building": "Desc_Packager_C",
    "inputs": [
      {
        "item": "Liquid_Biofuel",
        "name": "Liquid Biofuel",
        "rate": 40
      },
      {
        "item": "Empty_Canister",
        "name": "Empty Canister",
        "rate": 40
      }
    ],
    "outputs": [
      {
        "item": "Packaged_Liquid_Biofuel",
        "name": "Packaged Liquid Biofuel",
        "rate": 40
      }
    ]
  },
  "Recipe_PackagedCrudeOil_C": {
    "name": "Packaged Oil",
    "building": "Desc_Packager_C",
    "inputs": [
      {
        "item": "Crude_Oil",
        "name": "Crude Oil",
        "rate": 30
      },
      {
        "item": "Empty_Canister",
        "name": "Empty Canister",
        "rate": 30
      }
    ],
    "outputs": [
      {
        "item": "Packaged_Oil",
        "name": "Packaged Oil",
        "rate": 30
      }
    ]
  },
  "Recipe_PackagedOilResidue_C": {
    "name": "Packaged Heavy Oil Residue",
    "building": "Desc_Packager_C",
    "inputs": [
      {
        "item": "Heavy_Oil_Residue",
        "name": "Heavy Oil Residue",
        "rate": 30
      },
      {
        "item": "Empty_Canister",
        "name": "Empty Canister",
        "rate": 30
      }
    ],
    "outputs": [
      {
        "item": "Packaged_Heavy_Oil_Residue",
        "name": "Packaged Heavy Oil Residue",
        "rate": 30
      }
    ]
  },
  "Recipe_PackagedWater_C": {
    "name": "Packaged Water",
    "building": "Desc_Packager_C",
    "inputs": [
      {
        "item": "Water",
        "name": "Water",
        "rate": 60
      },
      {
        "item": "Empty_Canister",
        "name": "Empty Canister",
        "rate": 60
      }
    ],
    "outputs": [
      {
        "item": "Packaged_Water",
        "name": "Packaged Water",
        "rate": 60
      }
    ]
  },
  "Recipe_UnpackageBioFuel_C": {
    "name": "Unpackage Liquid Biofuel",
    "building": "Desc_Packager_C",
    "inputs": [
      {
        "item": "Packaged_Liquid_Biofuel",
        "name": "Packaged Liquid Biofuel",
        "rate": 60
      }
    ],
    "outputs": [
      {
        "item": "Liquid_Biofuel",
        "name": "Liquid Biofuel",
        "rate": 60
      },
      {
        "item": "Empty_Canister",
        "name": "Empty Canister",
        "rate": 60
      }
    ]
  },
  "Recipe_UnpackageFuel_C": {
    "name": "Unpackage Fuel",
    "building": "Desc_Packager_C",
    "inputs": [
      {
        "item": "Packaged_Fuel",
        "name": "Packaged Fuel",
        "rate": 60
      }
    ],
    "outputs": [
      {
        "item": "Fuel",
        "name": "Fuel",
        "rate": 60
      },
      {
        "item": "Empty_Canister",
        "name": "Empty Canister",
        "rate": 60
      }
    ]
  },
  "Recipe_UnpackageOil_C": {
    "name": "Unpackage Oil",
    "building": "Desc_Packager_C",
    "inputs": [
      {
        "item": "Packaged_Oil",
        "name": "Packaged Oil",
        "rate": 60
      }
    ],
    "outputs": [
      {
        "item": "Crude_Oil",
        "name": "Crude Oil",
        "rate": 60
      },
      {
        "item": "Empty_Canister",
        "name": "Empty Canister",
        "rate": 60
      }
    ]
  },
  "Recipe_UnpackageOilResidue_C": {
    "name": "Unpackage Heavy Oil Residue",
    "building": "Desc_Packager_C",
    "inputs": [
      {
        "item": "Packaged_Heavy_Oil_Residue",
        "name": "Packaged Heavy Oil Residue",
        "rate": 20
      }
    ],
    "outputs": [
      {
        "item": "Heavy_Oil_Residue",
        "name": "Heavy Oil Residue",
        "rate": 20
      },
      {
        "item": "Empty_Canister",
        "name": "Empty Canister",
        "rate": 20
      }
    ]
  },
  "Recipe_UnpackageWater_C": {
    "name": "Unpackage Water",
    "building": "Desc_Packager_C",
    "inputs": [
      {
        "item": "Packaged_Water",
        "name": "Packaged Water",
        "rate": 120
      }
    ],
    "outputs": [
      {
        "item": "Water",
        "name": "Water",
        "rate": 120
      },
      {
        "item": "Empty_Canister",
        "name": "Empty Canister",
        "rate": 120
      }
    ]
  },
  "Recipe_QuartzCrystal_C": {
    "name": "Quartz Crystal",
    "building": "Desc_ConstructorMk1_C",
    "inputs": [
      {
        "item": "Raw_Quartz",
        "name": "Raw Quartz",
        "rate": 37.5
      }
    ],
    "outputs": [
      {
        "item": "Quartz_Crystal",
        "name": "Quartz Crystal",
        "rate": 22.5
      }
    ]
  },
  "Recipe_UraniumCell_C": {
    "name": "Encased Uranium Cell",
    "building": "Desc_Blender_C",
    "inputs": [
      {
        "item": "Uranium",
        "name": "Uranium",
        "rate": 50
      },
      {
        "item": "Concrete",
        "name": "Concrete",
        "rate": 15
      },
      {
        "item": "Sulfuric_Acid",
        "name": "Sulfuric Acid",
        "rate": 40
      }
    ],
    "outputs": [
      {
        "item": "Encased_Uranium_Cell",
        "name": "Encased Uranium Cell",
        "rate": 25
      },
      {
        "item": "Sulfuric_Acid",
        "name": "Sulfuric Acid",
        "rate": 10
      }
    ]
  },
  "Recipe_CoolingSystem_C": {
    "name": "Cooling System",
    "building": "Desc_Blender_C",
    "inputs": [
      {
        "item": "Heat_Sink",
        "name": "Heat Sink",
        "rate": 12
      },
      {
        "item": "Rubber",
        "name": "Rubber",
        "rate": 12
      },
      {
        "item": "Water",
        "name": "Water",
        "rate": 30
      },
      {
        "item": "Nitrogen_Gas",
        "name": "Nitrogen Gas",
        "rate": 150
      }
    ],
    "outputs": [
      {
        "item": "Cooling_System",
        "name": "Cooling System",
        "rate": 6
      }
    ]
  },
  "Recipe_NitricAcid_C": {
    "name": "Nitric Acid",
    "building": "Desc_Blender_C",
    "inputs": [
      {
        "item": "Nitrogen_Gas",
        "name": "Nitrogen Gas",
        "rate": 120
      },
      {
        "item": "Water",
        "name": "Water",
        "rate": 30
      },
      {
        "item": "Iron_Plate",
        "name": "Iron Plate",
        "rate": 10
      }
    ],
    "outputs": [
      {
        "item": "Nitric_Acid",
        "name": "Nitric Acid",
        "rate": 30
      }
    ]
  },
  "Recipe_NonFissileUranium_C": {
    "name": "Non-fissile Uranium",
    "building": "Desc_Blender_C",
    "inputs": [
      {
        "item": "Uranium_Waste",
        "name": "Uranium Waste",
        "rate": 37.5
      },
      {
        "item": "Silica",
        "name": "Silica",
        "rate": 25
      },
      {
        "item": "Nitric_Acid",
        "name": "Nitric Acid",
        "rate": 15
      },
      {
        "item": "Sulfuric_Acid",
        "name": "Sulfuric Acid",
        "rate": 15
      }
    ],
    "outputs": [
      {
        "item": "Non_Fissile_Uranium",
        "name": "Non-fissile Uranium",
        "rate": 50
      },
      {
        "item": "Water",
        "name": "Water",
        "rate": 15
      }
    ]
  },
  "Recipe_AluminumCasing_C": {
    "name": "Aluminum Casing",
    "building": "Desc_ConstructorMk1_C",
    "inputs": [
      {
        "item": "Aluminum_Ingot",
        "name": "Aluminum Ingot",
        "rate": 90
      }
    ],
    "outputs": [
      {
        "item": "Aluminum_Casing",
        "name": "Aluminum Casing",
        "rate": 60
      }
    ]
  },
  "Recipe_AluminumSheet_C": {
    "name": "Alclad Aluminum Sheet",
    "building": "Desc_AssemblerMk1_C",
    "inputs": [
      {
        "item": "Aluminum_Ingot",
        "name": "Aluminum Ingot",
        "rate": 30
      },
      {
        "item": "Copper_Ingot",
        "name": "Copper Ingot",
        "rate": 10
      }
    ],
    "outputs": [
      {
        "item": "Alclad_Aluminum_Sheet",
        "name": "Alclad Aluminum Sheet",
        "rate": 30
      }
    ]
  },
  "Recipe_RadioControlUnit_C": {
    "name": "Radio Control Unit",
    "building": "Desc_ManufacturerMk1_C",
    "inputs": [
      {
        "item": "Aluminum_Casing",
        "name": "Aluminum Casing",
        "rate": 40
      },
      {
        "item": "Crystal_Oscillator",
        "name": "Crystal Oscillator",
        "rate": 1.25
      },
      {
        "item": "Computer",
        "name": "Computer",
        "rate": 1.25
      }
    ],
    "outputs": [
      {
        "item": "Radio_Control_Unit",
        "name": "Radio Control Unit",
        "rate": 2.5
      }
    ]
  },
  "Recipe_AluminaSolution_C": {
    "name": "Alumina Solution",
    "building": "Desc_OilRefinery_C",
    "inputs": [
      {
        "item": "Bauxite",
        "name": "Bauxite",
        "rate": 120
      },
      {
        "item": "Water",
        "name": "Water",
        "rate": 180
      }
    ],
    "outputs": [
      {
        "item": "Alumina_Solution",
        "name": "Alumina Solution",
        "rate": 120
      },
      {
        "item": "Silica",
        "name": "Silica",
        "rate": 50
      }
    ]
  },
  "Recipe_AluminumScrap_C": {
    "name": "Aluminum Scrap",
    "building": "Desc_OilRefinery_C",
    "inputs": [
      {
        "item": "Alumina_Solution",
        "name": "Alumina Solution",
        "rate": 240
      },
      {
        "item": "Coal",
        "name": "Coal",
        "rate": 120
      }
    ],
    "outputs": [
      {
        "item": "Aluminum_Scrap",
        "name": "Aluminum Scrap",
        "rate": 360
      },
      {
        "item": "Water",
        "name": "Water",
        "rate": 120
      }
    ]
  },
  "Recipe_PackagedAlumina_C": {
    "name": "Packaged Alumina Solution",
    "building": "Desc_Packager_C",
    "inputs": [
      {
        "item": "Alumina_Solution",
        "name": "Alumina Solution",
        "rate": 120
      },
      {
        "item": "Empty_Canister",
        "name": "Empty Canister",
        "rate": 120
      }
    ],
    "outputs": [
      {
        "item": "Packaged_Alumina_Solution",
        "name": "Packaged Alumina Solution",
        "rate": 120
      }
    ]
  },
  "Recipe_IngotAluminum_C": {
    "name": "Aluminum Ingot",
    "building": "Desc_FoundryMk1_C",
    "inputs": [
      {
        "item": "Aluminum_Scrap",
        "name": "Aluminum Scrap",
        "rate": 90
      },
      {
        "item": "Silica",
        "name": "Silica",
        "rate": 75
      }
    ],
    "outputs": [
      {
        "item": "Aluminum_Ingot",
        "name": "Aluminum Ingot",
        "rate": 60
      }
    ]
  },
  "Recipe_Silica_C": {
    "name": "Silica",
    "building": "Desc_ConstructorMk1_C",
    "inputs": [
      {
        "item": "Raw_Quartz",
        "name": "Raw Quartz",
        "rate": 22.5
      }
    ],
    "outputs": [
      {
        "item": "Silica",
        "name": "Silica",
        "rate": 37.5
      }
    ]
  },
  "Recipe_CrystalOscillator_C": {
    "name": "Crystal Oscillator",
    "building": "Desc_ManufacturerMk1_C",
    "inputs": [
      {
        "item": "Quartz_Crystal",
        "name": "Quartz Crystal",
        "rate": 18
      },
      {
        "item": "Cable",
        "name": "Cable",
        "rate": 14
      },
      {
        "item": "Reinforced_Iron_Plate",
        "name": "Reinforced Iron Plate",
        "rate": 2.5
      }
    ],
    "outputs": [
      {
        "item": "Crystal_Oscillator",
        "name": "Crystal Oscillator",
        "rate": 1
      }
    ]
  },
  "Recipe_UnpackageAlumina_C": {
    "name": "Unpackage Alumina Solution",
    "building": "Desc_Packager_C",
    "inputs": [
      {
        "item": "Packaged_Alumina_Solution",
        "name": "Packaged Alumina Solution",
        "rate": 120
      }
    ],
    "outputs": [
      {
        "item": "Alumina_Solution",
        "name": "Alumina Solution",
        "rate": 120
      },
      {
        "item": "Empty_Canister",
        "name": "Empty Canister",
        "rate": 120
      }
    ]
  },
  "Recipe_EncasedIndustrialBeam_C": {
    "name": "Encased Industrial Beam",
    "building": "Desc_AssemblerMk1_C",
    "inputs": [
      {
        "item": "Steel_Beam",
        "name": "Steel Beam",
        "rate": 24
      },
      {
        "item": "Concrete",
        "name": "Concrete",
        "rate": 30
      }
    ],
    "outputs": [
      {
        "item": "Encased_Industrial_Beam",
        "name": "Encased Industrial Beam",
        "rate": 6
      }
    ]
  },
  "Recipe_Motor_C": {
    "name": "Motor",
    "building": "Desc_AssemblerMk1_C",
    "inputs": [
      {
        "item": "Rotor",
        "name": "Rotor",
        "rate": 10
      },
      {
        "item": "Stator",
        "name": "Stator",
        "rate": 10
      }
    ],
    "outputs": [
      {
        "item": "Motor",
        "name": "Motor",
        "rate": 5
      }
    ]
  },
  "Recipe_Stator_C": {
    "name": "Stator",
    "building": "Desc_AssemblerMk1_C",
    "inputs": [
      {
        "item": "Steel_Pipe",
        "name": "Steel Pipe",
        "rate": 15
      },
      {
        "item": "Wire",
        "name": "Wire",
        "rate": 40
      }
    ],
    "outputs": [
      {
        "item": "Stator",
        "name": "Stator",
        "rate": 5
      }
    ]
  },
  "Recipe_ModularFrameHeavy_C": {
    "name": "Heavy Modular Frame",
    "building": "Desc_ManufacturerMk1_C",
    "inputs": [
      {
        "item": "Modular_Frame",
        "name": "Modular Frame",
        "rate": 10
      },
      {
        "item": "Steel_Pipe",
        "name": "Steel Pipe",
        "rate": 30
      },
      {
        "item": "Encased_Industrial_Beam",
        "name": "Encased Industrial Beam",
        "rate": 10
      },
      {
        "item": "Screw",
        "name": "Screw",
        "rate": 200
      }
    ],
    "outputs": [
      {
        "item": "Heavy_Modular_Frame",
        "name": "Heavy Modular Frame",
        "rate": 2
      }
    ]
  },
  "Recipe_SpaceElevatorPart_3_C": {
    "name": "Automated Wiring",
    "building": "Desc_AssemblerMk1_C",
    "inputs": [
      {
        "item": "Stator",
        "name": "Stator",
        "rate": 2.5
      },
      {
        "item": "Cable",
        "name": "Cable",
        "rate": 50
      }
    ],
    "outputs": [
      {
        "item": "Automated_Wiring",
        "name": "Automated Wiring",
        "rate": 2.5
      }
    ]
  },
  "Recipe_AILimiter_C": {
    "name": "AI Limiter",
    "building": "Desc_AssemblerMk1_C",
    "inputs": [
      {
        "item": "Copper_Sheet",
        "name": "Copper Sheet",
        "rate": 25
      },
      {
        "item": "Quickwire",
        "name": "Quickwire",
        "rate": 100
      }
    ],
    "outputs": [
      {
        "item": "Ai_Limiter",
        "name": "AI Limiter",
        "rate": 5
      }
    ]
  },
  "Recipe_Computer_C": {
    "name": "Computer",
    "building": "Desc_ManufacturerMk1_C",
    "inputs": [
      {
        "item": "Circuit_Board",
        "name": "Circuit Board",
        "rate": 25
      },
      {
        "item": "Cable",
        "name": "Cable",
        "rate": 22.5
      },
      {
        "item": "Plastic",
        "name": "Plastic",
        "rate": 45
      },
      {
        "item": "Screw",
        "name": "Screw",
        "rate": 130
      }
    ],
    "outputs": [
      {
        "item": "Computer",
        "name": "Computer",
        "rate": 2.5
      }
    ]
  },
  "Recipe_SpaceElevatorPart_4_C": {
    "name": "Modular Engine",
    "building": "Desc_ManufacturerMk1_C",
    "inputs": [
      {
        "item": "Motor",
        "name": "Motor",
        "rate": 2
      },
      {
        "item": "Rubber",
        "name": "Rubber",
        "rate": 15
      },
      {
        "item": "Smart_Plating",
        "name": "Smart Plating",
        "rate": 2
      }
    ],
    "outputs": [
      {
        "item": "Modular_Engine",
        "name": "Modular Engine",
        "rate": 1
      }
    ]
  },
  "Recipe_SpaceElevatorPart_5_C": {
    "name": "Adaptive Control Unit",
    "building": "Desc_ManufacturerMk1_C",
    "inputs": [
      {
        "item": "Automated_Wiring",
        "name": "Automated Wiring",
        "rate": 7.5
      },
      {
        "item": "Circuit_Board",
        "name": "Circuit Board",
        "rate": 5
      },
      {
        "item": "Heavy_Modular_Frame",
        "name": "Heavy Modular Frame",
        "rate": 1
      },
      {
        "item": "Computer",
        "name": "Computer",
        "rate": 1
      }
    ],
    "outputs": [
      {
        "item": "Adaptive_Control_Unit",
        "name": "Adaptive Control Unit",
        "rate": 1
      }
    ]
  },
  "Recipe_ModularFrame_C": {
    "name": "Modular Frame",
    "building": "Desc_AssemblerMk1_C",
    "inputs": [
      {
        "item": "Reinforced_Iron_Plate",
        "name": "Reinforced Iron Plate",
        "rate": 3
      },
      {
        "item": "Iron_Rod",
        "name": "Iron Rod",
        "rate": 12
      }
    ],
    "outputs": [
      {
        "item": "Modular_Frame",
        "name": "Modular Frame",
        "rate": 2
      }
    ]
  },
  "Recipe_Rotor_C": {
    "name": "Rotor",
    "building": "Desc_AssemblerMk1_C",
    "inputs": [
      {
        "item": "Iron_Rod",
        "name": "Iron Rod",
        "rate": 20
      },
      {
        "item": "Screw",
        "name": "Screw",
        "rate": 100
      }
    ],
    "outputs": [
      {
        "item": "Rotor",
        "name": "Rotor",
        "rate": 4
      }
    ]
  },
  "Recipe_CopperSheet_C": {
    "name": "Copper Sheet",
    "building": "Desc_ConstructorMk1_C",
    "inputs": [
      {
        "item": "Copper_Ingot",
        "name": "Copper Ingot",
        "rate": 20
      }
    ],
    "outputs": [
      {
        "item": "Copper_Sheet",
        "name": "Copper Sheet",
        "rate": 10
      }
    ]
  },
  "Recipe_SpaceElevatorPart_1_C": {
    "name": "Smart Plating",
    "building": "Desc_AssemblerMk1_C",
    "inputs": [
      {
        "item": "Reinforced_Iron_Plate",
        "name": "Reinforced Iron Plate",
        "rate": 2
      },
      {
        "item": "Rotor",
        "name": "Rotor",
        "rate": 2
      }
    ],
    "outputs": [
      {
        "item": "Smart_Plating",
        "name": "Smart Plating",
        "rate": 2
      }
    ]
  },
  "Recipe_PlutoniumCell_C": {
    "name": "Encased Plutonium Cell",
    "building": "Desc_AssemblerMk1_C",
    "inputs": [
      {
        "item": "Plutonium_Pellet",
        "name": "Plutonium Pellet",
        "rate": 10
      },
      {
        "item": "Concrete",
        "name": "Concrete",
        "rate": 20
      }
    ],
    "outputs": [
      {
        "item": "Encased_Plutonium_Cell",
        "name": "Encased Plutonium Cell",
        "rate": 5
      }
    ]
  },
  "Recipe_PressureConversionCube_C": {
    "name": "Pressure Conversion Cube",
    "building": "Desc_AssemblerMk1_C",
    "inputs": [
      {
        "item": "Fused_Modular_Frame",
        "name": "Fused Modular Frame",
        "rate": 1
      },
      {
        "item": "Radio_Control_Unit",
        "name": "Radio Control Unit",
        "rate": 2
      }
    ],
    "outputs": [
      {
        "item": "Pressure_Conversion_Cube",
        "name": "Pressure Conversion Cube",
        "rate": 1
      }
    ]
  },
  "Recipe_CopperDust_C": {
    "name": "Copper Powder",
    "building": "Desc_ConstructorMk1_C",
    "inputs": [
      {
        "item": "Copper_Ingot",
        "name": "Copper Ingot",
        "rate": 300
      }
    ],
    "outputs": [
      {
        "item": "Copper_Powder",
        "name": "Copper Powder",
        "rate": 50
      }
    ]
  },
  "Recipe_Plutonium_C": {
    "name": "Plutonium Pellet",
    "building": "Desc_HadronCollider_C",
    "inputs": [
      {
        "item": "Non_Fissile_Uranium",
        "name": "Non-fissile Uranium",
        "rate": 100
      },
      {
        "item": "Uranium_Waste",
        "name": "Uranium Waste",
        "rate": 25
      }
    ],
    "outputs": [
      {
        "item": "Plutonium_Pellet",
        "name": "Plutonium Pellet",
        "rate": 30
      }
    ]
  },
  "Recipe_PlutoniumFuelRod_C": {
    "name": "Plutonium Fuel Rod",
    "building": "Desc_ManufacturerMk1_C",
    "inputs": [
      {
        "item": "Encased_Plutonium_Cell",
        "name": "Encased Plutonium Cell",
        "rate": 7.5
      },
      {
        "item": "Steel_Beam",
        "name": "Steel Beam",
        "rate": 4.5
      },
      {
        "item": "Electromagnetic_Control_Rod",
        "name": "Electromagnetic Control Rod",
        "rate": 1.5
      },
      {
        "item": "Heat_Sink",
        "name": "Heat Sink",
        "rate": 2.5
      }
    ],
    "outputs": [
      {
        "item": "Plutonium_Fuel_Rod",
        "name": "Plutonium Fuel Rod",
        "rate": 0.25
      }
    ]
  },
  "Recipe_PackagedNitricAcid_C": {
    "name": "Packaged Nitric Acid",
    "building": "Desc_Packager_C",
    "inputs": [
      {
        "item": "Nitric_Acid",
        "name": "Nitric Acid",
        "rate": 30
      },
      {
        "item": "Empty_Fluid_Tank",
        "name": "Empty Fluid Tank",
        "rate": 30
      }
    ],
    "outputs": [
      {
        "item": "Packaged_Nitric_Acid",
        "name": "Packaged Nitric Acid",
        "rate": 30
      }
    ]
  },
  "Recipe_SpaceElevatorPart_9_C": {
    "name": "Nuclear Pasta",
    "building": "Desc_HadronCollider_C",
    "inputs": [
      {
        "item": "Copper_Powder",
        "name": "Copper Powder",
        "rate": 100
      },
      {
        "item": "Pressure_Conversion_Cube",
        "name": "Pressure Conversion Cube",
        "rate": 0.5
      }
    ],
    "outputs": [
      {
        "item": "Nuclear_Pasta",
        "name": "Nuclear Pasta",
        "rate": 0.5
      }
    ]
  },
  "Recipe_UnpackageNitricAcid_C": {
    "name": "Unpackage Nitric Acid",
    "building": "Desc_Packager_C",
    "inputs": [
      {
        "item": "Packaged_Nitric_Acid",
        "name": "Packaged Nitric Acid",
        "rate": 20
      }
    ],
    "outputs": [
      {
        "item": "Nitric_Acid",
        "name": "Nitric Acid",
        "rate": 20
      },
      {
        "item": "Empty_Fluid_Tank",
        "name": "Empty Fluid Tank",
        "rate": 20
      }
    ]
  },
  "Recipe_Battery_C": {
    "name": "Battery",
    "building": "Desc_Blender_C",
    "inputs": [
      {
        "item": "Sulfuric_Acid",
        "name": "Sulfuric Acid",
        "rate": 50
      },
      {
        "item": "Alumina_Solution",
        "name": "Alumina Solution",
        "rate": 40
      },
      {
        "item": "Aluminum_Casing",
        "name": "Aluminum Casing",
        "rate": 20
      }
    ],
    "outputs": [
      {
        "item": "Battery",
        "name": "Battery",
        "rate": 20
      },
      {
        "item": "Water",
        "name": "Water",
        "rate": 30
      }
    ]
  },
  "Recipe_ComputerSuper_C": {
    "name": "Supercomputer",
    "building": "Desc_ManufacturerMk1_C",
    "inputs": [
      {
        "item": "Computer",
        "name": "Computer",
        "rate": 3.75
      },
      {
        "item": "Ai_Limiter",
        "name": "AI Limiter",
        "rate": 3.75
      },
      {
        "item": "High_Speed_Connector",
        "name": "High-Speed Connector",
        "rate": 5.625
      },
      {
        "item": "Plastic",
        "name": "Plastic",
        "rate": 52.5
      }
    ],
    "outputs": [
      {
        "item": "Supercomputer",
        "name": "Supercomputer",
        "rate": 1.875
      }
    ]
  },
  "Recipe_SulfuricAcid_C": {
    "name": "Sulfuric Acid",
    "building": "Desc_OilRefinery_C",
    "inputs": [
      {
        "item": "Sulfur",
        "name": "Sulfur",
        "rate": 50
      },
      {
        "item": "Water",
        "name": "Water",
        "rate": 50
      }
    ],
    "outputs": [
      {
        "item": "Sulfuric_Acid",
        "name": "Sulfuric Acid",
        "rate": 50
      }
    ]
  },
  "Recipe_PackagedSulfuricAcid_C": {
    "name": "Packaged Sulfuric Acid",
    "building": "Desc_Packager_C",
    "inputs": [
      {
        "item": "Sulfuric_Acid",
        "name": "Sulfuric Acid",
        "rate": 40
      },
      {
        "item": "Empty_Canister",
        "name": "Empty Canister",
        "rate": 40
      }
    ],
    "outputs": [
      {
        "item": "Packaged_Sulfuric_Acid",
        "name": "Packaged Sulfuric Acid",
        "rate": 40
      }
    ]
  },
  "Recipe_SpaceElevatorPart_7_C": {
    "name": "Assembly Director System",
    "building": "Desc_AssemblerMk1_C",
    "inputs": [
      {
        "item": "Adaptive_Control_Unit",
        "name": "Adaptive Control Unit",
        "rate": 1.5
      },
      {
        "item": "Supercomputer",
        "name": "Supercomputer",
        "rate": 0.75
      }
    ],
    "outputs": [
      {
        "item": "Assembly_Director_System",
        "name": "Assembly Director System",
        "rate": 0.75
      }
    ]
  },
  "Recipe_HighSpeedConnector_C": {
    "name": "High-Speed Connector",
    "building": "Desc_ManufacturerMk1_C",
    "inputs": [
      {
        "item": "Quickwire",
        "name": "Quickwire",
        "rate": 210
      },
      {
        "item": "Cable",
        "name": "Cable",
        "rate": 37.5
      },
      {
        "item": "Circuit_Board",
        "name": "Circuit Board",
        "rate": 3.75
      }
    ],
    "outputs": [
      {
        "item": "High_Speed_Connector",
        "name": "High-Speed Connector",
        "rate": 3.75
      }
    ]
  },
  "Recipe_UnpackageSulfuricAcid_C": {
    "name": "Unpackage Sulfuric Acid",
    "building": "Desc_Packager_C",
    "inputs": [
      {
        "item": "Packaged_Sulfuric_Acid",
        "name": "Packaged Sulfuric Acid",
        "rate": 60
      }
    ],
    "outputs": [
      {
        "item": "Sulfuric_Acid",
        "name": "Sulfuric Acid",
        "rate": 60
      },
      {
        "item": "Empty_Canister",
        "name": "Empty Canister",
        "rate": 60
      }
    ]
  },
  "Recipe_ElectromagneticControlRod_C": {
    "name": "Electromagnetic Control Rod",
    "building": "Desc_AssemblerMk1_C",
    "inputs": [
      {
        "item": "Stator",
        "name": "Stator",
        "rate": 6
      },
      {
        "item": "Ai_Limiter",
        "name": "AI Limiter",
        "rate": 4
      }
    ],
    "outputs": [
      {
        "item": "Electromagnetic_Control_Rod",
        "name": "Electromagnetic Control Rod",
        "rate": 4
      }
    ]
  },
  "Recipe_NuclearFuelRod_C": {
    "name": "Uranium Fuel Rod",
    "building": "Desc_ManufacturerMk1_C",
    "inputs": [
      {
        "item": "Encased_Uranium_Cell",
        "name": "Encased Uranium Cell",
        "rate": 20
      },
      {
        "item": "Encased_Industrial_Beam",
        "name": "Encased Industrial Beam",
        "rate": 1.2
      },
      {
        "item": "Electromagnetic_Control_Rod",
        "name": "Electromagnetic Control Rod",
        "rate": 2
      }
    ],
    "outputs": [
      {
        "item": "Uranium_Fuel_Rod",
        "name": "Uranium Fuel Rod",
        "rate": 0.4
      }
    ]
  },
  "Recipe_SpaceElevatorPart_6_C": {
    "name": "Magnetic Field Generator",
    "building": "Desc_ManufacturerMk1_C",
    "inputs": [
      {
        "item": "Versatile_Framework",
        "name": "Versatile Framework",
        "rate": 2.5
      },
      {
        "item": "Electromagnetic_Control_Rod",
        "name": "Electromagnetic Control Rod",
        "rate": 1
      },
      {
        "item": "Battery",
        "name": "Battery",
        "rate": 5
      }
    ],
    "outputs": [
      {
        "item": "Magnetic_Field_Generator",
        "name": "Magnetic Field Generator",
        "rate": 1
      }
    ]
  },
  "Recipe_HeatSink_C": {
    "name": "Heat Sink",
    "building": "Desc_AssemblerMk1_C",
    "inputs": [
      {
        "item": "Alclad_Aluminum_Sheet",
        "name": "Alclad Aluminum Sheet",
        "rate": 37.5
      },
      {
        "item": "Copper_Sheet",
        "name": "Copper Sheet",
        "rate": 22.5
      }
    ],
    "outputs": [
      {
        "item": "Heat_Sink",
        "name": "Heat Sink",
        "rate": 7.5
      }
    ]
  },
  "Recipe_FusedModularFrame_C": {
    "name": "Fused Modular Frame",
    "building": "Desc_Blender_C",
    "inputs": [
      {
        "item": "Heavy_Modular_Frame",
        "name": "Heavy Modular Frame",
        "rate": 1.5
      },
      {
        "item": "Aluminum_Casing",
        "name": "Aluminum Casing",
        "rate": 75
      },
      {
        "item": "Nitrogen_Gas",
        "name": "Nitrogen Gas",
        "rate": 37.5
      }
    ],
    "outputs": [
      {
        "item": "Fused_Modular_Frame",
        "name": "Fused Modular Frame",
        "rate": 1.5
      }
    ]
  },
  "Recipe_GasTank_C": {
    "name": "Empty Fluid Tank",
    "building": "Desc_ConstructorMk1_C",
    "inputs": [
      {
        "item": "Aluminum_Ingot",
        "name": "Aluminum Ingot",
        "rate": 60
      }
    ],
    "outputs": [
      {
        "item": "Empty_Fluid_Tank",
        "name": "Empty Fluid Tank",
        "rate": 60
      }
    ]
  },
  "Recipe_PackagedNitrogen_C": {
    "name": "Packaged Nitrogen Gas",
    "building": "Desc_Packager_C",
    "inputs": [
      {
        "item": "Nitrogen_Gas",
        "name": "Nitrogen Gas",
        "rate": 240
      },
      {
        "item": "Empty_Fluid_Tank",
        "name": "Empty Fluid Tank",
        "rate": 60
      }
    ],
    "outputs": [
      {
        "item": "Packaged_Nitrogen_Gas",
        "name": "Packaged Nitrogen Gas",
        "rate": 60
      }
    ]
  },
  "Recipe_UnpackageNitrogen_C": {
    "name": "Unpackage Nitrogen Gas",
    "building": "Desc_Packager_C",
    "inputs": [
      {
        "item": "Packaged_Nitrogen_Gas",
        "name": "Packaged Nitrogen Gas",
        "rate": 60
      }
    ],
    "outputs": [
      {
        "item": "Nitrogen_Gas",
        "name": "Nitrogen Gas",
        "rate": 240
      },
      {
        "item": "Empty_Fluid_Tank",
        "name": "Empty Fluid Tank",
        "rate": 60
      }
    ]
  },
  "Recipe_IngotCaterium_C": {
    "name": "Caterium Ingot",
    "building": "Desc_SmelterMk1_C",
    "inputs": [
      {
        "item": "Caterium_Ore",
        "name": "Caterium Ore",
        "rate": 45
      }
    ],
    "outputs": [
      {
        "item": "Caterium_Ingot",
        "name": "Caterium Ingot",
        "rate": 15
      }
    ]
  },
  "Recipe_MotorTurbo_C": {
    "name": "Turbo Motor",
    "building": "Desc_ManufacturerMk1_C",
    "inputs": [
      {
        "item": "Cooling_System",
        "name": "Cooling System",
        "rate": 7.5
      },
      {
        "item": "Radio_Control_Unit",
        "name": "Radio Control Unit",
        "rate": 3.75
      },
      {
        "item": "Motor",
        "name": "Motor",
        "rate": 7.5
      },
      {
        "item": "Rubber",
        "name": "Rubber",
        "rate": 45
      }
    ],
    "outputs": [
      {
        "item": "Turbo_Motor",
        "name": "Turbo Motor",
        "rate": 1.875
      }
    ]
  },
  "Recipe_SpaceElevatorPart_8_C": {
    "name": "Thermal Propulsion Rocket",
    "building": "Desc_ManufacturerMk1_C",
    "inputs": [
      {
        "item": "Modular_Engine",
        "name": "Modular Engine",
        "rate": 2.5
      },
      {
        "item": "Turbo_Motor",
        "name": "Turbo Motor",
        "rate": 1
      },
      {
        "item": "Cooling_System",
        "name": "Cooling System",
        "rate": 3
      },
      {
        "item": "Fused_Modular_Frame",
        "name": "Fused Modular Frame",
        "rate": 1
      }
    ],
    "outputs": [
      {
        "item": "Thermal_Propulsion_Rocket",
        "name": "Thermal Propulsion Rocket",
        "rate": 1
      }
    ]
  },
  "Recipe_Hoverpack_C": {
    "name": "Hover Pack",
    "building": "Unknown",
    "inputs": [
      {
        "item": "Motor",
        "name": "Motor",
        "rate": 4
      },
      {
        "item": "Heavy_Modular_Frame",
        "name": "Heavy Modular Frame",
        "rate": 2
      },
      {
        "item": "Computer",
        "name": "Computer",
        "rate": 4
      },
      {
        "item": "Alclad_Aluminum_Sheet",
        "name": "Alclad Aluminum Sheet",
        "rate": 20
      }
    ],
    "outputs": [
      {
        "item": "Hover_Pack",
        "name": "Hover Pack",
        "rate": 0.5
      }
    ]
  },
  "Recipe_FilterHazmat_C": {
    "name": "Iodine Infused Filter",
    "building": "Desc_ManufacturerMk1_C",
    "inputs": [
      {
        "item": "Gas_Filter",
        "name": "Gas Filter",
        "rate": 3.75
      },
      {
        "item": "Quickwire",
        "name": "Quickwire",
        "rate": 30
      },
      {
        "item": "Aluminum_Casing",
        "name": "Aluminum Casing",
        "rate": 3.75
      }
    ],
    "outputs": [
      {
        "item": "Iodine_Infused_Filter",
        "name": "Iodine Infused Filter",
        "rate": 3.75
      }
    ]
  },
  "Recipe_HazmatSuit_C": {
    "name": "Hazmat Suit",
    "building": "Unknown",
    "inputs": [
      {
        "item": "Rubber",
        "name": "Rubber",
        "rate": 25
      },
      {
        "item": "Plastic",
        "name": "Plastic",
        "rate": 25
      },
      {
        "item": "Alclad_Aluminum_Sheet",
        "name": "Alclad Aluminum Sheet",
        "rate": 25
      },
      {
        "item": "Fabric",
        "name": "Fabric",
        "rate": 25
      }
    ],
    "outputs": [
      {
        "item": "Hazmat_Suit",
        "name": "Hazmat Suit",
        "rate": 0.5
      }
    ]
  },
  "Recipe_FilterGasMask_C": {
    "name": "Gas Filter",
    "building": "Desc_ManufacturerMk1_C",
    "inputs": [
      {
        "item": "Coal",
        "name": "Coal",
        "rate": 37.5
      },
      {
        "item": "Rubber",
        "name": "Rubber",
        "rate": 15
      },
      {
        "item": "Fabric",
        "name": "Fabric",
        "rate": 15
      }
    ],
    "outputs": [
      {
        "item": "Gas_Filter",
        "name": "Gas Filter",
        "rate": 7.5
      }
    ]
  },
  "Recipe_Gasmask_C": {
    "name": "Gas Mask",
    "building": "Unknown",
    "inputs": [
      {
        "item": "Rubber",
        "name": "Rubber",
        "rate": 100
      },
      {
        "item": "Plastic",
        "name": "Plastic",
        "rate": 100
      },
      {
        "item": "Fabric",
        "name": "Fabric",
        "rate": 100
      }
    ],
    "outputs": [
      {
        "item": "Gas_Mask",
        "name": "Gas Mask",
        "rate": 1
      }
    ]
  },
  "Recipe_JetPack_C": {
    "name": "Jetpack",
    "building": "Unknown",
    "inputs": [
      {
        "item": "Plastic",
        "name": "Plastic",
        "rate": 25
      },
      {
        "item": "Rubber",
        "name": "Rubber",
        "rate": 25
      },
      {
        "item": "Circuit_Board",
        "name": "Circuit Board",
        "rate": 7.5
      },
      {
        "item": "Motor",
        "name": "Motor",
        "rate": 2.5
      }
    ],
    "outputs": [
      {
        "item": "Jetpack",
        "name": "Jetpack",
        "rate": 0.5
      }
    ]
  },
  "Recipe_XenoBasher_C": {
    "name": "Xeno-Basher",
    "building": "Unknown",
    "inputs": [
      {
        "item": "Modular_Frame",
        "name": "Modular Frame",
        "rate": 3.75
      },
      {
        "item": "Xeno_Zapper",
        "name": "Xeno-Zapper",
        "rate": 1.5
      },
      {
        "item": "Cable",
        "name": "Cable",
        "rate": 18.75
      },
      {
        "item": "Wire",
        "name": "Wire",
        "rate": 375
      }
    ],
    "outputs": [
      {
        "item": "Xeno_Basher",
        "name": "Xeno-Basher",
        "rate": 0.75
      }
    ]
  },
  "Recipe_Biofuel_C": {
    "name": "Solid Biofuel",
    "building": "Desc_ConstructorMk1_C",
    "inputs": [
      {
        "item": "Biomass",
        "name": "Biomass",
        "rate": 120
      }
    ],
    "outputs": [
      {
        "item": "Solid_Biofuel",
        "name": "Solid Biofuel",
        "rate": 60
      }
    ]
  },
  "Recipe_Chainsaw_C": {
    "name": "Chainsaw",
    "building": "Unknown",
    "inputs": [
      {
        "item": "Reinforced_Iron_Plate",
        "name": "Reinforced Iron Plate",
        "rate": 5
      },
      {
        "item": "Iron_Rod",
        "name": "Iron Rod",
        "rate": 25
      },
      {
        "item": "Screw",
        "name": "Screw",
        "rate": 160
      },
      {
        "item": "Cable",
        "name": "Cable",
        "rate": 15
      }
    ],
    "outputs": [
      {
        "item": "Chainsaw",
        "name": "Chainsaw",
        "rate": 1
      }
    ]
  },
  "Recipe_Beacon_C": {
    "name": "Beacon",
    "building": "Desc_ManufacturerMk1_C",
    "inputs": [
      {
        "item": "Iron_Plate",
        "name": "Iron Plate",
        "rate": 22.5
      },
      {
        "item": "Iron_Rod",
        "name": "Iron Rod",
        "rate": 7.5
      },
      {
        "item": "Wire",
        "name": "Wire",
        "rate": 112.5
      },
      {
        "item": "Cable",
        "name": "Cable",
        "rate": 15
      }
    ],
    "outputs": [
      {
        "item": "Beacon",
        "name": "Beacon",
        "rate": 7.5
      }
    ]
  },
  "Recipe_ObjectScanner_C": {
    "name": "Object Scanner",
    "building": "Unknown",
    "inputs": [
      {
        "item": "Reinforced_Iron_Plate",
        "name": "Reinforced Iron Plate",
        "rate": 6
      },
      {
        "item": "Wire",
        "name": "Wire",
        "rate": 30
      },
      {
        "item": "Screw",
        "name": "Screw",
        "rate": 75
      }
    ],
    "outputs": [
      {
        "item": "Object_Scanner",
        "name": "Object Scanner",
        "rate": 1.5
      }
    ]
  },
  "Recipe_Protein_Stinger_C": {
    "name": "Stinger Protein",
    "building": "Desc_ConstructorMk1_C",
    "inputs": [
      {
        "item": "Stinger_Remains",
        "name": "Stinger Remains",
        "rate": 20
      }
    ],
    "outputs": [
      {
        "item": "Alien_Protein",
        "name": "Alien Protein",
        "rate": 20
      }
    ]
  },
  "Recipe_Protein_Spitter_C": {
    "name": "Spitter Protein",
    "building": "Desc_ConstructorMk1_C",
    "inputs": [
      {
        "item": "Plasma_Spitter_Remains",
        "name": "Plasma Spitter Remains",
        "rate": 20
      }
    ],
    "outputs": [
      {
        "item": "Alien_Protein",
        "name": "Alien Protein",
        "rate": 20
      }
    ]
  },
  "Recipe_Protein_Hog_C": {
    "name": "Hog Protein",
    "building": "Desc_ConstructorMk1_C",
    "inputs": [
      {
        "item": "Hog_Remains",
        "name": "Hog Remains",
        "rate": 20
      }
    ],
    "outputs": [
      {
        "item": "Alien_Protein",
        "name": "Alien Protein",
        "rate": 20
      }
    ]
  },
  "Recipe_Protein_Crab_C": {
    "name": "Hatcher Protein",
    "building": "Desc_ConstructorMk1_C",
    "inputs": [
      {
        "item": "Hatcher_Remains",
        "name": "Hatcher Remains",
        "rate": 20
      }
    ],
    "outputs": [
      {
        "item": "Alien_Protein",
        "name": "Alien Protein",
        "rate": 20
      }
    ]
  },
  "Recipe_AlienDNACapsule_C": {
    "name": "Alien DNA Capsule",
    "building": "Desc_ConstructorMk1_C",
    "inputs": [
      {
        "item": "Alien_Protein",
        "name": "Alien Protein",
        "rate": 10
      }
    ],
    "outputs": [
      {
        "item": "Alien_Dna_Capsule",
        "name": "Alien DNA Capsule",
        "rate": 10
      }
    ]
  },
  "Recipe_Biomass_AlienProtein_C": {
    "name": "Biomass (Alien Protein)",
    "building": "Desc_ConstructorMk1_C",
    "inputs": [
      {
        "item": "Alien_Protein",
        "name": "Alien Protein",
        "rate": 15
      }
    ],
    "outputs": [
      {
        "item": "Biomass",
        "name": "Biomass",
        "rate": 1500
      }
    ]
  },
  "Recipe_MedicinalInhalerAlienOrgans_C": {
    "name": "Protein Inhaler",
    "building": "Unknown",
    "inputs": [
      {
        "item": "Alien_Protein",
        "name": "Alien Protein",
        "rate": 3
      },
      {
        "item": "Beryl_Nut",
        "name": "Beryl Nut",
        "rate": 30
      }
    ],
    "outputs": [
      {
        "item": "Medicinal_Inhaler",
        "name": "Medicinal Inhaler",
        "rate": 3
      }
    ]
  },
  "Recipe_SpikedRebar_C": {
    "name": "Iron Rebar",
    "building": "Desc_ConstructorMk1_C",
    "inputs": [
      {
        "item": "Iron_Rod",
        "name": "Iron Rod",
        "rate": 15
      }
    ],
    "outputs": [
      {
        "item": "Iron_Rebar",
        "name": "Iron Rebar",
        "rate": 15
      }
    ]
  },
  "Recipe_RebarGun_C": {
    "name": "Rebar Gun",
    "building": "Unknown",
    "inputs": [
      {
        "item": "Reinforced_Iron_Plate",
        "name": "Reinforced Iron Plate",
        "rate": 6
      },
      {
        "item": "Iron_Rod",
        "name": "Iron Rod",
        "rate": 16
      },
      {
        "item": "Screw",
        "name": "Screw",
        "rate": 100
      }
    ],
    "outputs": [
      {
        "item": "Rebar_Gun",
        "name": "Rebar Gun",
        "rate": 1
      }
    ]
  },
  "Recipe_CartridgeSmart_C": {
    "name": "Homing Rifle Ammo",
    "building": "Desc_AssemblerMk1_C",
    "inputs": [
      {
        "item": "Rifle_Ammo",
        "name": "Rifle Ammo",
        "rate": 50
      },
      {
        "item": "High_Speed_Connector",
        "name": "High-Speed Connector",
        "rate": 2.5
      }
    ],
    "outputs": [
      {
        "item": "Homing_Rifle_Ammo",
        "name": "Homing Rifle Ammo",
        "rate": 25
      }
    ]
  },
  "Recipe_BladeRunners_C": {
    "name": "Blade Runners",
    "building": "Unknown",
    "inputs": [
      {
        "item": "Silica",
        "name": "Silica",
        "rate": 20
      },
      {
        "item": "Modular_Frame",
        "name": "Modular Frame",
        "rate": 3
      },
      {
        "item": "Rotor",
        "name": "Rotor",
        "rate": 3
      }
    ],
    "outputs": [
      {
        "item": "Blade_Runners",
        "name": "Blade Runners",
        "rate": 1
      }
    ]
  },
  "Recipe_Rebar_Stunshot_C": {
    "name": "Stun Rebar",
    "building": "Desc_AssemblerMk1_C",
    "inputs": [
      {
        "item": "Iron_Rebar",
        "name": "Iron Rebar",
        "rate": 10
      },
      {
        "item": "Quickwire",
        "name": "Quickwire",
        "rate": 50
      }
    ],
    "outputs": [
      {
        "item": "Stun_Rebar",
        "name": "Stun Rebar",
        "rate": 10
      }
    ]
  },
  "Recipe_ZipLine_C": {
    "name": "Zipline",
    "building": "Unknown",
    "inputs": [
      {
        "item": "Xeno_Zapper",
        "name": "Xeno-Zapper",
        "rate": 1.5
      },
      {
        "item": "Quickwire",
        "name": "Quickwire",
        "rate": 45
      },
      {
        "item": "Iron_Rod",
        "name": "Iron Rod",
        "rate": 4.5
      },
      {
        "item": "Cable",
        "name": "Cable",
        "rate": 15
      }
    ],
    "outputs": [
      {
        "item": "Zipline",
        "name": "Zipline",
        "rate": 1.5
      }
    ]
  },
  "Recipe_Quickwire_C": {
    "name": "Quickwire",
    "building": "Desc_ConstructorMk1_C",
    "inputs": [
      {
        "item": "Caterium_Ingot",
        "name": "Caterium Ingot",
        "rate": 12
      }
    ],
    "outputs": [
      {
        "item": "Quickwire",
        "name": "Quickwire",
        "rate": 60
      }
    ]
  },
  "Recipe_NobeliskGas_C": {
    "name": "Gas Nobelisk",
    "building": "Desc_AssemblerMk1_C",
    "inputs": [
      {
        "item": "Nobelisk",
        "name": "Nobelisk",
        "rate": 5
      },
      {
        "item": "Biomass",
        "name": "Biomass",
        "rate": 50
      }
    ],
    "outputs": [
      {
        "item": "Gas_Nobelisk",
        "name": "Gas Nobelisk",
        "rate": 5
      }
    ]
  },
  "Recipe_TherapeuticInhaler_C": {
    "name": "Therapeutic Inhaler",
    "building": "Unknown",
    "inputs": [
      {
        "item": "Mycelia",
        "name": "Mycelia",
        "rate": 45
      },
      {
        "item": "Alien_Protein",
        "name": "Alien Protein",
        "rate": 3
      },
      {
        "item": "Bacon_Agaric",
        "name": "Bacon Agaric",
        "rate": 3
      }
    ],
    "outputs": [
      {
        "item": "Medicinal_Inhaler",
        "name": "Medicinal Inhaler",
        "rate": 3
      }
    ]
  },
  "Recipe_MedicinalInhaler_C": {
    "name": "Vitamin Inhaler",
    "building": "Unknown",
    "inputs": [
      {
        "item": "Mycelia",
        "name": "Mycelia",
        "rate": 30
      },
      {
        "item": "Paleberry",
        "name": "Paleberry",
        "rate": 15
      }
    ],
    "outputs": [
      {
        "item": "Medicinal_Inhaler",
        "name": "Medicinal Inhaler",
        "rate": 3
      }
    ]
  },
  "Recipe_Parachute_C": {
    "name": "Parachute",
    "building": "Unknown",
    "inputs": [
      {
        "item": "Fabric",
        "name": "Fabric",
        "rate": 30
      },
      {
        "item": "Cable",
        "name": "Cable",
        "rate": 15
      }
    ],
    "outputs": [
      {
        "item": "Parachute",
        "name": "Parachute",
        "rate": 1.5
      }
    ]
  },
  "Recipe_Fabric_C": {
    "name": "Fabric",
    "building": "Desc_AssemblerMk1_C",
    "inputs": [
      {
        "item": "Mycelia",
        "name": "Mycelia",
        "rate": 15
      },
      {
        "item": "Biomass",
        "name": "Biomass",
        "rate": 75
      }
    ],
    "outputs": [
      {
        "item": "Fabric",
        "name": "Fabric",
        "rate": 15
      }
    ]
  },
  "Recipe_Biomass_Mycelia_C": {
    "name": "Biomass (Mycelia)",
    "building": "Desc_ConstructorMk1_C",
    "inputs": [
      {
        "item": "Mycelia",
        "name": "Mycelia",
        "rate": 15
      }
    ],
    "outputs": [
      {
        "item": "Biomass",
        "name": "Biomass",
        "rate": 150
      }
    ]
  },
  "Recipe_NutritionalInhaler_C": {
    "name": "Nutritional Inhaler",
    "building": "Unknown",
    "inputs": [
      {
        "item": "Bacon_Agaric",
        "name": "Bacon Agaric",
        "rate": 3
      },
      {
        "item": "Paleberry",
        "name": "Paleberry",
        "rate": 6
      },
      {
        "item": "Beryl_Nut",
        "name": "Beryl Nut",
        "rate": 15
      }
    ],
    "outputs": [
      {
        "item": "Medicinal_Inhaler",
        "name": "Medicinal Inhaler",
        "rate": 3
      }
    ]
  },
  "Recipe_PowerCrystalShard_3_C": {
    "name": "Power Shard (5)",
    "building": "Desc_ConstructorMk1_C",
    "inputs": [
      {
        "item": "Purple_Power_Slug",
        "name": "Purple Power Slug",
        "rate": 2.5
      }
    ],
    "outputs": [
      {
        "item": "Power_Shard",
        "name": "Power Shard",
        "rate": 12.5
      }
    ]
  },
  "Recipe_PowerCrystalShard_2_C": {
    "name": "Power Shard (2)",
    "building": "Desc_ConstructorMk1_C",
    "inputs": [
      {
        "item": "Yellow_Power_Slug",
        "name": "Yellow Power Slug",
        "rate": 5
      }
    ],
    "outputs": [
      {
        "item": "Power_Shard",
        "name": "Power Shard",
        "rate": 10
      }
    ]
  },
  "Recipe_PowerCrystalShard_1_C": {
    "name": "Power Shard (1)",
    "building": "Desc_ConstructorMk1_C",
    "inputs": [
      {
        "item": "Blue_Power_Slug",
        "name": "Blue Power Slug",
        "rate": 7.5
      }
    ],
    "outputs": [
      {
        "item": "Power_Shard",
        "name": "Power Shard",
        "rate": 7.5
      }
    ]
  },
  "Recipe_NobeliskShockwave_C": {
    "name": "Pulse Nobelisk",
    "building": "Desc_AssemblerMk1_C",
    "inputs": [
      {
        "item": "Nobelisk",
        "name": "Nobelisk",
        "rate": 5
      },
      {
        "item": "Crystal_Oscillator",
        "name": "Crystal Oscillator",
        "rate": 1
      }
    ],
    "outputs": [
      {
        "item": "Pulse_Nobelisk",
        "name": "Pulse Nobelisk",
        "rate": 5
      }
    ]
  },
  "Recipe_Rebar_Spreadshot_C": {
    "name": "Shatter Rebar",
    "building": "Desc_AssemblerMk1_C",
    "inputs": [
      {
        "item": "Iron_Rebar",
        "name": "Iron Rebar",
        "rate": 10
      },
      {
        "item": "Quartz_Crystal",
        "name": "Quartz Crystal",
        "rate": 15
      }
    ],
    "outputs": [
      {
        "item": "Shatter_Rebar",
        "name": "Shatter Rebar",
        "rate": 5
      }
    ]
  },
  "Recipe_CartridgeChaos_Packaged_C": {
    "name": "Turbo Rifle Ammo",
    "building": "Desc_ManufacturerMk1_C",
    "inputs": [
      {
        "item": "Rifle_Ammo",
        "name": "Rifle Ammo",
        "rate": 125.00000000000001
      },
      {
        "item": "Aluminum_Casing",
        "name": "Aluminum Casing",
        "rate": 15
      },
      {
        "item": "Packaged_Turbofuel",
        "name": "Packaged Turbofuel",
        "rate": 15
      }
    ],
    "outputs": [
      {
        "item": "Turbo_Rifle_Ammo",
        "name": "Turbo Rifle Ammo",
        "rate": 250.00000000000003
      }
    ]
  },
  "Recipe_CartridgeChaos_C": {
    "name": "Turbo Rifle Ammo",
    "building": "Desc_Blender_C",
    "inputs": [
      {
        "item": "Rifle_Ammo",
        "name": "Rifle Ammo",
        "rate": 125.00000000000001
      },
      {
        "item": "Aluminum_Casing",
        "name": "Aluminum Casing",
        "rate": 15
      },
      {
        "item": "Turbofuel",
        "name": "Turbofuel",
        "rate": 15
      }
    ],
    "outputs": [
      {
        "item": "Turbo_Rifle_Ammo",
        "name": "Turbo Rifle Ammo",
        "rate": 250.00000000000003
      }
    ]
  },
  "Recipe_NobeliskNuke_C": {
    "name": "Nuke Nobelisk",
    "building": "Desc_ManufacturerMk1_C",
    "inputs": [
      {
        "item": "Nobelisk",
        "name": "Nobelisk",
        "rate": 2.5
      },
      {
        "item": "Encased_Uranium_Cell",
        "name": "Encased Uranium Cell",
        "rate": 10
      },
      {
        "item": "Smokeless_Powder",
        "name": "Smokeless Powder",
        "rate": 5
      },
      {
        "item": "Ai_Limiter",
        "name": "AI Limiter",
        "rate": 3
      }
    ],
    "outputs": [
      {
        "item": "Nuke_Nobelisk",
        "name": "Nuke Nobelisk",
        "rate": 0.5
      }
    ]
  },
  "Recipe_Cartridge_C": {
    "name": "Rifle Ammo",
    "building": "Desc_AssemblerMk1_C",
    "inputs": [
      {
        "item": "Copper_Sheet",
        "name": "Copper Sheet",
        "rate": 15
      },
      {
        "item": "Smokeless_Powder",
        "name": "Smokeless Powder",
        "rate": 10
      }
    ],
    "outputs": [
      {
        "item": "Rifle_Ammo",
        "name": "Rifle Ammo",
        "rate": 75
      }
    ]
  },
  "Recipe_Rebar_Explosive_C": {
    "name": "Explosive Rebar",
    "building": "Desc_ManufacturerMk1_C",
    "inputs": [
      {
        "item": "Iron_Rebar",
        "name": "Iron Rebar",
        "rate": 10
      },
      {
        "item": "Smokeless_Powder",
        "name": "Smokeless Powder",
        "rate": 10
      },
      {
        "item": "Steel_Pipe",
        "name": "Steel Pipe",
        "rate": 10
      }
    ],
    "outputs": [
      {
        "item": "Explosive_Rebar",
        "name": "Explosive Rebar",
        "rate": 5
      }
    ]
  },
  "Recipe_SpaceRifleMk1_C": {
    "name": "Rifle",
    "building": "Unknown",
    "inputs": [
      {
        "item": "Motor",
        "name": "Motor",
        "rate": 1
      },
      {
        "item": "Rubber",
        "name": "Rubber",
        "rate": 5
      },
      {
        "item": "Steel_Pipe",
        "name": "Steel Pipe",
        "rate": 12.5
      },
      {
        "item": "Screw",
        "name": "Screw",
        "rate": 125.00000000000001
      }
    ],
    "outputs": [
      {
        "item": "Rifle",
        "name": "Rifle",
        "rate": 0.5
      }
    ]
  },
  "Recipe_NobeliskCluster_C": {
    "name": "Cluster Nobelisk",
    "building": "Desc_AssemblerMk1_C",
    "inputs": [
      {
        "item": "Nobelisk",
        "name": "Nobelisk",
        "rate": 7.5
      },
      {
        "item": "Smokeless_Powder",
        "name": "Smokeless Powder",
        "rate": 10
      }
    ],
    "outputs": [
      {
        "item": "Cluster_Nobelisk",
        "name": "Cluster Nobelisk",
        "rate": 2.5
      }
    ]
  },
  "Recipe_Nobelisk_C": {
    "name": "Nobelisk",
    "building": "Desc_AssemblerMk1_C",
    "inputs": [
      {
        "item": "Black_Powder",
        "name": "Black Powder",
        "rate": 20
      },
      {
        "item": "Steel_Pipe",
        "name": "Steel Pipe",
        "rate": 20
      }
    ],
    "outputs": [
      {
        "item": "Nobelisk",
        "name": "Nobelisk",
        "rate": 10
      }
    ]
  },
  "Recipe_NobeliskDetonator_C": {
    "name": "Nobelisk Detonator",
    "building": "Unknown",
    "inputs": [
      {
        "item": "Object_Scanner",
        "name": "Object Scanner",
        "rate": 0.75
      },
      {
        "item": "Steel_Beam",
        "name": "Steel Beam",
        "rate": 7.5
      },
      {
        "item": "Cable",
        "name": "Cable",
        "rate": 37.5
      }
    ],
    "outputs": [
      {
        "item": "Nobelisk_Detonator",
        "name": "Nobelisk Detonator",
        "rate": 0.75
      }
    ]
  },
  "Recipe_GunpowderMK2_C": {
    "name": "Smokeless Powder",
    "building": "Desc_OilRefinery_C",
    "inputs": [
      {
        "item": "Black_Powder",
        "name": "Black Powder",
        "rate": 20
      },
      {
        "item": "Heavy_Oil_Residue",
        "name": "Heavy Oil Residue",
        "rate": 10
      }
    ],
    "outputs": [
      {
        "item": "Smokeless_Powder",
        "name": "Smokeless Powder",
        "rate": 20
      }
    ]
  },
  "Recipe_Gunpowder_C": {
    "name": "Black Powder",
    "building": "Desc_AssemblerMk1_C",
    "inputs": [
      {
        "item": "Coal",
        "name": "Coal",
        "rate": 15
      },
      {
        "item": "Sulfur",
        "name": "Sulfur",
        "rate": 15
      }
    ],
    "outputs": [
      {
        "item": "Black_Powder",
        "name": "Black Powder",
        "rate": 30
      }
    ]
  },
  "Recipe_FactoryCart_C": {
    "name": "Factory Cart™",
    "building": "Unknown",
    "inputs": [
      {
        "item": "Reinforced_Iron_Plate",
        "name": "Reinforced Iron Plate",
        "rate": 12
      },
      {
        "item": "Iron_Rod",
        "name": "Iron Rod",
        "rate": 12
      },
      {
        "item": "Rotor",
        "name": "Rotor",
        "rate": 6
      }
    ],
    "outputs": [
      {
        "item": "Factory_Carttm",
        "name": "Factory Cart™",
        "rate": 3
      }
    ]
  },
  "Recipe_GoldenCart_C": {
    "name": "Golden Factory Cart™",
    "building": "Unknown",
    "inputs": [
      {
        "item": "Caterium_Ingot",
        "name": "Caterium Ingot",
        "rate": 45
      },
      {
        "item": "Iron_Rod",
        "name": "Iron Rod",
        "rate": 12
      },
      {
        "item": "Rotor",
        "name": "Rotor",
        "rate": 6
      }
    ],
    "outputs": [
      {
        "item": "Golden_Factory_Carttm",
        "name": "Golden Factory Cart™",
        "rate": 3
      }
    ]
  },
  "Recipe_Biomass_Leaves_C": {
    "name": "Biomass (Leaves)",
    "building": "Desc_ConstructorMk1_C",
    "inputs": [
      {
        "item": "Leaves",
        "name": "Leaves",
        "rate": 120
      }
    ],
    "outputs": [
      {
        "item": "Biomass",
        "name": "Biomass",
        "rate": 60
      }
    ]
  },
  "Recipe_Biomass_Wood_C": {
    "name": "Biomass (Wood)",
    "building": "Desc_ConstructorMk1_C",
    "inputs": [
      {
        "item": "Wood",
        "name": "Wood",
        "rate": 60
      }
    ],
    "outputs": [
      {
        "item": "Biomass",
        "name": "Biomass",
        "rate": 300
      }
    ]
  },
  "Recipe_IronPlateReinforced_C": {
    "name": "Reinforced Iron Plate",
    "building": "Desc_AssemblerMk1_C",
    "inputs": [
      {
        "item": "Iron_Plate",
        "name": "Iron Plate",
        "rate": 30
      },
      {
        "item": "Screw",
        "name": "Screw",
        "rate": 60
      }
    ],
    "outputs": [
      {
        "item": "Reinforced_Iron_Plate",
        "name": "Reinforced Iron Plate",
        "rate": 5
      }
    ]
  },
  "Recipe_Concrete_C": {
    "name": "Concrete",
    "building": "Desc_ConstructorMk1_C",
    "inputs": [
      {
        "item": "Limestone",
        "name": "Limestone",
        "rate": 45
      }
    ],
    "outputs": [
      {
        "item": "Concrete",
        "name": "Concrete",
        "rate": 15
      }
    ]
  },
  "Recipe_Screw_C": {
    "name": "Screw",
    "building": "Desc_ConstructorMk1_C",
    "inputs": [
      {
        "item": "Iron_Rod",
        "name": "Iron Rod",
        "rate": 10
      }
    ],
    "outputs": [
      {
        "item": "Screw",
        "name": "Screw",
        "rate": 40
      }
    ]
  },
  "Recipe_Cable_C": {
    "name": "Cable",
    "building": "Desc_ConstructorMk1_C",
    "inputs": [
      {
        "item": "Wire",
        "name": "Wire",
        "rate": 60
      }
    ],
    "outputs": [
      {
        "item": "Cable",
        "name": "Cable",
        "rate": 30
      }
    ]
  },
  "Recipe_Wire_C": {
    "name": "Wire",
    "building": "Desc_ConstructorMk1_C",
    "inputs": [
      {
        "item": "Copper_Ingot",
        "name": "Copper Ingot",
        "rate": 15
      }
    ],
    "outputs": [
      {
        "item": "Wire",
        "name": "Wire",
        "rate": 30
      }
    ]
  },
  "Recipe_IngotCopper_C": {
    "name": "Copper Ingot",
    "building": "Desc_SmelterMk1_C",
    "inputs": [
      {
        "item": "Copper_Ore",
        "name": "Copper Ore",
        "rate": 30
      }
    ],
    "outputs": [
      {
        "item": "Copper_Ingot",
        "name": "Copper Ingot",
        "rate": 30
      }
    ]
  },
  "Recipe_PortableMiner_C": {
    "name": "Portable Miner",
    "building": "Unknown",
    "inputs": [
      {
        "item": "Iron_Plate",
        "name": "Iron Plate",
        "rate": 3
      },
      {
        "item": "Iron_Rod",
        "name": "Iron Rod",
        "rate": 6
      }
    ],
    "outputs": [
      {
        "item": "Portable_Miner",
        "name": "Portable Miner",
        "rate": 1.5
      }
    ]
  }
};