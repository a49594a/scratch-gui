import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Box from '../components/box/box.jsx';
import GUI from '../containers/gui-player.jsx';
import HashParserHOC from '../lib/hash-parser-hoc.jsx';
import AppStateHOC from '../lib/app-state-hoc-player.jsx';//by yj
//import TitledHOC from '../lib/titled-hoc.jsx';

import { setPlayer } from '../reducers/mode';

//by yj
/*if (process.env.NODE_ENV === 'production' && typeof window === 'object') {
    // Warn before navigating away
    window.onbeforeunload = () => true;
}*/

import styles from './player.css';

const Player = ({isPlayerOnly, onSeeInside, projectId, projectVersion,isPhone,extUtils}) => (
    <Box className={classNames(isPlayerOnly ? styles.stageOnly : styles.editor)}>
        {/*isPlayerOnly && <button onClick={onSeeInside}>{'See inside'}</button>*/}
        <GUI
            showBranding={false}//by yj
            canEditTitle={false}//by yj
            enableCommunity
            isPlayerOnly={isPlayerOnly}
            projectId={projectId || Blockey.INIT_DATA.project.id}//by yj {projectId}
            projectVersion={projectVersion}
            isPhone={!!isPhone}
            extUtils={extUtils}
        />
    </Box>
);

Player.propTypes = {
    isPlayerOnly: PropTypes.bool,
    onSeeInside: PropTypes.func,
    projectId: PropTypes.string
};

const mapStateToProps = state => ({
    isPlayerOnly: state.scratchGui.mode.isPlayerOnly
});

const mapDispatchToProps = dispatch => ({
    onSeeInside: () => dispatch(setPlayer(false))
});

const ConnectedPlayer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Player);

// note that redux's 'compose' function is just being used as a general utility to make
// the hierarchy of HOC constructor calls clearer here; it has nothing to do with redux's
// ability to compose reducers.
const WrappedPlayer = compose(
    AppStateHOC,
    HashParserHOC
)(ConnectedPlayer);

/* by yj
const appTarget = document.createElement('div');
document.body.appendChild(appTarget);
*/
Blockey.GUIPlayer = WrappedPlayer;