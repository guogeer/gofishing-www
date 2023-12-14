import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Modal, Input, Form, Divider, Select, Typography, Tooltip } from 'antd';
import React, { Fragment, useState, useRef, useEffect } from 'react';

import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { TableListItem, TableListParams } from './data';

import { getItemList, deleteItem, addItem, updateItem, getRemoteIP } from './service';

const FormItem = Form.Item;
const { Text } = Typography;
const gUpdateTypes = { tip: '热更新', upgrade: '新版本提示', force: '新版本强更' };

type CreateFormProps = {
  modalVisible: boolean;
  modalType?: string;
  editItem?: Partial<TableListItem>;
  handleAdd: (fieldsValue: any) => void;
  onCancel: () => void;
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, handleAdd, onCancel, modalType, editItem } = props;
  const [form] = Form.useForm();
  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    handleAdd(fieldsValue);
  };

  const [updateType, setUpdateType] = useState<string>('');
  const [ip, setIP] = useState<string>('');

  const curUpdateType: string = updateType || editItem?.update_type || 'force';
  const item = { update_type: curUpdateType, ...editItem };

  useEffect(() => {
    const load = async () => {
      const res = await getRemoteIP();
      setIP(res.IP);
    };
    load();
  }, []);

  const checkJSON = (rule: any, value: string) => {
    return new Promise<void>((reslove, reject) => {
      if (value) {
        try {
          JSON.parse(value);
        } catch (error) {
          reject(error);
          return;
        }
      }
      reslove();
    });
  };

  return (
    <Modal
      destroyOnClose
      title={modalType === 'edit' ? '编辑' : '新建'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={onCancel}
    >
      <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} initialValues={item}>
        <FormItem style={{ display: 'none' }} label="ID" name="id">
          <Input type="hidden" placeholder="" />
        </FormItem>
        <FormItem
          label="渠道"
          name="chan_id"
          rules={[{ required: true, message: '请输入渠道！', min: 2 }]}
        >
          <Input placeholder="" />
        </FormItem>
        <FormItem
          label="版本"
          name="version"
          rules={[{ required: true, message: '请输入版本！', min: 2 }]}
        >
          <Input placeholder="" />
        </FormItem>
        <FormItem label="更新方式" name="update_type">
          <Select
            onChange={(v: string) => {
              setUpdateType(v);
            }}
          >
            {Object.keys(gUpdateTypes).map((v) => (
              <Select.Option key={v} value={v}>
                {gUpdateTypes[v]}
              </Select.Option>
            ))}
          </Select>
        </FormItem>
        <FormItem
          label="登陆IP白名单"
          name={['json_value', 'AllowIPs']}
          rules={[{ required: false }]}
          help={<Text type="danger">本机IP：{ip}</Text>}
        >
          <Input placeholder="192.168.1.1,192.168.1.2" />
        </FormItem>
        <FormItem
          label={
            <Tooltip title="可输入IP，玩家UID，版本v1.2.3.4">
              <span>更新白名单(?)</span>
            </Tooltip>
          }
          name="blacklist"
        >
          <Input placeholder="192.168.1.1,123456,v1.8.6.2450" />
        </FormItem>
        <FormItem
          label="更新地址"
          name="url"
          rules={[{ required: true, message: '请输入更新地址！', min: 2 }]}
        >
          <Input placeholder="" />
        </FormItem>
        {
          // 热更新不发送邮件
          curUpdateType !== 'tip' && (
            <>
              <FormItem label="奖励" name="reward" rules={[{ required: false }]}>
                <Input placeholder="" />
              </FormItem>
              <FormItem
                label="邮件标题"
                name="title"
                rules={[{ required: false, message: '请输入邮件标题！', min: 2 }]}
              >
                <Input placeholder="" />
              </FormItem>
              <FormItem label="版本日志" name="change_log">
                <Input.TextArea />
              </FormItem>
            </>
          )
        }
        <FormItem
          label="自定义参数"
          name="config"
          rules={[{ required: false }, { validator: checkJSON }]}
        >
          <Input.TextArea />
        </FormItem>
      </Form>
    </Modal>
  );
};

