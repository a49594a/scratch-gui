import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import MediaQuery from 'react-responsive';
import tabStyles from 'react-tabs/style/react-tabs.css';
import VM from 'scratch-vm';
import Renderer from 'scratch-render';

import Blocks from '../../containers/puzzle-blocks.jsx';
//by yj
//import CostumeTab from '../../containers/costume-tab.jsx';
//import TargetPane from '../../containers/target-pane.jsx';
//import SoundTab from '../../containers/sound-tab.jsx';
import PuzzlePane from '../../containers/puzzle-pane.jsx';

import StageHeader from '../../containers/puzzle-stage-header.jsx';
import Stage from '../../containers/stage.jsx';
import Loader from '../loader/loader.jsx';
import Box from '../box/box.jsx';
import MenuBar from '../puzzle-menu-bar/menu-bar.jsx';
import PreviewModal from '../../containers/preview-modal.jsx';
import ImportModal from '../../containers/import-modal.jsx';
import WebGlModal from '../../containers/webgl-modal.jsx';
//by yj
import PuzzleLoadingModal from '../puzzle-loading-modal/loading-modal.jsx';
import PuzzleResolvedModal from '../../containers/puzzle-resolved-modal.jsx';

import layout from '../../lib/layout-constants.js';
import styles from './gui.css';
import addExtensionIcon from './icon--extensions.svg';
//by yj
//import codeIcon from './icon--code.svg';
//import costumesIcon from './icon--costumes.svg';
//import soundsIcon from './icon--sounds.svg';

const messages = defineMessages({
    addExtension: {
        id: 'gui.gui.addExtension',
        description: 'Button to add an extension in the target pane',
        defaultMessage: 'Add Extension'
    }
});

// Cache this value to only retreive it once the first time.
// Assume that it doesn't change for a session.
let isRendererSupported = null;

const GUIComponent = props => {
    const {
        activeTabIndex,
        basePath,
        blocksTabVisible,
        children,
        costumesTabVisible,
        feedbackFormVisible,
        importInfoVisible,
        intl,
        loading,
        onExtensionButtonClick,
        //by yj
        //onActivateCostumesTab,
        //onActivateSoundsTab,

        onActivateTab,
        previewInfoVisible,
        soundsTabVisible,
        vm,
        //by yj
        puzzleData,
        puzzleLoadingVisible,
        puzzleResolvedVisible,
        ...componentProps
    } = props;
    if (children) {
        return (
            <Box {...componentProps}>
                {children}
            </Box>
        );
    }

    //by yj
    /*const tabClassNames = {
        tabs: styles.tabs,
        tab: classNames(tabStyles.reactTabsTab, styles.tab),
        tabList: classNames(tabStyles.reactTabsTabList, styles.tabList),
        tabPanel: classNames(tabStyles.reactTabsTabPanel, styles.tabPanel),
        tabPanelSelected: classNames(tabStyles.reactTabsTabPanelSelected, styles.isSelected),
        tabSelected: classNames(tabStyles.reactTabsTabSelected, styles.isSelected)
    };*/

    if (isRendererSupported === null) {
        isRendererSupported = Renderer.isSupported();
    }

    return (
        <Box
            className={styles.pageWrapper}
        >
            {previewInfoVisible ? (
                <PreviewModal />
            ) : null}
            {loading ? (
                <Loader />
            ) : null}
            {importInfoVisible ? (
                <ImportModal />
            ) : null}
            {isRendererSupported ? null : (
                <WebGlModal />
            )}
            {puzzleResolvedVisible ? (
                <PuzzleResolvedModal puzzleData={puzzleData} />
            ) : null}
            <MenuBar puzzleData={puzzleData} />
            <Box className={styles.bodyWrapper}>
                <Box className={styles.flexWrapper}>
                    <Box className={styles.stageAndTargetWrapper}>
                        <Box className={styles.stageWrapper}>
                            {/* eslint-disable arrow-body-style */}
                            <MediaQuery minWidth={layout.fullSizeMinWidth}>{isFullSize => {
                                return isRendererSupported ? (
                                    <Stage
                                        height={isFullSize ? layout.fullStageHeight : layout.smallerStageHeight}
                                        shrink={0}
                                        vm={vm}
                                        width={isFullSize ? layout.fullStageWidth : layout.smallerStageWidth}
                                    />
                                ) : null;
                            }}</MediaQuery>
                            {/* eslint-enable arrow-body-style */}
                        </Box>
                        <Box className={styles.stageMenuWrapper}>
                            <StageHeader vm={vm} />
                        </Box>
                        <Box className={styles.targetWrapper}>
                            <PuzzlePane vm={vm} puzzleData={puzzleData} />
                        </Box>
                    </Box>
                    <Box className={styles.editorWrapper}>
                        <Box className={styles.blocksWrapper}>
                            <Blocks
                                grow={1}
                                isVisible={blocksTabVisible}
                                options={{
                                    media: `${basePath}static/blocks-media/`
                                }}
                                vm={vm}
                                puzzleData={puzzleData}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
GUIComponent.propTypes = {
    activeTabIndex: PropTypes.number,
    basePath: PropTypes.string,
    blocksTabVisible: PropTypes.bool,
    children: PropTypes.node,
    costumesTabVisible: PropTypes.bool,
    importInfoVisible: PropTypes.bool,
    intl: intlShape.isRequired,
    loading: PropTypes.bool,
    //by yj
    //onActivateCostumesTab: PropTypes.func,
    //onActivateSoundsTab: PropTypes.func,
    onActivateTab: PropTypes.func,
    onExtensionButtonClick: PropTypes.func,
    onTabSelect: PropTypes.func,
    previewInfoVisible: PropTypes.bool,
    soundsTabVisible: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired,
};
GUIComponent.defaultProps = {
    //by yj 修改此处调整资源路径（blockly中的图片和声音）
    basePath: '/Content/ide5/scratch-puzzle/build/'
};
export default injectIntl(GUIComponent);
