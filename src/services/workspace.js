import request from '../utils/request';
import API from "../utils/api";

export function createWorkSpace(data) {
  return request(API + '/workspaces', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export function getWorkSpace(id) {
  return request(API + '/workspaces/'+id);
}

export function keepWorkSpace(name) {
  return request('http://aliapi.workspace.kfcoding.com/keep/workspace', {
    // return request('http://192.168.200.251:3000/keep/workspace', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({name : name})
  })
}

export function startWorkspace(id) {
  return request(API + '/workspaces/' + id + '/start');
}

export function submitMyWork(workspace_id) {
  return request(API + '/submissions/submit?workspace_id=' + workspace_id)
}