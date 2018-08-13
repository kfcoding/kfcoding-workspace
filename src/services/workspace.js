import request from '../utils/request';
import API from "../utils/api";

export function getWorkSpace(id) {
  return request(API + '/workspaces/'+id);
}

export function startWorkSpace(id) {
  return request(API + '/workspaces/'+id+'/start');
}

export function keepWorkSpace(name) {
  return request(API + '/workspaces/keep?'+ "containerName=" + name + "&type=workspace")
}

export function startWorkspace(id) {
  return request(API + '/workspaces/' + id + '/start');
}

export function submitMyWork(workspace_id) {
  return request(API + '/submissions/submit?workspace_id=' + workspace_id)
}

export function getWork(workId) {
  return request(API + '/works/' + workId);
}