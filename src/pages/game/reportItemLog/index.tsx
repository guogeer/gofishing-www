import React, { useEffect, useState } from 'react';

import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { TableListData, TableListItem, TableListParams } from './data';

import { exportItemLog, getItemLog } from './service';
import { Button, Card, Col, DatePicker, Form, Input, Row, Table, Tooltip, Typography } from 'antd';
import moment from 'moment';

const TableList: React.FC = () => {
  const shortDateFmt = 'YYYY-MM-DD';
  const defaultParams = {
    curdate: [
      moment().add(-3, 'days').format(shortDateFmt),
      moment().add(-1, 'days').format(shortDateFmt),
    ],
    itemId: 1104,
  };

  const [form] = Form.useForm();
  const [isExporting, setExporting] = useState<boolean>(false);
  const [tableData, setTableData] = useState<TableListData>({} as TableListData);
  const [columns, setColumns] = useState<ProColumns<TableListItem>[]>([]);
  const partColumns: ProColumns<TableListItem>[] = [
    {
      title: '途径',
      dataIndex: 'Way',
      search: false,
    },
    {
      title: '时间范围',
      dataIndex: 'curdate',
      hideInTable: true,
      initialValue: defaultParams.curdate.map((v) => moment(v, shortDateFmt)),
      valueType: 'dateRange',
    },
  ];

  function download(url: string) {
    const link = document.createElement('a');
    link.setAttribute('href', url); // 设置下载文件的url地址
    // link.setAttribute('download', 'download'); //用于设置下载文件的文件名
    link.click();
  }

  const exportExcel = async (formVars: TableListParams) => {
    setExporting(true);
    const res = await exportItemLog({ ...formVars } as TableListParams);
    download(res.url);

    setExporting(false);
  };

  const query = async (params: TableListParams) => {
    const res: TableListData = await getItemLog(params);
    const newColumns = partColumns;
    res.Dates.forEach((date, i) => {
      newColumns.push({
        title: date,
        search: false,
        children: [
          {
            title: '+发放/-消耗',
            dataIndex: ['Days', i, 'AddNum'],
            search: false,
          },
          {
            title: '次数',
            dataIndex: ['Days', i, 'Times'],
            search: false,
          },
          {
            title: '人数',
            dataIndex: ['Days', i, 'UserNum'],
            search: false,
          },
          {
            title: (
              <Tooltip title="当日事件触发人数/当日dau">
                <span>覆盖率%(?)</span>
              </Tooltip>
            ),
            dataIndex: ['Days', i, 'CoverPer'],
            search: false,
          },
          {
            title: '人均次数',
            dataIndex: ['Days', i, 'AvgTimes'],
            search: false,
          },
          {
            title: '人均',
            dataIndex: ['Days', i, 'AvgNum'],
            search: false,
          },
        ],
      });
    });

    setColumns(newColumns);
    setTableData(res);
  };

  useEffect(() => {
    query(defaultParams as TableListParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageContainer>
      <Card
        bordered={false}
        title="当地时间每天02:05更新
"
      >
        <Form form={form} layout="inline">
          <Row>
            <Col span={8}>
              <Form.Item label="类型" name="itemId" initialValue={defaultParams.itemId}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item
                label="日期"
                name="curdate"
                initialValue={defaultParams.curdate.map((v) => moment(v, shortDateFmt))}
              >
                <DatePicker.RangePicker
                  disabledDate={(current) =>
                    moment().format(shortDateFmt) <= current.format(shortDateFmt)
                  }
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                type="primary"
                htmlType="submit"
                style={{ margin: '0 8px' }}
                onClick={async () => {
                  const fieldsValue = await form.validateFields();
                  query(fieldsValue as TableListParams);
                }}
              >
                查看
              </Button>
              <Button
                type="primary"
                loading={isExporting}
                onClick={async () => {
                  const fieldsValue = await form.validateFields();
                  exportExcel(fieldsValue as TableListParams);
                }}
              >
                导出
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <ProTable<TableListItem>
        tableLayout="fixed"
        columns={columns}
        dataSource={tableData.data}
        // request={(params) => query({ ...params } as TableListParams)}
        rowKey="key"
        options={false}
        bordered={true}
        search={false}
        pagination={{
          ...tableData.pagination,
          onChange: async (page, pageSize) => {
            const fieldsValue = await form.validateFields();
            query({ ...fieldsValue, current: page, pageSize });
          },
        }}
        summary={() => {
          const sumData = tableData.SumData;
          if (!sumData) {
            return null;
          }
          const sumRow: (string | number)[] = ['当天汇总'];
          sumData.forEach((v: TableListItem) => {
            sumRow.push(v.AddNum, v.Times, v.UserNum, v.CoverPer, v.AvgTimes, v.AvgNum);
          });
          return (
            <Table.Summary.Row key="sum">
              {sumRow.map((v, k) => {
                return (
                  // eslint-disable-next-line react/no-array-index-key
                  <Table.Summary.Cell key={k} index={k}>
                    <Typography.Text type="danger">{v}</Typography.Text>
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
