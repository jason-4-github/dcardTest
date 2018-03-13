import React from 'react';
import { Upload, Icon, Modal, Button, Slider, Input, Row, Col } from 'antd';
import { Cropper } from 'react-image-cropper'
import _ from 'lodash';
import { isAbsolute } from 'path';
import { HuePicker } from 'react-color';

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
      shadowColor: {hex:'#000000', a:1, rgb:{}},
      imageUrl: '',
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

  handleChange = ({ fileList }) => {this.setState({ fileList })}

  handleColorChange = (e) => {
    const { shadowColor } = this.state;
    // const colorHex = `#${e.hex[1]}${e.hex[3]}${e.hex[5]}`
    shadowColor.hex = e.hex;
    shadowColor.rgb = _.omit(e.rgb, ['a']);
    this.setState({ shadowColor });
  }

  handleAlphaChange = (e) => {
    const { shadowColor } = this.state;
    shadowColor.a = e;
    this.setState({ shadowColor });
  }

  cropOnChange = (e) => { this.setState({ previewStyle: e.display }) }

  imageUrlOnChange = (e) => { this.setState({ imageUrl: e.target.value }); }

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

  addImageByUrl = () => {
    const { fileList, imageUrl } = this.state;
    const count = Object.keys(fileList).length;
    fileList.push({
      uid: count + 1,
      name: `example${count}.png`,
      status: 'done',
      // url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      url: imageUrl,
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
      croppedImg, isPixelated, isShadow, shadowColor } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    console.log(croppedImg);
    return (
      <Row className="clearfix">
      <Col span={4} />
      <Col span={16}>
        <Col span={24} style={{ textAlign: 'center' }}>
          <h1>UpLoad Image</h1>
        </Col>
        <Col span={16}>
          <Input placeholder="Enter The Image Url" onChange={this.imageUrlOnChange} />
        </Col>
        <Col span={8}>
          <Button onClick={this.addImageByUrl} >Add</Button>
        </Col>
        <Col span={24} style={{ paddingTop: '20px', textAlign: 'center' }}>
          <Upload
            action="//jsonplaceholder.typicode.com/posts/"
            listType="picture-card"
            fileList={fileList}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
          >
            {uploadButton}
          </Upload>
        </Col>
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
              { isShadow ? <rect x="0" y="0" width="100%" height="100%"
                style={{ stroke:"#000000", fill:shadowColor.hex, filter:"url(#shadow)",
                fillOpacity: shadowColor.a }} /> : ''}
            </svg>
          }
          <br />
          <Button onClick={this.isCropClick} style={{ marginTop: '10px' }}>Crop</Button>
          {isCrop ? <Button onClick={this.finishCropClick}>Ok</Button> : null}
          <Button onClick={this.pixelateClick} style={{ marginTop: '10px' }}>Pixelate</Button>
          <Button onClick={this.shadowClick} style={{ marginTop: '10px' }}>Shadow</Button>
          { isShadow
            ? <div><HuePicker color={shadowColor.hex} onChange={this.handleColorChange} />
              <Slider
                min={0}
                max={1}
                style={{ width: '60%' }}
                onChange={this.handleAlphaChange}
                value={shadowColor.a}
                step={0.01}
              />
              </div>
            : null }
        </Modal>
      </Col>
      <Col span={4} />
      </Row>
    );
  }
}

export default ImageUpload;