const removePuzzleExtension = function (json) {
    if (json.info && json.info.savedExtensions) {
        var exts = json.info.savedExtensions;
        for (var i = exts.length - 1; i >= 0; i--) {
            if (exts[i].extensionName == 'Puzzle') {
                exts.splice(i, 1);
            }
        }
        if (exts.length == 0) delete json.info.savedExtensions;
    }
}
const removeProcDef = function (templateBlocks, levelBlocks) {
    if (!(templateBlocks && levelBlocks)) return;
    var delBlockIds = {};
    for (var tkey in templateBlocks) {
        var opcode = templateBlocks[tkey].opcode;
        if (opcode == "procedures_prototype") {
            var proccode = templateBlocks[tkey].mutation.proccode;
            for (var lkey in levelBlocks) {
                if (levelBlocks[lkey].opcode == opcode && levelBlocks[lkey].mutation.proccode == proccode) {
                    delete levelBlocks[lkey];
                    delBlockIds[lkey] = true;
                    break;
                }
            }
        }
    }
    for (var lkey in levelBlocks) {
        if (levelBlocks[lkey].opcode == "procedures_definition" && levelBlocks[lkey].inputs.custom_block[1] == lkey) {
            delete levelBlocks[lkey];
        }
    }
};

const puzzleMergeProjectSb3 = (level, template) => {
    //if (level) removePuzzleExtension(level);
    if (template) removePuzzleExtension(template);
    if (!template) return JSON.stringify(level);

    var prefixMap = {};
    for (var i = 0; i < level.targets.length; i++) {
        var levelTarget = level.targets[i];
        var findTarget = false;
        for (var j = 0; j < template.targets.length; j++) {
            var templateTarget = template.targets[j];
            if (levelTarget.isStage == templateTarget.isStage && levelTarget.name == templateTarget.name) {
                findTarget = true;
                if (levelTarget.blocks) {
                    removeProcDef(templateTarget.blocks, levelTarget.blocks);
                    for (var key in levelTarget.blocks) {
                        templateTarget.blocks[key] = levelTarget.blocks[key];
                    }
                }
                if (levelTarget.variables) {
                    if (!templateTarget.variables) templateTarget.variables = {};
                    for (var key in levelTarget.variables) {
                        var lVar = levelTarget.variables[key];
                        var find = false;
                        for (var tkey in templateTarget.variables) {
                            var tVar = templateTarget.variables[tkey];
                            if (lVar[0] == tVar[0]) {
                                find = true;
                                prefixMap[tkey] = key;
                                break;
                            }
                        }
                        if (!find) {
                            templateTarget.variables[key] = levelTarget.variables[key];
                        }
                    }
                }
                if (levelTarget.lists) {
                    if (!templateTarget.lists) templateTarget.lists = {};
                    for (var key in levelTarget.lists) {
                        var lList = levelTarget.lists[key];
                        var find = false;
                        for (var tkey in templateTarget.lists) {
                            var tList = templateTarget.lists[tkey];
                            if (lList[0] == tList[0]) {
                                find = true;
                                prefixMap[tkey] = key;
                                break;
                            }
                        }
                        if (!find) {
                            templateTarget.lists[key] = levelTarget.lists[key];
                        }
                    }
                }
                if (levelTarget.broadcasts) {
                    if (!templateTarget.broadcasts) templateTarget.broadcasts = {};
                    for (var key in levelTarget.broadcasts) {
                        if (!templateTarget.broadcasts[key]) templateTarget.broadcasts[key] = levelTarget.broadcasts[key];
                    }
                }
            }
        }
        if (!findTarget) {
            template.targets.push(levelTarget);
        }
    }
    for (var i = 0; i < level.monitors.length; i++) {
        template.monitors.push(level.monitors[i]);
    }
    var jsonStr = JSON.stringify(template);
    for (var key in prefixMap) {
        jsonStr.replace(key, prefixMap[key]);
    }
    return jsonStr;
}

export default puzzleMergeProjectSb3;
