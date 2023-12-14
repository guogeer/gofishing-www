import { Card, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';

import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import { Chart, Line, Legend } from 'bizcharts';
import type { ChartPoint, TableListItem, TableListParams } from './data';

import { fetchDauPay } from './service';

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
        <Tooltip title="每天活跃付费总数/每天的活跃付费率和新手付费率，2个时间进比较">
          <span>第几天(?)</span>
        </Tooltip>
      ),
      search: false,
      dataIndex: 'day',
      renderText: (text, record, index) => `${index + 1}`,
    },
    {
      title: '时间范围A',
      dataIndex: 'curdateA',
      hideInTable: true,
      initialValue: defaultParams.curdateA.map((v) => moment(v, shortDateFmt)),
      valueType: 'dateRange',
    },
    {
      title: '时间范围A',
      children: [
        {
          title: '新用户日付费率',
          dataIndex: ['new_pay', 0],
        },
        {
          title: '日付费率',
          dataIndex: ['pay', 0],
        },
      ],
    },
    {
      title: '时间范围B',
      dataIndex: 'curdateB',
      hideInTable: true,
      initialValue: defaultParams.curdateB.map((v) => moment(v, shortDateFmt)),
      valueType: 'dateRange',
    },
    {
      title: '时间范围B',
      children: [
        {
          title: '新用户日付费率',
          dataIndex: ['new_pay', 1],
        },
        {
          title: '日付费率',
          dataIndex: ['pay', 1],
        },
      ],
    },
  ];

  const [chartData, setChartData] = useState<ChartPoint[]>([]);

  const query = async (params: TableListParams) => {
    const res: TableListParams = await fetchDauPay({ ...params } as TableListParams);
    const points: ChartPoint[] = [];

    res.data?.forEach((v, k) => {
      points.push({ id: `${k + 1}`, dateName: '新用户日付费率A', value: v.pay[0] });
      points.push({ id: `${k + 1}`, dateName: '日付费率A', value: v.pay[1] });
      points.push({ id: `${k + 1}`, dateName: '新用户日付费率B', value: v.new_pay[0] });
      points.push({ id: `${k + 1}`, dateName: '日付费率B', value: v.new_pay[1] });
    });
    setChartData(points);
    // console.log(points)
    return res;
  };

  return (
    <PageContainer>
      <ProTable<TableListItem>
        bordered
        headerTitle="当地时间每天02:05更新
"
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
