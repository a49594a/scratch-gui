import bindAll from 'lodash.bindall';
import React from 'react';
import styles from './gamepad.css';
import classNames from 'classnames';
//import topBlock from './top-block.svg';

class GamepadComponent extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            'onTouchStart',
            'onTouchEnd',
            'handleKeyDown',
        ]);
    }
    componentDidMount() {
        var btnKeys = [this.refs.keyUp, this.refs.keyDown, this.refs.keyLeft, this.refs.keyRight, this.refs.keySpace];
        var pid = null;
        for (var i = 0; i < btnKeys.length; i++) {
            btnKeys[i].addEventListener("touchstart", this.onTouchStart);
            btnKeys[i].addEventListener("touchend", this.onTouchEnd);
        }
    }
    componentWillUnmount() {
        var btnKeys = [this.refs.keyUp, this.refs.keyDown, this.refs.keyLeft, this.refs.keyRight, this.refs.keySpace];
        var pid = null;
        for (var i = 0; i < btnKeys.length; i++) {
            btnKeys[i].removeEventListener("touchstart", this.onTouchStart);
            btnKeys[i].removeEventListener("touchend", this.onTouchEnd);
        }
    }
    onTouchStart(e){
        window.clearInterval(this.pid);
        var currentTarget = e.currentTarget;
        this.handleKeyDown(currentTarget, true);
        this.pid = window.setInterval(() => {
            this.handleKeyDown(currentTarget, true);
        }, 100);
        e.preventDefault();
    }
    onTouchEnd(e){
        window.clearInterval(this.pid);
        var currentTarget = e.currentTarget;
        this.handleKeyDown(currentTarget, false);
        e.preventDefault();
    }
    handleKeyDown(target, isDown) {
        var keyCodes;
        var keys;
        switch (target) {
            case this.refs.keySpace:
                keyCodes = [32];
                keys = [' '];
                break;
            case this.refs.keyUp:
                keyCodes = [38, 87];
                keys = ['ArrowUp', 'w'];
                break;
            case this.refs.keyDown:
                keyCodes = [40, 83];
                keys = ['ArrowDown', 's'];
                break;
            case this.refs.keyRight:
                keyCodes = [39, 68];
                keys = ['ArrowRight', 'd'];
                break;
            case this.refs.keyLeft:
                keyCodes = [37, 65];
                keys = ['ArrowLeft', 'a'];
                break;
            default:
                keyCodes = [];
        }
        for (var i = 0; i < keyCodes.length; i++) {
            this.props.vm.postIOData('keyboard', {
                keyCode: keyCodes[i],
                key: keys[i],
                isDown: isDown
            });
        }
    }
    render() {
        return (
            <div className={styles.wrapper}>
                <div className={styles.container}>
                    <div className="modePanel">
                        <div className="panelContainer">
                            <div className="panelLeft">
                                <div ref="keyLeft" className={classNames(styles.key, styles.keyLeft)} data-key="left"></div>
                                <div ref="keyDown" className={classNames(styles.key, styles.keyDown)} data-key="down"></div>
                                <div ref="keyRight" className={classNames(styles.key, styles.keyRight)} data-key="right"></div>
                                <div ref="keyUp" className={classNames(styles.key, styles.keyUp)} data-key="up"></div>
                            </div>
                            <div ref="keySpace" className={classNames(styles.key, styles.keySpace)} data-key="space"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default GamepadComponent;
