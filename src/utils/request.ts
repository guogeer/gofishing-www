// 兼容就版本的适配代码
import { request } from 'umi';

const requestTable = async (url: any, options: any) => {
  const response: any = await request(url, options);
  if (!response.data && Array.isArray(response.list)) {
    response.data = response.list;
  }
  if (!response.data && Array.isArray(response.rows)) {
    response.data = response.rows;
  }
  if (Array.isArray(response.data)) {
    for (let i = 0; i < response.data.length; i += 1) {
      response.data[i].key = i;
    }
  }
  if (response.total_rows) {
    response.total = response.total_rows;
  }
  return response || {};
};

export { requestTable as request_table };
