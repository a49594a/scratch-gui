import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import {connect} from 'react-redux';

import analytics from '../lib/analytics';
import ControlsComponent from '../components/controls/controls.jsx';

class Controls extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            //by yj
            'handleStartClick',
            'handleResetClick',
            'onPuzzleRunStart',
            'onPuzzleRunReset',
            'onPuzzleBlocksChanged',

            'handleGreenFlagClick',
            'handleStopAllClick'
        ]);
        this.state = {
            //by yj
            started: false,
            preventComplete: false
        };
    }
    componentDidMount () {
        //by yj
        this.props.vm.addListener('PUZZLE_RUN_START', this.onPuzzleRunStart);
        this.props.vm.addListener('PUZZLE_RUN_RESET', this.onPuzzleRunReset);
        this.props.vm.addListener('PUZZLE_BLOCKS_CHANGED', this.onPuzzleBlocksChanged);
    }
    componentWillUnmount () {
        //by yj
        this.props.vm.removeListener('PUZZLE_RUN_START', this.onPuzzleRunStart);
        this.props.vm.removeListener('PUZZLE_RUN_RESET', this.onPuzzleRunReset);
        this.props.vm.removeListener('PUZZLE_BLOCKS_CHANGED', this.onPuzzleBlocksChanged);
    }
    handleGreenFlagClick (e) {
        e.preventDefault();
        if (e.shiftKey) {
            this.props.vm.setTurboMode(!this.props.turbo);
        } else {
            if (!this.props.isStarted) {
                this.props.vm.start();
            }
            this.props.vm.greenFlag();
            analytics.event({
                category: 'general',
                action: 'Green Flag'
            });
        }
    }
    handleStopAllClick (e) {
        e.preventDefault();
        this.props.vm.stopAll();
        analytics.event({
            category: 'general',
            action: 'Stop Button'
        });
    }
    
    //by yj
    onPuzzleRunStart() {
        let puzzle = this.props.vm.runtime.puzzle;
        puzzle.started = true;
        this.setState({ started: puzzle.started });
    }
    onPuzzleRunReset() {
        let puzzle = this.props.vm.runtime.puzzle;
        puzzle.started = false;
        puzzle.preventComplete = puzzle.maxBlockCount > 0 && puzzle.blockCount > puzzle.maxBlockCount;
        this.setState({
            started: puzzle.started,
            preventComplete: puzzle.preventComplete
        });
    }
    onPuzzleBlocksChanged(e) {
        let puzzle = this.props.vm.runtime.puzzle;
        if (e.type == "stackclick") {
            puzzle.started = true;
            this.setState({
                started: puzzle.started,
                preventComplete: puzzle.preventComplete
            });
        }
        else {
            this.setState({
                preventComplete: puzzle.preventComplete
            });
        }
    }
    handleStartClick(e) {
        e.preventDefault();
        //by yj
        this.props.vm.startPuzzle();
    }
    handleResetClick(e) {
        e.preventDefault();
        this.props.vm.resetPuzzle();

        let puzzle = this.props.vm.runtime.puzzle;
        puzzle.attemptCount++;
        puzzle.preventComplete = (puzzle.maxBlockCount > 0 && puzzle.blockCount > puzzle.maxBlockCount);
    }

    render () {
        const {
            vm, // eslint-disable-line no-unused-vars
            isStarted, // eslint-disable-line no-unused-vars
            projectRunning,
            turbo,
            ...props
        } = this.props;
        return (
            <ControlsComponent
                {...props}
                active={projectRunning}
                turbo={turbo}
                onGreenFlagClick={this.handleGreenFlagClick}
                onStopAllClick={this.handleStopAllClick}
                //by yj for puzzle
                started={this.state.started}
                preventComplete={this.state.preventComplete}
                onStartClick={this.handleStartClick}
                onResetClick={this.handleResetClick}
            />
        );
    }
}

Controls.propTypes = {
    isStarted: PropTypes.bool.isRequired,
    projectRunning: PropTypes.bool.isRequired,
    turbo: PropTypes.bool.isRequired,
    vm: PropTypes.instanceOf(VM)
};

const mapStateToProps = state => ({
    isStarted: state.scratchGui.vmStatus.running,
    projectRunning: state.scratchGui.vmStatus.running,
    turbo: state.scratchGui.vmStatus.turbo
});
// no-op function to prevent dispatch prop being passed to component
const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Controls);
