import React from 'react';
import { inject, observer } from "mobx-react/index";
import FileItem from "./FileItem";

const FileTree = inject('store')(
  observer(({store}) => (
    <div style={{background: '#364040', height: '100%', color: '#fff'}}>
      {store.files.map(f => <FileItem key={f} file={f}/>)}
    </div>
  ))
)

export default FileTree;