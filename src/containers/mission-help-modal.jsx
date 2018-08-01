import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import HelpModalComponent from '../components/mission-help-modal/help-modal.jsx';

import { closeMissionHelp } from '../reducers/modals';
import ScratchBlocks from 'scratch-blocks';

class HelpModal extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            'handleOK',
            'handleCancel',
            'handleSelect',
            'setContent'
        ]);

        let mission = Blockey.INIT_DATA.mission;
        let sidebarVisible = mission.helps && mission.helps.length > 1;
        this.state = {
            mission: mission,
            forType: 'Mission.Course',
            forOrder: mission.helpForOrder || 1,
            sidebarVisible: sidebarVisible,
            helps: mission.helps,
        };
    }
    componentDidMount() {
        window.get_cc_verification_code = function (vid) {
            return Blockey.ccVerificationCode;
        }
    }
    componentWillUnmount() {
        if (this.answersWorkspace) {
            this.answersWorkspace.dispose();
            this.answersWorkspace = null;
        }
    }
    componentDidUpdate() {
        let mission = this.state.mission;
        if (mission.helpForOrder != this.state.forOrder) {
            mission.helpForOrder = this.state.forOrder;
            this.setContent(this.elContent);
        }
    }
    setContent(elContent) {
        this.elContent = elContent;
        if (!this.elContent) return;

        let forType = this.state.forType;
        let forOrder = this.state.forOrder;
        let helps = this.state.mission.helps;
        let help = helps[forOrder - 1];
        if (help.contentType == 'text/html') {
            $(this.elContent).html(help.content);
        }
        else if (help.contentType == 'video/bokecc') {
            Blockey.ccVerificationCode = "Mission," + this.state.mission.id + "," + Blockey.INIT_DATA.logedInUser.id;
            $(this.elContent).html('<script src="//p.bokecc.com/player?autoStart=true&width=100%&height=600&siteid=FFEB007F21BC8D4A&vid=' + help.content + '" type="text/javascript"></script>');
        }
        else if (help.contentType == 'xml/scratch') {
            let workspace = ScratchBlocks.inject(this.elContent, {
                media: '/Content/gui/static/blocks-media/',
                toolbox: '<xml style="display: none"></xml>',
                scrollbars: true,
                zoom: {
                    controls: true,
                    wheel: true,
                    startScale: 0.75
                },
                colours: {
                    workspace: '#f9f9f9',
                    flyout: '#dddddd',
                    scrollbar: '#cecece',
                    scrollbarHover: '#cecece',
                    insertionMarker: '#666666',
                    insertionMarkerOpacity: 0.3,
                    fieldShadow: 'rgba(255, 255, 255, 0.3)',
                    dragShadowOpacity: 0.6
                }
            });

            workspace.clear();
            workspace.getFlyout().hide();
            var dom = ScratchBlocks.Xml.textToDom(help.content);
            workspace.scrollX -= 240;
            workspace.scrollY += 20;
            ScratchBlocks.Xml.domToWorkspace(dom, workspace);
            this.answersWorkspace = workspace;
        }
    }
    handleSelect(e) {
        let forOrder = e.currentTarget.getAttribute("data-order");
        let mission = this.state.mission;
        let help = mission.helps[forOrder - 1];
        if (help.forType == 'Mission.Hint' && !help.unlocked) {
            if (confirm('使用1个提示都会减少10%的任务奖励，确定要解锁这个提示吗?')) {
                Blockey.Utils.ajax({
                    url: '/WebApi/Mission/UnlockHint',
                    data: { id: mission.id, helpId: help.id },
                    success: r => {
                        help.unlocked = true;
                        this.setState({
                            forOrder: forOrder
                        });
                    }
                });
            }
            return;
        }
        else {
            this.setState({
                forOrder: forOrder
            });
        }
    }
    handleOK() {
        this.props.onOK();
    }
    handleCancel() {
        this.props.onCancel();
    }
    render() {
        const {
            ...componentProps
        } = this.props;
        return (
            <HelpModalComponent
                {...componentProps}
                onCancel={this.handleCancel}
                onOK={this.handleOK}
                onSelect={this.handleSelect}
                onToggleSidebar={this.handleToggleSidebar}
                forType={this.state.forType}
                forOrder={this.state.forOrder}
                loaded={this.state.loaded}
                mission={this.state.mission}
                sidebarVisible={this.state.sidebarVisible}
                setContent={this.setContent}
            />
        );
    }
}

HelpModal.propTypes = {
    onOK: PropTypes.func,
    onCancel: PropTypes.func,
    onSelect: PropTypes.func
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
    onOK: () => {
        dispatch(closeMissionHelp());
    },
    onCancel: () => {
        dispatch(closeMissionHelp());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HelpModal);
