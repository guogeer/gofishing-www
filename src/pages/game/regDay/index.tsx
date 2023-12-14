import { Card } from 'antd';
import React, { useRef, useState } from 'react';

import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import { Chart, Line, Legend } from 'bizcharts';
import type { ChartPoint, TableListItem, TableListParams } from './data';

import { fetchRegDataByCreateTime } from './service';

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
  const dataType = 'bingoCoin';

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '天数',
      dataIndex: 'day',
      search: false,
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
    const res: TableListParams = await fetchRegDataByCreateTime({ ...params } as TableListParams);
    const points: ChartPoint[] = [];

    const type = dataType;
    res.data?.forEach((v) => {
      points.push({ curdate: v.curdate, dateName: '注册时间A', value: v[type][0] });
      points.push({ curdate: v.curdate, dateName: '注册时间B', value: v[type][1] });
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
              <Line shape="smooth" position="curdate*value" color="dateName" />
              <Legend />
            </Chart>
          </Card>
        )}
      />
    </PageContainer>
  );
};

export default TableList;
