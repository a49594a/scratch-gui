import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import Box from '../box/box.jsx';

import resetIcon from './icon--reset.svg';
import startIcon from './icon--start.svg';

import styles from './controls.css';

const Controls = function (props) {
    const {
        started,
        preventComplete,
        className,
        onStartClick,
        onResetClick,
        ...componentProps
    } = props;
    return (
        <div
            className={classNames(styles.controlsContainer, className)}
            {...componentProps}
        >
            <button className={classNames(started ? styles.reset : styles.start, preventComplete ? styles.preventComplete : "")} onClick={started ? onResetClick : onStartClick}>
                <img className={started ? styles.resetIcon : styles.startIcon} src={started ? resetIcon : startIcon} />{started ? "重置" : "开始"}
            </button>
        </div>
    );
};

Controls.propTypes = {
    started: PropTypes.bool,
    className: PropTypes.string,
    onStartClick: PropTypes.func.isRequired,
    onResetClick: PropTypes.func.isRequired,
};

Controls.defaultProps = {
    started: false,
};

export default Controls;
