import bindAll from 'lodash.bindall';
import React from 'react';

import { connect } from 'react-redux';

/*import {
    openSpriteLibrary,
    closeBackdropLibrary,
    closeSpriteLibrary
} from '../reducers/modals';*/

//import {activateTab, COSTUMES_TAB_INDEX} from '../reducers/editor-tab';
//import {setReceivedBlocks} from '../reducers/hovered-target';

import PuzzlePaneComponent from '../components/puzzle-pane/puzzle-pane.jsx';
//import spriteLibraryContent from '../lib/libraries/sprites.json';

import { openPuzzleHelp } from '../reducers/modals';

class PuzzlePane extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            'handleTutorialClick',
            'handleHintClick',
            'handleAnswerClick',
            'handleShotscreenClick',
            'handleSettingsClick',
            'handleSaveAnswerClick',
            'onPuzzleBlocksChanged',
        ]);
        this.state = {
            preventComplete: false,
            blockCount: 0,
            maxBlockCount: 0,
        };
    }
    componentDidMount() {
        this.props.vm.addListener('PUZZLE_BLOCKS_CHANGED', this.onPuzzleBlocksChanged);
        this.props.vm.addListener('PUZZLE_ANSWER_SAVED', this.handleAnswerClick);
    }
    componentWillUnmount() {
        this.props.vm.removeListener('PUZZLE_BLOCKS_CHANGED', this.onPuzzleBlocksChanged);
        this.props.vm.removeListener('PUZZLE_ANSWER_SAVED', this.handleAnswerClick);
    }
    onPuzzleBlocksChanged(e) {
        let puzzle = this.props.vm.runtime.puzzle;
        this.setState({
            preventComplete: puzzle.preventComplete,
            blockCount: puzzle.blockCount,
            maxBlockCount: puzzle.maxBlockCount,
        })
    }
    handleTutorialClick() {
        let puzzle = this.props.vm.runtime.puzzle;
        puzzle.helpForType = "Mission.Course";
        puzzle.helpForOrder = puzzle.helpForOrder || 1;
        puzzle.helpSidebarVisible = this.props.puzzleData.courses.length > 0;
        this.props.onOpenPuzzleHelp();
    }
    handleHintClick(e) {
        let puzzle = this.props.vm.runtime.puzzle;
        puzzle.helpForType = "Mission.Hint";
        puzzle.helpForOrder = e.currentTarget.getAttribute("data-order");
        puzzle.helpSidebarVisible = false;
        this.props.onOpenPuzzleHelp();
    }
    handleAnswerClick() {
        let puzzle = this.props.vm.runtime.puzzle;
        puzzle.helpForType = "Mission.Answer";
        puzzle.helpForOrder = puzzle.helpForOrder || 1;
        puzzle.helpSidebarVisible = false;
        this.props.onOpenPuzzleHelp();
    }
    handleShotscreenClick() {
    }
    handleSettingsClick() {
    }
    handleSaveAnswerClick() {
        this.props.vm.emit("PUZZLE_SAVE_ANSWER");
    }
    render() {
        const {
            onActivateTab, // eslint-disable-line no-unused-vars
            ...componentProps
        } = this.props;
        return (
            <PuzzlePaneComponent
                {...componentProps}
                onTutorialClick={this.handleTutorialClick}
                onHintClick={this.handleHintClick}
                onAnswerClick={this.handleAnswerClick}
                onShotscreenClick={this.handleShotscreenClick}
                onSettingsClick={this.handleSettingsClick}
                onSaveAnswerClick={this.handleSaveAnswerClick}
            />
        );
    }
}

const {
    onSelectSprite, // eslint-disable-line no-unused-vars
    ...puzzlePaneProps
} = PuzzlePaneComponent.propTypes;

PuzzlePane.propTypes = {
    ...puzzlePaneProps
};

const mapStateToProps = state => ({
    editingTarget: state.scratchGui.targets.editingTarget,
    hoveredTarget: state.scratchGui.hoveredTarget,
    sprites: Object.keys(state.scratchGui.targets.sprites).reduce((sprites, k) => {
        let { direction, size, x, y, ...sprite } = state.scratchGui.targets.sprites[k];
        if (typeof direction !== 'undefined') direction = Math.round(direction);
        if (typeof x !== 'undefined') x = Math.round(x);
        if (typeof y !== 'undefined') y = Math.round(y);
        if (typeof size !== 'undefined') size = Math.round(size);
        sprites[k] = { ...sprite, direction, size, x, y };
        return sprites;
    }, {}),
    stage: state.scratchGui.targets.stage,
    raiseSprites: state.scratchGui.blockDrag,
    //spriteLibraryVisible: state.modals.spriteLibrary,
    //backdropLibraryVisible: state.modals.backdropLibrary
    //by yj
    puzzle: state.scratchGui.puzzle,
    puzzleHelpVisible: state.scratchGui.modals.puzzleHelp,
    helpForType: state.scratchGui.helpForType,
    helpForOrder: state.scratchGui.helpForOrder,
});
const mapDispatchToProps = dispatch => ({
    //by yj
    onClosePuzzleHelp: () => dispatch(closePuzzleHelp()),
    onOpenPuzzleHelp: () => dispatch(openPuzzleHelp()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PuzzlePane);
