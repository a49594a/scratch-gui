import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import ReactModal from 'react-modal';
import classNames from 'classnames';

import Box from '../box/box.jsx';

import { closePuzzleHelp } from '../../reducers/modals';

import styles from './help-modal.css';

const HelpModal = function (props) {
    const {
        vm,
        puzzleData,
        forType,
        forOrder,
        sidebarVisible,
        setContent,
        ...componentProps
    } = props;
    let puzzle = vm.runtime.puzzle;
    let helps = null;
    if (forType == 'Mission.Course') helps = puzzleData.courses;
    if (forType == 'Mission.Hint') helps = puzzleData.hints;
    if (forType == 'Mission.Answer') helps = puzzleData.answers;
    let help = helps[forOrder - 1];
    Blockey.ccVerificationCode = "Mission," + puzzleData.id + "," + Blockey.INIT_DATA.logedInUser.id;
    return (
        <ReactModal
            isOpen
            className={styles.modalContent}
            overlayClassName={styles.modalOverlay}
            onRequestClose={props.onClose}
            shouldCloseOnOverlayClick={true}
        >
            <Box className={styles.body}>
                {sidebarVisible && helps.length > 1 ? (
                    <div className={classNames(styles.sidebar, "col-md-3")}>
                        <ul className={classNames(styles.nav)}>
                            {helps.map(help => (
                                <li
                                    key={help.forOrder}
                                    data-order={help.forOrder}
                                    onClick={props.onSelect}
                                >
                                    <span className={styles.title}>{help.name}</span>
                                </li>
                            ))}
                        </ul>
                        <span className={classNames(styles.btnToggle)}>&lt;</span>
                    </div>
                ) : null}
                <div className={sidebarVisible && helps.length > 1 ? styles.contentWithSidebar : styles.content}>
                    <Box className={help.contentType == 'xml/scratch' ? styles.answerBlocks : ""} componentRef={setContent} />
                </div>
                <div className={styles.clearBoth}></div>
            </Box>
        </ReactModal>
    )
};

/*FeedbackForm.propTypes = {
    onFeedbackGiven: PropTypes.func.isRequired
};*/

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
    onClose: () => {
        dispatch(closePuzzleHelp());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HelpModal);