import bindAll from 'lodash.bindall';
import React from 'react';

import { connect } from 'react-redux';

import ScratchBlocks from 'scratch-blocks';
import PuzzlePaneComponent from '../components/puzzle-pane/puzzle-pane.jsx';

import { openMissionHelp, openPuzzleSettings, openPuzzleResolved } from '../reducers/modals';

class PuzzlePane extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            'handleShotscreenClick',
            'handleSettingsClick',
            'handleSaveAnswerClick',
            'handleEditClick',
            'handleEditTemplateClick',
            'handlePuzzleResolved',
        ]);
    }
    componentDidMount() {
        this.props.vm.addListener('PUZZLE_ANSWER_SAVED', this.props.onOpenMissionHelp);
        this.props.vm.addListener('PUZZLE_RESOLVED', this.handlePuzzleResolved);
    }
    componentWillUnmount() {
        this.props.vm.removeListener('PUZZLE_ANSWER_SAVED', this.props.onOpenMissionHelp);
        this.props.vm.removeListener('PUZZLE_RESOLVED', this.handlePuzzleResolved);
    }
    handleShotscreenClick() {
        this.props.vm.runtime.renderer.draw();
        var imgData = this.props.vm.runtime.renderer.gl.canvas.toDataURL('image/png');
        var postData = {
            id: this.props.puzzleData.id,
            img: imgData
        };
        Blockey.Utils.ajax({
            url: "/WebApi/Puzzle/saveShotscreen",
            data: postData,
            success: (e) => {
                Blockey.Utils.Alerter.info("舞台截图保存成功！");
            }
        });
    }
    handlePuzzleResolved() {
        var xmlText = ScratchBlocks.Xml.domToPrettyText(ScratchBlocks.Xml.workspaceToDom(ScratchBlocks.mainWorkspace));
        Blockey.Utils.ajax({
            url: "/Mission/SetResolved2",
            data: { id: this.props.puzzleData.id, answer: xmlText },
            success: (data) => {
                this.props.onOpenPuzzleResolved();
            }
        });
    }
    handleSettingsClick() {
        this.props.onOpenPuzzleSettings();
    }
    handleSaveAnswerClick() {
        this.props.vm.emit("PUZZLE_SAVE_ANSWER");
    }
    handleEditClick() {
        window.location = `/Projects/${this.props.puzzleData.levelProjectId}/Editor`;
    }
    handleEditTemplateClick() {
        window.location = `/Projects/${this.props.puzzleData.templateProjectId}/Editor`;
    }
    render() {
        const {
            onActivateTab, // eslint-disable-line no-unused-vars
            ...componentProps
        } = this.props;
        const templateProjectId = this.props.puzzleData ? this.props.puzzleData.templateProjectId : null;
        return (
            <PuzzlePaneComponent
                {...componentProps}
                onShotscreenClick={this.handleShotscreenClick}
                onSettingsClick={this.handleSettingsClick}
                onSaveAnswerClick={this.handleSaveAnswerClick}
                onEditClick={this.handleEditClick}
                onEditTemplateClick={templateProjectId ? this.handleEditTemplateClick : null}
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
    puzzleData: state.scratchGui.projectState.puzzleData,
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
    puzzleSettingsVisible: state.scratchGui.modals.puzzleSettings,
});
const mapDispatchToProps = dispatch => ({
    //by yj
    onCloseMissionHelp: () => dispatch(closeMissionHelp()),
    onOpenMissionHelp: () => dispatch(openMissionHelp()),
    onClosePuzzleSettings: () => dispatch(closePuzzleSettings()),
    onOpenPuzzleSettings: () => dispatch(openPuzzleSettings()),
    onOpenPuzzleResolved: () => dispatch(openPuzzleResolved()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PuzzlePane);
