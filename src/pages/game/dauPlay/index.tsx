import { Card, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';

import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import { Chart, Line, Legend } from 'bizcharts';
import type { ChartPoint, TableListItem, TableListParams } from './data';

import { fetchDauPlay } from './service';

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
        <Tooltip title="每天活跃用户平均每人玩bingo的局数，选择2个时间进行比较">
          <span>每日人均局数（第几天)(?)</span>
        </Tooltip>
      ),
      search: false,
      dataIndex: 'day',
      renderText: (text, record, index) => `${index + 1}`,
    },
    {
      title: '活跃日期范围A',
      dataIndex: 'curdateA',
      hideInTable: true,
      initialValue: defaultParams.curdateA.map((v) => moment(v, shortDateFmt)),
      valueType: 'dateRange',
    },
    {
      title: '活跃日期范围A',
      search: false,
      dataIndex: ['avgPlay', 0],
    },
    {
      title: '活跃日期范围B',
      dataIndex: 'curdateB',
      hideInTable: true,
      initialValue: defaultParams.curdateB.map((v) => moment(v, shortDateFmt)),
      valueType: 'dateRange',
    },
    {
      title: '活跃日期范围B',
      search: false,
      dataIndex: ['avgPlay', 1],
    },
  ];

  const [chartData, setChartData] = useState<ChartPoint[]>([]);

  const query = async (params: TableListParams) => {
    const res: TableListParams = await fetchDauPlay({ ...params } as TableListParams);
    const points: ChartPoint[] = [];

    res.data?.forEach((v, k) => {
      points.push({ id: `${k + 1}`, dateName: '活跃日期范围A', value: v.avgPlay[0] });
      points.push({ id: `${k + 1}`, dateName: '活跃日期范围B', value: v.avgPlay[1] });
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
