import React from 'react';
import styled from 'styled-components';
import style from './FileIntem.css'
import FileIcon, {defaultStyles} from 'react-file-icon';
import {inject, observer} from "mobx-react/index";
// import Icon from 'react-native-vector-icons/dist/Feather';
import {ContextMenu, MenuItem, ContextMenuTrigger} from "react-contextmenu";
import IconFolder from 'react-icons/lib/fa/folder';
import IconFolderOpen from 'react-icons/lib/fa/folder-open';
import IconFile from 'react-icons/lib/fa/file';
import IconBucket from 'react-icons/lib/fa/bitbucket';

const Container = styled.div`
  
`;

const FileContainer = styled.div`
  padding: 0.4rem 3rem 0.4rem calc(1rem - 2px);
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  color: #ccc;
  background: ${props => props.active ? 'rgba(139,191,228,0.2)' : 'inherit'};
  padding-left: ${props => 20 + props.depth * 20 + 'px'};
  border-left: 2px solid ${props => props.active ? '#fff' : 'inherit'};
  &:hover {
    background: rgba(108,174,221,0.1);
  }
`;
// const ContextMenu = styled.div`
//   color: #ccc;
//     background-color: #333;
//     border-color: #3a3a3a;
//     opacity: 0.95;
//     position: absolute;
//     z-index: 501;
//     box-shadow: 0 4px 20px 1px rgba(0,0,0,0.3);
//     border-radius: 4px;
//     border: 1px solid transparent;
//     padding: 4px 0;
// `

// class FileItem1 extends React.Component {
//   render() {
//     let {file} = this.props;
//     return (
//       <Container active={false}>
//         <FileContainer onClick={file.loadChildren}><FileIcon size={16} extension="file" {...defaultStyles.txt} /> {this.props.file.name}</FileContainer>
//         {file.children.map(f => <FileItem key={f} file={f}/>)}
//       </Container>
//     )
//   }
// }


const FileItem = inject('store')(
  observer(({file, store}) => {

    const handleClick = (e, data) => {
      console.log(data.item);
    }

    return (
      <div>
        <ContextMenuTrigger id={file.path} holdToDisplay={1000}>
          <Container active={false}>
            {file.isDir ?
              <FileContainer depth={file.depth} onClick={() => {
                file.toggleDir()
              }}>
                {file.expanded ?
                  <IconFolderOpen/>
                  :
                  <IconFolder/>
                }
                <span style={{paddingLeft: 5}}>
                {file.name}
                </span></FileContainer>
              :
              <FileContainer active={file.path === store.view.currentFilePath} depth={file.depth} onDoubleClick={() => {
                store.openFile(file)
              }}><IconFile/><span style={{paddingLeft: 5}}>{file.name}</span></FileContainer>
            }
            <div style={{display: file.expanded ? 'block' : 'none'}}>
              {file.children.map(f => <FileItem key={f} file={f}/>)}
            </div>
          </Container>
        </ContextMenuTrigger>
        <ContextMenu id={file.path} className='menu'>
          <MenuItem onClick={handleClick} data={{ item: 'item 1' }} attributes={{className :'menu-item-container'}}><IconFile style={{marginRight: '5px'}}/>添加文件</MenuItem>
          <MenuItem onClick={this.handleClick} data={{ item: 'item 2' }} attributes={{className :'menu-item-container'}}><IconFolder style={{marginRight: '5px'}}/>添加文件夹</MenuItem>
          <MenuItem divider />
          <MenuItem onClick={this.handleClick} data={{ item: 'item 3' }} attributes={{className :'menu-item-container'}}><IconBucket style={{marginRight: '5px'}}/>删除文件</MenuItem>
        </ContextMenu>
      </div>
    )
  })
)

export default FileItem;