import { request_table } from '@/utils/request';
import type { Config, Maintain } from './data';

export async function queryConfig(params: Config) {
  return request_table('/api/system/config', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateMaintain(params: Maintain) {
  return request_table('/api/system/maintain', {
    method: 'POST',
    data: {
      ...params,
      action: 'update',
    },
  });
}
