import { Button, Card } from 'antd';
import React, { useRef, useState } from 'react';

import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { ChartPoint, TableListItem, TableListParams } from './data';
import { exportRealTimeData, getRealTimeData } from './service';
import { Chart, Legend, Line } from 'bizcharts';

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [isExporting, setExporting] = useState<boolean>(false);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '数据/小时',
      search: false,
      dataIndex: 'Title',
      key: 'Title',
    },
  ];

  for (let i = 0; i < 24; i += 1) {
    columns.push({ title: `${i}`, dataIndex: ['Hours', i], search: false, key: `hour${i}` });
  }

  const [formVars, setFormVars] = useState({});
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const query = async (params: TableListParams) => {
    const res = await getRealTimeData(params);
    setFormVars(params);

    const points: ChartPoint[] = [];

    for (let i = 0; i < 24; i += 1) {
      points.push({ hour: i + 1, online: res.data[0].Hours[i + 1], pay: res.data[1].Hours[i + 1] });
    }
    setChartData(points);
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
    const res = await exportRealTimeData({
      ...formVars,
      current: 1,
      pageSize: 999,
    } as TableListParams);
    download(res.url);

    setExporting(false);
  };

  return (
    <PageContainer>
      <ProTable<TableListItem>
        tableLayout="fixed"
        bordered={true}
        actionRef={actionRef}
        columns={columns}
        search={false}
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
        title={() => (
          <>
            <Card bordered={false} title="在线人数">
              <Chart
                scale={{ value: { min: 0 } }}
                // padding={[40, 40, 80, 40]}
                autoFit
                height={320}
                data={chartData}
              >
                <Line shape="smooth" position="hour*online" />
              </Chart>
            </Card>
            <Card bordered={false} title="充值金额">
              <Chart
                scale={{ value: { min: 0 } }}
                // padding={[40, 40, 40, 40]}
                autoFit
                height={320}
                data={chartData}
              >
                <Line shape="smooth" position="hour*pay" />
                <Legend />
              </Chart>
            </Card>
          </>
        )}
      />
    </PageContainer>
  );
};

export default TableList;
