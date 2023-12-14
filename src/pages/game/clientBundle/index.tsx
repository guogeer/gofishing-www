import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Modal, Input, Form, Divider, Typography } from 'antd';
import React, { Fragment, useState, useRef, useEffect } from 'react';

import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { TableListItem, TableListParams } from './data';

import { getItemList, deleteItem, addItem, updateItem, getRemoteIP } from './service';

const FormItem = Form.Item;
const { Text } = Typography;

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

  const [ip, setIP] = useState<string>('');
  const item = editItem;

  useEffect(() => {
    const load = async () => {
      const res = await getRemoteIP();
      setIP(res.IP);
    };
    load();
  }, []);

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
          label="分包名"
          name="bundle_name"
          rules={[{ required: true, message: '请输入分包名！', min: 2 }]}
        >
          <Input placeholder="bundle1,bundle2" />
        </FormItem>
        <FormItem
          label="版本"
          name="version"
          rules={[{ required: true, message: '请输入版本！', min: 2 }]}
        >
          <Input placeholder="" />
        </FormItem>
        <FormItem
          label="IP/UID白名单"
          name={['json_value', 'allowList']}
          rules={[{ required: false }]}
          help={<Text type="danger">本机IP：{ip}</Text>}
        >
          <Input placeholder="123456,192.168.1.2" />
        </FormItem>
        <FormItem
          label="更新地址"
          name={['json_value', 'url']}
          rules={[{ required: true, message: '请输入更新地址！', min: 2 }]}
        >
          <Input placeholder="" />
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
      title: '序号/优先级',
      dataIndex: 'id',
      search: false,
    },
    {
      title: '分包名',
      dataIndex: 'bundle_name',
      ellipsis: true,
    },
    {
      title: '版本',
      dataIndex: 'version',
      search: false,
    },
    {
      title: 'IP/UID白名单',
      dataIndex: ['json_value', 'allowList'],
      search: false,
      ellipsis: true,
    },
    {
      title: '分包地址',
      dataIndex: ['json_value', 'url'],
      search: false,
      ellipsis: true,
      width: 100,
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
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
    if (jsonValue?.allowList) {
      jsonValue.allowList = jsonValue.allowList.trim();
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
        headerTitle="按照优先级降序显示"
        toolBarRender={() => [
          <Button
            type="primary"
            key="new_bundle"
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
