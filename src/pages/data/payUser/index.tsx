import React, { useState } from 'react';

import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { TableListData, TableListItem, TableListParams } from './data';

import { exportPayUserList, getPayUserList } from './service';
import { Button, DatePicker, Form, Input } from 'antd';
import moment from 'moment';

const TableList: React.FC = () => {
  const shortDateFmt = 'YYYY-MM-DD';
  // const defaultParams = {};

  const [isExporting, setExporting] = useState<boolean>(false);
  const [formVars, setFormVars] = useState<TableListParams>({} as TableListParams);
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '玩家ID',
      dataIndex: 'uid',
    },
    {
      title: '付费总额',
      dataIndex: ['snapshot', 'Audit', 'Pay'],
      search: false,
    },
    {
      title: '单笔最大付费',
      dataIndex: ['snapshot', 'Audit', 'MaxPay'],
      search: false,
    },
    {
      title: '付费次数',
      dataIndex: ['snapshot', 'Audit', 'PayTimes'],
      search: false,
    },
    {
      title: '最近付费时间',
      dataIndex: ['snapshot', 'LastPayTime'],
      search: false,
    },
    {
      title: 'BINGO币余额',
      dataIndex: ['snapshot', 'Items', '1104'],
      search: false,
    },
    {
      title: '初级SP余额',
      dataIndex: 'SPLv1',
      search: false,
    },
    {
      title: '中级SP余额',
      dataIndex: 'SPLv2',
      search: false,
    },
    {
      title: '高级SP余额',
      dataIndex: 'SPLv3',
      search: false,
    },
    {
      title: '总游戏局数',
      dataIndex: ['snapshot', 'Audit', 'Play'],
      search: false,
    },
    {
      title: '总卡片数',
      dataIndex: ['snapshot', 'Audit', 'CardNum'],
      search: false,
    },
    {
      title: '平均每局bingo币消费（最近50局）',
      dataIndex: 'AvgCostBingo50',
      search: false,
    },
    {
      title: '总平均每局bingo币消费',
      dataIndex: 'AvgCostBingo',
      search: false,
    },
    {
      title: '平均每局powerups消费（最近50局）',
      dataIndex: 'AvgCostSP50',
      search: false,
    },
    {
      title: '平均每局powerups消费',
      dataIndex: 'AvgCostSP',
      search: false,
    },
    {
      title: '最近一次登录时间',
      dataIndex: ['snapshot', 'LastEnterTime'],
      search: false,
    },
    {
      title: '注册时间',
      dataIndex: 'create_time',
      hideInTable: true,
      renderFormItem: (item, { defaultRender, ...rest }) => {
        return (
          <DatePicker.RangePicker
            {...rest}
            picker="date"
            showTime
            disabledDate={(current) =>
              moment().format(shortDateFmt) <= current.format(shortDateFmt)
            }
          />
        );
      },
    },
    {
      title: '付费金额',
      dataIndex: 'pay_num',
      hideInTable: true,
      renderFormItem: (item, { defaultRender, ...rest }) => {
        return (
          <Input.Group {...rest} compact>
            <Form.Item name={['pay_num', 0]} noStyle>
              <Input style={{ width: 100, textAlign: 'center' }} placeholder="最小值" />
            </Form.Item>
            <Input
              style={{
                width: 30,
                // borderLeft: 0,
                // borderRight: 0,
                pointerEvents: 'none',
                backgroundColor: 'white',
              }}
              placeholder="~"
              disabled
            />
            <Form.Item name={['pay_num', 1]} noStyle>
              <Input
                // className="site-input-right"
                style={{
                  width: 100,
                  textAlign: 'center',
                }}
                placeholder="最大值"
              />
            </Form.Item>
          </Input.Group>
        );
      },
    },
  ];

  function download(url: string) {
    const link = document.createElement('a');
    link.setAttribute('href', url); // 设置下载文件的url地址
    // link.setAttribute('download', 'download'); //用于设置下载文件的文件名
    link.click();
  }

  const exportExcel = async () => {
    setExporting(true);
    const res = await exportPayUserList({ ...formVars } as TableListParams);
    download(res.url);

    setExporting(false);
  };

  const query = async (params: TableListParams) => {
    const res: TableListData = await getPayUserList(params);
    setFormVars(params);
    return res;
  };

  return (
    <PageContainer>
      <ProTable<TableListItem>
        tableLayout="fixed"
        request={(params) => query({ ...params } as TableListParams)}
        rowKey="key"
        columns={columns}
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
      />
    </PageContainer>
  );
};

export default TableList;
