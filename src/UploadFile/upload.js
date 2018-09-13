import React, {Component} from 'react'

import Overlay from './overlay'
import UploadFile from './uploadFile'
import styled from "styled-components";
import IconCommit from 'react-icons/lib/fa/upload';
import './upload.css';

export default class Upload extends Component {
  state = {
    overlayActive: false
  };
  closeOverlay = () => {
    this.setState({overlayActive: false})
  };
  showOverlay = () => {
    this.setState({overlayActive: true})
  };

  render() {
    return (
      <div>
        {this.state.overlayActive &&
        <Overlay onClose={this.closeOverlay}><UploadFile closeOverlay={this.closeOverlay}
                                                         uploadUrl={this.props.uploadUrl}/></Overlay>}

        <Action title='上传文件' onClick={this.showOverlay}>
          <IconCommit/>
        </Action>
      </div>
    )
  }
}


const styles = props =>
  `
  display: flex !important;
  transition: 0.3s ease all;
  flex-direction: row;
  align-items: center;
  vertical-align: middle;
  font-size: .875rem;
  line-height: 1;
  height: 100%;
  color: rgba(255,255,255,0.7);
  cursor: pointer;
  box-sizing: inherit;
  z-index: 1;
  padding-left: 10px;
  padding-right: 10px;
  
  &:hover {
    color: rgba(255,255,255, 1);
    background: #444;
  }
  
`;

export const Action = styled.div`
  ${styles};
`;
