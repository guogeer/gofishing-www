import { message, Modal, Input, Form, Select, Divider } from 'antd';
import React, { useState, useRef, useEffect } from 'react';

import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { fetchConfigTable } from '@/services/common';
import type { TableListItem, TableListParams } from './data';

import { getAdviseList, updateAdvise } from './service';

const FormItem = Form.Item;
const enumResultMap = { 1: '未处理', 2: '忽略', 3: '模版', 4: '人工' };

type CreateFormProps = {
  modalVisible: boolean;
  id: number;
  handleAdd: (fieldsValue: any) => Promise<boolean>;
  onCancel: () => void;
  mailTemplates: Record<string, string>[];
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { mailTemplates, modalVisible, id, handleAdd, onCancel } = props;
  const [form] = Form.useForm();
  const okHandle = async () => {
    const fieldsValue = await form.validateFields();

    const body = fieldsValue.Body || fieldsValue.template;
    const ok = await handleAdd({ ...fieldsValue, id, Body: body });
    if (ok === true) {
      form.resetFields();
    }
  };

  const [mailBody, setMailBody] = useState('');
  return (
    <Modal
      destroyOnClose
      title="邮件回复"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={onCancel}
    >
      <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 20 }}>
        <FormItem
          label="标题"
          name="Title"
          initialValue="Reply"
          rules={[{ required: true, message: '请输入标题！', min: 2 }]}
        >
          <Input />
        </FormItem>
        <FormItem
          label="模版"
          name="template"
          initialValue=""
          rules={[{ required: false, message: '请输入模版！', min: 2 }]}
        >
          <Select onChange={(e) => e && setMailBody(e.toString())}>
            <Select.Option key="empty" value="">
              自定义
            </Select.Option>
            {mailTemplates.map((v) => (
              <Select.Option key={v.Id} value={v.Template}>
                {v.Template}
              </Select.Option>
            ))}
          </Select>
        </FormItem>
        {!mailBody && (
          <FormItem
            label="内容"
            name="Body"
            rules={[{ required: false, message: '请输入内容！', min: 2 }]}
          >
            <Input.TextArea
              autoSize={{ minRows: 4, maxRows: 20 }}
              key="mail_body"
              value={mailBody}
            />
          </FormItem>
        )}
      </Form>
    </Modal>
  );
};

const MyForm = CreateForm;

const TableList: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [mailTemplates, setMailTemplates] = useState<Record<string, string>[]>([]);
  const [id, setId] = useState(0);
  const actionRef = useRef<ActionType>();
  const defaultParams = {
    result: '-1',
  };

  useEffect(() => {
    const loadPage = async () => {
      const res = await fetchConfigTable({ Name: 'mail_template' });
      setMailTemplates(res.Table || []);
    };
    loadPage();
  }, []);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '状态',
      dataIndex: 'result',
      initialValue: '-1',
      renderFormItem: (item, { defaultRender, ...rest }) => {
        return (
          <Select {...rest}>
            <Select.Option key="all" value="-1">
              全部
            </Select.Option>
            {Object.keys(enumResultMap).map((v) => (
              <Select.Option key={v} value={v}>
                {enumResultMap[v]}
              </Select.Option>
            ))}
          </Select>
        );
      },
      render: (text, record) => {
        const result = parseInt(record.result, 10);
        return (
          <>
            {result > 1 ? (
              enumResultMap[result]
            ) : (
              <>
                <a
                  onClick={() => {
                    updateAdvise({ item: { id: record.id, result: '2', Body: '', Title: '' } });
                    actionRef.current?.reload();
                  }}
                >
                  忽略
                </a>
                <Divider type="vertical" />
                <a
                  onClick={() => {
                    setId(record.id || 0);
                    setModalVisible(true);
                  }}
                >
                  人工
                </a>
              </>
            )}
          </>
        );
      },
    },
    {
      title: '工单',
      dataIndex: 'id',
      search: false,
    },
    {
      title: '玩家ID',
      dataIndex: 'uid',
    },
    {
      title: '渠道',
      dataIndex: 'chan_id',
      search: false,
    },
    {
      title: '对局数',
      dataIndex: 'play_times',
      search: false,
    },
    {
      title: '充值金额',
      dataIndex: 'Body',
      search: false,
      renderText: (v) => `${parseFloat(v || '0').toFixed(2)}`,
    },
    {
      title: '反馈内容',
      dataIndex: 'msg',
      search: false,
      ellipsis: true,
    },
    {
      title: '回复内容',
      dataIndex: 'mail_content',
      search: false,
      ellipsis: true,
    },
    {
      title: '反馈日期',
      dataIndex: 'create_time',
      search: false,
    },
    {
      title: '回复日期',
      dataIndex: 'reply_time',
      search: false,
    },
  ];

  const handleAdd = async (params: TableListItem) => {
    updateAdvise({ item: { ...params, result: '4' } });
    setModalVisible(false);
    message.success('反馈已邮件通知玩家');
    actionRef.current?.reload();
    return true;
  };

  return (
    <PageContainer>
      <ProTable<TableListItem>
        tableLayout="fixed"
        actionRef={actionRef}
        columns={columns}
        request={(params) => getAdviseList({ ...defaultParams, ...params } as TableListParams)}
        rowKey="key"
      />
      <MyForm
        handleAdd={handleAdd}
        modalVisible={modalVisible}
        mailTemplates={mailTemplates}
        id={id}
        onCancel={() => {
          setModalVisible(false);
        }}
      />
    </PageContainer>
  );
};

export default TableList;
