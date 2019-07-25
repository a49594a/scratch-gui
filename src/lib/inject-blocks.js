const injectDataCategory = function (ScratchBlocks, isPuzzle) {
    var dataCategory = function (workspace) {
        var variableModelList = workspace.getVariablesOfType('');
        variableModelList.sort(ScratchBlocks.VariableModel.compareByName);
        var xmlList = [];

        ScratchBlocks.DataCategory.addCreateButton(xmlList, workspace, 'VARIABLE');

        if (variableModelList.length > 0) {
            var firstVariable = null;
            for (var i = 0; i < variableModelList.length; i++) {
                if (isPuzzle && variableModelList[i].name.substr(0, 1) == "@") continue;
                if (firstVariable == null) firstVariable = variableModelList[i];
                ScratchBlocks.DataCategory.addDataVariable(xmlList, variableModelList[i]);
            }
            if (firstVariable != null) {
                xmlList[xmlList.length - 1].setAttribute('gap', 24);

                ScratchBlocks.DataCategory.addSetVariableTo(xmlList, firstVariable);
                ScratchBlocks.DataCategory.addChangeVariableBy(xmlList, firstVariable);
                if (!isPuzzle) {
                    ScratchBlocks.DataCategory.addShowVariable(xmlList, firstVariable);
                    ScratchBlocks.DataCategory.addHideVariable(xmlList, firstVariable);

                    ScratchBlocks.DataCategory.addBlock(xmlList, firstVariable, 'data_loadvariable', 'VARIABLE', ['LOCATION', 'field_dropdown', 'shared space']);
                    ScratchBlocks.DataCategory.addBlock(xmlList, firstVariable, 'data_savevariable', 'VARIABLE', ['LOCATION', 'field_dropdown', 'shared space']);
                }
            }
        }

        // Now add list variables to the flyout
        ScratchBlocks.DataCategory.addCreateButton(xmlList, workspace, 'LIST');
        variableModelList = workspace.getVariablesOfType(ScratchBlocks.LIST_VARIABLE_TYPE);
        variableModelList.sort(ScratchBlocks.VariableModel.compareByName);
        if (variableModelList.length > 0) {
            var firstVariable = null;
            for (var i = 0; i < variableModelList.length; i++) {
                if (isPuzzle && variableModelList[i].name.substr(0, 1) == "@") continue;
                if (firstVariable == null) firstVariable = variableModelList[i];
                ScratchBlocks.DataCategory.addDataList(xmlList, variableModelList[i]);
            }
            if (firstVariable != null) {
                xmlList[xmlList.length - 1].setAttribute('gap', 24);

                ScratchBlocks.DataCategory.addAddToList(xmlList, firstVariable);
                ScratchBlocks.DataCategory.addSep(xmlList);
                ScratchBlocks.DataCategory.addDeleteOfList(xmlList, firstVariable);
                ScratchBlocks.DataCategory.addDeleteAllOfList(xmlList, firstVariable);
                ScratchBlocks.DataCategory.addInsertAtList(xmlList, firstVariable);
                ScratchBlocks.DataCategory.addReplaceItemOfList(xmlList, firstVariable);
                ScratchBlocks.DataCategory.addSep(xmlList);
                ScratchBlocks.DataCategory.addItemOfList(xmlList, firstVariable);
                ScratchBlocks.DataCategory.addItemNumberOfList(xmlList, firstVariable);
                ScratchBlocks.DataCategory.addLengthOfList(xmlList, firstVariable);
                ScratchBlocks.DataCategory.addListContainsItem(xmlList, firstVariable);
                if (!isPuzzle) {
                    ScratchBlocks.DataCategory.addSep(xmlList);
                    ScratchBlocks.DataCategory.addShowList(xmlList, firstVariable);
                    ScratchBlocks.DataCategory.addHideList(xmlList, firstVariable);

                    ScratchBlocks.DataCategory.addBlock(xmlList, firstVariable, 'data_loadlist', 'LIST', ['LOCATION', 'field_dropdown', 'shared space']);
                    ScratchBlocks.DataCategory.addBlock(xmlList, firstVariable, 'data_savelist', 'LIST', ['LOCATION', 'field_dropdown', 'shared space']);
                }
            }
        }

        return xmlList;
    };
    dataCategory.addCreateButton = ScratchBlocks.DataCategory.addCreateButton;
    dataCategory.addDataVariable = ScratchBlocks.DataCategory.addDataVariable;
    dataCategory.addSetVariableTo = ScratchBlocks.DataCategory.addSetVariableTo;
    dataCategory.addChangeVariableBy = ScratchBlocks.DataCategory.addChangeVariableBy;
    dataCategory.addShowVariable = ScratchBlocks.DataCategory.addShowVariable;
    dataCategory.addHideVariable = ScratchBlocks.DataCategory.addHideVariable;
    dataCategory.addDataList = ScratchBlocks.DataCategory.addDataList;
    dataCategory.addAddToList = ScratchBlocks.DataCategory.addAddToList;
    dataCategory.addSep = ScratchBlocks.DataCategory.addSep;
    dataCategory.addDeleteOfList = ScratchBlocks.DataCategory.addDeleteOfList;
    dataCategory.addDeleteAllOfList = ScratchBlocks.DataCategory.addDeleteAllOfList;
    dataCategory.addInsertAtList = ScratchBlocks.DataCategory.addInsertAtList;
    dataCategory.addReplaceItemOfList = ScratchBlocks.DataCategory.addReplaceItemOfList;
    dataCategory.addItemOfList = ScratchBlocks.DataCategory.addItemOfList;
    dataCategory.addItemNumberOfList = ScratchBlocks.DataCategory.addItemNumberOfList;
    dataCategory.addLengthOfList = ScratchBlocks.DataCategory.addLengthOfList;
    dataCategory.addListContainsItem = ScratchBlocks.DataCategory.addListContainsItem;
    dataCategory.addShowList = ScratchBlocks.DataCategory.addShowList;
    dataCategory.addHideList = ScratchBlocks.DataCategory.addHideList;
    dataCategory.addBlock = ScratchBlocks.DataCategory.addBlock;
    dataCategory.createValue = ScratchBlocks.DataCategory.createValue;

    ScratchBlocks.DataCategory = dataCategory;
}

