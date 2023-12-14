import { Button, Select, Upload } from 'antd';
import React, { useRef, useState } from 'react';

import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import type { InitParams, TableListItem, TableListParams } from './data';
import { getItemLogList, exportItemLog } from './service';
import { fetchChanConfig } from '@/services/common';
import { UploadOutlined } from '@ant-design/icons';

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const shortDateFmt = 'YYYY-MM-DD';
  // const longDateFmt = 'YYYY-MM-DD HH:mm:ss';
  const defaultParams = {
    create_time: [
      moment().format(`YYYY-MM-01 00:00:00`),
      moment().format(`${shortDateFmt} 23:59:59`),
    ],
  };

  const [initParams, setInitParams] = useState<InitParams>({} as InitParams);
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      search: false,
    },
    {
      title: '玩家ID',
      dataIndex: 'uid',
    },
    {
      title: '物品',
      dataIndex: 'item_id',
      hideInTable: true,
      renderFormItem: (item, { defaultRender, ...rest }) => {
        return (
          <Select key="items" allowClear {...rest}>
            {initParams.Items &&
              initParams.Items.map((v) => (
                <Select.Option key={v.ShopID} value={v.ShopID}>
                  {`${v.ShopID}-${v.ShopTitle}`}
                </Select.Option>
              ))}
          </Select>
        );
      },
    },
    {
      title: '物品名',
      dataIndex: 'item_name',
      search: false,
    },
    {
      title: '增加数',
      dataIndex: 'item_num',
      search: false,
    },
    {
      title: '余额',
      dataIndex: 'balance',
      search: false,
    },
    {
      title: '途径',
      dataIndex: 'way',
      renderFormItem: (item, { defaultRender, ...rest }) => {
        return (
          <Select key="ways" allowClear {...rest}>
            {initParams.Ways &&
              initParams.Ways.map((v) => (
                <Select.Option key={v.Way} value={v.Way}>
                  {v.Title}
                </Select.Option>
              ))}
          </Select>
        );
      },
    },
    {
      title: 'UUID',
      dataIndex: 'guid',
      search: false,
      ellipsis: true,
      width: 100,
    },
    {
      title: '渠道',
      dataIndex: 'chan_id',
      initialValue: '',
      valueEnum: initParams.Chans,
    },
    {
      title: '参数',
      dataIndex: 'params',
      search: false,
    },
    {
      title: '时间',
      dataIndex: 'deadline',
      search: false,
    },
    {
      title: '时间',
      dataIndex: 'deadline',
      hideInTable: true,
      initialValue: defaultParams.create_time.map((v) => moment(v)),
      valueType: 'dateTimeRange',
    },
    {
      title: '批量用户',
      dataIndex: 'userfile',
      hideInTable: true,
      renderFormItem: (item, { defaultRender, type, ...rest }) => {
        return (
          <Upload
            accept='text/csv'
            maxCount={1}
            action='/api/game/upload'
            {...rest}
          >
            <Button icon={<UploadOutlined />}>上传csv</Button>
          </Upload>
        )
      },
    },
  ];

  const query = async (params: TableListParams) => {
    const res = await getItemLogList(params);
    const chanConfig = await fetchChanConfig();
    setInitParams({
      Ways: res.ways,
      Items: res.items,
      Chans: chanConfig,
      FormVars: params,
    });
    return res;
  };

  function download(url: string) {
    const link = document.createElement('a');
    link.setAttribute('href', url); // 设置下载文件的url地址
    // link.setAttribute('download', 'download'); //用于设置下载文件的文件名
    link.click();
  }

  const [isExporting, setExporting] = useState<boolean>(false);
  const exportExcel = async () => {
    setExporting(true);
    const res = await exportItemLog({ ...initParams.FormVars } as TableListParams);
    download(res.url);

    setExporting(false);
  };

  return (
    <PageContainer>
      <ProTable<TableListItem>
        tableLayout="fixed"
        actionRef={actionRef}
        columns={columns}
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
      />
    </PageContainer>
  );
};

export default TableList;
