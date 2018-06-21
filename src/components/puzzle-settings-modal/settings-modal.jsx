import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import Box from '../box/box.jsx';
import Modal from '../modal/modal.jsx';

import { closePuzzleSettings } from '../../reducers/modals';

import styles from './settings-modal.css';

const SettingsModal = function (props) {
    const {
        vm,
        puzzleData,
        defaultSprite,
        maxBlockCount,
        templateProjectId,
        ...componentProps
    } = props;
    return (
        <Modal
            className={styles.modalContent}
            contentLabel="谜题设置"
            onRequestClose={props.onCancel}
        >
            <Box className={styles.body}>
                <Box className={styles.label}>
                    默认角色名称
                </Box>
                <Box>
                    <input
                        autoFocus
                        className={styles.input}
                        name="defaultSprite"
                        onChange={props.onChange}
                        onKeyPress={props.onKeyPress}
                        value={defaultSprite}
                    />
                </Box>
                <Box className={styles.label}>
                    指令块数量限制
                </Box>
                <Box>
                    <input
                        className={styles.input}
                        name="maxBlockCount"
                        onChange={props.onChange}
                        onKeyPress={props.onKeyPress}
                        value={maxBlockCount}
                    />
                </Box>
                <Box className={styles.label}>
                    模板ID
                </Box>
                <Box>
                    <input
                        className={styles.input}
                        name="templateProjectId"
                        onChange={props.onChange}
                        onKeyPress={props.onKeyPress}
                        value={templateProjectId}
                    />
                </Box>
                <Box className={styles.buttonRow}>
                    <button
                        className={styles.okButton}
                        onClick={props.onOK}>确定</button>
                    <button
                        className={styles.noButton}
                        onClick={props.onCancel}>取消</button>
                </Box>
            </Box>
        </Modal>
    )
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
    onClose: () => {
        dispatch(closePuzzleSettings());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SettingsModal);