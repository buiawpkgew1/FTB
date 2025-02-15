ServerEvents.recipes((event) => {
  //Straw from Sapplings
  event.custom({
    type: "farmersdelight:cutting",
    ingredients: [
      {
        tag: "minecraft:saplings",
      },
    ],
    result: [
      {
        item: {
          count: 1,
          id: "farmersdelight:straw",
        },
      },
    ],
    sound: {
      sound_id: "minecraft:item.axe.strip",
    },
    tool: {
      tag: "c:tools/knife",
    },
  });

  //Nerfing the Rope Recipe
  event.remove({ output: "farmersdelight:rope" });
  event
    .shaped(Item.of("farmersdelight:rope", 2), ["S  ", "S  "], {
      S: "farmersdelight:straw",
    })
    .id("ftb:rope");

    event
    .shaped(Item.of("farmersdelight:cooking_pot", 1), ["CSC", "CBC", "CCC"], {
      C: "#c:bricks",
      S: "minecraft:wooden_shovel",
      B: "minecraft:water_bucket",
    })
    .id("ftb:cooking_pot");

    event
    .shaped(Item.of("farmersdelight:cooking_pot", 1), ["CSC", "CBC", "CCC"], {
      C: "#c:bricks",
      S: "minecraft:wooden_shovel",
      B: "ceramicbucket:ceramic_bucket",
    })
    .id("ftb:cooking_pot_clay");


  //Adding a Extra Cotton -> String Recipe rewarding the use of a Cutting Board.
  event.custom({
    type: "farmersdelight:cutting",
    ingredients: [
      {
        tag: "c:crops/cotton",
      },
    ],
    result: [
      {
        item: {
          count: 3,
          id: "minecraft:string",
        },
      },
    ],
    sound: {
      sound_id: "minecraft:entity.sheep.shear",
    },
    tool: {
      tag: "c:tools/shear",
    },
  });

  event
    .custom({
      type: "farmersdelight:cooking",
      container: {
        count: 1,
        id: "minecraft:glass_bottle",
      },
      experience: 1.0,
      ingredients: [
        {
          item: "minecraft:sugar",
        },
        {
          item: "minecraft:sugar",
        },
        {
          item: "minecraft:sugar",
        },
      ],
      recipe_book_tab: "drinks",
      result: {
        count: 1,
        id: "minecraft:honey_bottle",
      },
    })
    .id("ftb:honeyfromsugar");

  //Quartz Dust in the Cutting Board
  event.custom({
    type: "farmersdelight:cutting",
    ingredients: [
      {
        tag: "c:gems/quartz",
      },
    ],
    result: [
      {
        item: {
          count: 1,
          id: "ftbmaterials:quartz_dust",
        },
      },
    ],
    sound: {
      sound_id: "minecraft:block.anvil.land",
    },
    tool: {
      tag: "ftbstuff:hammers",
    },
  });
});
