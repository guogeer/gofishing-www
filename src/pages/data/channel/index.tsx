import { Table, Typography } from 'antd';
import React, { useRef, useState } from 'react';

import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import type { TableListItem, TableListParams } from './data';

import { getItemList } from './service';
import { fetchChanConfig } from '@/services/common';

const { Text } = Typography;
const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const shortDateFmt = 'YYYY-MM-DD';
  const defaultParams = {
    Date: [
      moment().add(0, 'day').format('YYYY-MM-01'),
      moment().add(0, 'day').format(shortDateFmt),
    ],
  };
  const [chans, setChans] = useState<Record<string, string>>({});
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '渠道',
      dataIndex: 'ChanId',
      initialValue: 'google',
      valueEnum: chans,
    },
    {
      title: '日期',
      dataIndex: 'Date',
      search: false,
    },
    {
      title: '日期',
      dataIndex: 'Date',
      valueType: 'dateRange',
      hideInTable: true,
      initialValue: defaultParams.Date.map((v) => moment(v, shortDateFmt)),
    },
    {
      title: '新增用户数',
      dataIndex: 'RegisterUsers',
      search: false,
    },
    {
      title: '活跃用户数',
      dataIndex: 'ActiveUsers',
      search: false,
    },
    {
      title: '付费用户数',
      dataIndex: 'PayUsers',
      search: false,
    },
    {
      title: '首次付费人数',
      dataIndex: 'FirstPayUsers',
      search: false,
    },
    {
      title: '新注册付费人数',
      dataIndex: 'NewPayUsers',
      search: false,
    },
    {
      title: '新注册付费金额',
      dataIndex: 'NewPayRmb',
      search: false,
      renderText: (v: string) => `${parseFloat(v).toFixed(2)}`,
    },
    {
      title: '新注册用户付费率(%)',
      dataIndex: 'NewPayRate',
      search: false,
      renderText: (v: string) => `${parseFloat(v).toFixed(2)}`,
    },
    {
      title: '老用户付费人数',
      dataIndex: 'OldPayUsers',
      search: false,
    },
    {
      title: '老用户付费总额',
      dataIndex: 'OldPayRmb',
      search: false,
      renderText: (v: string) => `${parseFloat(v).toFixed(2)}`,
    },
    {
      title: '总付费金额',
      dataIndex: 'PayRmb',
      search: false,
      renderText: (v: string) => `${parseFloat(v).toFixed(2)}`,
    },
    {
      title: '活跃ARPU',
      dataIndex: 'ActiveARPU',
      search: false,
      renderText: (v: string) => `${parseFloat(v).toFixed(2)}`,
    },
    {
      title: '付费ARPU',
      dataIndex: 'PayARPU',
      search: false,
      renderText: (v: string) => `${parseFloat(v).toFixed(2)}`,
    },
    {
      title: '2留',
      dataIndex: 'ActiveDay2Per',
      search: false,
      renderText: (v: string) => `${parseFloat(v).toFixed(2)}`,
    },
    {
      title: '3留',
      dataIndex: 'ActiveDay3Per',
      search: false,
      renderText: (v: string) => `${parseFloat(v).toFixed(2)}`,
    },
    {
      title: '7留',
      dataIndex: 'ActiveDay7Per',
      search: false,
      renderText: (v: string) => `${parseFloat(v).toFixed(2)}`,
    },
    {
      title: '15留',
      dataIndex: 'ActiveDay15Per',
      search: false,
      renderText: (v: string) => `${parseFloat(v).toFixed(2)}`,
    },
    {
      title: '30留',
      dataIndex: 'ActiveDay30Per',
      search: false,
      renderText: (v: string) => `${parseFloat(v).toFixed(2)}`,
    },
  ];
  const [sumData, setSumData] = useState<TableListParams>({} as TableListParams);
  const query = async (params: TableListParams) => {
    const res = await getItemList({ ...defaultParams, ...params });
    setSumData(res);

    const chanConfig = await fetchChanConfig();
    setChans(chanConfig);
    return res;
  };
  return (
    <PageContainer>
      <ProTable<TableListItem>
        headerTitle="当地时间每天02:05更新
"
        actionRef={actionRef}
        columns={columns}
        request={(params) => query({ ...params } as TableListParams)}
        rowKey="key"
        summary={() => {
          if (!sumData.data || sumData.data.length === 0) {
            return null;
          }
          const sumRow: (number | string)[] = [
            '汇总',
            '-',
            sumData.TotalNewUser,
            sumData.TotalActiveUser,
            sumData.TotalPayUser,
            sumData.TotalFirstPayUser,
            sumData.TotalNewPayUser,
            sumData.TotalNewPayRmb.toFixed(2),
            sumData.TotalNewPayRate.toFixed(2),
            sumData.TotalOldPayUser,
            sumData.TotalOldPayRmb.toFixed(2),
            sumData.TotalPayRmb.toFixed(2),
            sumData.TotalActiveARPU.toFixed(2),
            sumData.TotalPayARPU.toFixed(2),
            '-',
            '-',
            '-',
            '-',
            '-',
          ];
          return (
            <Table.Summary.Row key="sum">
              {sumRow.map((v, k) => {
                return (
                  // eslint-disable-next-line react/no-array-index-key
                  <Table.Summary.Cell key={k} index={k}>
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
