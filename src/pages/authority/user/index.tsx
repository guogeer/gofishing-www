import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Modal, Input, Form, TreeSelect, Divider, Tag } from 'antd';
import React, { Fragment, useState, useRef, useEffect } from 'react';

import type { MenuDataItem } from '@ant-design/pro-layout';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { queryMenuTree } from '@/services/menu';
import type { DataNode } from 'antd/lib/tree';
import { getUserList, getUser, deleteUser, addUser, updateUser } from './service';
import type { TableListItem, TableListParams } from './data';

const FormItem = Form.Item;

type CreateFormProps = {
  modalVisible: boolean;
  modalType?: string;
  editItem?: Partial<TableListItem>;
  menuTree: MenuDataItem[];
  handleAdd: (fieldsValue: any) => void;
  onCancel: () => void;
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, handleAdd, onCancel, modalType, editItem, menuTree } = props;
  const [form] = Form.useForm();
  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    handleAdd(fieldsValue);
  };
  const defaultItem: TableListItem = {
    id: 0,
    account: '',
    passwd: '',
    coment: '',
  };

  const item = { ...defaultItem, ...editItem };
  if (!item.menus) {
    item.menus = undefined;
  }
  // 菜单
  const menus: DataNode[] = [];
  for (let i = 0; i < menuTree.length; i += 1) {
    const menu = menuTree[i];
    const children = [];
    for (let k = 0; menu.children && k < menu.children?.length; k += 1) {
      const child1 = menu.children[k];
      const child2 = {
        key: child1.path,
        title: child1.name,
        value: child1.path,
      };
      children.push(child2);
    }
    menus.push({
      key: menu.path,
      title: menu.name,
      value: menu.path,
      children,
    } as DataNode);
  }

  return (
    <Modal
      destroyOnClose
      title={modalType === 'edit' ? '编辑' : '新建'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={onCancel}
    >
      <Form form={form} initialValues={item} labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
        <FormItem label="ID" name="id" hidden>
          <Input placeholder="" />
        </FormItem>
        <FormItem label="权限" name="authority" hidden>
          <Input placeholder="" />
        </FormItem>
        <FormItem
          label="账号"
          name="account"
          rules={[{ required: true, message: '请输入账号！', min: 2 }]}
        >
          <Input placeholder="" readOnly={modalType === 'edit'} />
        </FormItem>
        <FormItem
          label="密码"
          name="passwd"
          rules={[{ required: true, message: '请输入密码！', min: 2 }]}
        >
          <Input placeholder="" type="password" />
        </FormItem>
        <FormItem label="菜单" name="menus">
          <TreeSelect
            treeData={menus}
            treeCheckable
            showCheckedStrategy={TreeSelect.SHOW_CHILD}
            style={{ width: 295 }}
          />
        </FormItem>
        <FormItem label="备注" name="coment">
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
  const [menuTree, setMenuTree] = useState<MenuDataItem[]>([]);
  const [childMenus, setChildMenus] = useState<Record<string, MenuDataItem>>({});
  const actionRef = useRef<ActionType>();

  useEffect(() => {
    const loadPage = async () => {
      const tree: MenuDataItem[] = await queryMenuTree();

      const menus: Record<string, MenuDataItem> = {};
      if (tree) {
        for (let i = 0; i < tree.length; i += 1) {
          const children = tree[i].children || [];
          for (let j = 0; j < children.length; j += 1) {
            const path = children[j].path || '';
            if (path) {
              menus[path] = children[j];
            }
          }
        }
      }
      setMenuTree(tree as []);
      setChildMenus(menus);
    };
    loadPage();
  }, []);

  const handleMenuClick = async (key: string, rows: TableListItem[]) => {
    const item = rows[0];
    switch (key) {
      case 'delete':
        await deleteUser({ item } as TableListParams);
        message.success('删除成功');
        actionRef?.current?.reload();
        break;
      case 'update':
        // eslint-disable-next-line no-case-declarations
        const res = await getUser({ item } as TableListParams);
        setModalVisible(true);
        setEditItem(res.item);
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
      title: '账号',
      dataIndex: 'account',
      search: false,
    },
    {
      title: '权限',
      dataIndex: 'friendly_menus',
      ellipsis: true,
      render: (text, record) => (
        <>
          {record.menus?.map((v) =>
            childMenus[v] ? <Tag key={v}>{childMenus[v].name}</Tag> : null,
          )}
        </>
      ),
    },
    {
      title: '备注',
      dataIndex: 'coment',
    },
    {
      title: '操作',
      render: (_, record) => (
        <Fragment>
          <a onClick={() => handleMenuClick('update', [record])}>编辑</a>
          <Divider type="vertical" />
          {record.account !== 'admin' ? (
            <a onClick={() => handleMenuClick('delete', [record])}>删除</a>
          ) : null}
        </Fragment>
      ),
    },
  ];

  const handleAdd = async (item: TableListItem) => {
    if (modalType === 'new') {
      addUser({ item } as TableListParams);
    } else {
      updateUser({ item } as TableListParams);
    }
    const msg = modalType === 'new' ? '添加成功' : '修改成功';
    message.success(msg);
    setModalVisible(false);
    actionRef?.current?.reload();
  };

  return (
    <PageContainer>
      <ProTable<TableListItem>
        search={false}
        actionRef={actionRef}
        columns={columns}
        request={(params) => getUserList({ ...params } as TableListParams)}
        rowKey="key"
        toolBarRender={() => [
          <Button
            type="primary"
            key="btn_add_user"
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
          menuTree={menuTree as []}
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
