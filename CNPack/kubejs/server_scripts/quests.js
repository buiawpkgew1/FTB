/* 
FTBQuestsEvents.customReward("3C4BE1C041C6CFF2", event =>{
    const {reward, level, player, server} = event
    const {tags} = reward

    let portalCenter = global.findPortalCenter(player)
    setWaypoint(player, 'Rift-Portal', portalCenter)
})

function setWaypoint(player, name, pos){
    let command = `execute as ${player.username} run ftbchunks waypoint add ${name} ${pos.x} ${pos.y} ${pos.z} minecraft:overworld`
    player.getServer().runCommand(command)
} 
*/