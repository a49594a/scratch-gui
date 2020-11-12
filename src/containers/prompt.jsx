import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import PromptComponent from '../components/prompt/prompt.jsx';
import VM from 'scratch-vm';

class Prompt extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleOk',
            'handleScopeOptionSelection',
            'handleCancel',
            'handleChange',
            'handleKeyPress',
            'handleCloudVariableOptionChange'
        ]);
        this.state = {
            inputValue: '',
            globalSelected: true,
            cloudSelected: false,
            canAddCloudVariable: (props.vm && props.vm.runtime.canAddCloudVariable()) || false
        };
    }
    handleKeyPress (event) {
        if (event.key === 'Enter') this.handleOk();
    }
    handleFocus (event) {
        event.target.select();
    }
    handleOk () {
        //by yj 禁止在谜题挑战中新建或修改以@符号开头的变量或消息名称，以防止作弊
        if (Blockey.GUI_CONFIG.MODE == 'Puzzle' && this.state.inputValue.charAt(0) == '@') return;

        this.props.onOk(this.state.inputValue, {
            scope: this.state.globalSelected ? 'global' : 'local',
            isCloud: this.state.cloudSelected
        });
    }
    handleCancel () {
        this.props.onCancel();
    }
    handleChange (e) {
        this.setState({inputValue: e.target.value});
    }
    handleScopeOptionSelection (e) {
        this.setState({globalSelected: (e.target.value === 'global')});
    }
    handleCloudVariableOptionChange (e) {
        if (!this.props.showCloudOption) return;

        const checked = e.target.checked;
        this.setState({cloudSelected: checked});
        if (checked) {
            this.setState({globalSelected: true});
        }
    }
    render () {
        return (
            <PromptComponent
                canAddCloudVariable={this.state.canAddCloudVariable}
                cloudSelected={this.state.cloudSelected}
                defaultValue={this.props.defaultValue}
                globalSelected={this.state.globalSelected}
                isStage={this.props.isStage}
                label={this.props.label}
                showCloudOption={this.props.showCloudOption}
                showVariableOptions={this.props.showVariableOptions}
                title={this.props.title}
                onCancel={this.handleCancel}
                onChange={this.handleChange}
                onCloudVarOptionChange={this.handleCloudVariableOptionChange}
                onFocus={this.handleFocus}
                onKeyPress={this.handleKeyPress}
                onOk={this.handleOk}
                onScopeOptionSelection={this.handleScopeOptionSelection}
            />
        );
    }
}

Prompt.propTypes = {
    defaultValue: PropTypes.string,
    isStage: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    onCancel: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired,
    showCloudOption: PropTypes.bool.isRequired,
    showVariableOptions: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    vm: PropTypes.instanceOf(VM)
};

export default Prompt;
