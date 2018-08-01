import classNames from 'classnames';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import VM from 'scratch-vm';

import Box from '../box/box.jsx';
import Button from '../button/button.jsx';
import Controls from '../../containers/puzzle-controls.jsx';
import { getStageDimensions } from '../../lib/screen-utils';
import { STAGE_SIZE_MODES } from '../../lib/layout-constants';

import fullScreenIcon from './icon--fullscreen.svg';
import largeStageIcon from './icon--large-stage.svg';
import smallStageIcon from './icon--small-stage.svg';
import unFullScreenIcon from './icon--unfullscreen.svg';

import styles from './stage-header.css';

const messages = defineMessages({
    largeStageSizeMessage: {
        defaultMessage: 'Switch to large stage',
        description: 'Button to change stage size to large',
        id: 'gui.stageHeader.stageSizeLarge'
    },
    smallStageSizeMessage: {
        defaultMessage: 'Switch to small stage',
        description: 'Button to change stage size to small',
        id: 'gui.stageHeader.stageSizeSmall'
    },
    fullStageSizeMessage: {
        defaultMessage: 'Enter full screen mode',
        description: 'Button to change stage size to full screen',
        id: 'gui.stageHeader.stageSizeFull'
    },
    unFullStageSizeMessage: {
        defaultMessage: 'Exit full screen mode',
        description: 'Button to get out of full screen mode',
        id: 'gui.stageHeader.stageSizeUnFull'
    },
    fullscreenControl: {
        defaultMessage: 'Full Screen Control',
        description: 'Button to enter/exit full screen mode',
        id: 'gui.stageHeader.fullscreenControl'
    }
});

const StageHeaderComponent = function (props) {
    const {
        isFullScreen,
        isPlayerOnly,
        onKeyPress,
        onSetStageLarge,
        onSetStageSmall,
        onSetStageFull,
        onSetStageUnFull,
        stageSizeMode,
        setSlider,
        vm,
        puzzleData
    } = props;

    let puzzle = vm.runtime.puzzle || {
        blockCount: 0,
        maxBlockCount: puzzleData.maxBlockCount,
    };
    let blockError = puzzle.maxBlockCount > 0 && puzzle.blockCount > puzzle.maxBlockCount;

    let header = null;

    if (isFullScreen) {
        const stageDimensions = getStageDimensions(null, true);
        header = (
            <Box className={styles.stageHeaderWrapperOverlay}>
                <Box
                    className={styles.stageMenuWrapper}
                    style={{ width: stageDimensions.width }}
                >
                    <Button
                        className={styles.stageButton}
                        onClick={onSetStageUnFull}
                        onKeyPress={onKeyPress}
                    >
                        <img
                            alt={props.intl.formatMessage(messages.unFullStageSizeMessage)}
                            className={styles.stageButtonIcon}
                            draggable={false}
                            src={unFullScreenIcon}
                            title={props.intl.formatMessage(messages.fullscreenControl)}
                        />
                    </Button>
                    <Controls vm={vm} />
                </Box>
            </Box>
        );
    } else {
        header = (
            <Box className={styles.stageHeaderWrapper}>
                <Box className={styles.stageMenuWrapper}>
                    <div className={styles.stageSizeRow}>
                        <div>
                            <Button
                                className={styles.stageButton}
                                onClick={onSetStageFull}
                            >
                                <img
                                    alt={props.intl.formatMessage(messages.fullStageSizeMessage)}
                                    className={styles.stageButtonIcon}
                                    draggable={false}
                                    src={fullScreenIcon}
                                    title={props.intl.formatMessage(messages.fullscreenControl)}
                                />
                            </Button>
                        </div>
                    </div>
                    <Box className={styles.slider} componentRef={setSlider}>
                        <svg className={"slider-svg"} xmlns="http://www.w3.org/2000/svg" width="150" height="32">
                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                                <clipPath id="slowClipPath">
                                    <rect width="26" height="12" x="5" y="14" /></clipPath>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                                <clipPath id="fastClipPath">
                                    <rect width="26" height="16" x="120" y="10" />
                                </clipPath>
                            </svg>
                        </svg>
                    </Box>
                    <div className={classNames(styles.blockCount, blockError ? styles.error : "")}>
                        <span>{puzzle.blockCount + "/" + (puzzle.maxBlockCount > 0 ? puzzle.maxBlockCount : "∞")}</span>
                    </div>
                    <Controls vm={vm} />
                </Box>
            </Box>
        );
    }

    return header;
};

const mapStateToProps = state => ({
    // This is the button's mode, as opposed to the actual current state
    stageSizeMode: state.scratchGui.stageSize.stageSize
});

StageHeaderComponent.propTypes = {
    intl: intlShape,
    isFullScreen: PropTypes.bool.isRequired,
    isPlayerOnly: PropTypes.bool.isRequired,
    onKeyPress: PropTypes.func.isRequired,
    onSetStageFull: PropTypes.func.isRequired,
    onSetStageLarge: PropTypes.func.isRequired,
    onSetStageSmall: PropTypes.func.isRequired,
    onSetStageUnFull: PropTypes.func.isRequired,
    stageSizeMode: PropTypes.oneOf(Object.keys(STAGE_SIZE_MODES)),
    vm: PropTypes.instanceOf(VM).isRequired
};

StageHeaderComponent.defaultProps = {
    stageSizeMode: STAGE_SIZE_MODES.large
};

export default injectIntl(connect(
    mapStateToProps
)(StageHeaderComponent));
