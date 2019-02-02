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
const removeProcDef = function (templateScripts, levelScripts) {
    if (!(templateScripts && levelScripts)) return;
    for (var i = templateScripts.length - 1; i >= 0; i--) {
        var opcode = templateScripts[i][2][0][0];
        var procName = templateScripts[i][2][0][1];
        if (opcode == "procDef") {
            for (var j = 0; j < levelScripts.length; j++) {
                if (levelScripts[j][2][0][0] == opcode && levelScripts[j][2][0][1] == procName) {
                    templateScripts.splice(i, 1);
                    break;
                }
            }
        }
    }
};

const puzzleMergeProjectSb2 = (level, template) => {
    if (level) removePuzzleExtension(level);
    if (template) removePuzzleExtension(template);
    if (!template) return JSON.stringify(level);

    if (level.scripts) {
        removeProcDef(template.scripts, level.scripts);
        for (var i = 0; i < level.scripts.length; i++) {
            template.scripts.push(level.scripts[i]);
        }
    }
    if (level.variables) {
        if (!template.variables) template.variables = [];
        for (var i = 0; i < level.variables.length; i++) {
            var lVar = level.variables[i];
            var find = false;
            for (var j = 0; j < template.variables.length; j++) {
                var tVar = template.variables[j];
                if (lVar["name"] == tVar["name"]) {
                    find = true;
                    break;
                }
            }
            if (!find) {
                template.variables.push(lVar);
            }
        }
    }
    if (level.lists) {
        if (!template.lists) template.lists = [];
        for (var i = 0; i < level.lists.length; i++) {
            var lVar = level.lists[i];
            var find = false;
            for (var j = 0; j < template.lists.length; j++) {
                var tVar = template.lists[j];
                if (lVar["listName"] == tVar["listName"]) {
                    find = true;
                    break;
                }
            }
            if (!find) template.lists.push(lVar);
        }
    }
    if (level.children) {
        for (var i = 0; i < level.children.length; i++) {
            var child = level.children[i];
            if (child.objName) {
                var find = false;
                for (var j = 0; j < template.children.length; j++) {
                    if (child.objName == template.children[j].objName) {
                        find = true;
                        template.children[j].costumesMenu = [];
                        for (var k = 0; k < child.costumes.length; k++) {
                            template.children[j].costumesMenu.push(child.costumes[k].costumeName);
                        }
                        if (child.scripts) {
                            removeProcDef(template.children[j].scripts, child.scripts);
                            for (var k = 0; k < child.scripts.length; k++) {
                                if (!template.children[j].scripts) template.children[j].scripts = [];
                                template.children[j].scripts.push(child.scripts[k]);
                            }
                        }
                    }
                }
                if (!find) {
                    template.children.push(child);
                }
            } else if (child.target && child.visible && child.cmd == 'getVar:') {
                template.children.push(child);
            }
        }
    }
    return JSON.stringify(template);
}

export default puzzleMergeProjectSb2;
