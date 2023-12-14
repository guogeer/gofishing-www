import { Input } from 'antd';
import React, { useRef } from 'react';

import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import type { TableListItem, TableListParams } from './data';

import { getRoomList } from './service';

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const dateFmt = 'YYYY-MM-DD';
  const defaultParams = {
    create_time: [moment().format('YYYY-MM-01'), moment().add(-1, 'days').format(dateFmt)],
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '场次ID',
      dataIndex: 'sub_id',
      render: (text) => <a href={`/bingo/roomInfo?sub_id=${text}`}>{text}</a>,
      renderFormItem: (item, { defaultRender, ...rest }) => {
        return <Input {...rest} />;
      },
    },
    {
      title: '场次标题',
      dataIndex: 'game_name',
      search: false,
    },
    {
      title: '局数',
      dataIndex: 'play_num',
      search: false,
    },
    {
      title: '续球次数',
      dataIndex: 'relife_num',
      search: false,
    },
    {
      title: '消耗卡片数',
      dataIndex: 'card_num',
      search: false,
    },
    {
      title: 'BINGO次数',
      dataIndex: 'bingo_num',
      search: false,
    },
    {
      title: 'bingo成功率(含/无续球%)',
      // dataIndex: 'bingo_percent',
      search: false,
      render: (_, record: TableListItem) =>
        `${record.bingo_percent}/${record.bingo_before_relife_percent}`,
    },
    {
      title: '平均激活数字/票',
      dataIndex: 'avg_cell',
      search: false,
    },
    {
      title: '1/2/4/8票占比(%)',
      search: false,
      render: (_, record: TableListItem) =>
        `${record.cper1}/${record.cper2}/${record.cper4}/${record.cper8}`,
    },
    {
      title: '消耗0/1/2/3/Nsp(%)',
      search: false,
      render: (_, record: TableListItem) =>
        `${record.sper0}/${record.sper1}/${record.sper2}/${record.sper3}/${record.spern}`,
    },
    {
      title: '时间',
      dataIndex: 'curdate',
      hideInTable: true,
      valueType: 'dateRange',
      initialValue: defaultParams.create_time.map((v) => moment(v, dateFmt)),
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem>
        headerTitle="当地时间每天02:05更新
"
        actionRef={actionRef}
        columns={columns}
        request={(params) => getRoomList({ ...params } as TableListParams)}
        rowKey="key"
      />
    </PageContainer>
  );
};

export default TableList;
