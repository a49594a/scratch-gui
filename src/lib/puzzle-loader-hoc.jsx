import React from 'react';
import PropTypes from 'prop-types';

import analytics from './analytics';
import log from './log';
import storage from './storage';

/* Higher Order Component to provide behavior for loading projects by id from
 * the window's hash (#this part in the url)
 * @param {React.Component} WrappedComponent component to receive projectData prop
 * @returns {React.Component} component with project loading behavior
 */
const PuzzleLoaderHOC = function (WrappedComponent) {
    class PuzzleLoaderComponent extends React.Component {
        constructor(props) {
            super(props);
            this.updatePuzzle = this.updatePuzzle.bind(this);
            this.state = {
                puzzleData: null,
                projectData: null,
                fetchingProject: false
            };
        }
        componentDidMount() {
            if (this.props.projectId || this.props.projectId === 0) {
                this.updatePuzzle(this.props.projectId);
            }
        }
        componentWillUpdate(nextProps) {
            if (this.props.projectId !== nextProps.projectId) {
                this.setState({ fetchingProject: true }, () => {
                    this.updatePuzzle(nextProps.projectId);
                });
            }
        }
        updatePuzzle(projectId) {
            if (projectId == 0) return;
            this.loadPuzzle(projectId)
                .then(function (puzzleData) {
                    let levelProjectData = null;
                    let templateProjectData = null;
                    storage.load(storage.AssetType.Project, puzzleData.levelProjectId + "", storage.DataFormat.JSON)
                        .then(function (projectAsset) {
                            levelProjectData = JSON.parse(projectAsset.decodeText());
                            if (levelProjectData && (templateProjectData || !puzzleData.templateProjectId)) this.puzzleLoaded(puzzleData, levelProjectData, templateProjectData);
                        }.bind(this))
                        .catch(err => log.error(err));
                    if (puzzleData.templateProjectId) {
                        storage.load(storage.AssetType.Project, puzzleData.templateProjectId + "", storage.DataFormat.JSON)
                            .then(function (projectAsset) {
                                templateProjectData = JSON.parse(projectAsset.decodeText());
                                if (levelProjectData && (templateProjectData || !puzzleData.templateProjectId)) this.puzzleLoaded(puzzleData, levelProjectData, templateProjectData);
                            }.bind(this))
                            .catch(err => log.error(err));
                    }
                }.bind(this))
                .catch(err => log.error(err));
        }
        loadPuzzle(projectId) {
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: "/WebApi/Puzzle/Get",
                    type: "POST",
                    data: { id: projectId },
                    success: function (data) {
                        resolve(data);
                    },
                    error: function (xhr) {
                        reject("系统或网络错误，请重试");
                    }
                });
            }.bind(this));
        }
        puzzleLoaded(puzzleData, level, template) {
            var removePuzzleExtension = function (json) {
                if (json.info && json.info.savedExtensions) {
                    var exts = json.info.savedExtensions;
                    for (var i = exts.length - 1; i >= 0; i--) {
                        if (exts[i].extensionName == 'Puzzle') {
                            exts.splice(i, 1);
                        }
                    }
                    if (exts.length == 0)delete json.info.savedExtensions;
                }
            }
            if (level) removePuzzleExtension(level);
            if (template) removePuzzleExtension(template);
            if (!template) {
                this.setState({
                    puzzleData: puzzleData,
                    projectData: JSON.stringify(level),
                    fetchingProject: false
                });
                return;
            }

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

            this.setState({
                puzzleData: puzzleData,
                projectData: JSON.stringify(template),
                fetchingProject: false
            });
        }
        render() {
            const {
                projectId, // eslint-disable-line no-unused-vars
                ...componentProps
            } = this.props;
            if (!this.state.projectData) return null;
            return (
                <WrappedComponent
                    fetchingProject={this.state.fetchingProject}
                    puzzleData={this.state.puzzleData}
                    projectData={this.state.projectData}
                    {...componentProps}
                />
            );
        }
    }
    PuzzleLoaderComponent.propTypes = {
        projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    };
    PuzzleLoaderComponent.defaultProps = {
        projectId: 0
    };

    return PuzzleLoaderComponent;
};

export {
    PuzzleLoaderHOC as default
};
