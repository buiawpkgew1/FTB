const tooltips = [
  {
    item: "ftb:abyssal_fragment",
    text: Text.green("Drops from the majority of Rift mobs"),
  },
  {
    item: "minecraft:soul_lantern",
    text: Text.green("Found in structures above the ocean"),
  },
  {
    item: "brickfurnace:brick_furnace",
    text: Text.aqua("ⓘ 2x Faster than a Vanilla Furnace!"),
  },
  {
    item: "brickfurnace:brick_blast_furnace",
    text: Text.aqua("ⓘ 2x Faster than a Vanilla Blast Furnace!"),
  },
  {
    item: "oritech:plastic_sheet",
    text: Text.aqua("Also known as an HDPE Sheet."),
  },
  {
    item: "pneumaticcraft:ingot_iron_compressed",
    text: Text.green("Crafted with Cast Iron Ingots."),
  },
  {
    item: "ftbstuff:stone_cobblestone_generator",
    text: Text.of("1").gold().append(Text.of(` Cobble / Sec`).gray()),
  },
  {
    item: "ftbstuff:iron_cobblestone_generator",
    text: Text.of("2").gold().append(Text.of(` Cobble / Sec`).gray()),
  },
  {
    item: "ftbstuff:gold_cobblestone_generator",
    text: Text.of("4").gold().append(Text.of(` Cobble / Sec`).gray()),
  },
  {
    item: "ftbstuff:diamond_cobblestone_generator",
    text: Text.of("16").gold().append(Text.of(` Cobble / Sec`).gray()),
  },
  {
    item: "ftbstuff:netherite_cobblestone_generator",
    text: Text.of("32").gold().append(Text.of(` Cobble / Sec`).gray()),
  },
  {
    item: "justdirethings:time_crystal_budding_block",
    text: Text.of("(Shift)").gray(),
  },
  {
    item: "justdirethings:time_crystal_budding_block",
    text: "Must absorb energy from each dimension in order.",
  },
  {
    item: "justdirethings:time_crystal_budding_block",
    text: "Will need an occasional recharge",
  },
  {
    item: "justdirethings:time_crystal_budding_block",
    text: Text.of("Overworld")
      .green()
      .append(Text.of(" → ").gray())
      .append(Text.of("Nether").red())
      .append(Text.of(" → ").gray())
      .append(Text.of("Compact Machine").blue()),
    shift: true,
  },
  {
    item: "actuallyadditions:coffee_beans",
    text: Text.gold("ⓘ A Robusta Variant, Grants a Strong and Bitter Flavor."),
  },
  {
    item: "rusticdelight:coffee_beans",
    text: Text.gold("ⓘ A Liberica Variant, Grants a Fruity Flavor."),
  }
];

const sluices = [
  {
    itemID: "ftbstuff:oak_sluice",
    time: "1.0",
    fluidUsage: "1.0",
    item: false,
    fluid: false,
    power: false,
  },
  {
    itemID: "ftbstuff:iron_sluice",
    time: "0.75",
    fluidUsage: "0.75",
    item: true,
    fluid: false,
    power: false,
  },
  {
    itemID: "ftbstuff:diamond_sluice",
    time: "0.50",
    fluidUsage: "0.50",
    item: true,
    fluid: true,
    power: false,
  },
  {
    itemID: "ftbstuff:netherite_sluice",
    time: "0.25",
    fluidUsage: "0.25",
    item: true,
    fluid: true,
    power: true,
  },
];

ItemEvents.modifyTooltips((event) => {
  sluices.forEach((sluice) => {
    event.add(
      sluice.itemID,
      { shift: true },
      Text.of("Processing Time: ")
        .gray()
        .append(Text.of(`${sluice.time}x`).gold())
    );
    event.add(
      sluice.itemID,
      { shift: true },
      Text.of("Fluid Usage Multiplier: ")
        .gray()
        .append(Text.of(`${sluice.fluidUsage}x`).aqua())
    );
    event.add(
      sluice.itemID,
      { shift: true },
      Text.of("Item Automation: ")
        .gray()
        .append(Text.of(sluice.item ? "True" : "False").color(sluice.item ? "green" : "red"))
    );
    event.add(
      sluice.itemID,
      { shift: true },
      Text.of("Fluid Automation: ")
        .gray()
        .append(Text.of(sluice.fluid ? "True" : "False").color(sluice.fluid ? "green" : "red"))
    );
    event.add(
      sluice.itemID,
      { shift: true },
      Text.of("Requires Power: ")
        .gray()
        .append(Text.of(sluice.power ? "True" : "False").color(sluice.power ? "green" : "red"))
    );
  });

  tooltips.forEach((tooltip) => {
    event.add(tooltip.item, tooltip.shift ? { shift: true } : {}, tooltip.text);
  });

  event.modify("mekanism:module_elytra_unit", (tooltip) => {
    tooltip.removeLine(1);
    tooltip.insert(1, Text.of("Applies an Elytra to the Meka Suit."));
  });

  event.modify(`obtrophies:display_trophy`, (b) => b.dynamic(`streamertrophy`));

  event.modify(['mekanism:jetpack', 'mekanism:jetpack_armored', 'oritech:jetpack', 'oritech:exo_jetpack', 'ftb:rift_charge'], { shift: false }, (tooltip) => {
    tooltip.insert(1, Text.gray("[Hold Shift for more info]"));
  })
  event.modify(['mekanism:jetpack', 'mekanism:jetpack_armored', 'oritech:jetpack', 'oritech:exo_jetpack'], { shift: true }, (tooltip) => {
    tooltip.insert(1, Text.red("The Rift will disrupt the Jetpack."));
  })
  event.modify('ftb:rift_charge', {shift: true}, tooltip => {
    tooltip.insert(1, Text.darkGray('Does not drop as an item.'))
    tooltip.insert(2, Text.darkGray('Only charges your Rift Time.'))
  });
});

const trophyTooltips = {
  "minecraft:cactus": "A special Trophy - For Reese",
  "oritech:banana": "A special Trophy - For Matrixis",
  "ars_nouveau:creative_spell_book": "A special Trophy - For ChosenArchitect",
  "mysticalagradditions:inferium_apple": "A special Trophy - For ectorvynk",
  "ftbstuff:purple_barrel": "A special Trophy - For Lashmak",
  "ftb:rift_weaver_disc": "A special Trophy - For Threefold",
  "ae2:singularity": "A special Trophy - For SystemCollapse",
  "minecraft:cauldron": "A special Trophy - For Vlofast",
  "ars_nouveau:frostaya_pod": "A special Trophy - For Joprebond",
  "gag:no_solicitors": "A special Trophy - For AlfredGG",
  "oritech:tech_button": "A special Trophy - For Button",
};

ItemEvents.dynamicTooltips("streamertrophy", (event) => {
  const { item } = event;
  Object.entries(trophyTooltips).forEach(([key, value]) => {
    if (item.getComponentsPatch().get("obtrophies:display_trophy_info").get().displayItem().id == key) {
      event.add(Text.green(value));
      event.add(Text.gray("With love from the FTB Team"));
    }
  });

});

const riftCrystalInformation = [
  "Rift Attenuation Crystals are used to stabilize Players Rifts.",
  " ",
  "Standing near the Empowerer when it finishes its craft will up any nearby Player's Charge.",
  " ",
  "Every Rift Attenuation Crystal has a limited amount of energy and is capped at their respective time limit.",
]
RecipeViewerEvents.addInformation('item', event => {
  event.add(/ftb:(.*)attenuation_crystal/, riftCrystalInformation);
})

