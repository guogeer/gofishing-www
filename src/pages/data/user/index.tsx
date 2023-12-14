import {
  Modal,
  Input,
  Form,
  // DatePicker,
  Select,
  Descriptions,
  message,
  InputNumber,
  Tag,
} from 'antd';
import React, { useState, useEffect, useRef } from 'react';

import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ColumnsState, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import Button from 'antd/es/button';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import type { ConfigTable } from '@/services/data.d';
import { fetchConfigTable } from '@/services/common';
// import moment from 'moment';
import type { TableListItem, TableListParams, RewardParams } from './data';
import { getUserList, deleteUser, addItems, fetchUser, exportUsers } from './service';

const FormItem = Form.Item;
const gSearchKeys = {
  uid: '玩家ID',
  phone: '手机号',
  imei: 'IMEI',
  chan_id: '渠道ID',
  idfa: 'IDFA',
  open_id: 'OpenID',
};

const gAuditDataMap = {
  Play: 'BINGO局数',
  CardNum: 'BINGO卡片消耗数',
  BingoNum: 'BINGO成功卡片数',
  RelifeNum: 'BINGO续球次',
};

type CreateFormProps = {
  modalVisible: boolean;
  item: TableListItem;
  onCancel: () => void;
  reload: () => void;
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { item, modalVisible, onCancel, reload } = props;
  const [chooseItems, setChooseItems] = useState<string[]>([]);
  const [itemConfig, setItemConfig] = useState<ConfigTable>({} as ConfigTable);
  const [sending, setSending] = useState<boolean>(false);

  // const itemConfig = fetchConfigTable({Name: 'item'} as ConfigTable)
  useEffect(() => {
    const initPage = async () => {
      const res = await fetchConfigTable({ Name: 'item' } as ConfigTable);
      setItemConfig(res);
    };
    initPage();
  }, []);

  const [form] = Form.useForm();
  const okHandle = async () => {
    setSending(true);

    const fieldsValue = await form.validateFields();
    await addItems({ ...fieldsValue, uid: item.uid } as RewardParams);
    form.resetFields();
    setChooseItems([]);
    onCancel();
    reload();

    setSending(false);
    message.success('物品补偿已发放');
  };

  return (
    <Modal
      maskClosable={false}
      destroyOnClose
      title="补偿"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={onCancel}
      confirmLoading={sending}
    >
      <Form form={form} labelCol={{ span: 10 }} wrapperCol={{ span: 20 }}>
        <FormItem
          label="物品"
          name="choose_items"
          rules={[{ required: true, message: '请选择物品！' }]}
        >
          <Select mode="multiple" onChange={(v) => v && setChooseItems(v.toString().split(','))}>
            {itemConfig.Table?.map((v) => (
              <Select.Option
                key={v.ShopID}
                value={v.ShopID}
              >{`${v.ShopTitle}-${v.ShopID}`}</Select.Option>
            ))}
          </Select>
        </FormItem>
        {Object.assign(chooseItems).map((itemId: string) => {
          let row: Record<string, string> = {};
          itemConfig.Table?.forEach((v) => {
            if (`${v.ShopID}` === itemId) {
              row = v;
            }
          });
          return (
            <FormItem
              key={row.ShopID}
              label={`${row.ShopTitle}-${row.ShopID}`}
              name={['items', row.ShopID]}
              rules={[{ required: true, message: `请输入数量` }]}
            >
              <InputNumber />
            </FormItem>
          );
        })}
      </Form>
    </Modal>
  );
};

type InfoModalProps = {
  modalVisible: boolean;
  item: TableListItem;
  onCancel: () => void;
  reload: () => void;
};

