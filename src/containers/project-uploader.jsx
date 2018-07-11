import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

//by yj
class ProjectUploader extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            'uploadProject'
        ]);
    }
    uploadProject() {
        if (!window.confirm('如果该作品原先为scratch2.0版本，保存后会永久转换为3.0版本。确定要保存吗？')) return;
        this.props.vm.saveProjectDiff().then(content => {
            const projectId = Blockey.INIT_DATA.PROJECT.id;
            Blockey.Utils.ajax({
                url: "/WebApi/Project/Upload",
                data: { id: projectId, content: content },
                success: (r) => {
                    Blockey.Utils.Alerter.info("保存成功");
                }
            });
        });
    }
    render() {
        const {
            /* eslint-disable no-unused-vars */
            children,
            vm,
            /* eslint-enable no-unused-vars */
            ...props
        } = this.props;
        return this.props.children(this.uploadProject, props);
    }
}

ProjectUploader.propTypes = {
    children: PropTypes.func,
    vm: PropTypes.shape({
        saveProjectDiff: PropTypes.func
    })
};

const mapStateToProps = state => ({
    vm: state.scratchGui.vm
});

export default connect(
    mapStateToProps,
    () => ({}) // omit dispatch prop
)(ProjectUploader);
