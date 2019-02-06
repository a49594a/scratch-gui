/*
NOTE: this file only temporarily resides in scratch-gui.
Nearly identical code appears in scratch-www, and the two should
eventually be consolidated.
*/

import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';

import MenuBarMenu from './menu-bar-menu.jsx';
import { MenuSection } from '../menu/menu.jsx';
import MenuItemContainer from '../../containers/menu-item.jsx';
import UserAvatar from './user-avatar.jsx';
import dropdownCaret from './dropdown-caret.svg';

import styles from './account-nav.css';

const AccountNavComponent = ({
    loggedInUser,
    className,
    isOpen,
    isRtl,
    menuBarMenuClassName,
    onClick,
    onClose,
}) => (
        <React.Fragment>
            <div
                className={classNames(
                    styles.userInfo,
                    className
                )}
                onMouseUp={onClick}
            >
                <UserAvatar
                    className={styles.avatar}
                    imageUrl={loggedInUser.thumbUrl}
                />
                <span className={styles.profileName}>
                    {loggedInUser.username}
                </span>
                <div className={styles.dropdownCaretPosition}>
                    <img
                        className={styles.dropdownCaretIcon}
                        src={dropdownCaret}
                    />
                </div>
            </div>
            <MenuBarMenu
                className={menuBarMenuClassName}
                open={isOpen}
                // note: the Rtl styles are switched here, because this menu is justified
                // opposite all the others
                place={isRtl ? 'right' : 'left'}
                onRequestClose={onClose}
            >
                <MenuItemContainer href={`/Users/${loggedInUser.id}`}>个人中心</MenuItemContainer>
                <MenuItemContainer href={`/Users/${loggedInUser.id}/Missions`}>我的任务</MenuItemContainer>
                <MenuItemContainer href={`/Users/${loggedInUser.id}/Projects`}>我的作品</MenuItemContainer>
                <MenuItemContainer href={`/Users/${loggedInUser.id}/Studios`}>我的工作室</MenuItemContainer>
                <MenuItemContainer href={`/Users/${loggedInUser.id}/Items`}>我的背包</MenuItemContainer>
                <MenuItemContainer href={`/Users/${loggedInUser.id}/CoursesFor${loggedInUser.isTeacher ? "Teacher" : "Student"}`}>我的课程</MenuItemContainer>
                <MenuItemContainer href={`/Users/${loggedInUser.id}/Settings`}>账户设置</MenuItemContainer>
                <MenuItemContainer href={`/User/Logout`}>退出</MenuItemContainer>
            </MenuBarMenu>
        </React.Fragment>
    );

export default AccountNavComponent;
