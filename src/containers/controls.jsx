import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';

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
            'handleStopAllClick',
            'onProjectRunStart',
            'onProjectRunStop'
        ]);
        this.state = {
            //by yj
            started: false,
            preventComplete: false,

            projectRunning: false,
            turbo: false
        };
    }
    componentDidMount () {
        //by yj
        this.props.vm.addListener('PUZZLE_RUN_START', this.onPuzzleRunStart);
        this.props.vm.addListener('PUZZLE_RUN_RESET', this.onPuzzleRunReset);
        this.props.vm.addListener('PUZZLE_BLOCKS_CHANGED', this.onPuzzleBlocksChanged);

        this.props.vm.addListener('PROJECT_RUN_START', this.onProjectRunStart);
        this.props.vm.addListener('PROJECT_RUN_STOP', this.onProjectRunStop);
    }
    componentWillUnmount () {
        //by yj
        this.props.vm.removeListener('PUZZLE_RUN_START', this.onPuzzleRunStart);
        this.props.vm.removeListener('PUZZLE_RUN_RESET', this.onPuzzleRunReset);
        this.props.vm.removeListener('PUZZLE_BLOCKS_CHANGED', this.onPuzzleBlocksChanged);

        this.props.vm.removeListener('PROJECT_RUN_START', this.onProjectRunStart);
        this.props.vm.removeListener('PROJECT_RUN_STOP', this.onProjectRunStop);
    }
    onProjectRunStart () {
        this.setState({projectRunning: true});
    }
    onProjectRunStop () {
        this.setState({projectRunning: false});
    }
    handleGreenFlagClick (e) {
        e.preventDefault();
        if (e.shiftKey) {
            this.setState({turbo: !this.state.turbo});
            this.props.vm.setTurboMode(!this.state.turbo);
        } else {
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
            ...props
        } = this.props;
        return (
            <ControlsComponent
                {...props}
                active={this.state.projectRunning}
                turbo={this.state.turbo}
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
    vm: PropTypes.instanceOf(VM)
};

export default Controls;
