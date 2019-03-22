const injectBlocks = function (ScratchBlocks) {
    const isPuzzle = Blockey.GUI_CONFIG.MODE == 'Puzzle';

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
