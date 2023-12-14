import { Card, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';

import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import { Chart, Line, Legend } from 'bizcharts';
import type { ChartPoint, TableListItem, TableListParams } from './data';

import { fetchDaubB } from './service';

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
  const dataType = 'arpu';

  const columns: ProColumns<TableListItem>[] = [
    {
      title: (
        <Tooltip title="每天活跃付费总数/活跃人数，分2个时间进行比较">
          <span>第几天(?)</span>
        </Tooltip>
      ),
      search: false,
      dataIndex: 'day',
      renderText: (text, record, index) => `${index + 1}`,
    },
    {
      title: '注册A',
      dataIndex: 'curdateA',
      hideInTable: true,
      initialValue: defaultParams.curdateA.map((v) => moment(v, shortDateFmt)),
      valueType: 'dateRange',
    },
    {
      title: '注册时间范围A',
      dataIndex: [dataType, 0],
      search: false,
    },
    {
      title: '注册B',
      dataIndex: 'curdateB',
      hideInTable: true,
      initialValue: defaultParams.curdateB.map((v) => moment(v, shortDateFmt)),
      valueType: 'dateRange',
    },
    {
      title: '注册时间范围B',
      dataIndex: [dataType, 1],
      search: false,
    },
  ];

  const [chartData, setChartData] = useState<ChartPoint[]>([]);

  const query = async (params: TableListParams) => {
    const res: TableListParams = await fetchDaubB({ ...params } as TableListParams);
    const points: ChartPoint[] = [];

    res.data?.forEach((v, k) => {
      points.push({ id: `${k + 1}`, dateName: '时间范围A', value: v[dataType][0] });
      points.push({ id: `${k + 1}`, dateName: '时间范围B', value: v[dataType][1] });
    });
    setChartData(points);
    // console.log(points)
    return res;
  };

  return (
    <PageContainer>
      <ProTable<TableListItem>
        headerTitle="当地时间每天02:05更新
"
        bordered
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
