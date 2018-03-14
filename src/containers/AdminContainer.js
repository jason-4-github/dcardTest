import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import { Route, Switch, Link } from 'react-router-dom';

import TodoListContainer from './TodoListContainer';
import ImageUploadContainer from './ImageUpload';
const { Header, Content, Footer, Sider } = Layout;

class AdminContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contentStyle: '200px',
    }
  }
  collapsdOnChange = (collapsed) => {
    this.setState({ contentStyle: collapsed ? '0px' : '200px' })
  }
  render() {
    return (
      <Layout id="admin-container">
        <Sider
          id="leftSider"
          breakpoint="md"
          collapsedWidth="0"
          onCollapse={this.collapsdOnChange}
        >
          <div className="logo">Home-Test</div>
          <Menu theme="dark" mode="inline">
            <Menu.Item key="1">
              <Link to={`/todoList`}>
                <Icon type="user" />
                <span className="nav-text">TodoList</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to={`/imageUpload`}>
                <Icon type="video-camera" />
                <span className="nav-text">Image Upload</span>
              </Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ marginLeft: this.state.contentStyle }}>
          <Content style={{ height: '90vh' }}>
            <Switch>
              <Route path="/todoList" exact component={TodoListContainer} />
              <Route path="/imageUpload" component={ImageUploadContainer} />
            </Switch>
          </Content>
          <Footer id="footer">
             ©2018 Jason Hsu
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default AdminContainer;