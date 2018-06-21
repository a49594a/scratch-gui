import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import VM from 'scratch-vm';

import Box from '../box/box.jsx';
import CostumeCanvas from '../costume-canvas/costume-canvas.jsx';
//import SpriteLibrary from '../../containers/sprite-library.jsx';
//import BackdropLibrary from '../../containers/backdrop-library.jsx';
//import PuzzleInfoComponent from '../puzzle-info/puzzle-info.jsx';
//import StageSelector from '../../containers/stage-selector.jsx';

import ReactTooltip from 'react-tooltip';
import Button from '../button/button.jsx';
import ActionMenu from '../action-menu/action-menu.jsx';

import styles from './puzzle-pane.css';

import infoIcon from './icon--info.svg';
import warningIcon from './icon--warning.svg';
import tutorialIcon from './icon--tutorial.svg';
import hintLockedIcon from './icon--hint-locked.svg';
import hintUnlockedIcon from './icon--hint-unlocked.svg';
import answerIcon from './icon--answer.svg';

import settingsIcon from './icon--settings.svg';
import saveAnswerIcon from './icon--save-answer.svg';
import shotscreenIcon from './icon--shotscreen.svg';

import PuzzleHelpModal from '../../containers/puzzle-help-modal.jsx';
import PuzzleSettingsModal from '../../containers/puzzle-settings-modal.jsx';
/*
 * Pane that contains the sprite selector, sprite info, stage selector,
 * and the new sprite, costume and backdrop buttons
 * @param {object} props Props for the component
 * @returns {React.Component} rendered component
 */
const PuzzlePane = function (props) {
    const {
        editingTarget,
        stage,
        sprites,
        vm,
        onAnswerClick,
        onShotscreenClick,
        onSettingsClick,
        onSaveAnswerClick,
        puzzleData,
        ...componentProps
    } = props;
    let selectedSprite = sprites[editingTarget];
    let spriteInfoDisabled = false;
    if (typeof selectedSprite === 'undefined') {
        selectedSprite = {};
        spriteInfoDisabled = true;
    }
    let assetId = selectedSprite.costume && selectedSprite.costume.assetId;
    let costumeURL = assetId && vm.runtime.storage.get(assetId).encodeDataURI();
    let warningTooltipId = `tooltip-${Math.random()}`;

    let puzzle = props.vm.runtime.puzzle || {
        blockCount: 0,
        maxBlockCount: puzzleData.maxBlockCount,
    };
    let blockError = puzzle.maxBlockCount > 0 && puzzle.blockCount > puzzle.maxBlockCount;
    return (
        <div className={styles.puzzlePane}>
            {props.puzzleHelpVisible ? (
                <PuzzleHelpModal
                    vm={vm}
                    puzzleData={puzzleData}
                />
            ) : null}
            {props.puzzleSettingsVisible ? (
                <PuzzleSettingsModal
                    vm={vm}
                    puzzleData={puzzleData} />
            ) : null}
            <Box className={styles.puzzleInfo}>
                <Box className={styles.puzzleHeader}>
                    {costumeURL ? (
                        <CostumeCanvas
                            className={styles.sprite}
                            height={64}
                            url={costumeURL}
                            width={64}
                        />
                    ) : null}
                    <div className={styles.puzzleHeaderRight}>
                        <div className={classNames(styles.blockCount, blockError ? styles.error : "")}>
                            <span>{puzzle.blockCount + "/" + (puzzle.maxBlockCount > 0 ? puzzle.maxBlockCount : "∞")}</span>
                        </div>
                    </div>
                </Box>
                <Box className={styles.scrollWrapper}>
                    <div className={styles.helpPane}>
                        {puzzleData.courses.length > 0 ? (
                            <Button
                                title={"任务指南"}
                                onClick={props.onTutorialClick}
                            >
                                <img
                                    className={styles.tutorialIcon}
                                    draggable={false}
                                    src={tutorialIcon}
                                />
                            </Button>
                        ) : null}
                        {puzzleData.hints.length > 0 ? (
                            puzzleData.hints.map(hint => (
                                <Button
                                    key={"hint-" + hint.forOrder}
                                    title={"任务提示-" + hint.forOrder}
                                    data-order={hint.forOrder}
                                    onClick={props.onHintClick}
                                >
                                    <img
                                        className={styles.hintIcon}
                                        draggable={false}
                                        src={hint.forOrder > puzzleData.unlockedHintCount ? hintLockedIcon : hintUnlockedIcon}
                                    />
                                </Button>
                            ))
                        ) : null}
                        {puzzleData.answers.length > 0 ? (
                            <Button
                                title={"标准答案"}
                                onClick={props.onAnswerClick}
                            >
                                <img
                                    className={styles.answerIcon}
                                    draggable={false}
                                    src={answerIcon}
                                />
                            </Button>
                        ) : null}
                    </div>
                    <div>
                        {puzzleData.descp}
                    </div>
                    {puzzleData.isAdmin ? (
                        <ActionMenu
                            className={styles.addButton}
                            img={settingsIcon}
                            moreButtons={[
                                {
                                    title: "谜题任务设置",
                                    img: settingsIcon,
                                    onClick: onSettingsClick
                                }, {
                                    title: "保存标准答案",
                                    img: saveAnswerIcon,
                                    onClick: onSaveAnswerClick
                                }, {
                                    title: "保存任务封面",
                                    img: shotscreenIcon,
                                    onClick: onShotscreenClick
                                }
                            ]}
                            title="设置"
                            onClick={onSettingsClick}
                        />
                    ) : null}
                </Box>
            </Box>
        </div>
    );
};

const spriteShape = PropTypes.shape({
    costume: PropTypes.shape({
        url: PropTypes.string,
        name: PropTypes.string.isRequired,
        bitmapResolution: PropTypes.number.isRequired,
        rotationCenterX: PropTypes.number.isRequired,
        rotationCenterY: PropTypes.number.isRequired
    }),
    direction: PropTypes.number,
    id: PropTypes.string,
    name: PropTypes.string,
    order: PropTypes.number,
    size: PropTypes.number,
    visibility: PropTypes.bool,
    x: PropTypes.number,
    y: PropTypes.number
});

PuzzlePane.propTypes = {
    editingTarget: PropTypes.string,
    sprites: PropTypes.objectOf(spriteShape),
    stage: spriteShape,
    vm: PropTypes.instanceOf(VM),
};

export default PuzzlePane;
