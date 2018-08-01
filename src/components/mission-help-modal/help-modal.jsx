import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import Modal from '../modal/modal.jsx';
import Box from '../box/box.jsx';

import { closeMissionHelp } from '../../reducers/modals';

import styles from './help-modal.css';
import iconAnswer from './icon--answer.svg';
import iconHintLocked from './icon--hint-locked.svg';
import iconHintUnlocked from './icon--hint-unlocked.svg';

const HelpModal = function (props) {
    const {
        vm,
        mission,
        forType,
        forOrder,
        sidebarVisible,
        setContent,
        ...componentProps
    } = props;
    let helps = mission.helps || [];
    let help = helps.length > 0 ? helps[forOrder - 1] : null;
    Blockey.ccVerificationCode = "Mission," + mission.id + "," + Blockey.INIT_DATA.logedInUser.id;
    return (
        <Modal
            className={styles.modalContent}
            contentLabel={"教程"}
            onRequestClose={props.onClose}
        >
            <Box className={styles.body}>
                {sidebarVisible && helps.length > 1 ? (
                    <div className={styles.sidebar}>
                        <ul className={styles.nav}>
                            {helps.map(help => (
                                <li
                                    className={help.forOrder == forOrder ? styles.active : ""}
                                    key={help.forOrder}
                                    data-order={help.forOrder}
                                    onClick={props.onSelect}
                                >
                                    <span className={styles.titlePrefix}>
                                        {help.forType == 'Mission.Course' ? (
                                            <span>{help.forOrder + '．'}</span>
                                        ) : null}
                                        {help.forType == 'Mission.Hint' ? (
                                            <img className={styles.helpIcon} src={help.unlocked ? iconHintUnlocked : iconHintLocked} />
                                        ) : null}
                                        {help.forType == 'Mission.Answer' ? (
                                            <img className={styles.helpIcon} src={iconAnswer} />
                                        ) : null}
                                    </span>
                                    <span className={styles.title}>{help.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : null}
                {help ? (
                    <div className={sidebarVisible ? styles.contentWithSidebar : styles.content}>
                        <Box className={help.contentType == 'xml/scratch' ? styles.answerBlocks : ""} componentRef={setContent} />
                    </div>
                ) : null}
                <div className={styles.clearBoth}></div>
            </Box>
        </Modal>
    )
};

/*FeedbackForm.propTypes = {
    onFeedbackGiven: PropTypes.func.isRequired
};*/

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
    onClose: () => {
        dispatch(closeMissionHelp());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HelpModal);