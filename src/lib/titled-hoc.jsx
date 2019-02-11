import React from 'react';
import bindAll from 'lodash.bindall';

/* Higher Order Component to get and set the project title
 * @param {React.Component} WrappedComponent component to receive project title related props
 * @returns {React.Component} component with project loading behavior
 */
const TitledHOC = function (WrappedComponent) {
    class TitledComponent extends React.Component {
        constructor (props) {
            super(props);
            bindAll(this, [
                'handleUpdateProjectTitle'
            ]);
            //by yj
            this.state = {
                projectTitle: this.props.projectTitle || null
            };
        }
        handleUpdateProjectTitle (newTitle) {
            //by yj
            const projectId = this.props.projectId;
            Blockey.Utils.ajax({
                url: `/WebApi/Projects/${projectId}/UpdateTitle`,
                data: { title: newTitle },
                success: (r) => {
                    this.setState({ projectTitle: newTitle });
                }
            });
        }
        render () {
            return (
                <WrappedComponent
                    canEditTitle
                    onUpdateProjectTitle={this.handleUpdateProjectTitle}
                    {...this.props}
                    projectTitle={this.state.projectTitle}
                />
            );
        }
    }

    return TitledComponent;
};

export {
    TitledHOC as default
};
