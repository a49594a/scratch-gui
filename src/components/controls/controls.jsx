import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';

import GreenFlag from '../green-flag/green-flag.jsx';
import StopAll from '../stop-all/stop-all.jsx';
import TurboMode from '../turbo-mode/turbo-mode.jsx';

//by yj
import resetIcon from './icon--reset.svg';
import startIcon from './icon--start.svg';

import styles from './controls.css';

const messages = defineMessages({
    goTitle: {
        id: 'gui.controls.go',
        defaultMessage: 'Go',
        description: 'Green flag button title'
    },
    stopTitle: {
        id: 'gui.controls.stop',
        defaultMessage: 'Stop',
        description: 'Stop button title'
    }
});

const Controls = function (props) {
    const {
        //by yj
        started,
        preventComplete,
        onStartClick,
        onResetClick,

        active,
        className,
        intl,
        onGreenFlagClick,
        onStopAllClick,
        turbo,
        ...componentProps
    } = props;

    //by yj
    if(Blockey.GUI_CONFIG.MODE=='Puzzle'){
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
    }

    return (
        <div
            className={classNames(styles.controlsContainer, className)}
            {...componentProps}
        >
            <GreenFlag
                active={active}
                title={intl.formatMessage(messages.goTitle)}
                onClick={onGreenFlagClick}
            />
            <StopAll
                active={active}
                title={intl.formatMessage(messages.stopTitle)}
                onClick={onStopAllClick}
            />
            {turbo ? (
                <TurboMode />
            ) : null}
        </div>
    );
};

Controls.propTypes = {
    active: PropTypes.bool,
    className: PropTypes.string,
    intl: intlShape.isRequired,
    onGreenFlagClick: PropTypes.func.isRequired,
    onStopAllClick: PropTypes.func.isRequired,
    turbo: PropTypes.bool
};

Controls.defaultProps = {
    active: false,
    turbo: false
};

export default injectIntl(Controls);
