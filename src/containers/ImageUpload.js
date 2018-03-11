import React from 'react';
import { Upload, Icon, Modal, Button } from 'antd';
import { Cropper } from 'react-image-cropper'
import { Image, Transformation } from 'cloudinary-react';
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
    this.finishCropClick = this.finishCropClick.bind(this);
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
  finishCropClick (e) {
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
            : <div><img
              alt="example"
              style={!isCrop || _.isEmpty(previewStyle) ? {width: "100%"} : previewStyle}
              src={croppedImg || previewImage}>
                {/* <Transformation effect="pixelate_region" height="80" width="200" x="170" y="260" crop="fill" /> */}
              </img>
              <span style={{ height:"80px", width:"200px", left:"170px", top:"260px", color: "black" }}>jjjj</span>
              {/* <Image>
              <Transformation effect="pixelate_region" height="80" width="200" x="170" y="260" crop="fill" />
              </Image> */}
              </div>
          }
          <br />
          <Button onClick={this.isCropClick} style={{ marginTop: '10px' }}>Crop</Button>
          {isCrop ? <Button onClick={this.finishCropClick}>Ok</Button> : null}
        </Modal>
      </div>
    );
  }
}

export default ImageUpload;