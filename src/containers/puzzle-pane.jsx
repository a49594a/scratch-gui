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
            'handleTimeExpired',
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
        var extUtils = this.props.extUtils;
        this.props.vm.runtime.renderer.draw();
        var imgData = this.props.vm.runtime.renderer.gl.canvas.toDataURL('image/png');
        var puzzleData = this.props.puzzleData;
        var idx = ('' + puzzleData.id).indexOf('-');
        var challengeId = idx > 0 ? puzzleData.id.substr(0, idx) : '';
        var levelId = idx > 0 ? Number(puzzleData.id.substr(idx + 1)) : puzzleData.id;
        extUtils.ajax({
            url: `/WebApi/Missions/${levelId}/updateThumb`,
            data: { dataUrl: imgData },
            success: (e) => {
                extUtils.Alerter.info("舞台截图保存成功！");
            }
        });
    }
    handlePuzzleResolved() {
        var extUtils = this.props.extUtils;
        var xmlText = ScratchBlocks.Xml.domToPrettyText(ScratchBlocks.Xml.workspaceToDom(ScratchBlocks.mainWorkspace));
        var puzzleData = this.props.puzzleData;
        var idx = ('' + puzzleData.id).indexOf('-');
        var challengeId = idx > 0 ? puzzleData.id.substr(0, idx) : '';
        var levelId = idx > 0 ? Number(puzzleData.id.substr(idx + 1)) : puzzleData.id;
        extUtils.setMissionResolved(puzzleData.id, { answer: xmlText })
            .then(() => {
                var nextIdx = null;
                var missions = puzzleData.missions;
                for (var i = 0; i < missions.length; i++) {
                    if (missions[i].id == levelId) {
                        missions[i].isSolved = true;
                    }
                    if (!missions[i].isSolved && nextIdx == null) {
                        nextIdx = i;
                    }
                }
                if (nextIdx != null) {
                    this.props.onProjectUnchanged();
                    window.location.hash = "#" + (challengeId ? challengeId + '-' : '') + missions[nextIdx].id;
                }
            });
    }
    handleSettingsClick() {
        var extUtils = this.props.extUtils;
        var puzzleData = this.props.puzzleData;
        var tmpId = String(puzzleData.id);
        var idx = tmpId.indexOf('-');
        var challengeId = idx > 0 ? Number(tmpId.substr(0, idx)) : '';
        var levelId = idx > 0 ? Number(tmpId.substr(idx + 1)) : puzzleData.id;
        //let mission = puzzleData.missions.find(mission => mission.id == puzzleData.id);
        extUtils.openMissionSettingsModal({
            id: levelId,
            onOk: () => {
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
    handleTimeExpired() {
        var extUtils = this.props.extUtils;
        var puzzleData = this.props.puzzleData;
        var ctx = extUtils.getContext();
        var objectiveProgress = 0;
        for (var i = 0; i < puzzleData.missions.length; i++) {
            if (puzzleData.missions[i].isSolved) objectiveProgress++;
        }
        var prompts = [{
            type: 'UserMission',
            content: {
                id: puzzleData.id,
                objectiveProgress: objectiveProgress,
                mission: {
                    type: puzzleData.missions.length > 1 ? 'Challenge' : 'Puzzle',
                    objectiveCount: puzzleData.missions.length
                },
                userId: ctx.loggedInUser.id,
                expireTime: puzzleData.expireTime
            }
        }];
        extUtils.showUserPrompts(prompts);
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
                onTimeExpired={this.handleTimeExpired}
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
