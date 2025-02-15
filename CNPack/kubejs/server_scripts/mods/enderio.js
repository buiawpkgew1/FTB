ServerEvents.recipes((event) => {
  //Moving IE Alloy Kiln Recipes to the Primitive Alloy Smelter from EnderIO

  let kiln_recipes = [
    [1, "c:ingots/copper", 1, "c:ingots/zinc", 2, "ftbmaterials:brass_ingot"],
    [2, "c:ingots/iron", 1, "c:ingots/nickel", 3, "ftbmaterials:invar_ingot"],
    [1, "c:ingots/copper", 1, "c:ingots/nickel", 2, "ftbmaterials:constantan_ingot"],
    [1, "c:ingots/silver", 1, "c:ingots/gold", 2, "ftbmaterials:electrum_ingot"],
    [3, "c:ingots/copper", 1, "c:ingots/tin", 4, "ftbmaterials:bronze_ingot"],
    [2, "c:glass_blocks", 1, "c:dusts/iron", 2, "immersiveengineering:insulating_glass"],
  ];

  kiln_recipes.forEach((recipe) => {
    let output_split = recipe[5].split(":");
    let output_name = output_split[1];

    event
      .custom({
        type: "enderio:alloy_smelting",
        energy: 4800,
        experience: 0.3,
        inputs: [
          {
            count: recipe[0],
            tag: recipe[1],
          },
          {
            count: recipe[2],
            tag: recipe[3],
          },
        ],
        output: {
          count: recipe[4],
          id: recipe[5],
        },
      })
      .id("ftb:alloying/" + output_name);
  });

  //Readding Wodden Gear Recipe to only Accept Normal Wooden Sticks.
  event.replaceInput({ id: "enderio:wood_gear" }, "#c:rods/wooden", "#c:sticks");

  // Add custom redstone ore SAG milling recipe
  enderIOBasicSagMillingRecipe(
    event,
    "c:ores/redstone",
    [
      ["minecraft:redstone", 8],
      ["minecraft:redstone", 1, 0.2],
      ["ae2:silicon", 1, 0.8],
      ["minecraft:cobblestone", 1, 0.15],
    ],
    "enderio:sag_milling/redstone_ore"
  );

  global.materials.forEach((material) => {
    let materialId = material[0];
    const itemID = materialId.includes(":") ? materialId : `minecraft:${materialId}`;
    let materialName = materialId.includes(":") ? materialId.split(":")[1] : materialId;

    if (material === "mekanism:fluorite_gem") {
      materialId = "mekanism:fluorite";
      materialName = "fluorite";
    }

    enderIOBasicAlloySmeltingRecipe(
      event,
      `c:clusters/${materialName}`,
      [itemID, material[1]],
      `ftb:enderio/smelt/cluster/${materialName}`
    );
  });

  //More Recipes for Withering Powder.
  let withering_dust_recipes = [
    ["minecraft:wither_skeleton_skull", "enderio:withering_powder", 2],
    ["minecraft:wither_rose", "enderio:withering_powder", 1]
  ];
  
  withering_dust_recipes.forEach(withering => {
    let inputName = withering[0].includes(":") ? withering[0].split(":")[1] : withering[0];
    let outputName = withering[1].includes(":") ? withering[1].split(":")[1] : withering[1];

    event.custom({
      "type": "immersiveengineering:crusher",
      "energy": 3000,
      "input": {
        "item": withering[0]
      },
      "result": {
        "basePredicate": {
          "item": withering[1]
        },
        "count": withering[2]
      }
    }).id(`ftb:immersive_engineering/crusher/${inputName}_to_${outputName}`);

    event.custom({
      "type": "oritech:pulverizer",
      "fluidInputAmount": 0,
      "fluidInputVariant": "minecraft:empty",
      "fluidOutputAmount": 0,
      "fluidOutputVariant": "minecraft:empty",
      "ingredients": [
        {
          "item": withering[0]
        }
      ],
      "results": [
        {
          "count": withering[2],
          "id": withering[1]
        }
      ],
      "time": 200
    }).id(`ftb:oritech/pulverizer/${inputName}_to_${outputName}`);

  });

});
