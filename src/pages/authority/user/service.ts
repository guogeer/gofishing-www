import { request } from 'umi';
import { request_table } from '@/utils/request';
import type { TableListParams } from './data';

export async function getUserList(params: TableListParams) {
  return request_table('/api/user/userList', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function getUser(params: TableListParams) {
  return request('/api/user/user', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addUser(params: TableListParams) {
  return request('/api/user/user', {
    method: 'POST',
    data: {
      ...params,
      action: 'add',
    },
  });
}

export async function deleteUser(params: TableListParams) {
  return request('/api/user/user', {
    method: 'POST',
    data: {
      ...params,
      action: 'delete',
    },
  });
}

export async function updateUser(params: TableListParams) {
  return request('/api/user/user', {
    method: 'POST',
    data: {
      ...params,
      action: 'update',
    },
  });
}
