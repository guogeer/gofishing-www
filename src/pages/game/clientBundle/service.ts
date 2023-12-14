import { request_table } from '@/utils/request';
import type { TableListParams } from './data';

export async function getItemList(params: TableListParams) {
  return request_table('/api/data/client_bundle', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addItem(params: TableListParams) {
  return request_table('/api/data/client_bundle', {
    method: 'POST',
    data: {
      ...params,
      action: 'add',
    },
  });
}

export async function updateItem(params: TableListParams) {
  return request_table('/api/data/client_bundle', {
    method: 'POST',
    data: {
      ...params,
      action: 'update',
    },
  });
}

export async function deleteItem(params: TableListParams) {
  return request_table('/api/data/client_bundle', {
    method: 'POST',
    data: {
      ...params,
      action: 'delete',
    },
  });
}

export async function getRemoteIP() {
  return request_table('/api/data/ip', {
    method: 'POST',
    data: {},
  });
}
