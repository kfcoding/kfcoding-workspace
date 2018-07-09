import {types, getParent, getRoot, hasParentOfType} from 'mobx-state-tree';

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
    reName: false,
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
    function setReName(flag) {
      self.reName = flag;
    }

    function setName(name) {
      self.name = name;
    }

    function setAdd(flag) {
      self.add = flag;
    }

    function setType(type) {
      self.type = type;
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

    function pushChildren(file) {
      self.children.push(file)
    }

    function popChildren() {
      self.children.pop()
    }

    function removeChildren(file) {
      self.children.remove(file)
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

    function toggleDir(fn) {
      if (self.isDir) {
        if (self.expanded) {
          self.expanded = false;
        } else {
          loadChildren(fn);
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
      setName,
      setType,
      setAdd,
      setDirty,
      setContent,
      loadChildren,
      setChildren,
      pushChildren,
      popChildren,
      removeChildren,
      setExpanded,
      toggleDir,
      open
    }
  });

export const FileStore = types
  .model("FileStore", {
    root: types.optional(File, {
      name: 'workspace',
      path: '/workspace',
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
      self.store.socket.emit('fs.mkdir', {path: path}, (data) => {
        if (data) alert(data)
      });
    }

    function writefile(path, content) {
      self.store.socket.emit('fs.writefile', {path: path, content: content || ''});
    }

    function unlink(file) {
      self.store.socket.emit('fs.unlink', {path: file.path});
    }

    function rename(file, newPath) {
      self.store.socket.emit('fs.rename', {oldPath: file.path, newPath: newPath}, (data) => {
        console.log(data)
      });
    }

    function rmdir(file) {
      if (file.isDir) {
        self.store.socket.emit('fs.rmdir', {path: file.path}, (data) => {
          if (data) alert(data)
        });
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