
import React from 'react';
import { Input, Icon, Row, Col, List, Avatar, Button, Radio, message } from 'antd';
import _ from 'lodash';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class TodoListContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: '',
      todoListArrs: [],
      taskCount: 0,
      isEdit: false,
      editOnChange: '',
      conditionSelect: 'overview',
      conditionDisplay: [],
    };
    this.addTaskClick = this.addTaskClick.bind(this);
    this.editTaskClick = this.editTaskClick.bind(this);
    this.isEditFinish = this.isEditFinish.bind(this);
  }

  // empty the input
  emitEmpty = () => {
    this.userNameInput.focus();
    this.setState({ inputText: '' });
  }

  // input text change
  onChangeInputText = (e) => {
    this.setState({ inputText: e.target.value });
  }

  // add button click event
  addTaskClick = () => {
    const { inputText, todoListArrs, taskCount, conditionSelect, conditionDisplay } = this.state;

    // consider the empty words
    if (inputText.trim() === '') {
      message.error('please check the input words again!', 2);
      this.setState({ inputText: '' });
      return;
    }
    const obj = {};
    obj.value = inputText;
    obj.finish = 0;
    obj.id = taskCount;
    todoListArrs.push(obj);
    if(conditionSelect === 'unfinish') conditionDisplay.push(obj);
    this.setState({
      inputText: '',
      todoListArrs,
      taskCount: taskCount + 1,
      conditionDisplay,
    });
  }

  editInputOnChange = (e) => { this.setState({ editOnChange: e.target.value }); }

  // check edit finish
  isEditFinish = (e) => {
    // console.log('ffff');
    const { todoListArrs, editOnChange } = this.state;
    const isItemIndex = _.findIndex(todoListArrs, (obj, key) => { return obj.id == e.target.name });
    const defaultValue = todoListArrs[isItemIndex].value.props.defaultValue;
    todoListArrs[isItemIndex].value = editOnChange === '' ? defaultValue : editOnChange;
    this.setState({
      isEdit: false,
      todoListArrs,
      editOnChange: '',
    })
  }

  // task edit click event
  editTaskClick = (e) => {
    const { todoListArrs } = this.state;
    const isItemIndex = _.findIndex(todoListArrs, (obj, key) => { return obj.id == e.target.name });
    todoListArrs[isItemIndex].value = <Input
      onChange={this.editInputOnChange}
      defaultValue={todoListArrs[isItemIndex].value}
      addonAfter={
        <a name={e.target.name} onClick={this.isEditFinish.bind(this)}>
          ok
        </a>
      }
    />;
    this.setState({
      todoListArrs,
      isEdit: true,
    });
  }

  deleteTaskClick = (e) => {
    const { todoListArrs, conditionDisplay } = this.state;
    const leftObjs = _.remove(todoListArrs, (obj) => { return obj.id !== parseInt(e.target.name, 10)});
    const leftConditionObjs = conditionDisplay.length === 0 ? [] : _.remove(conditionDisplay, (obj) => { return obj.id !== parseInt(e.target.name, 10)});
    // console.log(e.target.name, isItemIndex, parseInt(e.target.name, 10));
    this.setState({
      todoListArrs: leftObjs,
      conditionDisplay: leftConditionObjs,
    });
    message.success('Delete Tasks Success!!', 1);
  }

  isFinishTag = (e) => {
    const { todoListArrs } = this.state;
    const isItemIndex = _.findIndex(todoListArrs, (obj, key) => { return obj.id == e.target.id });
    todoListArrs[isItemIndex].finish = todoListArrs[isItemIndex].finish ? 0 : 1;
    this.setState({
      todoListArrs,
    });
  }

  radioConditionOnChange = (e) => {
    const { todoListArrs } = this.state;
    const tempOptionsArrs = [];

    _.map(todoListArrs, (value) => {
      if (value.finish === 1 && e.target.value === 'finish') tempOptionsArrs.push(value);
      else if(value.finish === 0 && e.target.value === 'unfinish') tempOptionsArrs.push(value);
    });
    console.log(tempOptionsArrs);
    this.setState({
      conditionSelect: e.target.value,
      conditionDisplay: tempOptionsArrs,
    });
  }

  clearFinishTask = () => {
    const { todoListArrs, conditionDisplay, conditionSelect } = this.state;
    const tempTotalArrs = [];
    const tempOptionsArrs = [];
    _.map(todoListArrs, (value) => { if (value.finish === 0) tempTotalArrs.push(value); });
    _.map(conditionDisplay, (value) => { if (value.finish === 0) tempOptionsArrs.push(value); });
    this.setState({
      todoListArrs: tempTotalArrs,
      conditionDisplay: conditionSelect === 'finish' ? []: tempOptionsArrs,
    });
    message.success('Clear Finish Tasks Success!!', 1);
  }

  render() {
    const { inputText, isEdit, todoListArrs, conditionSelect, conditionDisplay } = this.state;
    const suffix = inputText ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
    return (
      <Row id="todoList-container">
        <Col span={24} id="title"><h1>Todo List</h1></Col>
        <Col xs={0} sm={4} md={4} lg={7} xl={7} />
        <Col xs={24} sm={16} md={16} lg={10} xl={10}>
          <div style={{ display: 'flex' }}>
            <Input
              placeholder="Type Tasks Content Here"
              prefix={<Icon type="edit" style={{ color: 'rgba(0,0,0,.25)' }} />}
              suffix={suffix}
              value={inputText}
              onChange={this.onChangeInputText}
              ref={node => this.userNameInput = node}
            />
            <Button size={"large"} type="primary" onClick={this.addTaskClick} disabled={isEdit || false}>Add Task</Button>
          </div>
          <Col span={24} style={{ padding: '10px', textAlign: 'center' }}>
            <Col span={18} style={{ textAlign: 'left' }}>
              <RadioGroup defaultValue="overview" onChange={this.radioConditionOnChange}>
                <RadioButton value="overview">Overview</RadioButton>
                <RadioButton value="finish">Finish</RadioButton>
                <RadioButton value="unfinish">UnFinish</RadioButton>
              </RadioGroup>
            </Col>
            <Col span={6}>
              <Button onClick={this.clearFinishTask} type="primary">Clear Finish Task</Button>
            </Col>
            <Col span={24} style={{ textAlign: 'left' }}>
              <h5>#點擊文字或icon可將該項目勾為完成狀態</h5>
            </Col>
          </Col>
          <Col span={24}>
            <List
              itemLayout="horizontal"
              dataSource={conditionSelect === 'overview' ? todoListArrs : conditionDisplay}
              renderItem={item => (
                <List.Item
                  actions={!isEdit ? [
                    <a name={item.id} onClick={this.editTaskClick}>edit</a>,
                    <a name={item.id} onClick={this.deleteTaskClick}>delete</a>
                  ] : ''}
                >
                  <List.Item.Meta
                    avatar={!item.finish
                      ? <Icon type="tag-o" id={item.id} onClick={!isEdit ? this.isFinishTag : null} style={{ fontSize: '25px', cursor: 'pointer' }} />
                      : <Icon type="check" id={item.id} onClick={!isEdit ? this.isFinishTag : null} style={{ fontSize: '25px', cursor: 'pointer' }} />}
                    description={<b id={item.id} onClick={!isEdit ? this.isFinishTag : null} style={{ cursor: 'pointer' }}>{item.value}</b>}
                  />
                  <div style={{ cursor: 'pointer', width: '100%' }}></div>
                </List.Item>
              )}
            />
          </Col>
        </Col>
        <Col xs={0} sm={4} md={4} lg={7} xl={7} />
      </Row>
    );
  }
}

export default TodoListContainer;