import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import VM from 'scratch-vm';
import AudioEngine from 'scratch-audio';
import CloudProvider from '../lib/cloud-provider';

import {
    LoadingStates,
    getIsLoadingWithId,
    onLoadedProject,
    projectError
} from '../reducers/project-state';

//by yj
import ScratchBlocks from 'scratch-blocks';
import { openPuzzleResolved } from '../reducers/modals';

/*
 * Higher Order Component to manage events emitted by the VM
 * @param {React.Component} WrappedComponent component to manage VM events for
 * @returns {React.Component} connected component with vm events bound to redux
 */
const vmManagerHOC = function (WrappedComponent) {
    class VMManager extends React.Component {
        constructor (props) {
            super(props);
            bindAll(this, [
                'loadProject'
            ]);
        }
        componentDidMount () {
            if (this.props.vm.initialized) return;
            this.audioEngine = new AudioEngine();
            this.props.vm.attachAudioEngine(this.audioEngine);
            this.props.vm.setCompatibilityMode(true);
            this.props.vm.start();
            this.props.vm.initialized = true;

            //by yj
            this.props.vm.runtime.puzzle={};
            this.props.vm.startPuzzle = function () {
                this.runtime.startHats('event_whenflagclicked');
                this.emit('PUZZLE_RUN_START');
            };
            this.props.vm.resetPuzzle = function () {
                this.stopAll();
                this.runtime.startHats('event_whenbroadcastreceived', {
                    BROADCAST_OPTION: "@onInit"
                });
                this.emit('PUZZLE_RUN_RESET');
            };
        }
        componentDidUpdate (prevProps) {
            // if project is in loading state, AND fonts are loaded,
            // and they weren't both that way until now... load project!
            if (this.props.isLoadingWithId && /*this.props.fontsLoaded &&*///by yj fix safari can not load fonts
                (!prevProps.isLoadingWithId || !prevProps.fontsLoaded)) {
                this.loadProject();
            }
        }
        loadProject () {
            return this.props.vm.loadProject(this.props.projectData)
                .then(() => {
                    //by yj                    
                    if(Blockey.GUI_CONFIG.MODE=='Puzzle'){
                        this.onPuzzleLoaded();
                    }
                    else{
                        this.props.vm.updateSavedAssetMap();//配合saveProjectDiff                        
                    }

                    this.props.onLoadedProject(this.props.loadingState, this.props.canSave);
                    // If the cloud host exists, open a cloud connection and
                    // set the vm's cloud provider.
                    if (this.props.cloudHost) {
                        // TODO check if we should actually
                        // connect to cloud data based on info from the loaded project and
                        // info about the user (e.g. scratcher status)
                        this.props.vm.setCloudProvider(new CloudProvider(
                            this.props.cloudHost,
                            this.props.vm,
                            this.props.username,
                            this.props.projectId));
                    }
                })
                .catch(e => {
                    this.props.onError(e);
                });
        }
        //by yj
        onPuzzleLoaded() {
            this.props.vm.setCompatibilityMode(true);
            this.props.vm.start();
            if (this.props.puzzleData) {
                var runtime = this.props.vm.runtime;
                runtime.puzzle = {
                    maxBlockCount: this.props.puzzleData.maxBlockCount,
                    attemptCount: 0,
                    stepInterval: this.props.puzzleData.stepInterval || 0.5,
                    setResolved: this.setPuzzleResolved.bind(this),
                    isRuning: false,
                    preventComplete: false,
                };
                var defaultSprite = this.props.puzzleData.defaultSprite;
                var target = runtime.getSpriteTargetByName(defaultSprite);
                if (!target) target = runtime.getTargetForStage();
                this.props.vm.setEditingTarget(target.id);
                //this.props.vm.emitWorkspaceUpdate();
                this.props.vm.resetPuzzle();
                this.props.vm.emit("PUZZLE_LOADED");
                this.setState({ loading: false });
            }
        }
        setPuzzleResolved() {
            if (this.props.vm.runtime.puzzle.preventComplete) return;
    
            var xmlText = ScratchBlocks.Xml.domToPrettyText(ScratchBlocks.Xml.workspaceToDom(ScratchBlocks.mainWorkspace));
            Blockey.Utils.ajax({
                url: "/Mission/SetResolved2",
                data: { id: this.props.puzzleData.id, answer: xmlText },
                success: (data) => {
                    this.props.onOpenPuzzleResolved();
                }
            });
        }
        render () {
            const {
                /* eslint-disable no-unused-vars */
                cloudHost,
                fontsLoaded,
                loadingState,
                onError: onErrorProp,
                onLoadedProject: onLoadedProjectProp,
                projectData,
                projectId,
                username,
                /* eslint-enable no-unused-vars */
                isLoadingWithId: isLoadingWithIdProp,
                vm,
                ...componentProps
            } = this.props;
            return (
                <WrappedComponent
                    isLoading={isLoadingWithIdProp}
                    vm={vm}
                    {...componentProps}
                />
            );
        }
    }

    VMManager.propTypes = {
        canSave: PropTypes.bool,
        cloudHost: PropTypes.string,
        fontsLoaded: PropTypes.bool,
        isLoadingWithId: PropTypes.bool,
        loadingState: PropTypes.oneOf(LoadingStates),
        onError: PropTypes.func,
        onLoadedProject: PropTypes.func,
        projectData: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
        projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        username: PropTypes.string,
        vm: PropTypes.instanceOf(VM).isRequired
    };

    const mapStateToProps = state => {
        const loadingState = state.scratchGui.projectState.loadingState;
        return {
            isLoadingWithId: getIsLoadingWithId(loadingState),
            projectData: state.scratchGui.projectState.projectData,
            puzzleData: state.scratchGui.projectState.puzzleData,//by yj
            projectId: state.scratchGui.projectState.projectId,
            loadingState: loadingState
        };
    };

    const mapDispatchToProps = dispatch => ({
        //by yj
        onOpenPuzzleResolved: () => dispatch(openPuzzleResolved()),

        onError: error => dispatch(projectError(error)),
        onLoadedProject: (loadingState, canSave) =>
            dispatch(onLoadedProject(loadingState, canSave))
    });

    // Allow incoming props to override redux-provided props. Used to mock in tests.
    const mergeProps = (stateProps, dispatchProps, ownProps) => Object.assign(
        {}, stateProps, dispatchProps, ownProps
    );

    return connect(
        mapStateToProps,
        mapDispatchToProps,
        mergeProps
    )(VMManager);
};

export default vmManagerHOC;
