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
            summary: '',
            updateThumb: true,
            thumbDataUrl: null
        };
    }
    componentDidMount() {
        this.shotscreen();
    }
    shotscreen() {
        var runtime = this.props.vm.runtime;
        runtime.renderer.draw();
        var dataUrl = runtime.renderer.gl.canvas.toDataURL('image/png');
        this.setState({ thumbDataUrl: dataUrl });
    }
    handleKeyPress(event) {
        if (event.key === 'Enter') this.handleOk();
    }
    handleOk() {
        var blob = null;
        if (this.state.updateThumb) {
            var bstr = atob(this.state.thumbDataUrl.split(',')[1]);
            var n = bstr.length;
            var u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            blob = new Blob([u8arr], { type: 'image/png' });
        }
        this.props.vm.saveProjectDiff(blob).then(file => {
            const projectId = Blockey.INIT_DATA.project.id;
            Blockey.Utils.ajax({
                url: "/WebApi/Project/Upload",
                data: { id: projectId, file: file, publish: true, summary: this.state.summary },
                success: (r) => {
                    this.props.vm.updateSavedAssetMap();//配合saveProjectDiff
                    Blockey.INIT_DATA.project.version = r.model.version;
                    this.props.onClosePublish();
                    Blockey.Utils.Alerter.info("发布成功");
                }
            });
        });
    }
    handleChange(e) {
        var name = e.target.name;
        var value = e.target.value;
        switch (name) {
            case 'updateThumb':
                value = e.target.checked;
                break;
            default:
                break;
        }
        this.setState({ [name]: value });
    }
    render() {
        return (
            <PublishModalComponent
                version={this.state.version}
                thumbDataUrl={this.state.thumbDataUrl}
                summary={this.state.summary}
                updateThumb={this.state.updateThumb}
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