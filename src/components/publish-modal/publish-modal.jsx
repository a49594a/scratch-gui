import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Box from '../box/box.jsx';
import Modal from '../modal/modal.jsx';

import styles from './publish-modal.css';

const PublishModalComponent = props => (
    <Modal
        className={styles.modalContent}
        contentLabel={"发布(v" + (props.version + 1) + ")"}
        onRequestClose={props.onCancel}
    >
        <Box className={styles.body}>
            <Box>
                <input
                    autoFocus
                    className={styles.textInput}
                    placeholder="说明(必填)"
                    name="summary"
                    onChange={props.onChange}
                    onKeyPress={props.onKeyPress}
                    value={props.summary}
                />
            </Box>
            <Box className={styles.label}>
                <label>
                    <input
                        type="checkbox"
                        name="updateThumb"
                        onChange={props.onChange}
                        checked={props.updateThumb}
                    />
                    更新缩略图
                </label>
            </Box>
            <Box>
                <img src={props.thumbDataUrl} className={styles.thumbImage} />
            </Box>
            <Box className={styles.buttonRow}>
                <button
                    className={styles.cancelButton}
                    onClick={props.onCancel}
                >
                    <FormattedMessage
                        defaultMessage="Cancel"
                        description="Button in prompt for cancelling the dialog"
                        id="gui.prompt.cancel"
                    />
                </button>
                <button
                    className={styles.okButton}
                    onClick={props.onOk}
                >
                    <FormattedMessage
                        defaultMessage="OK"
                        description="Button in prompt for confirming the dialog"
                        id="gui.prompt.ok"
                    />
                </button>
            </Box>
        </Box>
    </Modal>
);

PublishModalComponent.propTypes = {
    onCancel: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onKeyPress: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired
};

export default PublishModalComponent;
