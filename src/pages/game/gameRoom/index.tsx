import React, { useState } from 'react';

import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { TableListItem, TableListParams } from './data';

import { exportRoomList, getRoomList } from './service';
import { Button, Tooltip } from 'antd';
import moment from 'moment';

const TableList: React.FC = () => {
  const shortDateFmt = 'YYYY-MM-DD';
  const defaultParams = {
    curdate: [
      moment().add(-1, 'days').format(shortDateFmt),
      moment().add(-1, 'days').format(shortDateFmt),
    ],
  };

  const [isExporting, setExporting] = useState<boolean>(false);
  const [formVars, setFormVars] = useState({});
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '日期',
      dataIndex: 'Date',
      search: false,
    },
    {
      title: '场次',
      dataIndex: 'RoomName',
      search: false,
    },
    {
      title: (
        <Tooltip title="登录这个房间的人数，每日排重">
          <span>进入人数(?)</span>
        </Tooltip>
      ),
      dataIndex: 'EnterUserNum',
      search: false,
    },
    {
      title: (
        <Tooltip title="至少玩了一局的人数每日排重">
          <span>游戏人数(?)</span>
        </Tooltip>
      ),
      dataIndex: 'PlayUserNum',
      search: false,
    },
    {
      title: (
        <Tooltip title="选卡消耗">
          <span>bingo币消耗(?)</span>
        </Tooltip>
      ),
      dataIndex: 'RegBingoCoin',
      search: false,
    },
    {
      title: (
        <Tooltip title="结算赢取的bingo币">
          <span>bingo币赢取(?)</span>
        </Tooltip>
      ),
      dataIndex: 'AddBingoCoin',
      search: false,
    },
    {
      title: 'power ups消耗',
      dataIndex: 'CostSP',
      search: false,
    },
    {
      title: 'power ups赢取',
      dataIndex: 'AddSP',
      search: false,
    },
    {
      title: 'green notes赢取',
      dataIndex: 'AddBone',
      search: false,
    },
    {
      title: (
        <Tooltip title="结算赢目前付费场景的需求，已经是BI上报里实现；付费场景在这个房间的付费人数取的bingo币">
          <span>付费人数(?)</span>
        </Tooltip>
      ),
      dataIndex: 'PayUserNum',
      search: false,
    },
    {
      title: '付费额度',
      dataIndex: 'Pay',
      search: false,
    },
    {
      title: '付费次数',
      dataIndex: 'PayTimes',
      search: false,
    },
    {
      title: '平均时长/分',
      dataIndex: 'AvgOnlineMins',
      search: false,
    },
    {
      title: '总card数',
      dataIndex: 'CardNum',
      search: false,
    },
    {
      title: '总局数',
      dataIndex: 'Play',
      search: false,
    },
    {
      title: (
        <Tooltip title="bingo获取的币/bingo投注的币">
          <span>bingo币RTP(?)</span>
        </Tooltip>
      ),
      dataIndex: 'BingoRTP',
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

  const exportExcel = async () => {
    setExporting(true);
    const res = await exportRoomList({ ...formVars } as TableListParams);
    download(res.url);

    setExporting(false);
  };

  const query = async (params: TableListParams) => {
    const res = await getRoomList(params);
    setFormVars(params);
    return res;
  };

  return (
    <PageContainer>
      <ProTable<TableListItem>
        tableLayout="fixed"
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
