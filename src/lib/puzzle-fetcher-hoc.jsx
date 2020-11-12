import React from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import bindAll from 'lodash.bindall';
import { connect } from 'react-redux';

import {
    LoadingStates,
    defaultProjectId,
    getIsFetchingWithId,
    onFetchedProjectData,
    projectError,
    setProjectId
} from '../reducers/project-state';

import analytics from './analytics';
import log from './log';
import storage from './storage';

import projectDecrypt from './project-decrypt';
import puzzleMergeProjectSb2 from './puzzleMergeProjectSb2.js';
import puzzleMergeProjectSb3 from './puzzleMergeProjectSb3.js';

/* Higher Order Component to provide behavior for loading projects by id. If
 * there's no id, the default project is loaded.
 * @param {React.Component} WrappedComponent component to receive projectData prop
 * @returns {React.Component} component with project loading behavior
 */
const PuzzleFetcherHOC = function (WrappedComponent) {
    class PuzzleFetcherComponent extends React.Component {
        constructor(props) {
            super(props);
            bindAll(this, [
                'fetchPuzzle'
            ]);
            storage.setProjectHost(props.projectHost);
            storage.setAssetHost(props.assetHost);
            storage.setTranslatorFunction(props.intl.formatMessage);
            // props.projectId might be unset, in which case we use our default;
            // or it may be set by an even higher HOC, and passed to us.
            // Either way, we now know what the initial projectId should be, so
            // set it in the redux store.
            if (
                props.projectId !== '' &&
                props.projectId !== null &&
                typeof props.projectId !== 'undefined'
            ) {
                this.props.setProjectId(props.projectId.toString());
            }
        }
        componentDidUpdate(prevProps) {
            if (prevProps.projectHost !== this.props.projectHost) {
                storage.setProjectHost(this.props.projectHost);
            }
            if (prevProps.assetHost !== this.props.assetHost) {
                storage.setAssetHost(this.props.assetHost);
            }
            if (this.props.isFetchingWithId && !prevProps.isFetchingWithId) {
                this.fetchPuzzle(this.props.reduxProjectId, this.props.loadingState);
            }
        }
        fetchPuzzle(projectId, loadingState) {
            var extUtils = this.props.extUtils;
            let hasLevel = projectId.indexOf('-') > 0;
            return new Promise((resolve, reject) => {
                extUtils.ajax({
                    url: '/WebApi/Puzzle/Get',
                    data: { id: projectId },
                    loadingStyle: "none",
                    success: (puzzleData) => {
                        if (puzzleData.error) window.location = `/Missions/${projectId}/View`;
                        let levelProjectData = null;
                        let templateProjectData = null;
                        storage.load(storage.AssetType.Project, puzzleData.levelProjectId + "", storage.DataFormat.JSON)
                            .then((projectAsset) => {
                                levelProjectData = JSON.parse(projectDecrypt(projectAsset));
                                if (levelProjectData && (templateProjectData || !puzzleData.templateProjectId)) {
                                    var mergedData = this.puzzleMergeProject(levelProjectData, templateProjectData);
                                    this.props.onFetchedProjectData(mergedData, loadingState, puzzleData);
                                    resolve();
                                }
                            })
                            .catch(err => {
                                this.props.onError(err);
                                log.error(err);
                            });
                        if (puzzleData.templateProjectId) {
                            storage.load(storage.AssetType.Project, puzzleData.templateProjectId + "", storage.DataFormat.JSON)
                                .then((projectAsset) => {
                                    templateProjectData = JSON.parse(projectDecrypt(projectAsset));
                                    if (levelProjectData && (templateProjectData || !puzzleData.templateProjectId)) {
                                        var mergedData = this.puzzleMergeProject(levelProjectData, templateProjectData);
                                        this.props.onFetchedProjectData(mergedData, loadingState, puzzleData);
                                        resolve();
                                    }
                                })
                                .catch(err => {
                                    this.props.onError(err);
                                    log.error(err);
                                });
                        }
                    }
                });
            });
        }
        puzzleMergeProject(levelProjectData, templateProjectData) {
            if (levelProjectData.targets) {
                return puzzleMergeProjectSb3(levelProjectData, templateProjectData);
            }
            else {
                return puzzleMergeProjectSb2(levelProjectData, templateProjectData);
            }
        }
        render() {
            const {
                /* eslint-disable no-unused-vars */
                assetHost,
                intl,
                loadingState,
                onError: onErrorProp,
                onFetchedProjectData: onFetchedProjectDataProp,
                projectHost,
                projectId,
                reduxProjectId,
                setProjectId: setProjectIdProp,
                /* eslint-enable no-unused-vars */
                isFetchingWithId: isFetchingWithIdProp,
                ...componentProps
            } = this.props;
            return (
                <WrappedComponent
                    fetchingProject={isFetchingWithIdProp}
                    {...componentProps}
                />
            );
        }
    }
    PuzzleFetcherComponent.propTypes = {
        assetHost: PropTypes.string,
        canSave: PropTypes.bool,
        intl: intlShape.isRequired,
        isFetchingWithId: PropTypes.bool,
        loadingState: PropTypes.oneOf(LoadingStates),
        onError: PropTypes.func,
        onFetchedProjectData: PropTypes.func,
        projectHost: PropTypes.string,
        projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        reduxProjectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        setProjectId: PropTypes.func
    };
    PuzzleFetcherComponent.defaultProps = {
        assetHost: 'https://assets.scratch.mit.edu',
        projectHost: 'https://projects.scratch.mit.edu'
    };

    const mapStateToProps = state => ({
        isFetchingWithId: getIsFetchingWithId(state.scratchGui.projectState.loadingState),
        loadingState: state.scratchGui.projectState.loadingState,
        reduxProjectId: state.scratchGui.projectState.projectId
    });
    const mapDispatchToProps = dispatch => ({
        onError: error => dispatch(projectError(error)),
        onFetchedProjectData: (projectData, loadingState, puzzleData) =>
            dispatch(onFetchedProjectData(projectData, loadingState, puzzleData)),
        setProjectId: projectId => dispatch(setProjectId(projectId))
    });
    // Allow incoming props to override redux-provided props. Used to mock in tests.
    const mergeProps = (stateProps, dispatchProps, ownProps) => Object.assign(
        {}, stateProps, dispatchProps, ownProps
    );
    return injectIntl(connect(
        mapStateToProps,
        mapDispatchToProps,
        mergeProps
    )(PuzzleFetcherComponent));
};

export {
    PuzzleFetcherHOC as default
};
