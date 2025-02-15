function isWithinProtectedBounds(pos, level) {
  const startX = -256,
  startY = 256,
  endX = 192,
  endY = -207;

  // if (level.dimension == "ftb:the_rift") return true; 

  if (level.dimension == "minecraft:overworld") {
    // Determine the minimum and maximum x and y values to handle any order
    const minX = Math.min(startX, endX);
    const maxX = Math.max(startX, endX);
    const minY = Math.min(startY, endY);
    const maxY = Math.max(startY, endY);

    // Check if the position is within the bounds
    return pos.x >= minX && pos.x <= maxX && pos.y >= minY && pos.y <= maxY;
  }
  return false;
}

//Cancel breaking blocks in overworld unless in creative
BlockEvents.broken((event) => {
  const { level, player } = event;
  if (isWithinProtectedBounds(event.block.pos, level)) {
    if (!player) event.cancel();
    if (!player.isCreative()) event.cancel();
  }
});

//Cancel placing blocks in overworld unless in creative
BlockEvents.placed((event) => {
  const { level, player, block } = event;
  if (isWithinProtectedBounds(event.block.pos, level)) {
    if (!player) event.cancel();
    if (!player.isCreative()) event.cancel();
  }
});

const $TagKey = Java.loadClass("net.minecraft.tags.TagKey");
const $Registry = Java.loadClass("net.minecraft.core.registries.Registries");

let $IFluidHandler = Java.loadClass("net.neoforged.neoforge.fluids.capability.IFluidHandler");
EntityEvents.afterHurt(event => {
  const { entity, source, level } = event;
  if(entity.getType().toString().contains('target_dummy')) return;
  if(!source.toString().contains('hotFloor')) return;


  const kuLevel = new Ku.Level(level);
  const location = kuLevel.findFirstBlockTagWithinRadius(
    $TagKey.create($Registry.BLOCK, 'productivemetalworks:foundry_controllers'),
    level.getBlock(entity.eyePosition).getPos(),
    32
  );
  let controller = level.getBlockEntity(location);

  let fluidStack = Fluid.of("productivemetalworks:meat", 10);
  if (controller.getFluidHandler().fill(fluidStack, $IFluidHandler.FluidAction.SIMULATE) == fluidStack.getAmount()) {
    controller.getFluidHandler().fill(fluidStack, $IFluidHandler.FluidAction.EXECUTE);
  }
  controller.setChanged();
})