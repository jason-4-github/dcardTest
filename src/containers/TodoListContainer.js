
import React from 'react';
import { Input, Icon, Row, Col, List, Avatar, Button } from 'antd';
import _ from 'lodash';

class TodoListContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: '',
      todoListArrs: [],
      taskCount: 0,
      isEdit: false,
      editOnChange: '',
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
    const { inputText, todoListArrs, taskCount } = this.state;

    // consider the empty words
    if (inputText.trim() === '') {
      alert('please check the input words again!');
      this.setState({ inputText: '' });
      return;
    }
    const obj = {};
    obj.value = inputText;
    obj.finish = 0;
    obj.id = taskCount;
    todoListArrs.push(obj);
    this.setState({
      inputText: '',
      todoListArrs,
      taskCount: taskCount + 1,
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
    })
    // console.log(e.target, isItemIndex);
  }
  render() {
    const { inputText, isEdit } = this.state;
    const suffix = inputText ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
    return (
      <Row>
        <Col span={24} style={{ textAlign: 'center' }}><h1>Todo List</h1></Col>
        <Col span={7} />
        <Col span={10}>
          <div style={{ display: 'flex' }}>
            <Input
              placeholder="Enter your username"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              suffix={suffix}
              value={inputText}
              onChange={this.onChangeInputText}
              ref={node => this.userNameInput = node}
            />
            <Button size={"large"} onClick={this.addTaskClick} disabled={isEdit || false}>Add Task</Button>
          </div>
          <List
            itemLayout="horizontal"
            dataSource={this.state.todoListArrs}
            renderItem={item => (
              <List.Item
                actions={!isEdit ? [
                  <a name={item.id} onClick={this.editTaskClick}>edit</a>,
                  <a>more</a>
                ] : ''}
              >
                <List.Item.Meta
                  avatar={<Icon type="tag-o" style={{ fontSize: '25px' }} />}
                  description={item.value}
                />
              </List.Item>
            )}
          />
        </Col>
        <Col span={7} />
      </Row>
    );
  }
}

export default TodoListContainer;