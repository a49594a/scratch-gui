import PropTypes from 'prop-types';
import React from 'react';
import ReactModal from 'react-modal';

import Box from '../box/box.jsx';

import styles from './resolved-modal.css';

const ResolvedModal = props => (
    <ReactModal
        isOpen
        className={styles.modalContent}
        overlayClassName={styles.modalOverlay}
        onRequestClose={props.onClose}
        shouldCloseOnOverlayClick={true}
    >
        <Box className={styles.body}>
            <h1 className={styles.title}>任务完成</h1>
            <ul className={styles.rewards}>
                {props.puzzleData.rewards
                    .map(reward => (
                        <li key={Math.random()}>
                            <img src={reward.thumbUrl} />
                            ×{reward.count}
                        </li>
                    ))
                }
            </ul>
            <Box className={styles.buttonRow}>
                <button
                    className={styles.okButton}
                    onClick={props.onOK}
                >
                    确定
                </button>
                <button
                    className={styles.noButton}
                    onClick={props.onCancel}
                >
                    取消
                </button>
            </Box>
        </Box>
    </ReactModal>
);

export default ResolvedModal;