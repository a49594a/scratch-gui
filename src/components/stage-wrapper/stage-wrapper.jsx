import PropTypes from 'prop-types';
import React from 'react';
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
        <Box className={styles.stageWrapper}>
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
        </Box>
    );
};

StageWrapperComponent.propTypes = {
    isRendererSupported: PropTypes.bool.isRequired,
    isRtl: PropTypes.bool,
    loading: PropTypes.bool,
    stageSize: PropTypes.oneOf(Object.keys(STAGE_DISPLAY_SIZES)).isRequired,
    vm: PropTypes.instanceOf(VM).isRequired
};

export default StageWrapperComponent;
