import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import ReactModal from 'react-modal';

import Box from '../box/box.jsx';

import { closePuzzleLoading } from '../../reducers/modals';

import styles from './loading-modal.css';

const LoadingModal = props => (
    <ReactModal
        isOpen
        className={styles.modalContent}
        overlayClassName={styles.modalOverlay}
        onRequestClose={props.onClose}
        shouldCloseOnOverlayClick={false}
    >
        <Box className={styles.body}>
            正在加载...
        </Box>
    </ReactModal>
);

/*FeedbackForm.propTypes = {
    onFeedbackGiven: PropTypes.func.isRequired
};*/

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
    onClose: () => {
        dispatch(closePuzzleLoading());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoadingModal);