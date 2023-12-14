import { Card, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';

import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import { Chart, Line, Legend } from 'bizcharts';
import type { ChartPoint, TableListItem, TableListParams } from './data';

import { fetchDauActive } from './service';

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const shortDateFmt = 'YYYY-MM-DD';
  const defaultParams = {
    curdateA: [
      moment().add(-1, 'days').format(shortDateFmt),
      moment().add(-1, 'days').format(shortDateFmt),
    ],
    curdateB: [
      moment().add(-2, 'days').format(shortDateFmt),
      moment().add(-2, 'days').format(shortDateFmt),
    ],
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: (
        <Tooltip title="次留，3留，7留数据，分2个时间段进行比较">
          <span>留存数据（第几天)(?)</span>
        </Tooltip>
      ),
      search: false,
      dataIndex: 'day',
      renderText: (text, record, index) => `${index + 1}`,
    },
    {
      title: '渠道',
      dataIndex: 'chanId',
      hideInTable: true,
      initialValue: 'google',
    },
    {
      title: '注册日期范围A',
      dataIndex: 'curdateA',
      hideInTable: true,
      initialValue: defaultParams.curdateA.map((v) => moment(v, shortDateFmt)),
      valueType: 'dateRange',
    },
    {
      title: '注册日期范围A',
      search: false,
      children: [
        {
          title: '次留',
          dataIndex: ['ActiveDay2Per', 0],
          hideInTable: true,
        },
        {
          title: '3留',
          dataIndex: ['ActiveDay3Per', 0],
          hideInTable: true,
        },
        {
          title: '7留',
          dataIndex: ['ActiveDay7Per', 0],
          hideInTable: true,
        },
      ],
    },
    {
      title: '注册日期范围B',
      dataIndex: 'curdateB',
      hideInTable: true,
      initialValue: defaultParams.curdateB.map((v) => moment(v, shortDateFmt)),
      valueType: 'dateRange',
    },
    {
      title: '注册日期范围B',
      search: false,
      children: [
        {
          title: '次留',
          dataIndex: ['ActiveDay2Per', 1],
          hideInTable: true,
        },
        {
          title: '3留',
          dataIndex: ['ActiveDay3Per', 1],
          hideInTable: true,
        },
        {
          title: '7留',
          dataIndex: ['ActiveDay7Per', 1],
          hideInTable: true,
        },
      ],
    },
  ];

  const [chartData, setChartData] = useState<ChartPoint[]>([]);

  const query = async (params: TableListParams) => {
    const res: TableListParams = await fetchDauActive({ ...params } as TableListParams);
    const points: ChartPoint[] = [];

    res.data?.forEach((v, k) => {
      points.push({
        id: `${k + 1}`,
        dateName: '注册日期范围A-次留',
        value: parseFloat(`${v.ActiveDay2Per[0]}`),
      });
      points.push({
        id: `${k + 1}`,
        dateName: '注册日期范围B-次留',
        value: parseFloat(`${v.ActiveDay2Per[1]}`),
      });
      points.push({
        id: `${k + 1}`,
        dateName: '注册日期范围A-3留',
        value: parseFloat(`${v.ActiveDay3Per[0]}`),
      });
      points.push({
        id: `${k + 1}`,
        dateName: '注册日期范围B-3留',
        value: parseFloat(`${v.ActiveDay3Per[1]}`),
      });
      points.push({
        id: `${k + 1}`,
        dateName: '注册日期范围A-7留',
        value: parseFloat(`${v.ActiveDay7Per[0]}`),
      });
      points.push({
        id: `${k + 1}`,
        dateName: '注册日期范围B-7留',
        value: parseFloat(`${v.ActiveDay7Per[1]}`),
      });
    });
    setChartData(points);
    // console.log(points)
    return res;
  };

  return (
    <PageContainer>
      <ProTable<TableListItem>
        bordered
        headerTitle="当地时间每天02:05更新"
        actionRef={actionRef}
        columns={columns}
        request={(params) => query({ ...params } as TableListParams)}
        rowKey="key"
        title={() => (
          <Card bordered={false}>
            <Chart
              scale={{ value: { min: 0 } }}
              padding={[40, 40, 80, 40]}
              autoFit
              height={320}
              data={chartData}
            >
              <Line shape="smooth" position="id*value" color="dateName" />
              <Legend />
            </Chart>
          </Card>
        )}
      />
    </PageContainer>
  );
};

export default TableList;
