import classNames from 'classnames';
import omit from 'lodash.omit';
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import tabStyles from 'react-tabs/style/react-tabs.css';
import VM from 'scratch-vm';
import Renderer from 'scratch-render';

import Blocks from '../../containers/puzzle-blocks.jsx';
import CostumeTab from '../../containers/costume-tab.jsx';
//import TargetPane from '../../containers/target-pane.jsx';
import SoundTab from '../../containers/sound-tab.jsx';
//import StageWrapper from '../../containers/stage-wrapper.jsx';
import Loader from '../loader/loader.jsx';
import Box from '../box/box.jsx';
import MenuBar from '../menu-bar/menu-bar.jsx';
import CostumeLibrary from '../../containers/costume-library.jsx';
import BackdropLibrary from '../../containers/backdrop-library.jsx';

//by yj
import PuzzlePane from '../../containers/puzzle-pane.jsx';
import StageWrapper from '../../containers/puzzle-stage-wrapper.jsx';

import Backpack from '../../containers/backpack.jsx';
import PreviewModal from '../../containers/preview-modal.jsx';
import ImportModal from '../../containers/import-modal.jsx';
import WebGlModal from '../../containers/webgl-modal.jsx';
import TipsLibrary from '../../containers/tips-library.jsx';
import Cards from '../../containers/cards.jsx';
import DragLayer from '../../containers/drag-layer.jsx';

//by yj
//import StageHeader from '../../containers/puzzle-stage-header.jsx';
//import Stage from '../../containers/stage.jsx';
import PuzzleLoadingModal from '../puzzle-loading-modal/loading-modal.jsx';
import PuzzleResolvedModal from '../../containers/puzzle-resolved-modal.jsx';

import layout, { STAGE_SIZE_MODES } from '../../lib/layout-constants';
import { resolveStageSize } from '../../lib/screen-utils';

import styles from './gui.css';
import addExtensionIcon from './icon--extensions.svg';
import codeIcon from './icon--code.svg';
import costumesIcon from './icon--costumes.svg';
import soundsIcon from './icon--sounds.svg';

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
        //by yj
        puzzleData,
        puzzleLoadingVisible,
        puzzleResolvedVisible,
        onOpenPuzzleResolved,

        activeTabIndex,
        basePath,
        backdropLibraryVisible,
        backpackOptions,
        blocksTabVisible,
        cardsVisible,
        children,
        costumeLibraryVisible,
        costumesTabVisible,
        enableCommunity,
        importInfoVisible,
        intl,
        isPlayerOnly,
        loading,
        onExtensionButtonClick,
        onActivateCostumesTab,
        onActivateSoundsTab,
        onActivateTab,
        onRequestCloseBackdropLibrary,
        onRequestCloseCostumeLibrary,
        previewInfoVisible,
        targetIsStage,
        soundsTabVisible,
        stageSizeMode,
        tipsLibraryVisible,
        vm,
        ...componentProps
    } = omit(props, 'dispatch');
    if (children) {
        return <Box {...componentProps}>{children}</Box>;
    }

    const tabClassNames = {
        tabs: styles.tabs,
        tab: classNames(tabStyles.reactTabsTab, styles.tab),
        tabList: classNames(tabStyles.reactTabsTabList, styles.tabList),
        tabPanel: classNames(tabStyles.reactTabsTabPanel, styles.tabPanel),
        tabPanelSelected: classNames(tabStyles.reactTabsTabPanelSelected, styles.isSelected),
        tabSelected: classNames(tabStyles.reactTabsTabSelected, styles.isSelected)
    };

    if (isRendererSupported === null) {
        isRendererSupported = Renderer.isSupported();
    }

    return (<MediaQuery minWidth={layout.fullSizeMinWidth}>{isFullSize => {
        const stageSize = resolveStageSize(stageSizeMode, isFullSize);

        return (
            <Box
                className={styles.pageWrapper}
                {...componentProps}
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
                {tipsLibraryVisible ? (
                    <TipsLibrary />
                ) : null}
                {cardsVisible ? (
                    <Cards />
                ) : null}
                {costumeLibraryVisible ? (
                    <CostumeLibrary
                        vm={vm}
                        onRequestClose={onRequestCloseCostumeLibrary}
                    />
                ) : null}
                {backdropLibraryVisible ? (
                    <BackdropLibrary
                        vm={vm}
                        onRequestClose={onRequestCloseBackdropLibrary}
                    />
                ) : null}
                {puzzleResolvedVisible ? (
                    <PuzzleResolvedModal puzzleData={puzzleData} />
                ) : null}
                <MenuBar puzzleData={puzzleData} />
                <Box className={styles.bodyWrapper}>
                    <Box className={styles.flexWrapper}>
                        <Box className={classNames(styles.stageAndTargetWrapper, styles[stageSize])}>
                            <StageWrapper
                                isRendererSupported={isRendererSupported}
                                stageSize={stageSize}
                                vm={vm}
                                puzzleData={puzzleData}
                            />
                            <Box className={styles.targetWrapper}>
                                <PuzzlePane
                                    stageSize={stageSize}
                                    vm={vm}
                                    puzzleData={puzzleData}
                                />
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
                                    stageSize={stageSize}
                                    vm={vm}
                                    puzzleData={puzzleData}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <DragLayer />
            </Box>
        );
    }}</MediaQuery>);
};
GUIComponent.propTypes = {
    //by yj
    onOpenPuzzleResolved: PropTypes.func,
    
    activeTabIndex: PropTypes.number,
    backdropLibraryVisible: PropTypes.bool,
    backpackOptions: PropTypes.shape({
        host: PropTypes.string,
        visible: PropTypes.bool
    }),
    basePath: PropTypes.string,
    blocksTabVisible: PropTypes.bool,
    cardsVisible: PropTypes.bool,
    children: PropTypes.node,
    costumeLibraryVisible: PropTypes.bool,
    costumesTabVisible: PropTypes.bool,
    enableCommunity: PropTypes.bool,
    importInfoVisible: PropTypes.bool,
    intl: intlShape.isRequired,
    isPlayerOnly: PropTypes.bool,
    loading: PropTypes.bool,
    onActivateCostumesTab: PropTypes.func,
    onActivateSoundsTab: PropTypes.func,
    onActivateTab: PropTypes.func,
    onExtensionButtonClick: PropTypes.func,
    onRequestCloseBackdropLibrary: PropTypes.func,
    onRequestCloseCostumeLibrary: PropTypes.func,
    onTabSelect: PropTypes.func,
    previewInfoVisible: PropTypes.bool,
    soundsTabVisible: PropTypes.bool,
    stageSizeMode: PropTypes.oneOf(Object.keys(STAGE_SIZE_MODES)),
    targetIsStage: PropTypes.bool,
    tipsLibraryVisible: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired
};
GUIComponent.defaultProps = {
    backpackOptions: {
        host: null,
        visible: false
    },
    //by yj 修改此处调整资源路径（blockly中的图片和声音）
    basePath: '/Content/gui/',

    stageSizeMode: STAGE_SIZE_MODES.large
};

const mapStateToProps = state => ({
    // This is the button's mode, as opposed to the actual current state
    stageSizeMode: state.scratchGui.stageSize.stageSize
});

export default injectIntl(connect(
    mapStateToProps
)(GUIComponent));
