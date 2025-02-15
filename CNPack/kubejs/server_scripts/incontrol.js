
const entitySpawnBlacklist = [
    {
      "minheight": 192,
      "hostile": true,
      "spawner": false,
      "result": "deny"
    },
    {
      "dimension": "minecraft:overworld",
      "height": "gt(160)",
      "mob": ["cataclysm:lionfish", "cataclysm:deepling"],
      "result": "deny"
    },
    {
      "dimension": "minecraft:overworld",
      "mob": ["aquatic_frontiers:sandy","minecraft:wandering_trader", "minecraft:villager", "minecraft:zombie_villager"],
      "result": "deny"
    },
    {
      "mob": [ "minecraft:sheep", "minecraft:chicken", "minecraft:pig", "minecraft:horse", "minecraft:donkey", "minecraft:pillager", "minecraft:evoker", "minecraft:wandering_trader"],
      "result": "deny"
    },
    {
      "minheight": 192,
      "dimension": "minecraft:overworld",
      "spawner": false,
      "result": "deny"
    }
  ]
  EntityEvents.checkSpawn((event) => {
    const {type, entity, level} = event;
    if(type == "COMMAND" || type == "SPAWN_EGG" || type == 'TRIAL_SPAWNER' || type == "MOB_SUMMONED") return;
    if(entity.isPlayer()) return;
    if(entity.getType().contains("hpm")) return;

    // console.log(`Checking spawn for ${entity.getType()} at ${entity.x}, ${entity.y}, ${entity.z} in ${level.dimension}`);

    for(let i = 0; i < entitySpawnBlacklist.length; i++) {
      let rule = entitySpawnBlacklist[i];
      // console.log(`Checking rule: ${JSON.stringify(rule)}`);
  
      let denySpawn = true;

      
      if(rule.mob && rule.mob.indexOf(entity.getType()) == -1) {
        // console.log(`Rule mob mismatch: ${entity.getType()} not in ${rule.mob}`);
        denySpawn = false;
      }
  
      if(rule.dimension && rule.dimension != level.dimension) {
        // console.log(`Rule dimension matched: ${rule.dimension} == ${level.dimension}`);
        denySpawn = false;
      }
      if(rule.minheight && entity.y < rule.minheight) {
        // console.log(`Rule minheight mismatch: ${entity.y < ${rule.minheight}`);
        denySpawn = false;
      }
  
      if(rule.height && rule.height.startsWith("gt(")) {
        let height = parseInt(rule.height.substring(3, rule.height.length - 1));
        if(entity.y <= height) {
          // console.log(`Rule height gt mismatch: ${entity.y <= ${height}`);
          denySpawn = false;
        }
      }
  
      if(rule.height && rule.height.startsWith("lt(")) {
        let height = parseInt(rule.height.substring(3, rule.height.length - 1));
        if(entity.y >= height) {
          // console.log(`Rule height lt mismatch: ${entity.y >= ${height}`);
          denySpawn = false;
        }
      }
  
      if(rule.hostile && !entity.isMonster()) {
        // console.log(`Rule hostile mismatch: ${entity.getType()} is not hostile`);
        denySpawn = false;
      }
      if(rule.spawner === false && type == "SPAWNER") {
        // console.log(`Rule spawner false but type is SPAWNER: ${type} == SPAWNER`);
        continue;
      }
  
      if(rule.spawner && type != "SPAWNER") {
        // console.log(`Rule spawner mismatch: ${type} != SPAWNER`);
        denySpawn = false;
      }
  
      if(denySpawn && rule.result == "deny") {
        // console.log(`Denied spawn of ${entity.getType()} at ${entity.x}, ${entity.y}, ${entity.z}`);
        event.cancel();
        return;
      }
    }
  });