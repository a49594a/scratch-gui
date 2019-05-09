import bindAll from 'lodash.bindall';
import React from 'react';

import { connect } from 'react-redux';

import ScratchBlocks from 'scratch-blocks';
import PuzzlePaneComponent from '../components/puzzle-pane/puzzle-pane.jsx';

import { openMissionHelp } from '../reducers/modals';
import { setProjectUnchanged } from '../reducers/project-changed';

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
        this.props.vm.runtime.addListener('MISSION_RESOLVED', this.handlePuzzleResolved);
    }
    componentWillUnmount() {
        this.props.vm.removeListener('PUZZLE_ANSWER_SAVED', this.props.onOpenMissionHelp);
        this.props.vm.runtime.removeListener('MISSION_RESOLVED', this.handlePuzzleResolved);
    }
    handleShotscreenClick() {
        this.props.vm.runtime.renderer.draw();
        var imgData = this.props.vm.runtime.renderer.gl.canvas.toDataURL('image/png');
        Blockey.Utils.ajax({
            url: `/WebApi/Missions/${this.props.puzzleData.id}/updateThumb`,
            data: { dataUrl: imgData },
            success: (e) => {
                Blockey.Utils.Alerter.info("舞台截图保存成功！");
            }
        });
    }
    handlePuzzleResolved() {
        var xmlText = ScratchBlocks.Xml.domToPrettyText(ScratchBlocks.Xml.workspaceToDom(ScratchBlocks.mainWorkspace));
        Blockey.Utils.setMissionResolved(this.props.puzzleData.id, { answer: xmlText })
            .then(() => {
                var missions = this.props.puzzleData.missions;
                for (var i = 0; i < missions.length; i++) {
                    if (missions[i].id == this.props.puzzleData.id) {
                        missions[i].isSolved = true;
                        if (i == missions.length - 1) {
                            this.props.onProjectUnchanged();
                            window.location = "/User/Missions";
                        }
                        else {
                            window.location.hash = "#" + missions[i + 1].id;
                        }
                        return;
                    }
                }
            });
    }
    handleSettingsClick() {
        var puzzleData = this.props.puzzleData;
        let mission = puzzleData.missions.find(mission => mission.id == puzzleData.id);
        Blockey.Utils.openMissionSettingsModal({
            id: puzzleData.id,
            onOk: ()=>{
                window.location.reload(true);
            }
        });
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
    puzzle: state.scratchGui.puzzle
});
const mapDispatchToProps = dispatch => ({
    //by yj
    onCloseMissionHelp: () => dispatch(closeMissionHelp()),
    onOpenMissionHelp: () => dispatch(openMissionHelp()),
    onProjectUnchanged: () => dispatch(setProjectUnchanged())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PuzzlePane);