const UserModal: React.FC<InfoModalProps> = (props) => {
  const { modalVisible, item, onCancel, reload } = props;
  const [rewardModalVisible, setRewardModalVisible] = useState<boolean>(false);

  if (Object.keys(item).length === 0) {
    return null;
  }
  return (
    <>
      <Modal
        destroyOnClose
        title="玩家信息"
        width={720}
        visible={modalVisible}
        onCancel={onCancel}
        footer={[
          <Button
            type="primary"
            key="remote"
            onClick={() => {
              Modal.confirm({
                title: `确定废弃账号${item.uid}?`,
                icon: <ExclamationCircleOutlined />,
                content: '删除后账号仍存在，将无法登陆。',
                okType: 'danger',
                onOk: () => {
                  deleteUser({ item });
                  message.info('账号已废弃');
                },
              });
            }}
          >
            作废
          </Button>,
          <Button key="deal" type="primary" onClick={() => setRewardModalVisible(true)}>
            补偿
          </Button>,
          <Button key="cancel" onClick={() => onCancel()}>
            取消
          </Button>,
        ]}
      >
        <Descriptions title="基本信息" column={2}>
          <Descriptions.Item label="玩家ID">{item.uid}</Descriptions.Item>
          <Descriptions.Item label="昵称">{item.nickname}</Descriptions.Item>
          <Descriptions.Item label="OpenID" span={2}>
            <div>
              {item.all_open_id.map((v) => (
                <Tag key={v}>{v}</Tag>
              ))}
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="渠道ID">{item.chan_id}</Descriptions.Item>
          <Descriptions.Item label="对局数">{item?.snapshot?.Audit?.Play || 0}</Descriptions.Item>
          <Descriptions.Item label="登陆IP">{item.ip}</Descriptions.Item>
          <Descriptions.Item label="登陆时间">
            {item?.snapshot?.LastEnterTime || ''}
          </Descriptions.Item>
          <Descriptions.Item label="充值金额">
            {parseFloat(`${item?.snapshot?.Audit?.Pay || 0}`).toFixed(2)}
          </Descriptions.Item>
          <Descriptions.Item label="注册时间">{item.create_time}</Descriptions.Item>
          <Descriptions.Item label="审计" span={2}>
            <div>
              {Object.keys(gAuditDataMap).map((v) => (
                <Tag key={v}>{`${gAuditDataMap[v]}: ${(item?.snapshot?.Audit && item?.snapshot?.Audit[v]) || 0
                  }`}</Tag>
              ))}
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="物品" span={2}>
            <div>
              {item.items &&
                Object.keys(item.items).map((v) => (
                  <Tag key={v}>{`${item.items[v].Title}: ${item.items[v].Num}`}</Tag>
                ))}
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="场次" span={2}>
            {item.game_name}
          </Descriptions.Item>
          <Descriptions.Item label="IMEI" span={2}>
            {item.imei}
          </Descriptions.Item>
          <Descriptions.Item label="IMSI" span={2}>
            {item.imsi}
          </Descriptions.Item>
          <Descriptions.Item label="IDFA" span={2}>
            {item.idfa}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
      <CreateForm
        modalVisible={rewardModalVisible}
        item={item}
        onCancel={() => setRewardModalVisible(false)}
        reload={reload}
      />
    </>
  );
};

