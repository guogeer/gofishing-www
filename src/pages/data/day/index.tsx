import { Table, Tooltip, Typography } from 'antd';
import React, { useRef, useState } from 'react';

import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import type { TableListItem, TableListParams } from './data';

import { getItemList } from './service';

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
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '日期',
      dataIndex: 'Date',
      search: false,
    },
    {
      title: '日期',
      dataIndex: 'Date',
      hideInTable: true,
      valueType: 'dateRange',
      initialValue: defaultParams.Date.map((v) => moment(v, shortDateFmt)),
    },
    {
      title: (
        <Tooltip title="注册成功的用户数">
          <span>注册用户数(?)</span>
        </Tooltip>
      ),
      dataIndex: 'RegisterUsers',
      search: false,
    },
    {
      title: (
        <Tooltip title="BINGO局数">
          <span>局数(?)</span>
        </Tooltip>
      ),
      dataIndex: 'PlayTimes',
      search: false,
    },
    {
      title: (
        <Tooltip title="登录游戏的去重用户数">
          <span>活跃玩家数(?)</span>
        </Tooltip>
      ),
      dataIndex: 'ActiveUsers',
      search: false,
    },
    {
      title: '观看广告人数',
      dataIndex: 'WatchAdUser',
      search: false,
    },
    {
      title: '观看广告次数',
      dataIndex: 'WatchAdNum',
      search: false,
    },
    {
      title: (
        <Tooltip title="看广告人数/活跃人数">
          <span>活跃玩家看广告率(?)</span>
        </Tooltip>
      ),
      dataIndex: 'ActiveWatchAdPer',
      search: false,
      renderText: (v: string) => `${parseFloat(v).toFixed(2)}`,
    },
    {
      title: (
        <Tooltip title="看广告次数/活跃人数">
          <span>活跃人均看广告(?)</span>
        </Tooltip>
      ),
      dataIndex: 'ActiveWatchAdAvg',
      search: false,
      renderText: (v: string) => `${parseFloat(v).toFixed(1)}`,
    },
    {
      title: (
        <Tooltip title="游戏内付费的去重用户数">
          <span>付费人数(?)</span>
        </Tooltip>
      ),
      dataIndex: 'PayUsers',
      search: false,
    },
    {
      title: (
        <Tooltip title="游戏内第一次付费的去重用户数">
          <span>首次付费人数(?)</span>
        </Tooltip>
      ),
      dataIndex: 'FirstPayUsers',
      search: false,
    },
    {
      title: (
        <Tooltip title="当天新注册用户付费人数">
          <span>注册付费人数(?)</span>
        </Tooltip>
      ),
      dataIndex: 'NewPayUsers',
      search: false,
    },
    {
      title: (
        <Tooltip title="当天新注册用户付费总金额，付费金额为商品定价总计，右同">
          <span>注册付费金额(?)</span>
        </Tooltip>
      ),
      dataIndex: 'NewPayRmb',
      search: false,
      renderText: (v: string) => `${parseFloat(v).toFixed(2)}`,
    },
    {
      title: (
        <Tooltip title="新注册付费人数/新增用户数">
          <span>注册付费率(?)</span>
        </Tooltip>
      ),
      dataIndex: 'NewPayRate',
      search: false,
      renderText: (v: string) => `${parseFloat(v).toFixed(2)}`,
    },
    {
      title: (
        <Tooltip title="非当天注册的用户付费人数">
          <span>老用户付费人数(?)</span>
        </Tooltip>
      ),
      dataIndex: 'OldPayUsers',
      search: false,
    },
    {
      title: (
        <Tooltip title="非当天注册用户的付费总额">
          <span>老用户付费金额(?)</span>
        </Tooltip>
      ),
      dataIndex: 'OldPayRmb',
      search: false,
      renderText: (v: string) => `${parseFloat(v).toFixed(2)}`,
    },
    {
      title: (
        <Tooltip title="当天付费总金额">
          <span>总付费金额(?)</span>
        </Tooltip>
      ),
      dataIndex: 'PayRmb',
      search: false,
      renderText: (v: string) => `${parseFloat(v).toFixed(2)}`,
    },
    {
      title: (
        <Tooltip title="总付费金额/活跃用户数">
          <span>活跃ARPU(?)</span>
        </Tooltip>
      ),
      dataIndex: 'ActiveARPU',
      search: false,
      renderText: (v: string) => `${parseFloat(v).toFixed(2)}`,
    },
    {
      title: (
        <Tooltip title="总付费金额/付费用户数">
          <span>付费ARPU(?)</span>
        </Tooltip>
      ),
      dataIndex: 'PayARPU',
      search: false,
      renderText: (v: string) => `${parseFloat(v).toFixed(2)}`,
    },
  ];

  const [sumData, setSumData] = useState<TableListParams>({} as TableListParams);
  const query = async (params: TableListParams) => {
    const res = await getItemList(params);
    setSumData(res);
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
            sumData.TotalNewUser,
            sumData.TotalPlayTimes,
            sumData.TotalActiveUser,
            sumData.TotalWatchAdUser,
            sumData.TotalWatchAdNum,
            sumData.TotalActiveWatchAdPer.toFixed(2),
            sumData.TotalActiveWatchAdAvg.toFixed(1),
            sumData.TotalPayUser,
            sumData.TotalFirstPayUser,
            sumData.TotalNewPayUser,
            sumData.TotalNewPayRmb.toFixed(2),
            sumData.TotalNewPayRate.toFixed(2),
            sumData.TotalOldPayUser,
            sumData.TotalOldPayRmb.toFixed(2),
            sumData.TotalPayRmb.toFixed(2),
            sumData.TotalActiveARPU.toFixed(2),
            sumData.TotalPayRmb.toFixed(2),
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
