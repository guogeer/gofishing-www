import { request_table } from '@/utils/request';
import type { TableListParams, RewardParams } from './data';

export async function getUserList(inParams: TableListParams) {
  const params = inParams;
  return request_table('/api/data/user', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function fetchUser(params: TableListParams) {
  return request_table('/api/data/user', {
    method: 'POST',
    data: {
      action: 'query',
      ...params,
    },
  });
}

export async function deleteUser(params: TableListParams) {
  return request_table('/api/data/user', {
    method: 'POST',
    data: {
      action: 'delete',
      ...params,
    },
  });
}

export async function addItems(params: RewardParams) {
  return request_table('/api/data/addItems', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function exportUsers(inParams: TableListParams) {
  const params = inParams;
  return request_table('/api/data/user', {
    method: 'POST',
    data: {
      ...params,
      action: 'export',
    },
  });
}
