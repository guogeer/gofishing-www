import { request } from 'umi';
import type { ConfigTable } from './data';

export async function fetchConfigTable(params: ConfigTable) {
  return request<ConfigTable>('/api/game/configTable', {
    method: 'POST',
    data: params,
  });
}

export async function fetchChanConfig() {
  return request<Record<string, string>>('/api/data/chanConfig', {
    method: 'POST',
    data: {},
  });
}
