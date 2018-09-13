import {types} from 'mobx-state-tree';

export const UploadStore = types
  .model({
    visibility: false,
    uploadUrl: ""
  }).actions(self => ({

    setVisibility(flag) {
      self.visibility = flag;
    },

    setUploadUrl(url) {
      self.uploadUrl = url;
    },

  }));