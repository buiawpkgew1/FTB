const addMekFurnaceRecipes = [
  ["c:raw_materials/iron", ["minecraft:iron_ingot", 1]],
  ["c:raw_materials/gold", ["minecraft:gold_ingot", 1]],
  ["c:raw_materials/copper", ["minecraft:copper_ingot", 1]],
  ["c:raw_materials/aluminum", ["ftbmaterials:aluminum_ingot", 1]],
  ["c:raw_materials/lead", ["ftbmaterials:lead_ingot", 1]],
  ["c:raw_materials/nickel", ["ftbmaterials:nickel_ingot", 1]],
  ["c:raw_materials/osmium", ["ftbmaterials:osmium_ingot", 1]],
  ["c:raw_materials/silver", ["ftbmaterials:silver_ingot", 1]],
  ["c:raw_materials/uranium", ["ftbmaterials:uranium_ingot", 1]],
  ["c:raw_materials/platinum", ["ftbmaterials:platinum_ingot", 1]],
  ["c:raw_materials/tin", ["ftbmaterials:tin_ingot", 1]],
];

ServerEvents.recipes((event) => {
  addMekFurnaceRecipes.forEach((recipe) => {
    const safeId = recipe[0].replace("c:raw_materials/", "").replace(/[:/]/g, "_");

    mekanismBasicSmeltingRecipe(event, recipe[0], recipe[1][0], recipe[1][1], `ftb:mekanism/smelt/${safeId}`);
  });

  global.materials.forEach((material) => {
    let materialId = material[0];
    const itemID = materialId.includes(":") ? materialId : `minecraft:${materialId}`;
    let materialName = materialId.includes(":") ? materialId.split(":")[1] : materialId;

    if (material === "mekanism:fluorite_gem") {
      materialId = "mekanism:fluorite";
      materialName = "fluorite";
    }

    mekanismBasicSmeltingRecipe(
      event,
      `c:clusters/${materialName}`,
      itemID,
      material[1],
      `ftb:mekanism/smelt/cluster/${materialName}`
    );
  });

  event.replaceOutput({ id: "mekanism:enriching/hdpe_sheet" }, "mekanism:hdpe_sheet", "oritech:plastic_sheet");

  let hdpe_sheet_recipes = [
    "mekanism:module_color_modulation_unit",
    "mekanism:sps_casing",
    "mekanism:module_attack_amplification_unit",
    "mekanism:module_radiation_shielding_unit",
    "mekanism:mekasuit_bodyarmor",
    "mekanism:modification_station",
    "mekanism:solar_neutron_activator",
    "mekanism:module_laser_dissipation_unit",
    "mekanism:mekasuit_helmet",
    "mekanism:module_electrolytic_breathing_unit",
    "mekanism:module_base",
    "mekanism:module_geiger_unit",
    "mekanism:mekasuit_pants",
    "mekanism:module_shearing_unit",
    "mekanism:module_energy_unit",
    "mekanism:module_excavation_escalation_unit",
    "mekanism:mekasuit_boots",
    "mekanism:module_farming_unit",
    "mekanism:meka_tool",
    "mekanism:module_dosimeter_unit",
    "mekanism_lasers:ore_generator",
  ];

  hdpe_sheet_recipes.forEach((recipe) => {
    event.replaceInput({ id: recipe }, "mekanism:hdpe_sheet", "oritech:plastic_sheet");
  });

  //Also Replacing the HDPE Elytra in the Elytra Module
  event.replaceInput({ id: "mekanism:module_elytra_unit" }, "mekanism:hdpe_elytra", "minecraft:elytra");

  event.replaceInput({id: "mekanism:metallurgic_infuser"}, "ftbmaterials:osmium_ingot", "ftbmaterials:steel_ingot")
  event.replaceInput({id: "mekanism:tier_installer/basic"}, "#minecraft:planks", "oritech:machine_core_4")
  event.replaceInput({id: "mekanism:tier_installer/advanced"}, "#minecraft:planks", "oritech:machine_core_5")
  event.replaceInput({id: "mekanism:tier_installer/elite"}, "#minecraft:planks", "oritech:machine_core_6")
  event.replaceInput({id: "mekanism:tier_installer/ultimate"}, "#minecraft:planks", "oritech:machine_core_7")

  event.forEachRecipe({id: new RegExp(`mekanism:factory\/(.*)\/(.*)`)}, recipe => {
    let result = recipe.getOriginalRecipeResult();
    let input = recipe.getOriginalRecipe().getIngredients()[4];
    let tier = recipe.getId().split("/")[1];
    event.shapeless(result, [input.getItemIds()[0], `mekanism:${tier}_tier_installer`]).id(recipe.getId());
  });
});
