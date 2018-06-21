import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import SettingsModalComponent from '../components/puzzle-settings-modal/settings-modal.jsx';

import { closePuzzleSettings } from '../reducers/modals';

class SettingsModal extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            'handleOK',
            'handleCancel',
            'handleChange'
        ]);

        let puzzleData = this.props.puzzleData;
        this.state = {
            defaultSprite: puzzleData.defaultSprite,
            maxBlockCount: puzzleData.maxBlockCount,
            templateProjectId: puzzleData.templateProjectId,
        };
    }
    handleOK() {
        let puzzleData = this.props.puzzleData;
        var postData = {
            id: puzzleData.id,
            defaultSprite: this.state.defaultSprite,
            maxBlocks: this.state.maxBlockCount,
            templateId: this.state.templateProjectId,
        };
        $.ajax({
            url: "/WebApi/Puzzle/saveSettings",
            type: "POST",
            dataType: "JSON",
            data: postData,
        }).done(e => {
            window.location.reload(true);
            //this.props.onOK();
        });
    }
    handleCancel() {
        this.props.onCancel();
    }
    handleChange(e) {
        var tmpState = {};
        tmpState[e.target.name] = e.target.value;
        this.setState(tmpState);
    }
    render() {
        const {
            ...componentProps
        } = this.props;
        return (
            <SettingsModalComponent
                {...componentProps}
                onOK={this.handleOK}
                onCancel={this.handleCancel}
                onChange={this.handleChange}
                defaultSprite={this.state.defaultSprite}
                maxBlockCount={this.state.maxBlockCount}
                templateProjectId={this.state.templateProjectId}
            />
        );
    }
}

SettingsModal.propTypes = {
    onOK: PropTypes.func,
    onCancel: PropTypes.func
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
    onOK: () => {
        dispatch(closePuzzleSettings());
    },
    onCancel: () => {
        dispatch(closePuzzleSettings());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SettingsModal);
