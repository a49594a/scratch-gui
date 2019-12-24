import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import VM from 'scratch-vm';

import Box from '../box/box.jsx';
import ActionMenu from '../action-menu/action-menu.jsx';

import styles from './puzzle-pane.css';

import settingsIcon from './icon--settings.svg';
import saveAnswerIcon from './icon--save-answer.svg';
import shotscreenIcon from './icon--shotscreen.svg';
import editIcon from './icon--edit.svg';
import editTemplateIcon from './icon--edit-template.svg';

import getCostumeUrl from '../../lib/get-costume-url';

class CountDown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timeLeft: props.expireTime - Date.now()
        };
    }
    componentDidMount() {
        this.pid = window.setInterval(() => {
            let timeLeft = this.props.expireTime - Date.now();
            if (timeLeft < 0) {
                window.clearInterval(this.pid);
                this.props.onTimeExpired();
            }
            this.setState({ timeLeft: timeLeft });
        }, 1000);
    }
    componentWillUnmount() {
        window.clearInterval(this.pid);
    }
    render() {
        let seconds = this.state.timeLeft / 1000;
        if (seconds < 0) seconds = 0;
        let hours = Math.floor(seconds / 3600);
        let minutes = Math.floor((seconds % 3600) / 60);
        seconds = Math.floor(seconds % 60);
        return (
            <span>
                剩余时间：
            <span>{(hours < 10 ? "0" : "") + hours}</span>
                :
            <span>{(minutes < 10 ? "0" : "") + minutes}</span>
                :
            <span>{(seconds < 10 ? "0" : "") + seconds}</span>
            </span>
        );
    }
}

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
        onEditClick,
        onEditTemplateClick,
        onTimeExpired,
        extUtils,
        puzzleData,
        ...componentProps
    } = props;
    let selectedSprite = sprites[editingTarget];
    let spriteInfoDisabled = false;
    if (typeof selectedSprite === 'undefined') {
        selectedSprite = {};
        spriteInfoDisabled = true;
    }
    let asset = selectedSprite.costume && selectedSprite.costume.asset;
    let costumeURL = asset && getCostumeUrl(asset);
    let warningTooltipId = `tooltip-${Math.random()}`;

    return puzzleData ? (
        <div className={styles.puzzlePane}>
            <Box className={styles.puzzleInfo}>
                <Box className={styles.scrollWrapper}>
                    {puzzleData.expireTime ? (
                        <div style={{ textAlign: "center", padding: "0 0 4px 0", fontWeight: "bold", fontSize: "16px" }}>
                            <CountDown expireTime={puzzleData.expireTime} onTimeExpired={onTimeExpired} />
                        </div>
                    ) : null}
                    {costumeURL ? (
                        <img
                            className={styles.sprite}
                            draggable={false}
                            src={costumeURL}
                        />
                    ) : null}
                    <div
                        dangerouslySetInnerHTML={{ __html: extUtils.markdownToHtml(puzzleData.descp) }}
                        style={{ wordBreak: 'break-all' }}
                    ></div>
                    {puzzleData.isAdmin ? (
                        <ActionMenu
                            className={styles.addButton}
                            img={settingsIcon}
                            moreButtons={[
                                {
                                    title: "保存标准答案",
                                    img: saveAnswerIcon,
                                    onClick: onSaveAnswerClick
                                }, {
                                    title: "保存任务封面",
                                    img: shotscreenIcon,
                                    onClick: onShotscreenClick
                                }, {
                                    title: "编辑关卡",
                                    img: editIcon,
                                    onClick: onEditClick
                                }, {
                                    title: "编辑模板",
                                    img: editTemplateIcon,
                                    onClick: onEditTemplateClick
                                }
                            ]}
                            title="设置"
                            onClick={onSettingsClick}
                        />
                    ) : null}
                </Box>
            </Box>
        </div>
    ) : null;
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
