import {types, getParent, getRoot, hasParentOfType} from 'mobx-state-tree';

export const Work = types.model('Work', {
  name: types.string,
  description: types.string
});