const MyForm = CreateForm;

const TableList: React.FC = () => {
  const [editItem, setEditItem] = useState({});
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>('new');
  const actionRef = useRef<ActionType>();

  const handleMenuClick = async (key: string, rows: TableListItem[]) => {
    const item = rows[0];
    switch (key) {
      case 'remove_one':
        await deleteItem({ item } as TableListParams);
        actionRef.current?.reload();
        break;
      case 'update':
        setModalVisible(true);
        setEditItem(item);
        setModalType('edit');
        // console.log("update title",res.item.title)
        break;
      default:
        break;
    }
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      search: false,
    },
    {
      title: '渠道',
      dataIndex: 'chan_id',
      hideInSearch: false,
    },
    {
      title: '版本',
      dataIndex: 'version',
      search: false,
    },
    {
      title: '更新方式',
      dataIndex: 'update_type',
      search: false,
      renderText: (v: string) => gUpdateTypes[v],
    },
    {
      title: '更新IP/UID白名单',
      dataIndex: 'blacklist',
      search: false,
      ellipsis: true,
      width: 100,
    },
    {
      title: '登陆IP白名单',
      dataIndex: ['json_value', 'AllowIPs'],
      search: false,
      ellipsis: true,
    },
    {
      title: '邮件标题',
      dataIndex: 'title',
      search: false,
    },
    {
      title: '更新内容',
      dataIndex: 'change_log',
      search: false,
      ellipsis: true,
      width: 100,
    },
    {
      title: '强更地址',
      dataIndex: 'url',
      search: false,
      ellipsis: true,
      width: 100,
    },
    {
      title: '自定义参数',
      dataIndex: 'config',
      search: false,
      ellipsis: true,
      width: 100,
    },
    {
      title: '更新时间',
      dataIndex: 'last_time',
      search: false,
      ellipsis: true,
      width: 140,
    },
    {
      title: '操作',
      search: false,
      render: (_, record) => (
        <Fragment>
          <a onClick={() => handleMenuClick('update', [record])}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => handleMenuClick('remove_one', [record])}>删除</a>
        </Fragment>
      ),
    },
  ];

  const handleAdd = async (rawItem: TableListItem) => {
    const item = rawItem;
    const jsonValue = item.json_value as Record<string, string>;
    if (jsonValue?.AllowIPs) {
      jsonValue.AllowIPs = jsonValue.AllowIPs.trim();
    }

    item.json_value = JSON.stringify(jsonValue).trim();
    if (modalType === 'new') {
      addItem({ item } as TableListParams);
    } else {
      updateItem({ item } as TableListParams);
    }
    const msg = modalType === 'new' ? '添加成功' : '修改成功';
    message.success(msg);
    setModalVisible(false);
    setModalType('');
    actionRef.current?.reload();
    return true;
  };

  return (
    <PageContainer>
      <ProTable<TableListItem>
        tableLayout="fixed"
        actionRef={actionRef}
        columns={columns}
        request={(params) => getItemList({ ...params } as TableListParams)}
        rowKey="key"
        toolBarRender={() => [
          <Button
            type="primary"
            key="new"
            onClick={() => {
              setModalVisible(true);
              setModalType('new');
              setEditItem({});
            }}
          >
            <PlusOutlined />
            新建
          </Button>,
        ]}
      />
      {modalType && (
        <MyForm
          handleAdd={handleAdd}
          modalVisible={modalVisible}
          modalType={modalType}
          editItem={editItem}
          onCancel={() => {
            setModalVisible(false);
            setModalType('');
            // setEditItem({})
          }}
        />
      )}
    </PageContainer>
  );
};

export default TableList;
