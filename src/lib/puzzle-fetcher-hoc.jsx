import React from 'react';
import PropTypes from 'prop-types';
import {intlShape, injectIntl} from 'react-intl';
import bindAll from 'lodash.bindall';
import {connect} from 'react-redux';

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

/* Higher Order Component to provide behavior for loading projects by id. If
 * there's no id, the default project is loaded.
 * @param {React.Component} WrappedComponent component to receive projectData prop
 * @returns {React.Component} component with project loading behavior
 */
const PuzzleFetcherHOC = function (WrappedComponent) {
    class PuzzleFetcherComponent extends React.Component {
        constructor (props) {
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
        componentDidUpdate (prevProps) {
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
        fetchPuzzle (projectId, loadingState) {
            return new Promise((resolve, reject)=> {
                Blockey.Utils.ajax({
                    url: "/WebApi/Puzzle/Get",
                    data: { id: projectId },
                    loadingStyle: "none",
                    success: (puzzleData)=> {
                        let levelProjectData = null;
                        let templateProjectData = null;
                        storage.load(storage.AssetType.Project, puzzleData.levelProjectId + "", storage.DataFormat.JSON)
                            .then((projectAsset) => {
                                levelProjectData = JSON.parse(projectAsset.decodeText());
                                if (levelProjectData && (templateProjectData || !puzzleData.templateProjectId)){
                                    var mergedData = this.mergePuzzleData(levelProjectData, templateProjectData);
                                    this.props.onFetchedProjectData(mergedData, loadingState, puzzleData);
                                    resolve();
                                }
                            })
                            .catch(err =>{
                                this.props.onError(err);
                                log.error(err);
                            });
                        if (puzzleData.templateProjectId) {
                            storage.load(storage.AssetType.Project, puzzleData.templateProjectId + "", storage.DataFormat.JSON)
                                .then((projectAsset) => {
                                    templateProjectData = JSON.parse(projectAsset.decodeText());
                                    if (levelProjectData && (templateProjectData || !puzzleData.templateProjectId)){
                                        var mergedData = this.mergePuzzleData(levelProjectData, templateProjectData);
                                        this.props.onFetchedProjectData(mergedData, loadingState, puzzleData);
                                        resolve();
                                    }
                                })
                                .catch(err =>{
                                    this.props.onError(err);
                                    log.error(err);
                                });
                        }
                    }
                });
            });
        }
        mergePuzzleData(level, template) {
            var removePuzzleExtension = function (json) {
                if (json.info && json.info.savedExtensions) {
                    var exts = json.info.savedExtensions;
                    for (var i = exts.length - 1; i >= 0; i--) {
                        if (exts[i].extensionName == 'Puzzle') {
                            exts.splice(i, 1);
                        }
                    }
                    if (exts.length == 0) delete json.info.savedExtensions;
                }
            }
            if (level) removePuzzleExtension(level);
            if (template) removePuzzleExtension(template);
            if (!template) return JSON.stringify(level);

            var removeProcDef = function (templateScripts, levelScripts) {
                if (!(templateScripts && levelScripts)) return;
                for (var i = templateScripts.length - 1; i >= 0; i--) {
                    var opcode = templateScripts[i][2][0][0];
                    var procName = templateScripts[i][2][0][1];
                    if (opcode == "procDef") {
                        for (var j = 0; j < levelScripts.length; j++) {
                            if (levelScripts[j][2][0][0] == opcode && levelScripts[j][2][0][1] == procName) {
                                templateScripts.splice(i, 1);
                                break;
                            }
                        }
                    }
                }
            };
            if (level.scripts) {
                removeProcDef(template.scripts, level.scripts);
                for (var i = 0; i < level.scripts.length; i++) {
                    template.scripts.push(level.scripts[i]);
                }
            }
            if (level.variables) {
                if (!template.variables) template.variables = [];
                for (var i = 0; i < level.variables.length; i++) {
                    var lVar = level.variables[i];
                    var find = false;
                    for (var j = 0; j < template.variables.length; j++) {
                        var tVar = template.variables[j];
                        if (lVar["name"] == tVar["name"]) {
                            find = true;
                            break;
                        }
                    }
                    if (!find) {
                        template.variables.push(lVar);
                    }
                }
            }
            if (level.lists) {
                if (!template.lists) template.lists = [];
                for (var i = 0; i < level.lists.length; i++) {
                    var lVar = level.lists[i];
                    var find = false;
                    for (var j = 0; j < template.lists.length; j++) {
                        var tVar = template.lists[j];
                        if (lVar["listName"] == tVar["listName"]) {
                            find = true;
                            break;
                        }
                    }
                    if (!find) template.lists.push(lVar);
                }
            }
            if (level.children) {
                for (var i = 0; i < level.children.length; i++) {
                    var child = level.children[i];
                    if (child.objName) {
                        var find = false;
                        for (var j = 0; j < template.children.length; j++) {
                            if (child.objName == template.children[j].objName) {
                                find = true;
                                template.children[j].costumesMenu = [];
                                for (var k = 0; k < child.costumes.length; k++) {
                                    template.children[j].costumesMenu.push(child.costumes[k].costumeName);
                                }
                                if (child.scripts) {
                                    removeProcDef(template.children[j].scripts, child.scripts);
                                    for (var k = 0; k < child.scripts.length; k++) {
                                        if (!template.children[j].scripts) template.children[j].scripts = [];
                                        template.children[j].scripts.push(child.scripts[k]);
                                    }
                                }
                            }
                        }
                        if (!find) {
                            template.children.push(child);
                        }
                    }
                    else if (child.target && child.visible && child.cmd == 'getVar:') {
                        template.children.push(child);
                    }
                }
            }
            return JSON.stringify(template);
        }
        render () {
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
