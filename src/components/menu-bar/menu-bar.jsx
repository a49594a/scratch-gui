import classNames from 'classnames';
import { connect } from 'react-redux';
import { defineMessages, FormattedMessage, injectIntl, intlShape } from 'react-intl';
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

//by yj
import MissionSelector from '../puzzle-mission-selector/mission-selector.jsx';
import aerfayingLogo from './aerfaying-logo.svg';
import MissionHelpModal from '../../containers/mission-help-modal.jsx';
import PublishModal from '../../containers/publish-modal.jsx';
import { openMissionHelp, openPublish } from '../../reducers/modals';

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
import feedbackIcon from './icon--feedback.svg';
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

            'handleClickNew',
            'handleClickRemix',
            'handleClickSave',
            'handleClickSaveAsCopy',
            'handleClickSeeCommunity',
            'handleClickShare',
            'handleKeyPress',
            'handleLanguageMouseUp',
            'handleRestoreOption',
            'handleSaveToComputer',
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
        if (Blockey.GUI_CONFIG.MODE == 'Puzzle') {
            let missionId = location.hash.substr(1);
            if (!(Blockey.INIT_DATA.mission && Blockey.INIT_DATA.mission.id == missionId)) {
                Blockey.INIT_DATA.mission = {
                    id: location.hash.substr(1)
                };
            }
        }
        let mission = Blockey.INIT_DATA.mission;
        if (mission && mission.helps == null) {
            let missionId = mission.id;
            let levelId = null;
            let idx = (""+mission.id).indexOf('-');
            if (idx > 0) {
                missionId = mission.id.substr(0, idx);
                levelId = mission.id.substr(idx + 1);
            }
            Blockey.Utils.ajax({
                url: '/WebApi/Mission/GetHelps',
                data: { id: levelId ? levelId : missionId },
                success: r => {
                    mission.helps = r.data;
                    for (var i = 0; i < mission.helps.length; i++) {
                        if (mission.helps[i].forType == 'Mission.Course') {
                            this.props.onOpenMissionHelp();
                            break;
                        }
                    }
                }
            });
        }
    }
    handleClickNew() {
        let readyToReplaceProject = true;
        // if the project is dirty, and user owns the project, we will autosave.
        // but if they are not logged in and can't save, user should consider
        // downloading or logging in first.
        // Note that if user is logged in and editing someone else's project,
        // they'll lose their work.
        if (this.props.projectChanged && !this.props.canCreateNew) {
            readyToReplaceProject = confirm( // eslint-disable-line no-alert
                this.props.intl.formatMessage(sharedMessages.replaceProjectWarning)
            );
        }
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
    handleClickSeeCommunity(waitForUpdate) {
        if (this.props.canSave && this.props.projectChanged && this.props.enableAutoSave/*by yj*/) { // save before transitioning to project page
            this.props.autoUpdateProject();
            waitForUpdate(true); // queue the transition to project page
        } else {
            waitForUpdate(false); // immediately transition to project page
        }
    }
    handleClickShare(waitForUpdate) {
        /*if (this.props.canShare) { // save before transitioning to project page
            this.props.onShare();
        }*/
        if (this.props.canSave && this.props.projectChanged) { // save before transitioning to project page
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
        const modifier = bowser.mac ? event.metaKey : event.ctrlKey;
        if (modifier && event.key === 's') {
            this.props.onClickSave();
            event.preventDefault();
        }
    }
    handleSaveToComputer(downloadProjectCallback) {
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
                                    <SBFileUploader className={classNames({ [styles.disabled]: !this.props.canSaveToLocal })}
                                        canSave={this.props.canSave} onUpdateProjectTitle={this.props.onUpdateProjectTitle}
                                    >
                                        {(className, renderFileInput, loadProject) => (
                                            <MenuItem
                                                className={className}
                                                onClick={this.props.canSaveToLocal ? loadProject : null}
                                            >
                                                <FormattedMessage
                                                    defaultMessage="Load from your computer"
                                                    description={
                                                        'Menu bar item for uploading a project from your computer'
                                                    }
                                                    id="gui.menuBar.uploadFromComputer"
                                                />
                                                {renderFileInput()}
                                            </MenuItem>
                                        )}
                                    </SBFileUploader>
                                    <SB3Downloader>{(className, downloadProjectCallback) => (
                                        <MenuItem
                                            className={classNames(className, { [styles.disabled]: !this.props.canSaveToLocal })}
                                            onClick={this.props.canSaveToLocal ? this.handleSaveToComputer(downloadProjectCallback) : null}
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
                    <div
                        aria-label={this.props.intl.formatMessage(ariaMessages.tutorials)}
                        className={classNames(styles.menuBarItem, styles.hoverable)}
                        onClick={Blockey.INIT_DATA.mission ? this.props.onOpenMissionHelp : this.props.onOpenTipLibrary}
                    >
                        <img
                            className={styles.helpIcon}
                            src={helpIcon}
                        />
                        <FormattedMessage {...ariaMessages.tutorials} />
                    </div>
                    <Divider className={classNames(styles.divider)} />
                    {Blockey.GUI_CONFIG.MODE == 'Puzzle' && this.props.puzzleData && this.props.puzzleData.missions.length > 1 ? (
                        <MissionSelector className={styles.missionSelector} puzzleData={this.props.puzzleData} />
                    ) : null}
                    {Blockey.GUI_CONFIG.MODE != 'Puzzle' && this.props.canEditTitle ? (
                        <div className={classNames(styles.menuBarItem, styles.growable)}>
                            <MenuBarItemTooltip
                                enable
                                id="title-field"
                            >
                                <ProjectTitleInput
                                    className={classNames(styles.titleFieldGrowable)}
                                    onUpdateProjectTitle={this.props.onUpdateProjectTitle}
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
                {this.props.publishModalVisible ? (
                    <PublishModal vm={this.props.vm} />
                ) : null}
                {this.props.missionHelpModalVisible ? (
                    <MissionHelpModal vm={this.props.vm} />
                ) : null}
            </Box>
        );
    }
}

MenuBar.propTypes = {
    //by yj
    canSaveToLocal: PropTypes.bool,

    accountMenuOpen: PropTypes.bool,
    authorId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    authorThumbnailUrl: PropTypes.string,
    authorUsername: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    autoUpdateProject: PropTypes.func,
    canCreateCopy: PropTypes.bool,
    canCreateNew: PropTypes.bool,
    canEditTitle: PropTypes.bool,
    canRemix: PropTypes.bool,
    canSave: PropTypes.bool,
    canShare: PropTypes.bool,
    className: PropTypes.string,
    editMenuOpen: PropTypes.bool,
    enableCommunity: PropTypes.bool,
    fileMenuOpen: PropTypes.bool,
    intl: intlShape,
    isRtl: PropTypes.bool,
    isShared: PropTypes.bool,
    isShowingProject: PropTypes.bool,
    isUpdating: PropTypes.bool,
    languageMenuOpen: PropTypes.bool,
    loginMenuOpen: PropTypes.bool,
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
    onUpdateProjectTitle: PropTypes.func,
    projectChanged: PropTypes.bool,
    projectTitle: PropTypes.string,
    renderLogin: PropTypes.func,
    sessionExists: PropTypes.bool,
    showComingSoon: PropTypes.bool,
    username: PropTypes.string,
    vm: PropTypes.instanceOf(VM).isRequired
};

MenuBar.defaultProps = {
    onShare: () => { }
};

const mapStateToProps = state => {
    const loadingState = state.scratchGui.projectState.loadingState;
    const user = state.session && state.session.session && state.session.session.user;
    return {
        //by yj
        vm: state.scratchGui.vm,
        puzzleData: state.scratchGui.projectState.puzzleData,
        missionHelpModalVisible: state.scratchGui.modals.missionHelp,
        publishModalVisible: state.scratchGui.modals.publish,

        accountMenuOpen: accountMenuOpen(state),
        fileMenuOpen: fileMenuOpen(state),
        editMenuOpen: editMenuOpen(state),
        isRtl: state.locales.isRtl,
        isUpdating: getIsUpdating(loadingState),
        isShowingProject: getIsShowingProject(loadingState),
        languageMenuOpen: languageMenuOpen(state),
        locale: state.locales.locale,
        loginMenuOpen: loginMenuOpen(state),
        projectChanged: state.scratchGui.projectChanged,
        projectTitle: state.scratchGui.projectTitle,
        sessionExists: state.session && typeof state.session.session !== 'undefined',
        username: user ? user.username : null,
        vm: state.scratchGui.vm
    };
};

const mapDispatchToProps = dispatch => ({
    //by yj
    //onShare: () => dispatch(openPublish()),
    onOpenMissionHelp: () => dispatch(openMissionHelp()),

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

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(MenuBar));
