//Recipes for Custom Items

const tiers = [
  {
    essence: "mysticalagriculture:prudentium_essence",
    crafting_seed: "ftb:charged_prosperity_seed",
  },
  {
    essence: "mysticalagriculture:tertium_essence",
    crafting_seed: "ftb:charged_voidflame_seed",
  },
  {
    essence: "mysticalagriculture:imperium_essence",
    crafting_seed: "ftb:charged_voidflame_seed",
  },
  {
    essence: "mysticalagriculture:supremium_essence",
    crafting_seed: "ftb:empowered_rift_seed",
  },
  {
    essence: "mysticalagradditions:insanium_essence",
    crafting_seed: "ftb:empowered_rift_seed",
  },
];

ServerEvents.recipes((event) => {
  event
    .custom({
      type: "mysticalagriculture:infusion",
      input: {
        tag: "c:slime_balls",
      },
      ingredients: [
        {
          tag: "minecraft:bee_food",
        },
        {
          item:"minecraft:dried_kelp",
        },
        {
          tag: "minecraft:bee_food",
        },
        {
          item: "minecraft:dried_kelp",
        },
        {
          tag: "minecraft:bee_food",
        },
        {
          item: "minecraft:dried_kelp",
        },
        {
          tag: "minecraft:bee_food",
        },
        {
          item: "minecraft:dried_kelp",
        },
      ],
      result: {
        id: "gateways:gate_pearl",
        components: {
          "gateways:gateway": "gateways:emerald_grove",
        },
      },
    })
    .id("ftb:gateways/emerald_grove");

  tiers.forEach((tier) => {
    event.forEachRecipe(
      { id: /mysticalagriculture:seed\/infusion/, input: tier.essence },
      (recipe) => {
        let r = JSON.parse(recipe.json);
        r.input = { item: tier.crafting_seed };
        event.custom(r).id(recipe.getId());
      }
    );
  });
});
