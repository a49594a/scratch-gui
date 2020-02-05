import classNames from 'classnames';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {defineMessages, FormattedMessage, injectIntl, intlShape} from 'react-intl';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';
import bowser from 'bowser';
import React from 'react';

import VM from 'scratch-vm';

import Box from '../box/box.jsx';
import Button from '../button/button.jsx';
import CommunityButton from './community-button.jsx';
import ShareButton from './share-button.jsx';
import { ComingSoonTooltip } from '../coming-soon/coming-soon.jsx';
import Divider from '../divider/divider.jsx';
import LanguageSelector from '../../containers/language-selector.jsx';
import SaveStatus from './save-status.jsx';
import SBFileUploader from '../../containers/sb-file-uploader.jsx';
import ProjectWatcher from '../../containers/project-watcher.jsx';
import MenuBarMenu from './menu-bar-menu.jsx';
import { MenuItem, MenuSection } from '../menu/menu.jsx';
import ProjectTitleInput from './project-title-input.jsx';
import AuthorInfo from './author-info.jsx';
import AccountNav from '../../containers/account-nav.jsx';
import LoginDropdown from './login-dropdown.jsx';
import SB3Downloader from '../../containers/sb3-downloader.jsx';
import DeletionRestorer from '../../containers/deletion-restorer.jsx';
import TurboMode from '../../containers/turbo-mode.jsx';
import MenuBarHOC from '../../containers/menu-bar-hoc.jsx';

//by yj
import MissionSelector from '../puzzle-mission-selector/mission-selector.jsx';
import aerfayingLogo from './aerfaying-logo.svg';
import ScratchBlocks from 'scratch-blocks';

import { openTipsLibrary } from '../../reducers/modals';
import { setPlayer } from '../../reducers/mode';
import {
    autoUpdateProject,
    getIsUpdating,
    getIsShowingProject,
    manualUpdateProject,
    requestNewProject,
    remixProject,
    saveProjectAsCopy
} from '../../reducers/project-state';
import {
    openAccountMenu,
    closeAccountMenu,
    accountMenuOpen,
    openFileMenu,
    closeFileMenu,
    fileMenuOpen,
    openEditMenu,
    closeEditMenu,
    editMenuOpen,
    openLanguageMenu,
    closeLanguageMenu,
    languageMenuOpen,
    openLoginMenu,
    closeLoginMenu,
    loginMenuOpen
} from '../../reducers/menus';

import collectMetadata from '../../lib/collect-metadata';

import styles from './menu-bar.css';

import helpIcon from '../../lib/assets/icon--tutorials.svg';
import mystuffIcon from './icon--mystuff.png';
import profileIcon from './icon--profile.png';
import remixIcon from './icon--remix.svg';
import dropdownCaret from './dropdown-caret.svg';
import languageIcon from '../language-selector/language-icon.svg';

import scratchLogo from './scratch-logo.svg';

import sharedMessages from '../../lib/shared-messages';

const ariaMessages = defineMessages({
    language: {
        id: 'gui.menuBar.LanguageSelector',
        defaultMessage: 'language selector',
        description: 'accessibility text for the language selection menu'
    },
    tutorials: {
        id: 'gui.menuBar.tutorialsLibrary',
        defaultMessage: 'Tutorials',
        description: 'accessibility text for the tutorials button'
    }
});

const MenuBarItemTooltip = ({
    children,
    className,
    enable,
    id,
    place = 'bottom'
}) => {
    if (enable) {
        return (
            <React.Fragment>
                {children}
            </React.Fragment>
        );
    }
    return (
        <ComingSoonTooltip
            className={classNames(styles.comingSoon, className)}
            place={place}
            tooltipClassName={styles.comingSoonTooltip}
            tooltipId={id}
        >
            {children}
        </ComingSoonTooltip>
    );
};


MenuBarItemTooltip.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    enable: PropTypes.bool,
    id: PropTypes.string,
    place: PropTypes.oneOf(['top', 'bottom', 'left', 'right'])
};

