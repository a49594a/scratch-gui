import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';

import analytics from '../lib/analytics';
import ControlsComponent from '../components/puzzle-controls/controls.jsx';

//by yj
import { connect } from 'react-redux';
import { updatePlayer } from '../reducers/puzzle';

class Controls extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            'handleStartClick',
            'handleResetClick',
            'onPuzzleRunStart',
            'onPuzzleRunReset',
            'onPuzzleBlocksChanged',
        ]);
        this.state = {
            started: false,
            preventComplete: false,
        };
    }
    componentDidMount() {
        this.props.vm.addListener('PUZZLE_RUN_START', this.onPuzzleRunStart);
        this.props.vm.addListener('PUZZLE_RUN_RESET', this.onPuzzleRunReset);
        this.props.vm.addListener('PUZZLE_BLOCKS_CHANGED', this.onPuzzleBlocksChanged);
    }
    componentWillUnmount() {
        this.props.vm.removeListener('PUZZLE_RUN_START', this.onPuzzleRunStart);
        this.props.vm.removeListener('PUZZLE_RUN_RESET', this.onPuzzleRunReset);
        this.props.vm.removeListener('PUZZLE_BLOCKS_CHANGED', this.onPuzzleBlocksChanged);
    }
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

        analytics.event({
            category: 'general',
            action: 'Green Flag'
        });
    }
    handleResetClick(e) {
        e.preventDefault();
        this.props.vm.resetPuzzle();

        let puzzle = this.props.vm.runtime.puzzle;
        puzzle.preventComplete = (puzzle.maxBlockCount > 0 && puzzle.blockCount > puzzle.maxBlockCount);

        analytics.event({
            category: 'general',
            action: 'Stop Button'
        });
    }
    render() {
        const {
            vm, // eslint-disable-line no-unused-vars
            ...props
        } = this.props;
        return (
            <ControlsComponent
                {...props}
                started={this.state.started}
                preventComplete={this.state.preventComplete}
                onStartClick={this.handleStartClick}
                onResetClick={this.handleResetClick}
            />
        );
    }
}

Controls.propTypes = {
    vm: PropTypes.instanceOf(VM),
};

export default Controls;
