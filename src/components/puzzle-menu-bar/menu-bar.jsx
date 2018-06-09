import classNames from 'classnames';
import {connect} from 'react-redux';
import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';

import Box from '../box/box.jsx';
import Button from '../button/button.jsx';
import {ComingSoonTooltip} from '../coming-soon/coming-soon.jsx';
import LanguageSelector from '../../containers/language-selector.jsx';
import ProjectLoader from '../../containers/project-loader.jsx';
import Menu from '../../containers/menu.jsx';
import {MenuItem, MenuSection} from '../menu/menu.jsx';
import ProjectSaver from '../../containers/project-saver.jsx';
import MissionSelector from '../puzzle-mission-selector/mission-selector.jsx';

import {
    openFileMenu,
    closeFileMenu,
    fileMenuOpen,
    openEditMenu,
    closeEditMenu,
    editMenuOpen
} from '../../reducers/menus';

import styles from './menu-bar.css';

import mystuffIcon from './icon--mystuff.png';
import profileIcon from './icon--profile.png';
import communityIcon from './icon--see-community.svg';
import dropdownCaret from '../language-selector/dropdown-caret.svg';
//by yj
//import scratchLogo from './scratch-logo.svg';
import aerfayingLogo from './aerfaying-logo.svg';

const MenuBarItemTooltip = ({
    children,
    className,
    id,
    place = 'bottom'
}) => (
    <ComingSoonTooltip
        className={classNames(styles.comingSoon, className)}
        place={place}
        tooltipClassName={styles.comingSoonTooltip}
        tooltipId={id}
    >
        {children}
    </ComingSoonTooltip>
);

MenuBarItemTooltip.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    id: PropTypes.string,
    place: PropTypes.oneOf(['top', 'bottom', 'left', 'right'])
};

const MenuItemTooltip = ({id, children, className}) => (
    <ComingSoonTooltip
        className={classNames(styles.comingSoon, className)}
        place="right"
        tooltipClassName={styles.comingSoonTooltip}
        tooltipId={id}
    >
        {children}
    </ComingSoonTooltip>
);

MenuItemTooltip.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    id: PropTypes.string
};

const MenuBarMenu = ({
    children,
    onRequestClose,
    open,
    place = 'right'
}) => (
    <Menu
        className={styles.menu}
        open={open}
        place={place}
        onRequestClose={onRequestClose}
    >
        {children}
    </Menu>
);

MenuBarMenu.propTypes = {
    children: PropTypes.node,
    onRequestClose: PropTypes.func,
    open: PropTypes.bool,
    place: PropTypes.oneOf(['left', 'right'])
};

const MenuBar = props => (
    <Box
        className={classNames({
            [styles.menuBar]: true
        })}
    >
        <div className={styles.mainMenu}>
            <div className={classNames(styles.logoWrapper, styles.menuItem)}>
                <a href="/"><img
                    alt="阿儿法营创意编程"
                    className={styles.aerfayingLogo}
                    draggable={false}
                    src={aerfayingLogo}
                /></a>
            </div>
        </div>
        <MissionSelector className={styles.missionSelector} puzzleData={props.puzzleData} />
        <div className={styles.accountInfoWrapper}>
            <MenuBarItemTooltip id="mystuff">
                <div
                    className={classNames(
                        styles.menuBarItem,
                        styles.hoverable,
                        styles.mystuffButton
                    )}
                >
                    <img
                        className={styles.mystuffIcon}
                        src={mystuffIcon}
                    />
                </div>
            </MenuBarItemTooltip>
            <MenuBarItemTooltip
                id="account-nav"
                place="left"
            >
                <div
                    className={classNames(
                        styles.menuBarItem,
                        styles.hoverable,
                        styles.accountNavMenu
                    )}
                >
                    <img
                        className={styles.profileIcon}
                        src={profileIcon}
                    />
                    <span>scratch-cat</span>
                    <img
                        className={styles.dropdownCaretIcon}
                        src={dropdownCaret}
                    />
                </div>
            </MenuBarItemTooltip>
        </div>
    </Box>
);

MenuBar.propTypes = {
//    onGiveFeedback: PropTypes.func.isRequired
};

/*const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
    onGiveFeedback: () => {
        dispatch(openFeedbackForm());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MenuBar);*/
export default MenuBar;
