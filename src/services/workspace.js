import request from '../utils/request';
import API from "../utils/api";

export function getWorkSpace(id) {
  return request(API + '/workspaces/'+id);
}

export function startWorkSpace(id) {
  return request(API + '/workspaces/'+id+'/start');
}

export function keepWorkSpace(name) {
  return request(API + '/workspace/keep', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({name : name, type : 'workspace'})
  })
}