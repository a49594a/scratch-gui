import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import VM from 'scratch-vm';
import {setStageSize, STAGE_SIZES} from '../reducers/stage-size';
import {setFullScreen} from '../reducers/mode';

import { connect } from 'react-redux';

import StageHeaderComponent from '../components/puzzle-stage-header/stage-header.jsx';

import Slider from '../lib/puzzle-slider';

// eslint-disable-next-line react/prefer-stateless-function
class StageHeader extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            'handleKeyPress',
            'setSlider',
        ]);
    }
    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyPress);
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyPress);
    }
    handleKeyPress(event) {
        if (event.key === 'Escape' && this.props.isFullScreen) {
            this.props.onSetStageUnFull(false);
        }
    }
    setSlider(slider) {
        if (slider) {
            this.slider = slider;
            var sliderSvg = $(this.slider).find(".slider-svg")[0];
            let stepIntervalSlider = new Slider(10, 24, 130, sliderSvg, function (value) {
                if (this.props.vm.runtime.puzzle) {
                    this.props.vm.runtime.puzzle.stepInterval = 1000 * Math.pow(1 - value, 2);
                }
            }.bind(this));
            let puzzle = this.props.vm.runtime.puzzle;
            if (puzzle) {
                stepIntervalSlider.setValue(1 - Math.sqrt(puzzle.stepInterval / 1000));
            }
        }
    }
    render() {
        const {
            ...props
        } = this.props;
        return (
            <StageHeaderComponent
                {...props}
                onKeyPress={this.handleKeyPress}
                setSlider={this.setSlider}
            />
        );
    }
}

StageHeader.propTypes = {
    isFullScreen: PropTypes.bool,
    isPlayerOnly: PropTypes.bool,
    onSetStageUnFull: PropTypes.func.isRequired,
    stageSize: PropTypes.oneOf(Object.keys(STAGE_SIZES)),
    vm: PropTypes.instanceOf(VM).isRequired
};

const mapStateToProps = state => ({
    stageSize: state.scratchGui.stageSize.stageSize,
    isFullScreen: state.scratchGui.mode.isFullScreen,
    isPlayerOnly: state.scratchGui.mode.isPlayerOnly
});

const mapDispatchToProps = dispatch => ({
    onSetStageLarge: () => dispatch(setStageSize(STAGE_SIZES.large)),
    onSetStageSmall: () => dispatch(setStageSize(STAGE_SIZES.small)),
    onSetStageFull: () => dispatch(setFullScreen(true)),
    onSetStageUnFull: () => dispatch(setFullScreen(false))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StageHeader);
