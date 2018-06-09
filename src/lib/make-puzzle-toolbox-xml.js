const categorySeparator = '<sep gap="36"/>';

const blockSeparator = '<sep gap="36"/>'; // At default scale, about 28px

const motion = function (isStage, targetId) {
    return `
    <category name="Motion" colour="#4C97FF" secondaryColour="#3373CC">
        ${isStage ? `
        <label text="Stage selected: no motion blocks"></label>
        ` : `
        <block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="motion_gotoxy">
            <value name="X">
                <shadow id="movex" type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="Y">
                <shadow id="movey" type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="motion_goto">
            <value name="TO">
                <shadow type="motion_goto_menu">
                </shadow>
            </value>
        </block>
        <block type="motion_glidesecstoxy">
            <value name="SECS">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="X">
                <shadow id="glidex" type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="Y">
                <shadow id="glidey" type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="motion_glideto" id="motion_glideto">
            <value name="SECS">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="TO">
                <shadow type="motion_glideto_menu">
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="motion_turnright">
            <value name="DEGREES">
                <shadow type="math_number">
                    <field name="NUM">15</field>
                </shadow>
            </value>
        </block>
        <block type="motion_turnleft">
            <value name="DEGREES">
                <shadow type="math_number">
                    <field name="NUM">15</field>
                </shadow>
            </value>
        </block>
        <block type="motion_pointindirection">
            <value name="DIRECTION">
                <shadow type="math_angle">
                    <field name="NUM">90</field>
                </shadow>
            </value>
        </block>
        <block type="motion_pointtowards">
            <value name="TOWARDS">
                <shadow type="motion_pointtowards_menu">
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="motion_changexby">
            <value name="DX">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
        <block type="motion_setx">
            <value name="X">
                <shadow id="setx" type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="motion_changeyby">
            <value name="DY">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
        <block type="motion_sety">
            <value name="Y">
                <shadow id="sety" type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="motion_ifonedgebounce"/>
        ${blockSeparator}
        <block type="motion_setrotationstyle"/>
        ${blockSeparator}
        <block id="${targetId}_xposition" type="motion_xposition"/>
        <block id="${targetId}_yposition" type="motion_yposition"/>
        <block id="${targetId}_direction" type="motion_direction"/>`}
        ${categorySeparator}
    </category>
    `;
};

const looks = function (isStage, targetId) {
    return `
    <category name="Looks" colour="#9966FF" secondaryColour="#774DCB">
        ${isStage ? '' : `
        <block type="looks_sayforsecs">
            <value name="MESSAGE">
                <shadow type="text">
                    <field name="TEXT">Hello!</field>
                </shadow>
            </value>
            <value name="SECS">
                <shadow type="math_number">
                    <field name="NUM">2</field>
                </shadow>
            </value>
        </block>
        <block type="looks_say">
            <value name="MESSAGE">
                <shadow type="text">
                    <field name="TEXT">Hello!</field>
                </shadow>
            </value>
        </block>
        <block type="looks_thinkforsecs">
            <value name="MESSAGE">
                <shadow type="text">
                    <field name="TEXT">Hmm...</field>
                </shadow>
            </value>
            <value name="SECS">
                <shadow type="math_number">
                    <field name="NUM">2</field>
                </shadow>
            </value>
        </block>
        <block type="looks_think">
            <value name="MESSAGE">
                <shadow type="text">
                    <field name="TEXT">Hmm...</field>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        `}
        ${isStage ? `
            <block type="looks_switchbackdropto">
                <value name="BACKDROP">
                    <shadow type="looks_backdrops"/>
                </value>
            </block>
            <block type="looks_switchbackdroptoandwait">
                <value name="BACKDROP">
                    <shadow type="looks_backdrops"/>
                </value>
            </block>
            <block type="looks_nextbackdrop"/>
        ` : `
            <block type="looks_switchcostumeto">
                <value name="COSTUME">
                    <shadow type="looks_costume"/>
                </value>
            </block>
            <block type="looks_nextcostume"/>
            <block type="looks_switchbackdropto">
                <value name="BACKDROP">
                    <shadow type="looks_backdrops"/>
                </value>
            </block>
            <block type="looks_nextbackdrop"/>
            ${blockSeparator}
            <block type="looks_changesizeby">
                <value name="CHANGE">
                    <shadow type="math_number">
                        <field name="NUM">10</field>
                    </shadow>
                </value>
            </block>
            <block type="looks_setsizeto">
                <value name="SIZE">
                    <shadow type="math_number">
                        <field name="NUM">100</field>
                    </shadow>
                </value>
            </block>
        `}
        ${blockSeparator}
        <block type="looks_changeeffectby">
            <value name="CHANGE">
                <shadow type="math_number">
                    <field name="NUM">25</field>
                </shadow>
            </value>
        </block>
        <block type="looks_seteffectto">
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="looks_cleargraphiceffects"/>
        ${blockSeparator}
        <block type="looks_show"/>
        <block type="looks_hide"/>
        ${blockSeparator}
        ${isStage ? '' : `
            <block type="looks_gotofrontback"/>
            <block type="looks_goforwardbackwardlayers">
                <value name="NUM">
                    <shadow type="math_integer">
                        <field name="NUM">1</field>
                    </shadow>
                </value>
            </block>
            ${blockSeparator}
        `}
        ${isStage ? `
            <block id="backdropnumbername" type="looks_backdropnumbername"/>
        ` : `
            <block id="${targetId}_costumenumbername" type="looks_costumenumbername"/>
            <block id="backdropnumbername" type="looks_backdropnumbername"/>
            <block id="${targetId}_size" type="looks_size"/>
        `}
        ${categorySeparator}
    </category>
    `;
};