const MenuItemTooltip = ({ id, isRtl, children, className }) => (
    <ComingSoonTooltip
        className={classNames(styles.comingSoon, className)}
        isRtl={isRtl}
        place={isRtl ? 'left' : 'right'}
        tooltipClassName={styles.comingSoonTooltip}
        tooltipId={id}
    >
        {children}
    </ComingSoonTooltip>
);

MenuItemTooltip.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    id: PropTypes.string,
    isRtl: PropTypes.bool
};

class MenuBar extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            //by yj
            'loadMission',
            'handleOpenTutorials',
            'importFromMainWorkspace',
            'exportToMainWorkspace',

            'handleClickNew',
            'handleClickRemix',
            'handleClickSave',
            'handleClickSaveAsCopy',
            'handleClickSeeCommunity',
            'handleClickShare',
            'handleKeyPress',
            'handleLanguageMouseUp',
            'handleRestoreOption',
            'getSaveToComputerHandler',
            'restoreOptionMessage'
        ]);
    }
    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyPress);
        //by yj
        this.props.vm.addListener('PUZZLE_LOADED', this.loadMission);
        if (Blockey.GUI_CONFIG.MODE != 'Puzzle') this.loadMission();
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyPress);
        //by yj
        this.props.vm.removeListener('PUZZLE_LOADED', this.loadMission);
    }
    loadMission() {
        var extUtils = this.props.extUtils;
        if (Blockey.GUI_CONFIG.MODE == 'Puzzle') {
            let missionId = location.hash.substr(1);
            if (!(Blockey.INIT_DATA.mission && Blockey.INIT_DATA.mission.id == missionId)) {
                Blockey.INIT_DATA.mission = {
                    id: location.hash.substr(1)
                };
            }
        }

        var { puzzleData } = this.props;
        if (puzzleData && puzzleData.mode == 1 && puzzleData.levelMission.autoShowTutorial) {
            this.handleOpenTutorials();
        }
    }
    importFromMainWorkspace() {
        var xmlString = '<xml xmlns="http://www.w3.org/1999/xhtml">' + '<variables>';
        //${variables.map(v => v.toXML()).join()}
        xmlString += '</variables>' + this.props.vm.editingTarget.blocks.toXML(null, false) + '</xml>';
        return xmlString;
    }
    exportToMainWorkspace(content) {
        var dom = ScratchBlocks.Xml.textToDom(content);
        /*workspace.scrollX -= 240;
        workspace.scrollY += 20;*/
        ScratchBlocks.Xml.clearWorkspaceAndLoadFromXml(dom, this.props.vm._workspaceForPuzzle);
        //ScratchBlocks.Xml.domToWorkspace(dom, ScratchBlocks.mainWorkspace);
    }
    handleOpenTutorials() {
        var { extUtils, puzzleData } = this.props;
        var context = extUtils.getContext();
        var mission = Blockey.INIT_DATA.mission;
        if (puzzleData) mission = puzzleData.levelMission;
        if (mission) {
            extUtils.openMissionHelpsModal({
                ScratchBlocks: ScratchBlocks,
                mission: mission,
                importFromMainWorkspace: this.importFromMainWorkspace,
                exportToMainWorkspace: this.exportToMainWorkspace
            });
        }
        else {
            this.props.onOpenTipLibrary();
        }
    }
    handleClickNew () {
        // if the project is dirty, and user owns the project, we will autosave.
        // but if they are not logged in and can't save, user should consider
        // downloading or logging in first.
        // Note that if user is logged in and editing someone else's project,
        // they'll lose their work.
        const readyToReplaceProject = this.props.confirmReadyToReplaceProject(
            this.props.intl.formatMessage(sharedMessages.replaceProjectWarning)
        );
        this.props.onRequestCloseFile();
        if (readyToReplaceProject) {
            this.props.onClickNew(this.props.canSave && this.props.canCreateNew);
        }
        this.props.onRequestCloseFile();
    }
    handleClickRemix() {
        if (window.confirm("你确定要改编该作品吗？")) {
            this.props.onClickRemix();
            this.props.onRequestCloseFile();
        }
    }
    handleClickSave() {
        this.props.onClickSave();
        this.props.onRequestCloseFile();
    }
    handleClickSaveAsCopy() {
        this.props.onClickSaveAsCopy();
        this.props.onRequestCloseFile();
    }
    handleClickSeeCommunity (waitForUpdate) {
        if (this.props.shouldSaveBeforeTransition() && this.props.enableAutoSave/*by yj*/) {
            this.props.autoUpdateProject(); // save before transitioning to project page
            waitForUpdate(true); // queue the transition to project page
        } else {
            waitForUpdate(false); // immediately transition to project page
        }
    }
    handleClickShare(waitForUpdate) {
        /*if (this.props.canShare) { // save before transitioning to project page
            this.props.onShare();
        }*/
        if (this.props.canSave) { // save before transitioning to project page
            this.props.autoUpdateProject();
            waitForUpdate(true); // queue the transition to project page
        } else {
            waitForUpdate(false); // immediately transition to project page
        }
    }
    handleRestoreOption(restoreFun) {
        return () => {
            restoreFun();
            this.props.onRequestCloseEdit();
        };
    }
    handleKeyPress(event) {
        //by yj
        if (!this.props.canSaveToLocal) return;

        const modifier = bowser.mac ? event.metaKey : event.ctrlKey;
        if (modifier && event.key === 's') {
            this.props.onClickSave();
            event.preventDefault();
        }
    }
    getSaveToComputerHandler (downloadProjectCallback) {
        return () => {
            this.props.onRequestCloseFile();
            downloadProjectCallback();
            if (this.props.onProjectTelemetryEvent) {
                const metadata = collectMetadata(this.props.vm, this.props.projectTitle, this.props.locale);
                this.props.onProjectTelemetryEvent('projectDidSave', metadata);
            }
        };
    }
    handleLanguageMouseUp(e) {
        if (!this.props.languageMenuOpen) {
            this.props.onClickLanguage(e);
        }
    }
    restoreOptionMessage(deletedItem) {
        switch (deletedItem) {
            case 'Sprite':
                return (<FormattedMessage
                    defaultMessage="Restore Sprite"
                    description="Menu bar item for restoring the last deleted sprite."
                    id="gui.menuBar.restoreSprite"
                />);
            case 'Sound':
                return (<FormattedMessage
                    defaultMessage="Restore Sound"
                    description="Menu bar item for restoring the last deleted sound."
                    id="gui.menuBar.restoreSound"
                />);
            case 'Costume':
                return (<FormattedMessage
                    defaultMessage="Restore Costume"
                    description="Menu bar item for restoring the last deleted costume."
                    id="gui.menuBar.restoreCostume"
                />);
            default: {
                return (<FormattedMessage
                    defaultMessage="Restore"
                    description="Menu bar item for restoring the last deleted item in its disabled state." /* eslint-disable-line max-len */
                    id="gui.menuBar.restore"
                />);
            }
        }
    }
    render() {
        const saveNowMessage = (
            <FormattedMessage
                defaultMessage="Save now"
                description="Menu bar item for saving now"
                id="gui.menuBar.saveNow"
            />
        );
        const createCopyMessage = (
            <FormattedMessage
                defaultMessage="Save as a copy"
                description="Menu bar item for saving as a copy"
                id="gui.menuBar.saveAsCopy"
            />
        );
        const remixMessage = (
            <FormattedMessage
                defaultMessage="Remix"
                description="Menu bar item for remixing"
                id="gui.menuBar.remix"
            />
        );
        const newProjectMessage = (
            <FormattedMessage
                defaultMessage="New"
                description="Menu bar item for creating a new project"
                id="gui.menuBar.new"
            />
        );
        const remixButton = (
            <Button
                className={classNames(
                    styles.menuBarButton,
                    styles.remixButton
                )}
                iconClassName={styles.remixButtonIcon}
                iconSrc={remixIcon}
                onClick={this.handleClickRemix}
            >
                {remixMessage}
            </Button>
        );
        const MissionLevelNavigation = this.props.extUtils.MissionLevelNavigation;
        var missionId, levelId, levels;
        var { puzzleData } = this.props;
        if (puzzleData) {
            var idx = ('' + puzzleData.id).indexOf('-');
            missionId = idx > 0 ? puzzleData.id.substr(0, idx) : '';
            levelId = idx > 0 ? Number(puzzleData.id.substr(idx + 1)) : puzzleData.id;
            levels = puzzleData.missions;
        }
        return (
            <Box
                className={classNames(
                    this.props.className,
                    styles.menuBar
                )}
            >
                <div className={styles.mainMenu}>
                    <div className={styles.fileGroup}>
                        <div className={classNames(styles.menuBarItem)}>
                            <img
                                alt="阿儿法营魔抓社区"
                                className={classNames(styles.scratchLogo, {
                                    [styles.clickable]: typeof this.props.onClickLogo !== 'undefined'
                                })}
                                draggable={false}
                                src={aerfayingLogo}
                                onClick={this.props.onClickLogo}
                            />
                        </div>
                        {Blockey.GUI_CONFIG.MODE != 'Puzzle' ? (
                            <div
                                className={classNames(styles.menuBarItem, styles.hoverable, styles.languageMenu)}
                            >
                                <div>
                                    <img
                                        className={styles.languageIcon}
                                        src={languageIcon}
                                    />
                                    <img
                                        className={styles.languageCaret}
                                        src={dropdownCaret}
                                    />
                                </div>
                                <LanguageSelector label={this.props.intl.formatMessage(ariaMessages.language)} />
                            </div>
                        ) : null}
                        {Blockey.GUI_CONFIG.MODE != 'Puzzle' ? (
                            <div
                                className={classNames(styles.menuBarItem, styles.hoverable, {
                                    [styles.active]: this.props.fileMenuOpen
                                })}
                                onMouseUp={this.props.onClickFile}
                            >
                                <FormattedMessage
                                    defaultMessage="File"
                                    description="Text for file dropdown menu"
                                    id="gui.menuBar.file"
                                />
                                <MenuBarMenu
                                    className={classNames(styles.menuBarMenu)}
                                    open={this.props.fileMenuOpen}
                                    place={this.props.isRtl ? 'left' : 'right'}
                                    onRequestClose={this.props.onRequestCloseFile}
                                >
                                    <MenuItem
                                        className={classNames({ [styles.disabled]: !this.props.canSave })}
                                        onClick={this.props.canSave ? this.handleClickSave : null}
                                    >
                                        {saveNowMessage}
                                    </MenuItem>
                                    <MenuItem
                                        className={classNames({ [styles.disabled]: !this.props.canRemix })}
                                        onClick={this.props.canRemix ? this.handleClickRemix : null}
                                    >
                                        {remixMessage}
                                    </MenuItem>
                                    <SBFileUploader
                                        canSave={this.props.canSave}
                                        userOwnsProject={this.props.userOwnsProject}
                                    >
                                        {(className, renderFileInput, handleLoadProject) => (
                                            <MenuItem
                                                className={classNames({ [styles.disabled]: !this.props.canSaveToLocal })}
                                                onClick={this.props.canSaveToLocal ? handleLoadProject : null}
                                            >
                                                {/* eslint-disable max-len */}
                                                {this.props.intl.formatMessage(sharedMessages.loadFromComputerTitle)}
                                                {/* eslint-enable max-len */}
                                                {renderFileInput()}
                                            </MenuItem>
                                        )}
                                    </SBFileUploader>
                                    <SB3Downloader>{(className, downloadProjectCallback) => (
                                        <MenuItem
                                            className={classNames(className, { [styles.disabled]: !this.props.canSaveToLocal })}
                                            onClick={this.props.canSaveToLocal ? this.getSaveToComputerHandler(downloadProjectCallback) : null}
                                        >
                                            <FormattedMessage
                                                defaultMessage="Save to your computer"
                                                description="Menu bar item for downloading a project to your computer"
                                                id="gui.menuBar.downloadToComputer"
                                            />
                                        </MenuItem>
                                    )}</SB3Downloader>
                                </MenuBarMenu>
                            </div>
                        ) : null}
                        {Blockey.GUI_CONFIG.MODE != 'Puzzle' ? (
                            <div
                                className={classNames(styles.menuBarItem, styles.hoverable, {
                                    [styles.active]: this.props.editMenuOpen
                                })}
                                onMouseUp={this.props.onClickEdit}
                            >
                                <div className={classNames(styles.editMenu)}>
                                    <FormattedMessage
                                        defaultMessage="Edit"
                                        description="Text for edit dropdown menu"
                                        id="gui.menuBar.edit"
                                    />
                                </div>
                                <MenuBarMenu
                                    className={classNames(styles.menuBarMenu)}
                                    open={this.props.editMenuOpen}
                                    place={this.props.isRtl ? 'left' : 'right'}
                                    onRequestClose={this.props.onRequestCloseEdit}
                                >
                                    <DeletionRestorer>{(handleRestore, { restorable, deletedItem }) => (
                                        <MenuItem
                                            className={classNames({ [styles.disabled]: !restorable })}
                                            onClick={this.handleRestoreOption(handleRestore)}
                                        >
                                            {this.restoreOptionMessage(deletedItem)}
                                        </MenuItem>
                                    )}</DeletionRestorer>
                                    <MenuSection>
                                        <TurboMode>{(toggleTurboMode, { turboMode }) => (
                                            <MenuItem onClick={toggleTurboMode}>
                                                {turboMode ? (
                                                    <FormattedMessage
                                                        defaultMessage="Turn off Turbo Mode"
                                                        description="Menu bar item for turning off turbo mode"
                                                        id="gui.menuBar.turboModeOff"
                                                    />
                                                ) : (
                                                        <FormattedMessage
                                                            defaultMessage="Turn on Turbo Mode"
                                                            description="Menu bar item for turning on turbo mode"
                                                            id="gui.menuBar.turboModeOn"
                                                        />
                                                    )}
                                            </MenuItem>
                                        )}</TurboMode>
                                    </MenuSection>
                                </MenuBarMenu>
                            </div>
                        ) : null}
                    </div>
                    <Divider className={classNames(styles.divider)} />
                    {!(this.props.puzzleData && this.props.puzzleData.mode == 2) ? (
                        <React.Fragment>
                            <div
                                aria-label={this.props.intl.formatMessage(ariaMessages.tutorials)}
                                className={classNames(styles.menuBarItem, styles.hoverable)}
                                onClick={this.handleOpenTutorials}
                            >
                                <img
                                    className={styles.helpIcon}
                                    src={helpIcon}
                                />
                                <FormattedMessage {...ariaMessages.tutorials} />
                            </div>
                            <Divider className={classNames(styles.divider)} />
                        </React.Fragment>
                    ) : null}
                    {Blockey.GUI_CONFIG.MODE == 'Puzzle' && this.props.puzzleData && this.props.puzzleData.missions.length > 1 ? (
                        <MissionLevelNavigation missionId={missionId} levelId={levelId} levels={levels} />
                    ) : null}
                    {/*<MissionSelector className={styles.missionSelector} puzzleData={this.props.puzzleData} />*/}
                    {Blockey.GUI_CONFIG.MODE != 'Puzzle' && this.props.canEditTitle ? (
                        <div className={classNames(styles.menuBarItem, styles.growable)}>
                            <MenuBarItemTooltip
                                enable
                                id="title-field"
                            >
                                <ProjectTitleInput
                                    className={classNames(styles.titleFieldGrowable)}
                                />
                            </MenuBarItemTooltip>
                        </div>
                    ) : null}
                    {Blockey.GUI_CONFIG.MODE != 'Puzzle' && !this.props.canEditTitle ? (
                        <AuthorInfo
                            className={styles.authorInfo}
                            imageUrl={this.props.authorThumbnailUrl}
                            projectTitle={this.props.projectTitle}
                            userId={this.props.authorId}
                            username={this.props.authorUsername}
                        />
                    ) : null}
                    {Blockey.GUI_CONFIG.MODE != 'Puzzle' ? (
                        <div className={classNames(styles.menuBarItem)}>
                            {this.props.canShare ? (
                                (this.props.isShowingProject || this.props.isUpdating) && (
                                    <ProjectWatcher onDoneUpdating={this.props.onShare}>
                                        {
                                            waitForUpdate => (
                                                <ShareButton
                                                    className={styles.menuBarButton}
                                                    isShared={this.props.isShared}
                                                    /* eslint-disable react/jsx-no-bind */
                                                    onClick={() => {
                                                        this.handleClickShare(waitForUpdate);
                                                    }}
                                                /* eslint-enable react/jsx-no-bind */
                                                />
                                            )
                                        }
                                    </ProjectWatcher>
                                )
                            ) : []}
                            {this.props.canRemix ? remixButton : []}
                        </div>
                    ) : null}
                    {Blockey.GUI_CONFIG.MODE != 'Puzzle' ? (
                        <div className={classNames(styles.menuBarItem, styles.communityButtonWrapper)}>
                            {this.props.isShowingProject || this.props.isUpdating ? (
                                <ProjectWatcher onDoneUpdating={this.props.onSeeCommunity}>
                                    {
                                        waitForUpdate => (
                                            <CommunityButton
                                                className={styles.menuBarButton}
                                                /* eslint-disable react/jsx-no-bind */
                                                onClick={() => {
                                                    this.handleClickSeeCommunity(waitForUpdate);
                                                }}
                                            /* eslint-enable react/jsx-no-bind */
                                            />
                                        )
                                    }
                                </ProjectWatcher>
                            ) : null}
                        </div>
                    ) : null}
                </div>

                {/* show the proper UI in the account menu, given whether the user is
                logged in, and whether a session is available to log in with */}
                <div className={styles.accountInfoGroup}>
                    <div className={styles.menuBarItem}>
                        {this.props.canSave && (
                            <SaveStatus />
                        )}
                    </div>
                    <AccountNav
                        className={classNames(
                            styles.menuBarItem,
                            styles.hoverable,
                            { [styles.active]: this.props.accountMenuOpen }
                        )}
                        isOpen={this.props.accountMenuOpen}
                        isRtl={this.props.isRtl}
                        menuBarMenuClassName={classNames(styles.menuBarMenu)}
                        onClick={this.props.onClickAccount}
                        onClose={this.props.onRequestCloseAccount}
                        onLogOut={this.props.onLogOut}
                        loggedInUser={Blockey.Utils.getLoggedInUser()}
                    />
                </div>
            </Box>
        );
    }
}

