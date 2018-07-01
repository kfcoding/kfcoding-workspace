import { types, getParent, flow } from 'mobx-state-tree';

export const File = types
  .model('File', {
    name: types.string,
    isDir: types.boolean,
    type: types.string,
    size: types.number,
    path: types.identifier(),
    children: types.late(() => types.array(File)),
    content: '',
    dirty: false
  }).views(self => ({
    get store() {
      return getParent(self, 2);
    }
  })).actions(self => {

    function loadWorkspace() {
      self.store.socket.emit('fs.readdir', {path: '/tmp'}, data => {
        console.log(data)
        self.files = data;
      })
    }

    function setDirty(flag) {
      self.dirty = flag;
    }

    function setContent(content) {
      self.content = content
    }

    return {
      setDirty,
      setContent
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

    function readfile(file) {
      if (!file.isDir) {
        self.store.socket.emit('fs.readfile', {path: file.path}, data => {
          self.store.fileStore.setContent(file, data);
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