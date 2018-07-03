import React from 'react';
import styled from 'styled-components';
import style from './FileItem.css'
import {inject, observer} from "mobx-react/index";
import {ContextMenu, MenuItem, ContextMenuTrigger} from "react-contextmenu";
import IconFolder from 'react-icons/lib/fa/folder';
import IconFolderOpen from 'react-icons/lib/fa/folder-open';
import IconFile from 'react-icons/lib/fa/file';
import IconBucket from 'react-icons/lib/fa/bitbucket';
import IconFaCircleONotch from 'react-icons/lib/fa/circle-o-notch';
import AddItem from './AddItem';
import icons from 'file-icons-js';

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
  white-space: nowrap;
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

    const handleAddFileClick = (e, data) => {
      file.setAdd('file');
      if (!file.expanded) {
        file.toggleDir()
      }
      const input = this.refs.addItem.refs.fileInput;
      input.focus();
      input.setSelectionRange(0, input.value.length);
      // console.log(data.item);

    }

    const handleAddFoldClick = (e, data) => {
      file.setAdd('fold');
      if (!file.expanded) {
        file.toggleDir()
      }
      console.log("refs")
      console.log(this.refs)
      // const input = this.refs.addItem.refs.foldInput;
      // input.focus();
      // input.setSelectionRange(0, input.value.length);
      // console.log(data.item);
    }

    const handleRenameClick = (e, data) => {

    }

    const handleChange = (event) => {
      file.setRename(event.target.value);
    }

    const handleOnBlue = (event) => {
    }

    const handleDeleteClick = (e, data) => {
      store.fileStore.rmdir(file)
      // console.log(data.item);
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
                  {/*{file.reName? <div>file.name</div> : <input onblur={handleOnBlue} ref='foldInput' className='add-item-input' type='text' value={file.name} onChange={handleChange}> }*/}

                </span></FileContainer>
              :
              <FileContainer active={file.path === store.view.currentFilePath} depth={file.depth} onDoubleClick={() => {
                file.open()
              }}><i style={{fontStyle: 'normal'}} className={icons.getClassWithColor(file.name)}></i><span style={{paddingLeft: 5}}>{file.name}</span></FileContainer>
            }
            <div style={{display: file.expanded ? 'block' : 'none'}}>
              <AddItem file={file} ref='addItem'/>
              {file.children.sort((a, b) => {return b.isDir - a.isDir}).map(f => <FileItem key={f} file={f}/>)}
            </div>
          </Container>
        </ContextMenuTrigger>
        <ContextMenu id={file.path} className='menu'>
          <MenuItem onClick={handleAddFileClick.bind(this)} data={{ item: 'item 1' }} attributes={{className :'menu-item-container'}}><IconFile style={{marginRight: '5px'}}/>添加文件</MenuItem>
          <MenuItem onClick={handleAddFoldClick} data={{ item: 'item 2' }} attributes={{className :'menu-item-container'}}><IconFolder style={{marginRight: '5px'}}/>添加文件夹</MenuItem>
          <MenuItem divider />
          <MenuItem onClick={handleRenameClick} data={{ item: 'item 3' }} attributes={{className :'menu-item-container'}}><IconFaCircleONotch style={{marginRight: '5px'}}/>重命名</MenuItem>
          <MenuItem onClick={handleDeleteClick} data={{ item: 'item 3' }} attributes={{className :'menu-item-container'}}><IconBucket style={{marginRight: '5px'}}/>删除文件</MenuItem>
        </ContextMenu>

      </div>
    )
  })
)

export default FileItem;