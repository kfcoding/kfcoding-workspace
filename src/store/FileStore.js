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
    expanded: false,
    add: '',
    addName: '',
    reName: '',
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
    function setReName(name) {
      self.reName = name;
    }

    function setAddName(name) {
      self.addName = name;
    }

    function setAdd(flag) {
      self.add = flag;
    }

    function setDirty(flag) {
      self.dirty = flag;
    }

    function setContent(content) {
      self.content = content
    }

    function setChildren(data) {
      self.children = data;
    }

    function pushChildren(child) {
      const array = self.children.slice();
      array.push(child);
      self.children = array
      console.log(self.children.slice())
    }

    function setExpanded(flag) {
      self.expanded = flag;
    }

    function loadChildren(fn) {
      self.store.socket.emit('fs.readdir', {path: self.path}, data => {
        self.setChildren(data);
        self.setExpanded(true);
        fn && fn(data)
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

    function open() {
      self.store.socket.emit('fs.readfile', {path: self.path}, data => {
        self.setContent(data);
        self.store.pushOpenedFile(self);
        self.store.view.setEditorIndex(self.store.openedFiles.length - 1);
      })
    }

    return {
      setReName,
      setAddName,
      setAdd,
      setDirty,
      setContent,
      loadChildren,
      setChildren,
      pushChildren,
      setExpanded,
      toggleDir,
      open
    }
  });

export const FileStore = types
  .model("FileStore", {
    root: types.optional(File, {
      name: 'workspace',
      path: '/tmp/workspace',
      isDir: true,
      size: 0,
      type: 'file',
      children: []
    })
  }).views(self => ({
    get store() {
      return getParent(self)
    }
  })).actions(self => {

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
      mkdir,
      writefile,
      unlink,
      rename,
      rmdir,
      // readfile
    }
  });