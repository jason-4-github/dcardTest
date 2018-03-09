import React from 'react';
import { Upload, Icon, Modal, Button } from 'antd';
import {Cropper} from 'react-image-cropper'
import _ from 'lodash';

class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: [{
        uid: -1,
        name: 'xxx.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png ',
      }],
      isCrop: false,
      previewStyle: {},
      croppedImg: '',
      imageLoaded: false,
    };
    this.isCropClick2 = this.isCropClick2.bind(this);
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = ({ fileList }) => {console.log(fileList); this.setState({ fileList })}

  cropOnChange = (e) => { console.log(e); this.setState({ previewStyle: e.display }) }

  isCropClick = () => {
    const { isCrop } = this.state;
    this.setState({ isCrop:  isCrop ? false : true });
  }
  isCropClick2 (e) {
    let node = this.cropper;
    console.log(this.state.fileList, e.target.value);
    this.setState({
      croppedImg: node.crop(),
      isCrop: false,
    })
  }

  testClick = () => {
    const { fileList } = this.state;
    fileList.push({
      uid: -2,
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    });
    this.setState({ fileList });
  }

  render() {
    const { previewVisible, previewImage, fileList, previewStyle, isCrop, croppedImg } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    // console.log(croppedImg, previewImage);
    return (
      <div className="clearfix">
      <Button onClick={this.testClick} >Click</Button>
        <Upload
          action="//jsonplaceholder.typicode.com/posts/"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          {isCrop
            ? <Cropper
              src={croppedImg || previewImage}
              ref={ ref => { this.cropper = ref;}}
              onChange={this.cropOnChange}
            />
            : <img
              alt="example"
              style={_.isEmpty(previewStyle) ? {width: "100%"} : previewStyle}
              src={croppedImg || previewImage} />
          }
          <br />
          <Button onClick={this.isCropClick} style={{ marginTop: '10px' }}>Crop</Button>
          {isCrop ? <Button onClick={this.isCropClick2}>Ok</Button> : null}
        </Modal>
      </div>
    );
  }
}

export default ImageUpload;