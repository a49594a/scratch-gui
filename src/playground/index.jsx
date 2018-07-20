import 'es6-object-assign/auto';
import 'core-js/fn/array/includes';
import React from 'react';
import ReactDOM from 'react-dom';

import analytics from '../lib/analytics';
import GUI from '../containers/gui.jsx';
import PuzzleGUI from '../containers/puzzle-gui.jsx';
import HashParserHOC from '../lib/hash-parser-hoc.jsx';
import AppStateHOC from '../lib/app-state-hoc.jsx';

import styles from './index.css';

if (process.env.NODE_ENV === 'production' && typeof window === 'object') {
    // Warn before navigating away
    window.onbeforeunload = () => true;
}

// Register "base" page view
analytics.pageview('/');

const appTarget = document.createElement('div');
appTarget.className = styles.app;
document.body.appendChild(appTarget);

GUI.setAppElement(appTarget);

//by yj
const WrappedGui = HashParserHOC(AppStateHOC(Blockey && Blockey.GUIMode == "Puzzle" ? PuzzleGUI : GUI));

// TODO a hack for testing the backpack, allow backpack host to be set by url param
const backpackHostMatches = window.location.href.match(/[?&]backpack_host=([^&]*)&?/);
const backpackHost = backpackHostMatches ? backpackHostMatches[1] : null;

const backpackOptions = {
    visible: true,
    host: backpackHost
};

ReactDOM.render(<WrappedGui backpackOptions={backpackOptions} />, appTarget);