const injectBlocks = function (ScratchBlocks) {
    const isPuzzle = Blockey.GUI_CONFIG && Blockey.GUI_CONFIG.MODE == 'Puzzle';

    injectDataCategory(ScratchBlocks, isPuzzle);
    if (isPuzzle) {
        ScratchBlocks.FieldVariable.___dropdownCreate = ScratchBlocks.FieldVariable.dropdownCreate;
        ScratchBlocks.FieldVariable.dropdownCreate = function () {
            var options = ScratchBlocks.FieldVariable.___dropdownCreate.call(this);
            for (var i = options.length - 1; i >= 0; i--) {
                if (options[i][0].substr(0, 1) == "@") options.splice(i, 1);
            }
            return options;
        }

        ScratchBlocks.Constants.Data.CUSTOM_CONTEXT_MENU_GET_VARIABLE_MIXIN.customContextMenu = function (options) {
            if (this.isCollapsed()) {
                return;
            }
            if (!this.isInFlyout) {
                var variablesList = this.workspace.getVariablesOfType('');
                for (var i = 0; i < variablesList.length; i++) {
                    var option = {
                        enabled: true
                    };
                    option.text = variablesList[i].name;
                    if (option.text.substr(0, 1) == "@") continue;

                    option.callback =
                        ScratchBlocks.Constants.Data.VARIABLE_OPTION_CALLBACK_FACTORY(this,
                            option.text);
                    options.push(option);
                }
            } else {
                var renameOption = {
                    text: ScratchBlocks.Msg.RENAME_VARIABLE,
                    enabled: true,
                    callback: ScratchBlocks.Constants.Data.RENAME_OPTION_CALLBACK_FACTORY(this)
                };
                var name = this.getField('VARIABLE').text_;
                var deleteOption = {
                    text: ScratchBlocks.Msg.DELETE_VARIABLE.replace('%1', name),
                    enabled: true,
                    callback: ScratchBlocks.Constants.Data.DELETE_OPTION_CALLBACK_FACTORY(this)
                };
                options.push(renameOption);
                options.push(deleteOption);
            }
        };
    }

    ScratchBlocks.Blocks['data_cloud_menu_options'] = [
        ['共享空间', 'shared space'],
        ['个人空间', 'private space']
    ];

    ScratchBlocks.Blocks['data_savevariable'] = {
        /**
         * Block to show a variable
         * @this ScratchBlocks.Block
         */
        init: function () {
            this.jsonInit({
                "message0": "save variable %1 to %2",
                "args0": [{
                        "type": "field_variable",
                        "name": "VARIABLE"
                    },
                    {
                        "type": "field_dropdown",
                        "name": "LOCATION",
                        "options": ScratchBlocks.Blocks['data_cloud_menu_options']
                    }
                ],
                "category": ScratchBlocks.Categories.data,
                "extensions": ["colours_data", "shape_statement"]
            });
        }
    };

    ScratchBlocks.Blocks['data_loadvariable'] = {
        /**
         * Block to hide a variable
         * @this ScratchBlocks.Block
         */
        init: function () {
            this.jsonInit({
                "message0": "load variable %1 from %2",
                "args0": [{
                        "type": "field_variable",
                        "name": "VARIABLE"
                    },
                    {
                        "type": "field_dropdown",
                        "name": "LOCATION",
                        "options": ScratchBlocks.Blocks['data_cloud_menu_options']
                    }
                ],
                "category": ScratchBlocks.Categories.data,
                "extensions": ["colours_data", "shape_statement"]
            });
        }
    };

    ScratchBlocks.Blocks['data_savelist'] = {
        /**
         * Block to show a variable
         * @this ScratchBlocks.Block
         */
        init: function () {
            this.jsonInit({
                "message0": "save list %1 to %2",
                "args0": [{
                        "type": "field_variable",
                        "name": "LIST",
                        "variableTypes": ["list"]
                    },
                    {
                        "type": "field_dropdown",
                        "name": "LOCATION",
                        "options": ScratchBlocks.Blocks['data_cloud_menu_options']
                    }
                ],
                "category": ScratchBlocks.Categories.data,
                "extensions": ["colours_data_lists", "shape_statement"]
            });
        }
    };

    ScratchBlocks.Blocks['data_loadlist'] = {
        /**
         * Block to hide a variable
         * @this ScratchBlocks.Block
         */
        init: function () {
            this.jsonInit({
                "message0": "load list %1 from %2",
                "args0": [{
                        "type": "field_variable",
                        "name": "LIST",
                        "variableTypes": ["list"]
                    },
                    {
                        "type": "field_dropdown",
                        "name": "LOCATION",
                        "options": ScratchBlocks.Blocks['data_cloud_menu_options']
                    }
                ],
                "category": ScratchBlocks.Categories.data,
                "extensions": ["colours_data_lists", "shape_statement"]
            });
        }
    };

    /**
     * Initialize this block using a cross-platform, internationalization-friendly
     * JSON description.
     * @param {!Object} json Structured data describing the block.
     */
    ScratchBlocks.Block.prototype.jsonInit__ = ScratchBlocks.Block.prototype.jsonInit;
    ScratchBlocks.Block.prototype.jsonInit = function (json) {
        var i = 0;
        while (json['message' + i] !== undefined && ScratchBlocks.Msg[json['message' + i]]) {
            json['message' + i] = ScratchBlocks.Msg[json['message' + i]];
            i++;
        }
        this.jsonInit__(json);
    };
};

export default injectBlocks;