const sound = function () {
    return `
    <category name="Sound" colour="#D65CD6" secondaryColour="#BD42BD">
        <block type="sound_play">
            <value name="SOUND_MENU">
                <shadow type="sound_sounds_menu"/>
            </value>
        </block>
        <block type="sound_playuntildone">
            <value name="SOUND_MENU">
                <shadow type="sound_sounds_menu"/>
            </value>
        </block>
        <block type="sound_stopallsounds"/>
        ${blockSeparator}
        <block type="sound_changeeffectby">
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
        <block type="sound_seteffectto">
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
        </block>
        <block type="sound_cleareffects"/>
        ${blockSeparator}
        <block type="sound_changevolumeby">
            <value name="VOLUME">
                <shadow type="math_number">
                    <field name="NUM">-10</field>
                </shadow>
            </value>
        </block>
        <block type="sound_setvolumeto">
            <value name="VOLUME">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
        </block>
        <block id="volume" type="sound_volume"/>
        ${categorySeparator}
    </category>
    `;
};

const events = function () {
    return `
    <category name="Events" colour="#FFD500" secondaryColour="#CC9900">
        <block type="event_whenflagclicked"/>
        <block type="event_whenkeypressed">
        </block>
        <block type="event_whenthisspriteclicked"/>
        <block type="event_whenbackdropswitchesto">
        </block>
        ${blockSeparator}
        <block type="event_whengreaterthan">
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="event_whenbroadcastreceived">
        </block>
        <block type="event_broadcast">
            <value name="BROADCAST_INPUT">
                <shadow type="event_broadcast_menu"></shadow>
            </value>
        </block>
        <block type="event_broadcastandwait">
            <value name="BROADCAST_INPUT">
              <shadow type="event_broadcast_menu"></shadow>
            </value>
        </block>
        ${categorySeparator}
    </category>
    `;
};

const control = function (isStage) {
    return `
    <category name="Control" colour="#FFAB19" secondaryColour="#CF8B17">
        <block type="control_wait">
            <value name="DURATION">
                <shadow type="math_positive_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="control_repeat">
            <value name="TIMES">
                <shadow type="math_whole_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
        <block id="forever" type="control_forever"/>
        ${blockSeparator}
        <block type="control_if"/>
        <block type="control_if_else"/>
        <block id="wait_until" type="control_wait_until"/>
        <block id="repeat_until" type="control_repeat_until"/>
        ${blockSeparator}
        <block type="control_stop"/>
        ${blockSeparator}
        ${isStage ? `
            <block type="control_create_clone_of">
                <value name="CLONE_OPTION">
                    <shadow type="control_create_clone_of_menu"/>
                </value>
            </block>
        ` : `
            <block type="control_start_as_clone"/>
            <block type="control_create_clone_of">
                <value name="CLONE_OPTION">
                    <shadow type="control_create_clone_of_menu"/>
                </value>
            </block>
            <block type="control_delete_this_clone"/>
        `}
        ${categorySeparator}
    </category>
    `;
};

