import { Typography, Button, Table } from 'antd';
import React, { useRef, useState } from 'react';

import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import type { TableListItem, TableListParams } from './data';
import { exportOrders, getOrderList } from './service';

const gOrderResultList = ['0', '新建', '支付未发货', '成功', '测试'];

const { Text } = Typography;

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const dateFmt = 'YYYY-MM-DD';
  const defaultParams = {
    create_time: [moment().format('YYYY-MM-01'), moment().format(dateFmt)],
  };
  const [isExporting, setExporting] = useState<boolean>(false);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '订单号',
      dataIndex: 'order_id',
    },
    {
      title: '玩家ID',
      dataIndex: 'buy_uid',
    },
    {
      title: '渠道',
      dataIndex: 'chan_id',
      search: false,
    },
    {
      title: '商品ID',
      dataIndex: 'item_id',
      search: false,
    },
    {
      title: '商品名称',
      dataIndex: 'ShopTitle',
      search: false,
    },
    {
      title: '场次',
      dataIndex: 'GameName',
      search: false,
    },
    {
      title: '付款金额',
      dataIndex: 'exchange_price',
      search: false,
    },
    {
      title: '购买后总付费额度',
      dataIndex: 'NumAfterPay',
      search: false,
    },
    {
      title: '购买时vip等级',
      dataIndex: 'VIPBeforePay',
      search: false,
    },
    {
      title: '购买时等级',
      dataIndex: 'LevelBeforePay',
      search: false,
    },
    {
      title: '折算金额',
      dataIndex: 'count_price',
      search: false,
    },
    {
      title: '配置价格',
      dataIndex: 'rmb',
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'result',
      search: false,
      renderText: (val: string) => gOrderResultList[parseInt(val, 10)],
    },
    {
      title: '支付SDK',
      dataIndex: 'pay_sdk',
      search: false,
    },
    {
      title: '发送时间',
      dataIndex: 'create_time',
      search: false,
    },
    {
      title: '发送时间',
      dataIndex: 'create_time',
      valueType: 'dateRange',
      hideInTable: true,
      initialValue: defaultParams.create_time.map((v) => moment(v, dateFmt)),
    },
  ];

  const [sumData, setSumData] = useState<TableListParams>({} as TableListParams);
  const [formVars, setFormVars] = useState({});
  const query = async (params: TableListParams) => {
    const res = await getOrderList(params);
    setSumData(res);
    setFormVars(params);
    return res;
  };

  function download(url: string) {
    const link = document.createElement('a');
    link.setAttribute('href', url); // 设置下载文件的url地址
    // link.setAttribute('download', 'download'); //用于设置下载文件的文件名
    link.click();
  }

  const exportExcel = async () => {
    setExporting(true);
    const res = await exportOrders({ ...formVars, current: 1, pageSize: 999 } as TableListParams);
    download(res.url);

    setExporting(false);
  };
  return (
    <PageContainer>
      <ProTable<TableListItem>
        actionRef={actionRef}
        columns={columns}
        request={(params) => query({ ...params } as TableListParams)}
        rowKey="key"
        toolBarRender={() => [
          <Button
            type="primary"
            key="export_excel"
            loading={isExporting}
            onClick={() => {
              exportExcel();
            }}
          >
            导出
          </Button>,
        ]}
        summary={() => {
          const sumRow: (string | number)[] = [
            '汇总',
            sumData.local_bills && sumData.local_bills.join('; '),
            sumData.total_count_price,
            sumData.total_rmb,
            '-',
            '-',
            '-', // 折算金额
          ];
          return (
            <Table.Summary.Row key="sum">
              {sumRow.map((v, k) => {
                const colSpan = k === 1 ? 4 : undefined;
                return (
                  // eslint-disable-next-line react/no-array-index-key
                  <Table.Summary.Cell key={k} colSpan={colSpan} index={k}>
                    <Text type="danger">{v}</Text>
                  </Table.Summary.Cell>
                );
              })}
            </Table.Summary.Row>
          );
        }}
      />
    </PageContainer>
  );
};

export default TableList;
