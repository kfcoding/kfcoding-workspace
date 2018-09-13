import React, {PureComponent} from 'react'
import './upload.css';

export default class UploadFile extends PureComponent {
  state = {
    path: '',
    data: null
  };

  changePath = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    this.setState({path: file.name, data: file})
  };

  upload = () => {

    const data = this.state.data;
    if (!data) {
      console.log('未选择文件');
      return;
    }

    //此处的url应该是服务端提供的上传文件api
    const url = this.props.uploadUrl;

    const form = new FormData();

    //此处的file字段由服务端的api决定，可以是其它值
    form.append('file', data);

    fetch(url, {
      method: 'POST',
      body: form
    }).then(res => {
      console.log(res);
      if (res.status === 200) {
        alert("上传成功");
        this.props.closeOverlay();
      } else {
        res.text().then(function (responseText) {
          console.log(responseText);
          let obj = JSON.parse(responseText);
          alert(obj.error);
        });
      }
    })
  };

  cancel = () => {
    this.props.closeOverlay();
  };

  render() {
    return (
      <div>
        <h4>上传文件</h4>
        <div className='row'>
          <label>文件路径</label>
          <div className='row-input'>
            <span>{'请选择文件路径'}</span>
            <input type='file' accept='*/*' onChange={this.changePath}/>
          </div>
        </div>
        <button className='primary upload' onClick={this.upload}>上传</button>
        <button className='primary cancel' onClick={this.cancel}>取消</button>
      </div>
    )
  }
}