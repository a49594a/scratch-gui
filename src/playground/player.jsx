import React from 'react';
import ReactDOM from 'react-dom';

import Box from '../components/box/box.jsx';
import GUI from '../containers/gui.jsx';
import HashParserHOC from '../lib/hash-parser-hoc.jsx';
import AppStateHOC from '../lib/app-state-hoc.jsx';
const WrappedGui = HashParserHOC(AppStateHOC(GUI));

if (process.env.NODE_ENV === 'production' && typeof window === 'object') {
    // Warn before navigating away
    window.onbeforeunload = () => true;
}

import styles from './player.css';
const Player = () => (
    <Box className={styles.stageOnly}>
        <WrappedGui
            isPlayerOnly
            isFullScreen={false}
        />
    </Box>
);

/* by yj
const appTarget = document.createElement('div');
document.body.appendChild(appTarget);
*/
const appTarget = document.getElementById("player");

ReactDOM.render(<Player />, appTarget);
