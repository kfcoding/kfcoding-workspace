import { types, getParent, getRoot, hasParentOfType } from 'mobx-state-tree';

export const File = types
  .model('File', {
    name: types.string,
    isDir: types.boolean,
    type: types.string,
    size: types.number,
    path: types.identifier(),
    children: types.late(() => types.array(File)),
    content: '',
    dirty: false,
    expanded: false
  }).views(self => ({
    get store() {
      return getRoot(self);
    },
    get depth() {
      if (!hasParentOfType(self, File)) {
        return 0;
      } else {
        return getParent(self, 2).depth + 1;
      }
    }
  })).actions(self => {

    function setDirty(flag) {
      self.dirty = flag;
    }

    function setContent(content) {
      self.content = content
    }

    function setChildren(data) {
      self.children = data;
    }

    function setExpanded(flag) {
      self.expanded = flag;
    }

    function loadChildren() {
      self.store.socket.emit('fs.readdir', {path: self.path}, data => {
        console.log(data);
        self.setChildren(data);
        self.setExpanded(true);
      })
    }

    function toggleDir() {
      if (self.isDir) {
        if (self.expanded) {
          self.expanded = false;
        } else {
          loadChildren();
          self.expanded = true;
        }
      }
    }

    // function open() {
    //   self.store.socket.emit('fs.readfile', {path: self.path}, data => {
    //     self.setContent(data);
    //     self.store.openedFiles.push(self);
    //     self.view.editorIndex = self.openedFiles.length -1;
    //   })
    // }

    return {
      setDirty,
      setContent,
      loadChildren,
      setChildren,
      setExpanded,
      toggleDir,
      // open
    }
  });

export const FileStore = types
  .model("FileStore", {
    files: types.array(File)
  }).views(self => ({
    get store() {
      return getParent(self)
    }
  })).actions(self => {
    let socket = self.store.socket;

    function setFiles(files) {
      self.files = files;
    }

    function setChildren(file, files) {
      file.children = files;
    }

    function setContent(file, content) {
      file.content = content;
    }

    function loadFiles(path, fn) {
      self.store.socket.emit('fs.readdir', {path: path || '/tmp'}, data => {
        self.store.fileStore.setFiles(data);
        fn && fn();
      })
    }

    function readdir(file) {
      self.store.socket.emit('fs.readdir', {path: file.path}, data => {
        self.store.fileStore.setChildren(file, data);
      })
    }

    function mkdir(path) {
      self.store.socket.emit('fs.mkdir', {path: path});
    }

    function writefile(path, content) {
      self.store.socket.emit('fs.writefile', {path: path, content: content || ''});
    }

    function unlink(file) {
      self.store.socket.emit('fs.unlink', {path: file.path});
    }

    function rename(file, newPath) {
      self.store.socket.emit('fs.rename', {oldPath: file.path, newPath: newPath});
    }

    function rmdir(file) {
      if (file.isDir) {
        self.store.socket.emit('fs.rmdir', {path: file.path});
      }
    }

    function readfile(file, fn) {
      if (!file.isDir) {
        self.store.socket.emit('fs.readfile', {path: file.path}, data => {
          self.store.fileStore.setContent(file, data);
          fn.apply(self.store);
        })
      }
    }

    return {
      loadFiles,
      setFiles,
      setChildren,
      setContent,
      readdir,
      mkdir,
      writefile,
      unlink,
      rename,
      rmdir,
      readfile
    }
  });