const twoByTwo = ["II", "II"];

ServerEvents.recipes((event) => {
  let pebble_recipes = [
    ["ftb:stone_pebbles", "minecraft:cobblestone"],
    ["ftb:andesite_pebbles", "minecraft:andesite"],
    ["ftb:granite_pebbles", "minecraft:granite"],
    ["ftb:diorite_pebbles", "minecraft:diorite"],
    ["ftb:calcite_pebbles", "minecraft:calcite"],
    ["ftb:deepslate_pebbles", "minecraft:deepslate"],
    ["ftb:tuff_pebbles", "minecraft:tuff"],
    ["ftb:basalt_pebbles", "minecraft:basalt"],
    ["ftb:endstone_pebbles", "minecraft:end_stone"],
    ["ftb:netherrack_pebbles", "minecraft:netherrack"],
    ["ftb:red_sandstone_pebbles", "minecraft:red_sandstone"],
    ["ftb:sandstone_pebbles", "minecraft:sandstone"],
  ];

  pebble_recipes.forEach((recipe) => {
    let pebbleName = recipe[0].split(":")[1].toLowerCase();
    event
      .shaped(`${recipe[1]}`, twoByTwo, { I: `${recipe[0]}` })
      .id(`ftbmaterials:ftb/pebbles/${pebbleName}_compressing`);
  });

  //Making Kelp Resin
  event.custom({
    type: "farmersdelight:cooking",
    cookingtime: 1200,
    experience: 0.35,
    ingredients: [
      {
        item: "minecraft:kelp",
      },
      {
        item: "minecraft:kelp",
      },
      {
        item: "minecraft:kelp",
      },
      {
        item: "minecraft:kelp",
      },
      {
        item: "minecraft:kelp",
      },
      {
        item: "minecraft:kelp",
      },
    ],
    recipe_book_tab: "misc",
    result: {
      count: 2,
      id: "ftb:kelp_goo",
    },
  });

  //Nautical Eye
  event
    .shaped("ftb:nautical_eye", [" G ", "GEG", " G "], {
      G: "minecraft:prismarine_shard",
      E: "minecraft:ender_eye",
    })
    .id("ftb:nautical_eye");



  //Abyssal Eye
  event
    .shaped("ftb:abyssal_pearl", [" G ", "GEG", " G "], {
      G: "ftb:abyssal_fragment",
      E: "minecraft:ender_pearl",
    })
    .id("ftb:abyssal_pearl");

  //rusty gear
  event.shapeless("nautec:rusty_gear", ["nautec:air_bottle","pneumaticcraft:compressed_iron_gear"]).id("ftb:rusty_gear");

  //broken whisk
  event.shapeless("nautec:broken_whisk", ["nautec:cast_iron_rod","3x #c:wires/steel"]).id("ftb:broken_whisk");

  //burn coil
  event.shapeless("nautec:burnt_coil", ["2x #c:ingots/cast_iron","#c:rods/blaze", "#c:dusts/prismarine"]).id("ftb:burnt_coil");

  //ancient valve
  event.shapeless("nautec:ancient_valve", ["minecraft:netherite_scrap","pneumaticcraft:turbine_rotor", "2x #c:dusts/prismarine"]).id("ftb:ancient_valve");

  //Magma Droplet
  event.shapeless("9x ftb:magma_droplet", "minecraft:magma_block").id("ftb:magma_droplet");
  event.shaped("minecraft:magma_block", ["III", "III", "III"], { I: "ftb:magma_droplet" }).id("ftb:magma_block");

  //wither rose
  event
    .custom({
      type: "occultism:spirit_fire",
      ingredient: {
        item: "minecraft:poppy",
      },
      result: {
        count: 1,
        id: "minecraft:wither_rose",
      },
    })
    .id("ftb:wither_rose");

  // Extend Craft
  event
    .shaped("extendedcrafting:auto_ender_crafter", ["SMS", "MEM", "SMS"], {
      E: "extendedcrafting:ender_crafter",
      S: "nautec:aquarine_steel_ingot",
      M: "pneumaticcraft:upgrade_matrix",
    })
    .id("ftb:ender_craft_auto");
});
