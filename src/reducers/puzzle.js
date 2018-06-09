const UPDATE_BLOCKS = 'scratch-gui/puzzle/UPDATE_BLOCKS';
const UPDATE_PLAYER = 'scratch-gui/puzzle/UPDATE_PLAYER';

const initialState = {
    preventComplete: false,
    blockStackClicked: false,
    blockCount: 0,
    isRuning: false,
    warningMessage: ""
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
        case UPDATE_BLOCKS:
            return {
                preventComplete: state.isRuning ? true : state.preventComplete,
                blockStackClicked: action.blockStackClicked || state.blockStackClicked,
                blockCount: action.blockCount != null ? action.blockCount : state.blockCount,
                isRuning: state.isRuning,
                warningMessage: state.isRuning ? "运行时修改程序无法完成任务" : action.blockStackClicked || state.blockStackClicked ? "点击指令块调试程序后无法完成任务" : ""
            };
        case UPDATE_PLAYER:
            return {
                preventComplete: action.isRuning ? false : state.preventComplete,
                blockStackClicked: action.isRuning ? state.blockStackClicked : false,
                blockCount: state.blockCount,
                isRuning: action.isRuning,
                warningMessage: action.isRuning ? state.warningMessage : ""
            };
        default:
            return state;
    }
};

const updateBlocks = function (blockStackClicked, blockCount) {
    return {
        type: UPDATE_BLOCKS,
        blockStackClicked: blockStackClicked,
        blockCount: blockCount
    };
};

const updatePlayer = function (isRuning) {
    return {
        type: UPDATE_PLAYER,
        isRuning: isRuning
    };
};

export {
    reducer as default,
    updateBlocks,
    updatePlayer
};
