import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import VM from 'scratch-vm';

import Box from '../box/box.jsx';
import { STAGE_DISPLAY_SIZES } from '../../lib/layout-constants.js';
import StageHeader from '../../containers/stage-header.jsx';
import Stage from '../../containers/stage.jsx';
import Loader from '../loader/loader.jsx';

import styles from './stage-wrapper.css';

const StageWrapperComponent = function (props) {
    const {
        //by yj
        isPhone,

        isFullScreen,
        isRtl,
        isRendererSupported,
        loading,
        stageSize,
        vm
    } = props;

    //by yj
    //let isPhone = isPhone;// Blockey.GUI_CONFIG&&Blockey.GUI_CONFIG.IS_MOBILE;
    let isPuzzle = Blockey.GUI_CONFIG.MODE=='Puzzle';

    return (
        <Box
            className={classNames(
                styles.stageWrapper,
                {[styles.fullScreen]: isFullScreen}
            )}
            dir={isRtl ? 'rtl' : 'ltr'}
        >
            {isPuzzle || isPhone ? null : (
                <Box className={styles.stageMenuWrapper}>
                    <StageHeader
                        stageSize={stageSize}
                        vm={vm}
                    />
                </Box>
            )}
            <Box className={isPhone?styles.stageCanvasWrapperMobile:styles.stageCanvasWrapper}>
                {
                    isRendererSupported ?
                        <Stage
                            stageSize={stageSize}
                            vm={vm}
                        /> :
                        null
                }
            </Box>
            {isPuzzle ? (
                <Box className={styles.stageMenuWrapper}>
                    <StageHeader
                        stageSize={stageSize}
                        vm={vm}
                        puzzleData={props.puzzleData}
                    />
                </Box>
            ) : (isPhone ? (
                <Box className={styles.stageMenuWrapper}>
                    <StageHeader
                        stageSize={stageSize}
                        vm={vm}
                    />
                </Box>
            ) : null)}
            {loading ? (
                <Loader isFullScreen={isFullScreen} />
            ) : null}
        </Box>
    );
};

StageWrapperComponent.propTypes = {
    isFullScreen: PropTypes.bool,
    isRendererSupported: PropTypes.bool.isRequired,
    isRtl: PropTypes.bool.isRequired,
    loading: PropTypes.bool,
    stageSize: PropTypes.oneOf(Object.keys(STAGE_DISPLAY_SIZES)).isRequired,
    vm: PropTypes.instanceOf(VM).isRequired
};

export default StageWrapperComponent;
