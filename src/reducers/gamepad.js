const TOGGLE_GAMEPAD = 'scratch-gui/Gamepad/TOGGLE_GAMEPAD';

const initialState = {
    gamepadVisible: false
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case TOGGLE_GAMEPAD:
        return {
            gamepadVisible: !state.gamepadVisible
        };
    default:
        return state;
    }
};

const toggleGamepad = function () {
    return {
        type: TOGGLE_GAMEPAD
    };
};

export {
    reducer as default,
    initialState as gamepadInitialState,
    toggleGamepad
};
