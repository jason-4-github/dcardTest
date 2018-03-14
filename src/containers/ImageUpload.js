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
      fileList: [{
        uid: -1,
        name: 'xxx.png',
        status: 'done',
        // url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png ',
        url: 'http://a1.att.hudong.com/86/38/300001140423130278388082725_950.jpg',
      }],
      previewImage: '',
      croppedImg: '',
      imageUrl: '',
      previewVisible: false,
      isCrop: false,
      imageLoaded: false,
      isPixelated: false,
      isShadow: false,
      previewStyle: {},
      shadowColor: { hex:'#000000', a:1, rgb:{} },
    };
    this.finishCropClick = this.finishCropClick.bind(this);
  }

  // close the modal
  handleCancel = () => this.setState({
    previewVisible: false,
    isCrop: false,
    isPixelated: false,
    isShadow: false,
   })

  // show the cropped image or origin one
  handlePreview = (file, d, e) => {
    console.log(file, d, e);
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = ({ fileList }) => {this.setState({ fileList })}

  handleColorChange = (e) => {
    const { shadowColor } = this.state;
    shadowColor.hex = e.hex;
    shadowColor.rgb = _.omit(e.rgb, ['a']);
    this.setState({ shadowColor });
  }

  handleAlphaChange = (e) => {
    const { shadowColor } = this.state;
    shadowColor.a = e;
    this.setState({ shadowColor });
  }

  // save the cropping image
  cropOnChange = (e) => { this.setState({ previewStyle: e.display }) }

  // save the entered url
  imageUrlOnChange = (e) => { this.setState({ imageUrl: e.target.value }); }

  // click crop button
  isCropClick = () => {
    const { isCrop } = this.state;
    this.setState({ isCrop:  isCrop ? false : true });
  }

  // save the cropped image
  finishCropClick () {
    let node = this.cropper;
    this.setState({
      croppedImg: node.crop(),
      isCrop: false,
    })
  }

  // add image by entered url
  addImageByUrl = () => {
    const { fileList, imageUrl } = this.state;
    const count = Object.keys(fileList).length;
    fileList.push({
      uid: count + 1,
      name: `example${count}.png`,
      status: 'done',
      url: imageUrl,
    });
    this.setState({ fileList, imageUrl: '' });
  }

  // switch the pixel style or not
  pixelateClick = () => {
    const { isPixelated } = this.state;
    this.setState({ isPixelated: isPixelated ? false : true });
  }

  // switch the shadow style or not
  shadowClick = () => {
    const { isShadow } = this.state;
    this.setState({ isShadow: isShadow ? false : true });
  }


  render() {
    const { previewVisible, previewImage, fileList, previewStyle, isCrop,
      croppedImg, isPixelated, isShadow, shadowColor, imageUrl } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    console.log(previewImage);
    return (
      <Row className="clearfix">
      <Col span={4} />
      <Col span={16}>
        <Col span={24} style={{ textAlign: 'center' }}>
          <h1>UpLoad Image</h1>
        </Col>
        <Col span={16}>
          <Input placeholder="Enter The Image Url" value={imageUrl} onChange={this.imageUrlOnChange} />
        </Col>
        <Col span={8}>
          <Button onClick={this.addImageByUrl} >Add</Button>
        </Col>
        <Col span={24} style={{ paddingTop: '20px', textAlign: 'center' }}>
          <Upload
            action="https://jsonplaceholder.typicode.com/posts"
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