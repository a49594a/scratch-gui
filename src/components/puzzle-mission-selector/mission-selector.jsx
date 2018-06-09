import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

/*import GreenFlag from '../green-flag/green-flag.jsx';
import StopAll from '../stop-all/stop-all.jsx';
import TurboMode from '../turbo-mode/turbo-mode.jsx';*/

import styles from './mission-selector.css';

const MissionSelector = function (props) {
    const {
        className,
        puzzleData,
        ...componentProps
    } = props;
    return (
        <div
            className={classNames(styles.container, className)}
        >
            <ul>
                {puzzleData.missions
                    .map(mission => (
                        <li
                            className={mission.id === puzzleData.id ?
                                classNames(styles.mission, styles.active, mission.isSolved ? styles.solved : null) :
                                classNames(styles.mission, mission.isSolved ? styles.solved : null)}
                            id={mission.id}
                            key={mission.id}
                        >
                            <a href={"#" + mission.id}></a>
                        </li>
                    ))
                }
            </ul>
        </div>
    );
};

/*MissionSelector.propTypes = {
    active: PropTypes.bool,
    className: PropTypes.string,
    onGreenFlagClick: PropTypes.func.isRequired,
    onStopAllClick: PropTypes.func.isRequired,
    turbo: PropTypes.bool
};*/

MissionSelector.defaultProps = {
    /*active: false,
    turbo: false*/
};

export default MissionSelector;
