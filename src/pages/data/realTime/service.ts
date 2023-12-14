import { request_table } from '@/utils/request';
import type { TableListParams } from './data';

export async function getRealTimeData(input: TableListParams) {
  const params = input;
  const res = await request_table('/api/data/realTimeData', {
    method: 'POST',
    data: {
      ...params,
    },
  });

  const { data } = res;
  if (data) {
    const onlines: (string | number)[] = [];
    const pays: (string | number)[] = [];
    for (let i = 0; i < data.length; i += 1) {
      onlines.push(data[i].OnlineNum);
      pays.push(data[i].PayNum);
    }
    res.data = [
      { key: 'online', Title: '在线人数', Hours: onlines },
      { key: 'pay', Title: '充值金额', Hours: pays },
    ];
  }
  return res;
}

export async function exportRealTimeData(input: TableListParams) {
  const params = input;
  return request_table('/api/data/realTimeData', {
    method: 'POST',
    data: {
      action: 'export',
      ...params,
    },
  });
}