const sensing = function (isStage) {
    return `
    <category name="Sensing" colour="#4CBFE6" secondaryColour="#2E8EB8">
        ${isStage ? '' : `
            <block type="sensing_touchingobject">
                <value name="TOUCHINGOBJECTMENU">
                    <shadow type="sensing_touchingobjectmenu"/>
                </value>
            </block>
            <block type="sensing_touchingcolor">
                <value name="COLOR">
                    <shadow type="colour_picker"/>
                </value>
            </block>
            <block type="sensing_coloristouchingcolor">
                <value name="COLOR">
                    <shadow type="colour_picker"/>
                </value>
                <value name="COLOR2">
                    <shadow type="colour_picker"/>
                </value>
            </block>
            <block type="sensing_distanceto">
                <value name="DISTANCETOMENU">
                    <shadow type="sensing_distancetomenu"/>
                </value>
            </block>
            ${blockSeparator}
        `}
        <block id="askandwait" type="sensing_askandwait">
            <value name="QUESTION">
                <shadow type="text">
                    <field name="TEXT">What's your name?</field>
                </shadow>
            </value>
        </block>
        <block id="answer" type="sensing_answer"/>
        ${blockSeparator}
        <block type="sensing_keypressed"/>
        <block type="sensing_mousedown"/>
        <block type="sensing_mousex"/>
        <block type="sensing_mousey"/>
        ${isStage ? '' : `
            ${blockSeparator}
            '<block type="sensing_setdragmode" id="sensing_setdragmode"></block>'+
            ${blockSeparator}
        `}
        ${blockSeparator}
        <block id="loudness" type="sensing_loudness"/>
        ${blockSeparator}
        <block id="timer" type="sensing_timer"/>
        <block type="sensing_resettimer"/>
        ${blockSeparator}
        <block id="of" type="sensing_of">
            <value name="OBJECT">
                <shadow id="sensing_of_object_menu" type="sensing_of_object_menu"/>
            </value>
        </block>
        ${blockSeparator}
        <block id="current" type="sensing_current"/>
        <block type="sensing_dayssince2000"/>
        ${categorySeparator}
    </category>
    `;
};

const operators = function () {
    return `
    <category name="Operators" colour="#40BF4A" secondaryColour="#389438">
        <block type="operator_add">
            <value name="NUM1">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
            <value name="NUM2">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
        </block>
        <block type="operator_subtract">
            <value name="NUM1">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
            <value name="NUM2">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
        </block>
        <block type="operator_multiply">
            <value name="NUM1">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
            <value name="NUM2">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
        </block>
        <block type="operator_divide">
            <value name="NUM1">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
            <value name="NUM2">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="operator_random">
            <value name="FROM">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="TO">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="operator_lt">
            <value name="OPERAND1">
                <shadow type="text">
                    <field name="TEXT"/>
                </shadow>
            </value>
            <value name="OPERAND2">
                <shadow type="text">
                    <field name="TEXT"/>
                </shadow>
            </value>
        </block>
        <block type="operator_equals">
            <value name="OPERAND1">
                <shadow type="text">
                    <field name="TEXT"/>
                </shadow>
            </value>
            <value name="OPERAND2">
                <shadow type="text">
                    <field name="TEXT"/>
                </shadow>
            </value>
        </block>
        <block type="operator_gt">
            <value name="OPERAND1">
                <shadow type="text">
                    <field name="TEXT"/>
                </shadow>
            </value>
            <value name="OPERAND2">
                <shadow type="text">
                    <field name="TEXT"/>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="operator_and"/>
        <block type="operator_or"/>
        <block type="operator_not"/>
        ${blockSeparator}
        <block type="operator_join">
            <value name="STRING1">
                <shadow type="text">
                    <field name="TEXT">hello</field>
                </shadow>
            </value>
            <value name="STRING2">
                <shadow type="text">
                    <field name="TEXT">world</field>
                </shadow>
            </value>
        </block>
        <block type="operator_letter_of">
            <value name="LETTER">
                <shadow type="math_whole_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="STRING">
                <shadow type="text">
                    <field name="TEXT">world</field>
                </shadow>
            </value>
        </block>
        <block type="operator_length">
            <value name="STRING">
                <shadow type="text">
                    <field name="TEXT">world</field>
                </shadow>
            </value>
        </block>
        <block type="operator_contains" id="operator_contains">
          <value name="STRING1">
            <shadow type="text">
              <field name="TEXT">hello</field>
            </shadow>
          </value>
          <value name="STRING2">
            <shadow type="text">
              <field name="TEXT">world</field>
            </shadow>
          </value>
        </block>
        ${blockSeparator}
        <block type="operator_mod">
            <value name="NUM1">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
            <value name="NUM2">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
        </block>
        <block type="operator_round">
            <value name="NUM">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="operator_mathop">
            <value name="NUM">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
        </block>
        ${categorySeparator}
    </category>
    `;
};

