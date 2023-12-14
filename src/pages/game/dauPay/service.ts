import { request_table } from '@/utils/request';
import type { TableListParams } from './data';

export async function fetchDauPay(params: TableListParams) {
  const params2 = params;
  params2.curdate = [params.curdateA as string[], params.curdateB as string[]];
  return request_table('/api/report/compare_dau_pay', {
    method: 'POST',
    data: {
      ...params2,
    },
  });
}