MenuBar.propTypes = {
    //by yj
    extUtils: PropTypes.any,
    canSaveToLocal: PropTypes.bool,

    accountMenuOpen: PropTypes.bool,
    authorId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    authorThumbnailUrl: PropTypes.string,
    authorUsername: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    autoUpdateProject: PropTypes.func,
    canChangeLanguage: PropTypes.bool,
    canCreateCopy: PropTypes.bool,
    canCreateNew: PropTypes.bool,
    canEditTitle: PropTypes.bool,
    canManageFiles: PropTypes.bool,
    canRemix: PropTypes.bool,
    canSave: PropTypes.bool,
    canShare: PropTypes.bool,
    className: PropTypes.string,
    confirmReadyToReplaceProject: PropTypes.func,
    editMenuOpen: PropTypes.bool,
    enableCommunity: PropTypes.bool,
    fileMenuOpen: PropTypes.bool,
    intl: intlShape,
    isRtl: PropTypes.bool,
    isShared: PropTypes.bool,
    isShowingProject: PropTypes.bool,
    isUpdating: PropTypes.bool,
    languageMenuOpen: PropTypes.bool,
    locale: PropTypes.string.isRequired,
    loginMenuOpen: PropTypes.bool,
    logo: PropTypes.string,
    onClickAccount: PropTypes.func,
    onClickEdit: PropTypes.func,
    onClickFile: PropTypes.func,
    onClickLanguage: PropTypes.func,
    onClickLogin: PropTypes.func,
    onClickLogo: PropTypes.func,
    onClickNew: PropTypes.func,
    onClickRemix: PropTypes.func,
    onClickSave: PropTypes.func,
    onClickSaveAsCopy: PropTypes.func,
    onLogOut: PropTypes.func,
    onOpenRegistration: PropTypes.func,
    onOpenTipLibrary: PropTypes.func,
    onProjectTelemetryEvent: PropTypes.func,
    onRequestCloseAccount: PropTypes.func,
    onRequestCloseEdit: PropTypes.func,
    onRequestCloseFile: PropTypes.func,
    onRequestCloseLanguage: PropTypes.func,
    onRequestCloseLogin: PropTypes.func,
    onSeeCommunity: PropTypes.func,
    onShare: PropTypes.func,
    onToggleLoginOpen: PropTypes.func,
    projectTitle: PropTypes.string,
    renderLogin: PropTypes.func,
    sessionExists: PropTypes.bool,
    shouldSaveBeforeTransition: PropTypes.func,
    showComingSoon: PropTypes.bool,
    userOwnsProject: PropTypes.bool,
    username: PropTypes.string,
    vm: PropTypes.instanceOf(VM).isRequired
};

