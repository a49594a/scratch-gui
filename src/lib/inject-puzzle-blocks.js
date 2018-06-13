const injectPuzzleBlocks = function (ScratchBlocks, VM) {

    VM.Scratch3RenderedTarget.prototype.startTracker = function (util) {
        if (this._spriteTracker && !util.stackFrame.executed) {
            util.stackFrame.executed = true;
            util.startProcedure(this._spriteTracker);
        }
    };

    VM.Scratch3MotionBlocks.prototype.moveSteps__ = VM.Scratch3MotionBlocks.prototype.moveSteps;
    VM.Scratch3MotionBlocks.prototype.moveSteps = function (args, util) {
        this.moveSteps__(args, util);
        util.target.startTracker(util);
    };

    VM.Scratch3MotionBlocks.prototype.goToXY__ = VM.Scratch3MotionBlocks.prototype.goToXY;
    VM.Scratch3MotionBlocks.prototype.goToXY = function (args, util) {
        this.goToXY__(args, util);
        util.target.startTracker(util);
    };

    VM.Scratch3MotionBlocks.prototype.goTo__ = VM.Scratch3MotionBlocks.prototype.goTo;
    VM.Scratch3MotionBlocks.prototype.goTo = function (args, util) {
        this.goTo__(args, util);
        util.target.startTracker(util);
    };

    VM.Scratch3MotionBlocks.prototype.turnRight__ = VM.Scratch3MotionBlocks.prototype.turnRight;
    VM.Scratch3MotionBlocks.prototype.turnRight = function (args, util) {
        this.turnRight__(args, util);
        util.target.startTracker(util);
    };

    VM.Scratch3MotionBlocks.prototype.turnLeft__ = VM.Scratch3MotionBlocks.prototype.turnLeft;
    VM.Scratch3MotionBlocks.prototype.turnLeft = function (args, util) {
        this.turnLeft__(args, util);
        util.target.startTracker(util);
    };

    VM.Scratch3MotionBlocks.prototype.pointInDirection__ = VM.Scratch3MotionBlocks.prototype.pointInDirection;
    VM.Scratch3MotionBlocks.prototype.pointInDirection = function (args, util) {
        this.pointInDirection__(args, util);
        util.target.startTracker(util);
    };

    VM.Scratch3MotionBlocks.prototype.pointTowards__ = VM.Scratch3MotionBlocks.prototype.pointTowards;
    VM.Scratch3MotionBlocks.prototype.pointTowards__ = function (args, util) {
        this.pointTowards(args, util);
        util.target.startTracker(util);
    };

    VM.Scratch3MotionBlocks.prototype.changeX__ = VM.Scratch3MotionBlocks.prototype.changeX;
    VM.Scratch3MotionBlocks.prototype.changeX = function (args, util) {
        this.changeX__(args, util);
        util.target.startTracker(util);
    };

    VM.Scratch3MotionBlocks.prototype.setX__ = VM.Scratch3MotionBlocks.prototype.setX;
    VM.Scratch3MotionBlocks.prototype.setX = function (args, util) {
        this.setX__(args, util);
        util.target.startTracker(util);
    };

    VM.Scratch3MotionBlocks.prototype.changeY__ = VM.Scratch3MotionBlocks.prototype.changeY;
    VM.Scratch3MotionBlocks.prototype.changeY = function (args, util) {
        this.changeY__(args, util);
        util.target.startTracker(util);
    };

    VM.Scratch3MotionBlocks.prototype.setY__ = VM.Scratch3MotionBlocks.prototype.setY;
    VM.Scratch3MotionBlocks.prototype.setY = function (args, util) {
        this.setY__(args, util);
        util.target.startTracker(util);
    };

    VM.Scratch3LooksBlocks.prototype.switchCostume__ = VM.Scratch3LooksBlocks.prototype.switchCostume;
    VM.Scratch3LooksBlocks.prototype.switchCostume = function (args, util) {
        this.switchCostume__(args, util);
        util.target.startTracker(util);
    };

    VM.Scratch3LooksBlocks.prototype.nextCostume__ = VM.Scratch3LooksBlocks.prototype.nextCostume;
    VM.Scratch3LooksBlocks.prototype.nextCostume = function (args, util) {
        this.nextCostume__(args, util);
        util.target.startTracker(util);
    };

    ScratchBlocks.FieldVariable.___dropdownCreate = ScratchBlocks.FieldVariable.dropdownCreate;
    ScratchBlocks.FieldVariable.dropdownCreate = function () {
        var options = ScratchBlocks.FieldVariable.___dropdownCreate.call(this);
        for (var i = options.length - 1; i >= 0; i--) {
            if (options[i][0].substr(0, 1) == "@") options.splice(i, 1);
        }
        return options;
    }

    /**
     * Mixin to add a context menu for a data_variable block.  It adds one item for
     * each variable defined on the workspace.
     * @mixin
     * @augments ScratchBlocks.Block
     * @package
     * @readonly
     */
    ScratchBlocks.Constants.Data.CUSTOM_CONTEXT_MENU_GET_VARIABLE_MIXIN.customContextMenu = function (options) {
        if (this.isCollapsed()) {
            return;
        }
        if (!this.isInFlyout) {
            var variablesList = this.workspace.getVariablesOfType('');
            for (var i = 0; i < variablesList.length; i++) {
                var option = { enabled: true };
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

    ScratchBlocks.Blocks['motion_setrotationstyle'] = {
        /**
         * Block to set rotation style.
         * @this ScratchBlocks.Block
         */
        init: function () {
            this.jsonInit({
                "message0": "set rotation style %1",
                "args0": [
                    {
                        "type": "field_dropdown",
                        "name": "STYLE",
                        "options": [
                            ['允许旋转', 'all around'],
                            ['只允许左右翻转', 'left-right'],
                            ['不允许旋转', 'don\'t rotate']
                        ]
                    }
                ],
                "category": ScratchBlocks.Categories.motion,
                "extensions": ["colours_motion", "shape_statement"]
            });
        }
    };

    ScratchBlocks.Blocks['operator_mathop'] = {
        /**
         * Block for "advanced" math ops on a number.
         * @this ScratchBlocks.Block
         */
        init: function () {
            this.jsonInit(
                {
                    "message0": "%1 of %2",
                    "args0": [
                        {
                            "type": "field_dropdown",
                            "name": "OPERATOR",
                            "options": [
                                ['绝对值', 'abs'],
                                ['向下取整', 'floor'],
                                ['向上取整', 'ceiling'],
                                ['平方根', 'sqrt'],
                                ['sin', 'sin'],
                                ['cos', 'cos'],
                                ['tan', 'tan'],
                                ['asin', 'asin'],
                                ['acos', 'acos'],
                                ['atan', 'atan'],
                                ['ln', 'ln'],
                                ['log', 'log'],
                                ['e ^', 'e ^'],
                                ['10 ^', '10 ^']
                            ]
                        },
                        {
                            "type": "input_value",
                            "name": "NUM"
                        }
                    ],
                    "category": ScratchBlocks.Categories.operators,
                    "extensions": ["colours_operators", "output_number"]
                });
        }
    };

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
                "args0": [
                    {
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
                "args0": [
                    {
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
                "args0": [
                    {
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
                "args0": [
                    {
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
     *谜题指令集
    **/

    ScratchBlocks.Blocks['puzzle_convertpainttowatermark'] = {
        init: function () {
            this.jsonInit({
                "message0": "将画板保存为水印",
                "previousStatement": null,
                "nextStatement": null,
                "category": ScratchBlocks.Categories.more,
                "colour": ScratchBlocks.Colours.more.primary,
                "colourSecondary": ScratchBlocks.Colours.more.secondary,
                "colourTertiary": ScratchBlocks.Colours.more.tertiary
            });
        }
    };

    ScratchBlocks.Blocks['puzzle_showwatermark'] = {
        init: function () {
            this.jsonInit({
                "message0": "显示水印",
                "previousStatement": null,
                "nextStatement": null,
                "category": ScratchBlocks.Categories.more,
                "colour": ScratchBlocks.Colours.more.primary,
                "colourSecondary": ScratchBlocks.Colours.more.secondary,
                "colourTertiary": ScratchBlocks.Colours.more.tertiary
            });
        }
    };

    ScratchBlocks.Blocks['puzzle_hidewatermark'] = {
        init: function () {
            this.jsonInit({
                "message0": "隐藏水印",
                "previousStatement": null,
                "nextStatement": null,
                "category": ScratchBlocks.Categories.more,
                "colour": ScratchBlocks.Colours.more.primary,
                "colourSecondary": ScratchBlocks.Colours.more.secondary,
                "colourTertiary": ScratchBlocks.Colours.more.tertiary
            });
        }
    };

    ScratchBlocks.Blocks['puzzle_ispaintsameaswatermark'] = {
        init: function () {
            this.jsonInit({
                "message0": "画板与水印是否相同",
                "inputsInline": true,
                "output": "Boolean",
                "category": ScratchBlocks.Categories.more,
                "colour": ScratchBlocks.Colours.more.primary,
                "colourSecondary": ScratchBlocks.Colours.more.secondary,
                "colourTertiary": ScratchBlocks.Colours.more.tertiary,
                "outputShape": ScratchBlocks.OUTPUT_SHAPE_HEXAGONAL
            });
        }
    };

    ScratchBlocks.Blocks['puzzle_attemptcount'] = {
        init: function () {
            this.jsonInit({
                "message0": "重置次数",
                "category": ScratchBlocks.Categories.more,
                "checkboxInFlyout": true,
                "extensions": ["colours_more", "output_number"]
            });
        }
    };

    ScratchBlocks.Blocks['puzzle_stepinterval'] = {
        init: function () {
            this.jsonInit({
                "message0": "动作间隔",
                "category": ScratchBlocks.Categories.more,
                "checkboxInFlyout": true,
                "extensions": ["colours_more", "output_number"]
            });
        }
    };

    ScratchBlocks.Blocks['puzzle_setresolved'] = {
        init: function () {
            this.jsonInit({
                "message0": "将任务设定为已完成",
                "previousStatement": null,
                "nextStatement": null,
                "category": ScratchBlocks.Categories.more,
                "colour": ScratchBlocks.Colours.more.primary,
                "colourSecondary": ScratchBlocks.Colours.more.secondary,
                "colourTertiary": ScratchBlocks.Colours.more.tertiary
            });
        }
    };

    ScratchBlocks.Blocks['puzzle_setspritetracker'] = {
        init: function () {
            this.jsonInit({
                "message0": "设置角色追踪器%1",
                "args0": [
                    {
                        "type": "input_value",
                        "name": "TRACKER"
                    }
                ],
                "previousStatement": null,
                "nextStatement": null,
                "category": ScratchBlocks.Categories.more,
                "colour": ScratchBlocks.Colours.more.primary,
                "colourSecondary": ScratchBlocks.Colours.more.secondary,
                "colourTertiary": ScratchBlocks.Colours.more.tertiary
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

    ScratchBlocks.Msg["forever"] = "重复执行";
    ScratchBlocks.Msg["repeat %1"] = "重复执行 %1 次";
    ScratchBlocks.Msg["if %1 then"] = "如果 %1 那么";
    ScratchBlocks.Msg["else"] = "否则";
    ScratchBlocks.Msg["wait %1 secs"] = "等待 %1 秒";
    ScratchBlocks.Msg["wait until %1"] = "在 %1 之前一直等待";
    ScratchBlocks.Msg["repeat until %1"] = "重复执行直到 %1";
    ScratchBlocks.Msg["when I start as a clone"] = "当作为克隆体启动时";
    ScratchBlocks.Msg["create clone of %1"] = "克隆 %1";
    ScratchBlocks.Msg["delete this clone"] = "删除本克隆体";

    ScratchBlocks.Msg["when %1 clicked"] = "当 %1 被点击";
    ScratchBlocks.Msg["when this sprite clicked"] = "当角色被点击";
    ScratchBlocks.Msg["when I receive %1"] = "当接收到 %1";
    ScratchBlocks.Msg["when backdrop switches to %1"] = "当背景切换到 %1";
    ScratchBlocks.Msg["when %1 > %2"] = "当 %1 > %2";
    ScratchBlocks.Msg["broadcast %1"] = "广播 %1";
    ScratchBlocks.Msg["broadcast %1 and wait"] = "广播 %1 并等待";
    ScratchBlocks.Msg["when %1 key pressed"] = "当按下 %1";

    ScratchBlocks.Msg["say %1 for %2 secs"] = "说 %1 %2 秒";
    ScratchBlocks.Msg["say %1"] = "说 %1";
    ScratchBlocks.Msg["think %1 for %2 secs"] = "思考 %1 %2 秒";
    ScratchBlocks.Msg["think %1"] = "思考 %1";
    ScratchBlocks.Msg["show"] = "显示";
    ScratchBlocks.Msg["hide"] = "隐藏";
    ScratchBlocks.Msg["change %1 effect by %2"] = "将 %1 特效增加 %2";
    ScratchBlocks.Msg["set %1 effect to %2"] = "将 %1 特效设定为 %2";
    ScratchBlocks.Msg["clear graphic effects"] = "清除所有图形特效";
    ScratchBlocks.Msg["change size by %1"] = "将角色的大小增加 %1";
    ScratchBlocks.Msg["set size to %1 %"] = "将角色的大小设定为 %1 %";
    ScratchBlocks.Msg["size"] = "大小";
    ScratchBlocks.Msg["switch costume to %1"] = "将造型切换为 %1";
    ScratchBlocks.Msg["next costume"] = "下一个造型";
    ScratchBlocks.Msg["switch backdrop to %1"] = "将背景切换为 %1";
    ScratchBlocks.Msg["go to front"] = "移至最上层";
    ScratchBlocks.Msg["go back %1 layers"] = "下移 %1 层";
    ScratchBlocks.Msg["backdrop name"] = "背景名称";
    ScratchBlocks.Msg["costume #"] = "造型编号";
    ScratchBlocks.Msg["backdrop #"] = "背景编号";
    ScratchBlocks.Msg["switch backdrop to %1 and wait"] = "将背景切换为 %1 并等待";
    ScratchBlocks.Msg["next backdrop"] = "下一个背景";

    ScratchBlocks.Msg["move %1 steps"] = "移动 %1 步";
    ScratchBlocks.Msg["turn %1 %2 degrees"] = "旋转 %1 %2 度";
    ScratchBlocks.Msg["turn %1 %2 degrees"] = "旋转 %1 %2 度";
    ScratchBlocks.Msg["point in direction %1"] = "面向 %1 方向";
    ScratchBlocks.Msg["point towards %1"] = "面向 %1";
    ScratchBlocks.Msg["go to x: %1 y: %2"] = "移到 x: %1 y: %2";
    ScratchBlocks.Msg["go to %1"] = "移到 %1";
    ScratchBlocks.Msg["glide %1 secs to x: %2 y: %3"] = "在 %1 秒内滑行到 x: %2 y: %3";
    ScratchBlocks.Msg["change x by %1"] = "将x坐标增加 %1";
    ScratchBlocks.Msg["set x to %1"] = "将x坐标设定为 %1";
    ScratchBlocks.Msg["change y by %1"] = "将y坐标增加 %1";
    ScratchBlocks.Msg["set y to %1"] = "将y坐标设定为 %1";
    ScratchBlocks.Msg["if on edge, bounce"] = "碰到边缘就反弹";
    ScratchBlocks.Msg["set rotation style %1"] = "将旋转模式设定为 %1";
    ScratchBlocks.Msg["x position"] = "x坐标";
    ScratchBlocks.Msg["y position"] = "y坐标";
    ScratchBlocks.Msg["direction"] = "方向";

    /*ScratchBlocks.Msg["stamp"] = "图章";
    ScratchBlocks.Msg["pen down"] = "落笔";
    ScratchBlocks.Msg["pen up"] = "抬笔";
    ScratchBlocks.Msg["set pen color to %1"] = "将画笔颜色设定为 %1";
    ScratchBlocks.Msg["change pen color by %1"] = "将画笔颜色值增加 %1";
    ScratchBlocks.Msg["set pen color to %1"] = "将画笔颜色值设定为 %1";
    ScratchBlocks.Msg["change pen shade by %1"] = "将画笔色度增加 %1";
    ScratchBlocks.Msg["set pen shade to %1"] = "将画笔色度设定为 %1";
    ScratchBlocks.Msg["change pen size by %1"] = "将画笔大小增加 %1";
    ScratchBlocks.Msg["set pen size to %1"] = "将画笔大小设定为 %1";
    ScratchBlocks.Msg["print %1"] = "打印 %1";*/

    ScratchBlocks.Msg["touching %1?"] = "碰到 %1?";
    ScratchBlocks.Msg["touching color %1?"] = "碰到颜色 %1?";
    ScratchBlocks.Msg["color %1 is touching %2?"] = "颜色 %1 碰到 %2?";
    ScratchBlocks.Msg["distance to %1"] = "到 %1 的距离";
    ScratchBlocks.Msg["ask %1 and wait"] = "询问 %1 并等待";
    ScratchBlocks.Msg["answer"] = "回答";
    ScratchBlocks.Msg["key %1 pressed?"] = "按键 %1 是否按下?";
    ScratchBlocks.Msg["mouse down?"] = "按下鼠标?";
    ScratchBlocks.Msg["mouse x"] = "鼠标的x坐标";
    ScratchBlocks.Msg["mouse y"] = "鼠标的y坐标";
    ScratchBlocks.Msg["loudness"] = "麦克风音量";
    ScratchBlocks.Msg["video %1 on %2"] = "视频在 %2 上的 %1";
    ScratchBlocks.Msg["turn video %1"] = "将摄像头 %1";
    ScratchBlocks.Msg["set video transparency to %1%"] = "将视频透明度设定为 %1%";
    ScratchBlocks.Msg["timer"] = "计时器";
    ScratchBlocks.Msg["reset timer"] = "计时器归零";
    ScratchBlocks.Msg["%1 of %2"] = "%2 的 %1";
    ScratchBlocks.Msg["current %1"] = "当前时间 %1";
    ScratchBlocks.Msg["days since 2000"] = "2000年之后的天数";
    ScratchBlocks.Msg["username"] = "用户名";

    ScratchBlocks.Msg["play sound %1"] = "播放声音 %1";
    ScratchBlocks.Msg["play sound %1 until done"] = "播放声音 %1 直到播放完毕";
    ScratchBlocks.Msg["stop all sounds"] = "停止所有声音";
    ScratchBlocks.Msg["play drum %1 for %2 beats"] = "弹奏鼓声 %1 %2 拍";
    ScratchBlocks.Msg["rest for %1 beats"] = "停止 %1 拍";
    ScratchBlocks.Msg["play note %1 for %2 beats"] = "弹奏音符 %1 %2 拍";
    //ScratchBlocks.Msg["set %1 effect to %2"] = "";
    //ScratchBlocks.Msg["change %1 effect by %2"] = "";
    ScratchBlocks.Msg["clear sound effects"] = "清除所有声音特效";
    ScratchBlocks.Msg["set instrument to %1"] = "设定乐器为 %1";
    ScratchBlocks.Msg["change volume by %1"] = "将音量增加 %1";
    ScratchBlocks.Msg["set volume to %1%"] = "将音量设定为 %1%";
    ScratchBlocks.Msg["volume"] = "音量";
    ScratchBlocks.Msg["change tempo by %1"] = "将节奏加快 %1";
    ScratchBlocks.Msg["set tempo to %1 bpm"] = "将节奏设定为 %1 bpm";
    ScratchBlocks.Msg["tempo"] = "节奏";

    ScratchBlocks.Msg["set %1 to %2"] = "将 %1 设定为 %2";
    ScratchBlocks.Msg["change %1 by %2"] = "将 %1 增加 %2";
    ScratchBlocks.Msg["show variable %1"] = "显示变量 %1";
    ScratchBlocks.Msg["hide variable %1"] = "隐藏变量 %1";
    ScratchBlocks.Msg["add %1 to %2"] = "将 %1 添加到 %2 末尾";
    ScratchBlocks.Msg["delete %1 of %2"] = "删除 %2 的第 %1 项";
    ScratchBlocks.Msg["insert %1 at %2 of %3"] = "插入 %1 到 %3 的第 %2 项";
    ScratchBlocks.Msg["replace item %1 of %2 with %3"] = "替换 %2 的第 %1 项为 %3";
    ScratchBlocks.Msg["item %1 of %2"] = "%2 的第 %1 项";
    ScratchBlocks.Msg["length of %1"] = "%1的长度";
    ScratchBlocks.Msg["%1 contains %2?"] = "%1 包含 %2?";
    ScratchBlocks.Msg["show list %1"] = "显示链表 %1";
    ScratchBlocks.Msg["hide list %1"] = "隐藏链表 %1";

    ScratchBlocks.Msg["pick random %1 to %2"] = "在 %1 到 %2 间随机选一个数";
    ScratchBlocks.Msg["%1 and %2"] = "%1 且 %2";
    ScratchBlocks.Msg["%1 or %2"] = "%1 或 %2";
    ScratchBlocks.Msg["not %1"] = "%1 不成立";
    ScratchBlocks.Msg["join %1 %2"] = "连接 %1 %2";
    ScratchBlocks.Msg["letter %1 of %2"] = "%2 的第 %1 个字符";
    ScratchBlocks.Msg["length of %1"] = "%1 的长度";
    ScratchBlocks.Msg["%1 mod %2"] = "%1 除以 %2 的余数";
    ScratchBlocks.Msg["round %1"] = "将 %1 四舍五入";
};

export default injectPuzzleBlocks;
