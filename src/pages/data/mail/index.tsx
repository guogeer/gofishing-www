import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Modal, Input, Radio, Form, DatePicker } from 'antd';
import React, { useState, useRef } from 'react';

import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import type { TableListItem, TableListParams, Item } from './data';

import { getMailList, sendMail } from './service';

const FormItem = Form.Item;
const gMailTypeList = ['普通邮件', '系统邮件'];
const gMailStatusList = ['未查看', '已查看', '已收取', '已删除', '系统清理'];

type CreateFormProps = {
  modalVisible: boolean;
  handleAdd: (fieldsValue: any) => Promise<boolean>;
  onCancel: () => void;
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, handleAdd, onCancel } = props;
  const [form] = Form.useForm();
  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    const ok = await handleAdd(fieldsValue);
    if (ok === true) {
      form.resetFields();
    }
  };

  const [mailType, setMailType] = useState(0);

  return (
    <Modal
      destroyOnClose
      title="发送邮件"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={onCancel}
      maskClosable={false}
    >
      <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 20 }}>
        <FormItem
          label="标题"
          name="Title"
          rules={[{ required: true, message: '请输入标题！', min: 2 }]}
        >
          <Input placeholder="" />
        </FormItem>
        <FormItem label="类型" name="type" rules={[{ required: true }]} initialValue={mailType}>
          <Radio.Group
            onChange={(e) => {
              setMailType(e.target.value);
            }}
          >
            {gMailTypeList.map((v, k) => (
              <Radio key={v} value={k}>
                {v}
              </Radio>
            ))}
          </Radio.Group>
        </FormItem>
        {mailType === 1 && (
          <>
            <FormItem label="注册时间" name="RegTime">
              <DatePicker.RangePicker format="YYYY-MM-DD HH:mm:ss" />
            </FormItem>
            <FormItem
              label="有效时间"
              name="EffectTime"
              initialValue={[moment(), moment().add(1, 'year')]}
            >
              <DatePicker.RangePicker format="YYYY-MM-DD HH:mm:ss" />
            </FormItem>
          </>
        )}
        {mailType === 0 && (
          <>
            <FormItem
              label="用户名单"
              name="recv_id"
              rules={[{ required: true, message: '请输入用户' }]}
            >
              <Input placeholder="[10001,10002]" />
            </FormItem>
          </>
        )}
        <FormItem label="内容" name="Body">
          <Input.TextArea />
        </FormItem>
        <FormItem label="奖励" name="Items">
          <Input placeholder="[[1101,1],[1102,300]]" />
        </FormItem>
      </Form>
    </Modal>
  );
};

const MyForm = CreateForm;

const TableList: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      search: false,
    },
    {
      title: '类型',
      dataIndex: 'type',
      search: false,
      renderText: (val: string) => gMailTypeList[val],
    },
    {
      title: '接收者',
      dataIndex: 'recv_uid',
    },
    {
      title: '标题',
      dataIndex: 'Title',
      search: false,
    },
    {
      title: '内容',
      dataIndex: 'Body',
      search: false,
      ellipsis: true,
      width: 100,
    },
    {
      title: '物品',
      dataIndex: 'Items',
      search: false,
      ellipsis: true,
      render: (_, record: TableListItem) => {
        const items: number[][] = [];
        if (record && record.Items) {
          (record.Items as Item[]).forEach((v: Item) => {
            items.push([v.Id, v.Num || 0]);
          });
        }
        return JSON.stringify(items);
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      search: false,
      ellipsis: true,
      renderText: (val: string) => gMailStatusList[parseInt(val, 10)],
    },
    {
      title: '有效时间',
      dataIndex: 'EffectTime',
      search: false,
      ellipsis: true,
      render: (_, record: TableListItem) => {
        return JSON.stringify(record.EffectTime);
      },
    },
    {
      title: '注册时间',
      dataIndex: 'RegTime',
      search: false,
      ellipsis: true,
      render: (_, record: TableListItem) => {
        return JSON.stringify(record.RegTime);
      },
    },
    {
      title: '发送时间',
      dataIndex: 'send_time',
      ellipsis: true,
      valueType: 'dateTime',
    },
  ];

  const handleAdd = async (params: TableListItem) => {
    const mail = params;
    try {
      if (!mail.Items) {
        mail.Items = '[]';
      }
      const items: number[][] = JSON.parse(mail.Items as string);

      mail.Items = [];
      for (let i = 0; items && i < items.length; i += 1) {
        mail.Items.push({ Id: items[i][0], Num: items[i][1] });
      }
    } catch (error) {
      message.error('奖励不是有效的JSON格式');
      return false;
    }
    try {
      if (!mail.recv_id) {
        mail.recv_id = '[]';
      }
      mail.recv_id = JSON.parse(mail.recv_id as string);
    } catch (error) {
      message.error('接收者名单不是有效的JSON格式');
      return false;
    }

    const regTime: string[] = [];
    const formRegTime: moment.Moment[] = mail.RegTime as moment.Moment[];
    for (let i = 0; formRegTime && i < formRegTime.length; i += 1) {
      regTime.push(formRegTime[i].format('YYYY-MM-DD HH:mm:ss'));
    }
    mail.RegTime = regTime;

    const effectTime: string[] = [];
    const formEffectTime: moment.Moment[] = mail.EffectTime as moment.Moment[];
    for (let i = 0; formEffectTime && i < formEffectTime.length; i += 1) {
      effectTime.push(formEffectTime[i].format('YYYY-MM-DD HH:mm:ss'));
    }
    mail.EffectTime = effectTime;

    await sendMail({ item: mail } as TableListParams);
    setModalVisible(false);

    return true;
  };

  return (
    <PageContainer>
      <ProTable<TableListItem>
        tableLayout="fixed"
        actionRef={actionRef}
        columns={columns}
        request={(params) => getMailList({ ...params } as TableListParams)}
        rowKey="key"
        toolBarRender={() => [
          <Button
            type="primary"
            key="send_mail"
            onClick={() => {
              setModalVisible(true);
            }}
          >
            <PlusOutlined />
            发送邮件
          </Button>,
        ]}
      />
      <MyForm
        handleAdd={handleAdd}
        modalVisible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
        }}
      />
    </PageContainer>
  );
};

export default TableList;