const variables = function () {
    return `
    <category name="Variables" colour="#FF8C1A" secondaryColour="#DB6E00" custom="VARIABLE">
    </category>
    `;
};

const myBlocks = function () {
    return `
    <category name="My Blocks" colour="#FF6680" secondaryColour="#FF4D6A" custom="PROCEDURE">
    </category>
    `;
};

const xmlOpen = '<xml style="display: none">';
const xmlClose = '</xml>';

/**
 * @param {!boolean} isStage - Whether the toolbox is for a stage-type target.
 * @param {?string} targetId - The current editing target
 * @param {string?} categoriesXML - null for default toolbox, or an XML string with <category> elements.
 * @returns {string} - a ScratchBlocks-style XML document for the contents of the toolbox.
 */
/*const makeToolboxXML = function (isStage, targetId, categoriesXML) {
    const gap = [categorySeparator];

    const everything = [
        xmlOpen,
        motion(isStage, targetId), gap,
        looks(isStage, targetId), gap,
        sound(isStage, targetId), gap,
        events(isStage, targetId), gap,
        control(isStage, targetId), gap,
        sensing(isStage, targetId), gap,
        operators(isStage, targetId), gap,
        variables(isStage, targetId), gap,
        myBlocks(isStage, targetId)
    ];

    if (categoriesXML) {
        everything.push(gap, categoriesXML);
    }

    everything.push(xmlClose);
    return everything.join('\n');
};*/

const makeToolboxXML = function (target) {
    var topBlocks = {};
    var scripts = target.blocks._scripts;
    for (let i = 0; i < scripts.length; i++) {
        //在谜题中隐藏控制脚本
        var block = target.blocks.getBlock(scripts[i]);
        if (block.opcode == "event_whenbroadcastreceived"
            && block.fields.BROADCAST_OPTION
            && block.fields.BROADCAST_OPTION.value.substr(0, 1) == "@") continue;
        if (block.opcode == "procedures_definition") continue;
        if (!topBlocks[block.opcode]) topBlocks[block.opcode] = [];
        topBlocks[block.opcode].push(target.blocks.blockToXML(scripts[i]));
        //xmlString += this.blockToXML(this._scripts[i]);
    }
    let xmlString = '<xml xmlns="http://www.w3.org/1999/xhtml">';
    for (var i = 0; i < blockOrders.length; i++) {
        var count = 0;
        var tmpXml = "";
        for (var j = 0; j < blockOrders[i].blocks.length; j++) {
            var blockXmls = topBlocks[blockOrders[i].blocks[j]];
            if (blockXmls) {
                for (var k = 0; k < blockXmls.length; k++) {
                    tmpXml += blockXmls[k];
                    count++;
                }
            }
        }
        if (count > 0) xmlString += blockOrders[i].categoryTag + tmpXml + '</category>';
    }
    return `${xmlString}</xml>`;
}

