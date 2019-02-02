import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import { connect } from 'react-redux';

import PublishModalComponent from '../components/publish-modal/publish-modal.jsx';
import { closePublish } from '../reducers/modals';

class PublishModal extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            'handleOk',
            'handleChange',
            'handleKeyPress'
        ]);
        this.state = {
            version: Blockey.INIT_DATA.project.version || 0,
            summary: ''
        };
    }
    handleKeyPress(event) {
        if (event.key === 'Enter') this.handleOk();
    }
    handleOk() {
        if (!this.state.summary) return;
        const projectId = Blockey.INIT_DATA.project.id;
        Blockey.Utils.ajax({
            url: `/WebApi/Projects/${projectId}/Publish`,
            data: { summary: this.state.summary },
            success: (r) => {
                Blockey.INIT_DATA.project.version = r.project.version;
                this.props.onClosePublish();
                Blockey.Utils.Alerter.info("发布成功");
            }
        });
    }
    handleChange(e) {
        var name = e.target.name;
        var value = e.target.value;
        this.setState({ [name]: value });
    }
    render() {
        return (
            <PublishModalComponent
                version={this.state.version}
                summary={this.state.summary}
                onCancel={this.props.onClosePublish}
                onChange={this.handleChange}
                onKeyPress={this.handleKeyPress}
                onOk={this.handleOk}
            />
        );
    }
}

const mapStateToProps = state => ({
    vm: state.scratchGui.vm
});

const mapDispatchToProps = dispatch => ({
    onClosePublish: () => dispatch(closePublish())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PublishModal);