MenuBar.defaultProps = {
    logo: scratchLogo,
    onShare: () => {}
};

const mapStateToProps = (state, ownProps) => {
    const loadingState = state.scratchGui.projectState.loadingState;
    const user = state.session && state.session.session && state.session.session.user;
    return {
        //by yj
        vm: state.scratchGui.vm,
        puzzleData: state.scratchGui.projectState.puzzleData,

        accountMenuOpen: accountMenuOpen(state),
        fileMenuOpen: fileMenuOpen(state),
        editMenuOpen: editMenuOpen(state),
        isRtl: state.locales.isRtl,
        isUpdating: getIsUpdating(loadingState),
        isShowingProject: getIsShowingProject(loadingState),
        languageMenuOpen: languageMenuOpen(state),
        locale: state.locales.locale,
        loginMenuOpen: loginMenuOpen(state),
        projectTitle: state.scratchGui.projectTitle,
        sessionExists: state.session && typeof state.session.session !== 'undefined',
        username: user ? user.username : null,
        userOwnsProject: ownProps.authorUsername && user &&
            (ownProps.authorUsername === user.username),
        vm: state.scratchGui.vm
    };
};

const mapDispatchToProps = dispatch => ({
    autoUpdateProject: () => dispatch(autoUpdateProject()),
    onOpenTipLibrary: () => dispatch(openTipsLibrary()),
    onClickAccount: () => dispatch(openAccountMenu()),
    onRequestCloseAccount: () => dispatch(closeAccountMenu()),
    onClickFile: () => dispatch(openFileMenu()),
    onRequestCloseFile: () => dispatch(closeFileMenu()),
    onClickEdit: () => dispatch(openEditMenu()),
    onRequestCloseEdit: () => dispatch(closeEditMenu()),
    onClickLanguage: () => dispatch(openLanguageMenu()),
    onRequestCloseLanguage: () => dispatch(closeLanguageMenu()),
    onClickLogin: () => dispatch(openLoginMenu()),
    onRequestCloseLogin: () => dispatch(closeLoginMenu()),
    onClickNew: needSave => dispatch(requestNewProject(needSave)),
    onClickRemix: () => dispatch(remixProject()),
    onClickSave: () => dispatch(manualUpdateProject()),
    onClickSaveAsCopy: () => dispatch(saveProjectAsCopy()),
    //onSeeCommunity: () => dispatch(setPlayer(true))
});

export default compose(
    injectIntl,
    MenuBarHOC,
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(MenuBar);
