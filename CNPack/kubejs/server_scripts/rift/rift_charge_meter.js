const $CuriosApi = Java.loadClass("top.theillusivec4.curios.api.CuriosApi")
PlayerEvents.tick((event) => {
    const {player, server} = event
    if(server.getTickCount() % 40 != 0) return;

    let inv = $CuriosApi.getCuriosInventory(player)
    if (inv == null) return

    let riftmeter = inv.get().isEquipped('ftb:rift_charge_meter')
    if (!riftmeter) return
    
    global.showRiftCharge(player); 
})