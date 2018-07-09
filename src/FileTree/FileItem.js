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
  observer(({parentFile, file, store}) => {
    const handleAddFileClick = (e, data) => {
      let newFile = {
        name: '',
        isDir: false,
        type: 'file',
        size: 0,
        // path: file.path + "/",
        path: file.path + '/',
        children: [],
        content: '',
        dirty: false,
        expanded: false,
        add: 'file',
        reName: false,
      }
      if (!file.expanded) {
        const fn = () => {
          file.pushChildren(newFile)
        }
        console.log(newFile.path);
        file.toggleDir(fn)
      } else {
        file.pushChildren(newFile)
      }

    }

    const handleAddFoldClick = (e, data) => {
      let newFold = {
        name: '',
        isDir: true,
        type: 'file',
        size: 0,
        path: file.path + '/',
        children: [],
        content: '',
        dirty: false,
        expanded: false,
        add: 'fold',
        reName: false,
      }
      if (!file.expanded) {
        const fn = () => {
          file.pushChildren(newFold)
        }
        file.toggleDir(fn)
      } else {
        file.pushChildren(newFold)
      }
    }

    const handleRenameClick = (e, data) => {
      file.setReName(true);
    }

    const handleFileOnBlue = (event) => {
      if (event.target.value !== '') {
        const path = file.path + event.target.value;

        let newFile = {
          name: event.target.value,
          isDir: false,
          type: 'file',
          size: 0,
          path: path,
          children: [],
          content: '',
          dirty: false,
          expanded: false,
          add: '',
          reName: false,
        }
        store.fileStore.writefile(path, '');
        parentFile.removeChildren(file);
        parentFile.pushChildren(newFile)
      } else {
        parentFile.popChildren()
      }
    }

    const handleDirOnBlue = (event) => {
      if (event.target.value !== '') {
        const path = file.path + event.target.value;
        let newFold = {
          name: event.target.value,
          isDir: true,
          type: 'file',
          size: 0,
          // path: file.path + "/",
          path: path,
          children: [],
          content: '',
          dirty: false,
          expanded: false,
          add: '',
          reName: false,
        }
        store.fileStore.mkdir(path);
        parentFile.removeChildren(file)
        parentFile.pushChildren(newFold)
      } else {
        parentFile.popChildren()
      }
    }

    const handleReNameOnBlue = (event) => {
      if (!file.reName) {
        return;
      }
      if (event.target.value !== '') {
        const pathArray = file.path.split('/');
        var path = '';
        if (file.isDir) {
          pathArray[pathArray.length] = event.target.value;
        } else {
          pathArray[pathArray.length - 1] = event.target.value;
        }
        path = pathArray.toString();
        path = path.replace(/,/g, "/")
        store.fileStore.rename(file, path);
      }
      parentFile.loadChildren();
    }

    const handleDeleteClick = (e, data) => {
      if (file.isDir) {
        store.fileStore.rmdir(file)
      } else {
        store.fileStore.unlink(file)
      }
      parentFile.removeChildren(file);
    }

    const handleInputChange = (event) => {
      file.setName(event.target.value)
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
                  {file.add === '' ? file.name :
                    <input autoFocus={true} onBlur={handleDirOnBlue} className='add-item-input' type='text'
                           value={file.name} onChange={handleInputChange}/>}
                </span></FileContainer>
              :
              <FileContainer active={file.path === store.view.currentFilePath} depth={file.depth} onDoubleClick={() => {
                file.open()
              }}><i style={{fontStyle: 'normal'}} className={icons.getClassWithColor(file.name)}></i>
              <span style={{paddingLeft: 5}}>
                  {file.add === '' ? (!file.reName ? file.name :
                    <input autoFocus={true} onBlur={handleReNameOnBlue} className='add-item-input' type='text'
                           value={file.name} onChange={handleInputChange}/>) :
                    <input autoFocus={true} onBlur={handleFileOnBlue} className='add-item-input' type='text'
                           value={file.name} onChange={handleInputChange}/>}
                  </span></FileContainer>
            }
            <div style={{display: file.expanded ? 'block' : 'none'}}>
              {file.children.sort((a, b) => {
                return b.isDir - a.isDir
              }).map(f => <FileItem parentFile={file} key={f} file={f}/>)}
            </div>
          </Container>
        </ContextMenuTrigger>
        <ContextMenu id={file.path} className='menu'>
          <MenuItem onClick={handleAddFileClick} data={{item: 'item 1'}}
                    attributes={{className: 'menu-item-container'}}><IconFile
            style={{marginRight: '5px'}}/>添加文件</MenuItem>
          <MenuItem onClick={handleAddFoldClick} data={{item: 'item 2'}}
                    attributes={{className: 'menu-item-container'}}><IconFolder
            style={{marginRight: '5px'}}/>添加文件夹</MenuItem>
          <MenuItem divider/>
          <MenuItem onClick={handleRenameClick} data={{item: 'item 3'}} attributes={{className: 'menu-item-container'}}><IconFaCircleONotch
            style={{marginRight: '5px'}}/>重命名</MenuItem>
          <MenuItem onClick={handleDeleteClick} data={{item: 'item 3'}} attributes={{className: 'menu-item-container'}}><IconBucket
            style={{marginRight: '5px'}}/>删除文件</MenuItem>
        </ContextMenu>

      </div>
    )
  })
)

export default FileItem;