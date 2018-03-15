import React from 'react';
import { Upload, Icon, Modal, Button, Slider, Input, Row, Col, message } from 'antd';
import { Cropper } from 'react-image-cropper'
import _ from 'lodash';
import { HuePicker } from 'react-color';

class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      currentKey: 0,
      previewImage: [],
      imageUrl: '',
      previewVisible: false,
      isCrop: false,
      isDelete: false,
      previewStyle: {},
      shadowColor: { hex:'#000000', a:1, rgb:{} },
      currentImageStatus: [],
    };
    this.finishCropClick = this.finishCropClick.bind(this);
  }

  // close the modal
  handleCancel = () => this.setState({
    previewVisible: false,
    isCrop: false,
   })

  // show the cropped image or origin one
  // previewImage : [{cropped, origin, uid}]
  handlePreview = (file) => {
    const { previewImage } = this.state;
    let currentKey = 0;

    _.map(previewImage, (value, key) => { if (value.uid === file.uid) { currentKey = key; } });

    this.setState({
      currentKey,
      previewVisible: true,
    });
  }

  // upload function
  handleChange = ({ fileList }) => {
    const { previewImage, currentImageStatus, isDelete, currentKey } = this.state;
    const newfile = _.last(fileList);
    if (newfile.status !== 'uploading' && !isDelete) {
      const tempObj = {};

      tempObj.cropped = newfile.thumbUrl;
      tempObj.origin = tempObj.cropped;
      tempObj.uid = newfile.uid;
      previewImage.push(tempObj);

      currentImageStatus.push({
        pixelate: false,
        shadow: false,
      });
    } else if(newfile.status !== 'uploading') {
      previewImage.splice(currentKey, 1);
      currentImageStatus.splice(currentKey, 1);
    }
    this.setState({
      fileList,
      previewImage,
      currentImageStatus,
      isDelete: false,
    })
  }

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
    const { previewImage, currentKey } = this.state;
    let node = this.cropper;

    if (node.crop() !== 'data:,') previewImage[currentKey].cropped = node.crop();

    this.setState({
      previewImage,
      isCrop: false,
    })
  }

  // add image by entered url
  addImageByUrl = () => {
    const { fileList, imageUrl, previewImage, currentImageStatus } = this.state;
    if (imageUrl.match(/\.(jpeg|jpg|gif|png)$/) === null) {
      message.error('please check your image address!', 2);
      return;
    }

    const count = Object.keys(fileList).length;
    fileList.push({
      uid: count + 1,
      name: `example${count}.png`,
      status: 'done',
      url: imageUrl,
    });
    previewImage.push({
      cropped: imageUrl,
      origin: imageUrl,
      uid: count + 1,
    });
    currentImageStatus.push({
      pixelate: false,
      shadow: false,
    });

    this.setState({
      fileList,
      previewImage,
      currentImageStatus,
      imageUrl: ''
    });
  }

  // switch the pixel style or not
  pixelateClick = () => {
    const { currentImageStatus, currentKey } = this.state;
    currentImageStatus[currentKey].pixelate = currentImageStatus[currentKey].pixelate
      ? false : true;
    this.setState({
      currentImageStatus,
    });
  }

  // switch the shadow style or not
  shadowClick = () => {
    const { currentImageStatus, currentKey } = this.state;
    currentImageStatus[currentKey].shadow = currentImageStatus[currentKey].shadow
      ? false : true;
    this.setState({
      currentImageStatus
    });
  }

  // cleck the delete icon on photo
  deleteClick = (file) => {
    const { previewImage } = this.state;
    let currentKey = 0;

    _.map(previewImage, (value, key) => { if (value.uid === file.uid) { currentKey = key; } });

    this.setState({
      isDelete: true,
      currentKey
    });
  }


  render() {
    const { previewVisible, previewImage, fileList, previewStyle, isCrop,
      currentKey, shadowColor, imageUrl, currentImageStatus } = this.state;
    const isImagePixelate = currentImageStatus[currentKey] ? currentImageStatus[currentKey].pixelate : false;
    const isImageShadow = currentImageStatus[currentKey] ? currentImageStatus[currentKey].shadow : false;

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
            onRemove={this.deleteClick}
          >
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">Upload</div>
            </div>
          </Upload>
        </Col>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} style={{ height: '100%' }}>
          {isCrop
            ? <Cropper
              src={previewImage[currentKey] ? previewImage[currentKey].cropped : null}
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
                xlinkHref={previewImage[currentKey] ? previewImage[currentKey].cropped : null}
                filter={isImagePixelate ? (isImagePixelate ? "url(#pixelate)" : null) : null}>
              </image>
              { isImageShadow ? <rect x="0" y="0" width="100%" height="100%"
                style={{ stroke:"#000000", fill:shadowColor.hex, filter:"url(#shadow)",
                fillOpacity: shadowColor.a }} /> : ''}
            </svg>
          }
          <br />
          <Button onClick={this.isCropClick} style={{ marginTop: '10px' }}>Crop</Button>
          {isCrop ? <Button onClick={this.finishCropClick}>Ok</Button> : null}
          <Button onClick={this.pixelateClick} style={{ marginTop: '10px' }}>Pixelate</Button>
          <Button onClick={this.shadowClick} style={{ marginTop: '10px' }}>Shadow</Button>
          { isImageShadow
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