const TableList: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // const shortDateFmt = 'YYYY-MM-DD';

  const [user, setUser] = useState<TableListItem>({} as TableListItem);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '关键字',
      dataIndex: 'search',
      hideInTable: true,
      renderFormItem: (item, { defaultRender, ...rest }) => {
        return (
          <Input.Group {...rest} compact>
            <Form.Item name={['search', 'key']} initialValue="uid" noStyle>
              <Select>
                {Object.keys(gSearchKeys).map((v) => (
                  <Select.Option key={v} value={v}>
                    {gSearchKeys[v]}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name={['search', 'value']} noStyle>
              <Input style={{ width: 160 }} />
            </Form.Item>
          </Input.Group>
        );
      },
    },
    {
      title: 'ID',
      dataIndex: 'uid',
      search: false,
      sorter: true,
      render: (text, record) => (
        <a
          onClick={async () => {
            const err = await fetchUser({ item: record });
            setUser(err.item);
            setModalVisible(true);
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      search: false,
    },
    {
      title: 'Green Notes',
      dataIndex: 'bone',
      search: false,
      sorter: true,
    },
    {
      title: 'BINGO币',
      dataIndex: 'bingo',
      search: false,
      sorter: true,
    },
    {
      title: 'Power Ups',
      dataIndex: 'super_power',
      search: false,
    },
    {
      title: 'Daub Alert/m',
      dataIndex: 'DaubAlertsMin',
      search: false,
    },
    {
      title: '对局次数',
      dataIndex: ['snapshot', 'Audit', 'Play'],
      search: false,
    },
    {
      title: '充值$',
      dataIndex: ['snapshot', 'Audit', 'Pay'],
      search: false,
      // ellipsis: true,
      renderText: (v: string) => `${parseFloat(v || '0').toFixed(2)}`,
    },
    {
      title: '关卡',
      dataIndex: ['snapshot', 'Info', 'MaxOutpostId'],
      search: false,
    },
    {
      title: 'BINGO成功率',
      search: false,
      render: (text, record) =>
        (record?.snapshot?.Audit?.BingoNum
          ? (100 * record?.snapshot?.Audit?.BingoNum) / record?.snapshot?.Audit?.CardNum
          : 0.0
        ).toFixed(1),
      ellipsis: true,
    },
    {
      title: '经验等级',
      dataIndex: ['snapshot', 'Info', 'Level'],
      search: false,
    },
    {
      title: 'VIP等级',
      dataIndex: ['snapshot', 'Info', 'VIP'],
      search: false,
    },
    {
      title: '最近日志',
      dataIndex: ['snapshot', 'Audit', 'LastItemWay'],
      search: false,
      ellipsis: true,
      key: 'LastItemWay',
    },
    {
      title: '最近付费',
      ellipsis: true,
      key: 'pay_time',
      valueType: 'dateTimeRange',
      hideInTable: true,
    },
    {
      title: '最近付费',
      dataIndex: ['snapshot', 'LastPayTime'],
      ellipsis: true,
      key: 'pay_time',
      hideInSearch: true,
    },
    {
      title: '渠道',
      dataIndex: 'chan_id',
      search: false,
    },
    {
      title: '游戏状态',
      dataIndex: 'game_name',
      search: false,
    },
    {
      title: '最近登陆',
      key: 'login_time',
      valueType: 'dateTimeRange',
      hideInTable: true,
    },
    {
      title: '最近离线',
      key: 'offline_time',
      valueType: 'dateTimeRange',
      hideInTable: true,
    },
    {
      title: '最近登陆',
      key: 'login_time',
      dataIndex: ['snapshot', 'LastEnterTime'],
      ellipsis: true,
      search: false,
    },
    {
      title: '最近离线',
      key: 'offline_time',
      dataIndex: ['snapshot', 'LastLeaveTime'],
      ellipsis: true,
      search: false,
    },
    {
      title: '注册时间',
      dataIndex: 'create_time',
      search: false,
      ellipsis: true,
    },
    {
      title: '登陆版本',
      dataIndex: ['snapshot', 'ClientVersion'],
      search: false,
      key: 'ClientVersion',
    },
    {
      title: '设备型号',
      dataIndex: 'phone_brand',
      search: false,
      key: 'PhoneBrand',
    },
    {
      title: '连续登陆天数',
      dataIndex: ['snapshot', 'LoginDayNum'],
      search: false,
      key: 'LoginDayNum',
    },
    {
      title: 'VIP点数',
      dataIndex: ['snapshot', 'Items', 1106],
      search: false,
      key: 'VIPPoints',
    },
    {
      title: '登陆类型',
      dataIndex: ['snapshot', 'Plate'],
      search: false,
      key: 'plate',
    },
    {
      title: '续球币',
      dataIndex: ['snapshot', 'Items', 1105],
      search: false,
      key: 'RelifeCoin',
    },
    {
      title: '最大菜谱',
      dataIndex: ['snapshot', 'MaxFactoryFood'],
      search: false,
      key: 'MaxFactoryFood',
    },
    {
      title: '仓库等级',
      dataIndex: ['snapshot', 'StorageLevel'],
      search: false,
      key: 'StorageLevel',
    },
    {
      title: '注册时间',
      dataIndex: 'create_time',
      hideInTable: true,
      valueType: 'dateTimeRange',
    },
  ];

  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, ColumnsState>>({
    ClientVersion: { show: false },
    PhoneBrand: { show: false },
    plate: { show: false },
    RelifeCoin: { show: false },
    VIPPoints: { show: false },
    LoginDayNum: { show: false },
    login_time: { show: false },
    offline_time: { show: false },
    LastItemWay: { show: false },
    MaxFactoryFood: { show: false },
    StorageLevel: { show: false },
  });

  const reload = () => {
    setModalVisible(false);
    actionRef.current?.reload();
  };

  const [exporting, setExporting] = useState<boolean>(false);
  const [formVars, setFormVars] = useState<TableListParams>({} as TableListParams);
  const query = async (params: TableListParams) => {
    const res = await getUserList(params);
    setFormVars(params);
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
    const res = await exportUsers({ ...formVars, current: 1, pageSize: 999 } as TableListParams);
    download(res.url);

    setExporting(false);
  };

  return (
    <PageContainer>
      <ProTable<TableListItem>
        tableLayout="fixed"
        actionRef={actionRef}
        columns={columns}
        request={(params, sorter) => query({ ...params, sorter } as TableListParams)}
        rowKey="key"
        columnsStateMap={columnsStateMap}
        onColumnsStateChange={(map) => setColumnsStateMap(map)}
        // scroll={{ x: 'calc(700px + 50%)' }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="export_excel"
            loading={exporting}
            onClick={() => {
              exportExcel();
            }}
          >
            导出
          </Button>,
        ]}
      />
      <UserModal
        modalVisible={modalVisible}
        item={user}
        onCancel={() => {
          setModalVisible(false);
        }}
        reload={reload}
      />
    </PageContainer>
  );
};

export default TableList;
