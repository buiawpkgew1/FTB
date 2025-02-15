const $EnchantmentHelper = Java.loadClass("net.minecraft.world.item.enchantment.EnchantmentHelper");
const $ItemEnchants = Java.loadClass("net.minecraft.world.item.enchantment.ItemEnchantments");

ServerEvents.recipes(event => {
    // Correctly define the Soulbound book
    const soulbound_book = 'minecraft:enchanted_book[stored_enchantments={levels:{"soulbound:soulbound":1}}]';

    event.shapeless('pneumaticcraft:pneumatic_chestplate', ['#c:pncchestplate', soulbound_book]).modifyResult('soulbound_transfer').id('ftb:chest_soulbound_transfer');
    event.shapeless('pneumaticcraft:pneumatic_boots', ['#c:pncboots', soulbound_book]).modifyResult('soulbound_transfer').id('ftb:boots_soulbound_transfer');
    event.shapeless('pneumaticcraft:pneumatic_leggings', ['#c:pncleggings', soulbound_book]).modifyResult('soulbound_transfer').id('ftb:leggings_soulbound_transfer');
    event.shapeless('pneumaticcraft:pneumatic_helmet', ['#c:pnchelmet', soulbound_book]).modifyResult('soulbound_transfer').id('ftb:helmet_soulbound_transfer');
});

// Modify the recipe result to add enchantments while keeping all components
ServerEvents.modifyRecipeResult('soulbound_transfer', (event) => {
    
    let grid = event.grid;
    let baseArmor = grid.getItem(0).copy();
    let soulboundBook = grid.getItem(1);

    // Get the components patch safely
    let bookPatch = soulboundBook.getComponentsPatch();
    if (!bookPatch) return;
    let storedEnchants = bookPatch.get('minecraft:stored_enchantments');
    if (!storedEnchants) return;
    if(!storedEnchants.get().entrySet()[0].toString().contains("soulbound:soulbound")) return;

    let result = baseArmor.copy();
    $EnchantmentHelper.setEnchantments(result, storedEnchants.get());
    event.success(result);

});
