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
  return request('http://aliapi.workspace.cloudwarehub.com/workspace/keep', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({name : name})
  })
}