const blockOrders = [
    {
        categoryTag: '<category name="动作" colour="#4C97FF" secondaryColour="#3373CC">',
        blocks: ['motion_movesteps', 'motion_turnright', 'motion_turnleft', 'motion_pointindirection', 'motion_pointtowards', 'motion_gotoxy', 'motion_goto', 'motion_glidesecstoxy', 'motion_changexby', 'motion_setx', 'motion_changeyby', 'motion_sety', 'motion_ifonedgebounce', 'motion_setrotationstyle', 'motion_xposition', 'motion_yposition', 'motion_direction'],
    },
    {
        categoryTag: '<category name="外观" colour="#9966FF" secondaryColour="#774DCB">',
        blocks: ['looks_sayforsecs', 'looks_say', 'looks_thinkforsecs', 'looks_think', 'looks_show', 'looks_hide', 'looks_switchcostumeto', 'looks_nextcostume', 'looks_switchbackdropto', 'looks_changeeffectby', 'looks_seteffectto', 'looks_cleargraphiceffects', 'looks_changesizeby', 'looks_setsizeto', 'looks_gotofront', 'looks_gobacklayers', 'looks_costumeorder', 'looks_backdropname', 'looks_switchbackdroptoandwait', 'looks_nextbackdrop', 'looks_backdroporder'],
    },
    {
        categoryTag: '<category name="声音" colour="#D65CD6" secondaryColour="#BD42BD">',
        blocks: ['sound_play', 'sound_playuntildone', 'sound_stopallsounds'],
    },
    {
        categoryTag: '<category name="Music" colour="#FFD500" secondaryColour="#CC9900">',
        blocks: ['music.playDrumForBeats', 'music.restForBeats', 'music.playNoteForBeats', 'music.setInstrument', 'sound_changevolumeby', 'sound_setvolumeto', 'sound_volume', 'music.changeTempo', 'music.setTempo', 'music.getTempo'],
    },
    {
        categoryTag: '<category name="画笔" colour="#FFD500" secondaryColour="#CC9900">',
        blocks: ['pen.clear', 'pen.stamp', 'pen.penDown', 'pen.penUp', 'pen.setPenColorToColor', 'pen.changePenHueBy', 'pen.setPenHueToNumber', 'pen.changePenShadeBy', 'pen.setPenShadeToNumber', 'pen.changePenSizeBy', 'pen.setPenSizeTo', 'pen.print'],
    },
    {
        categoryTag: '<category name="事件" colour="#FFD500" secondaryColour="#CC9900">',
        blocks: ['event_whenflagclicked', 'event_whenkeypressed', 'event_whenthisspriteclicked', 'event_whenbackdropswitchesto', 'event_whengreaterthan', 'event_whenbroadcastreceived', 'event_broadcast', 'event_broadcastandwait'],
    },
    {
        categoryTag: '<category name="控制" colour="#FFAB19" secondaryColour="#CF8B17">',
        blocks: ['control_wait', 'control_repeat', 'control_forever', 'control_if', 'control_if_else', 'control_wait_until', 'control_repeat_until', 'control_stop', 'control_start_as_clone', 'control_create_clone_of', 'control_delete_this_clone'],
    },
    {
        categoryTag: '<category name="侦测" colour="#4CBFE6" secondaryColour="#2E8EB8">',
        blocks: ['sensing_touchingobject', 'sensing_touchingcolor', 'sensing_coloristouchingcolor', 'sensing_distanceto', 'sensing_askandwait', 'sensing_answer', 'sensing_keypressed', 'sensing_mousedown', 'sensing_mousex', 'sensing_mousey', 'sensing_loudness', 'sensing_videoon', 'sensing_videotoggle', 'sensing_setvideotransparency', 'sensing_timer', 'sensing_resettimer', 'sensing_of', 'sensing_current', 'sensing_dayssince2000', 'sensing_username'],
    },
    {
        categoryTag: '<category name="运算" colour="#40BF4A" secondaryColour="#389438">',
        blocks: ['operator_add', 'operator_subtract', 'operator_multiply', 'operator_divide', 'operator_random', 'operator_lt', 'operator_equals', 'operator_gt', 'operator_and', 'operator_or', 'operator_not', 'operator_join', 'operator_letter_of', 'operator_length', 'operator_mod', 'operator_round', 'operator_mathop'],
    },
    {
        categoryTag: '<category name="变量" colour="#FF8C1A" secondaryColour="#DB6E00">',
        blocks: ['data_variable', 'data_setvariableto', 'data_changevariableby', 'data_showvariable', 'data_hidevariable', 'data_listcontents', 'data_addtolist', 'data_deleteoflist', 'data_insertatlist', 'data_replaceitemoflist', 'data_itemoflist', 'data_lengthoflist', 'data_listcontainsitem', 'data_showlist', 'data_hidelist'],
    },
    {
        categoryTag: '<category name="其他" colour="#FF6680" secondaryColour="#FF4D6A">',
        blocks: ['procedures_definition', 'argument_reporter_string_number', 'procedures_call']
    }
];

export default makeToolboxXML;
