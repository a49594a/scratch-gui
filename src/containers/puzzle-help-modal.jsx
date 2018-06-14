import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import HelpModalComponent from '../components/puzzle-help-modal/help-modal.jsx';

import { closePuzzleHelp } from '../reducers/modals';
import ScratchBlocks from 'scratch-blocks';

class HelpModal extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            'handleOK',
            'handleCancel',
            'handleSelect',
            'setContent',
        ]);

        let puzzle = this.props.vm.runtime.puzzle;
        this.state = {
            forType: puzzle.helpForType,
            forOrder: puzzle.helpForOrder,
            sidebarVisible: puzzle.helpSidebarVisible,
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
    setContent(elContent) {
        this.elContent = elContent;
        if (!this.elContent) return;

        let puzzleData = this.props.puzzleData;
        let forType = this.state.forType;
        let forOrder = this.state.forOrder;
        let helps = null;
        if (forType == 'Mission.Course') helps = puzzleData.courses;
        if (forType == 'Mission.Hint') helps = puzzleData.hints;
        if (forType == 'Mission.Answer') helps = puzzleData.answers;
        let help = helps[forOrder - 1];
        if (help.contentType == 'text/html') {
            $(this.elContent).html(help.content);
        }
        else if (help.contentType == 'video/bokecc') {
            Blockey.ccVerificationCode = "Mission," + puzzleData.id + "," + Blockey.INIT_DATA.logedInUser.id;
            $(this.elContent).html('<script src="http://p.bokecc.com/player?autoStart=true&width=100%&height=600&vid=' + help.content + '" type="text/javascript"></script>');
        }
        else if (help.contentType == 'xml/scratch') {
            let workspace = ScratchBlocks.inject(this.elContent, {
                media: '/Content/scratch-puzzle5/static/blocks-media/',
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
            var dom = ScratchBlocks.Xml.textToDom(this.props.puzzleData.answers[0].content);
            workspace.scrollX -= 240;
            workspace.scrollY += 20;
            ScratchBlocks.Xml.domToWorkspace(dom, workspace);
            this.answersWorkspace = workspace;
        }
    }
    handleSelect(e) {
        let puzzle = this.props.vm.runtime.puzzle;
        puzzle.helpForOrder = e.currentTarget.getAttribute("data-order");
        this.setState({
            forOrder: puzzle.helpForOrder
        });
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
                forType={this.state.forType}
                forOrder={this.state.forOrder}
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
        dispatch(closePuzzleHelp());
    },
    onCancel: () => {
        dispatch(closePuzzleHelp());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HelpModal);
