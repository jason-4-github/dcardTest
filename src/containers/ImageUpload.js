import React from 'react';
import { Upload, Icon, Modal, Button } from 'antd';
import { Cropper } from 'react-image-cropper'
import _ from 'lodash';
import { isAbsolute } from 'path';

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
        // url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png ',
        url: 'http://a1.att.hudong.com/86/38/300001140423130278388082725_950.jpg',
      }],
      isCrop: false,
      previewStyle: {},
      croppedImg: '',
      imageLoaded: false,
      isPixelated: false,
      isShadow: false,
    };
    this.finishCropClick = this.finishCropClick.bind(this);
  }

  handleCancel = () => this.setState({
    previewVisible: false,
    isCrop: false,
   })

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
      // url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      url: 'http://a1.att.hudong.com/86/38/300001140423130278388082725_950.jpg',
    });
    this.setState({ fileList });
  }

  pixelateClick = () => {
    const { isPixelated } = this.state;
    this.setState({ isPixelated: isPixelated ? false : true });
  }

  shadowClick = () => {
    const { isShadow } = this.state;
    this.setState({ isShadow: isShadow ? false : true });
  }


  render() {
    const { previewVisible, previewImage, fileList, previewStyle, isCrop,
      croppedImg, isPixelated, isShadow } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    console.log(this.state.isPixelated);
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
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} style={{ height: '100%' }}>
          {isCrop
            ? <Cropper
              src={croppedImg || previewImage}
              ref={ ref => { this.cropper = ref;}}
              onChange={this.cropOnChange}
            />
            : <svg width="100%" height="65vh">
              <defs>
                <filter id="pixelate" x="0" y="0" width="1" height="1">
                  <feFlood x="4" y="4" height="2" width="2"/>
                  <feComposite width="10" height="10"/>
                  <feTile result="a"/>
                  <feComposite in="SourceGraphic" in2="a" operator="in"/>
                  <feMorphology operator="dilate" radius="5"/>
                </filter>
                <filter id="shadow">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="12" />
                </filter>
              </defs>
              <image
                alt="example"
                style={!isCrop || _.isEmpty(previewStyle) ? {width: "100%"} : previewStyle}
                xlinkHref={croppedImg || previewImage}
                filter={isPixelated ? "url(#pixelate)" : null}>
              </image>
              { isShadow ? <rect x="180" y="120" width="100" height="100"
                    style={{ stroke:"#000000", fill:"#ffffff", filter:"url(#shadow)" }} /> : ''}
            </svg>
          }
          <br />
          <Button onClick={this.isCropClick} style={{ marginTop: '10px' }}>Crop</Button>
          {isCrop ? <Button onClick={this.finishCropClick}>Ok</Button> : null}
          <Button onClick={this.pixelateClick} style={{ marginTop: '10px' }}>Pixelate</Button>
          <Button onClick={this.shadowClick} style={{ marginTop: '10px' }}>Shadow</Button>
        </Modal>
      </div>
    );
  }
}

export default ImageUpload;