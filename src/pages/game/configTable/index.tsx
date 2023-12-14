import { Modal, Input, Form, Button, message, Divider } from 'antd';
import React, { useState, useRef, useEffect } from 'react';

import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import type { ConfigTable, TableListItem } from './data';

import { getConfigTable, updateConfigTable } from './service';
import { PageContainer } from '@ant-design/pro-layout';
import { CopyOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

const FormItem = Form.Item;

type LineFormProps = {
  modalVisible: boolean;
  handleAdd: (fieldsValue: any) => Promise<boolean>;
  onCancel: () => void;
  configTable: ConfigTable;
  chooseRow: number;
};

const LineForm: React.FC<LineFormProps> = (props) => {
  const {
    modalVisible,
    handleAdd,
    onCancel,
    chooseRow,
    configTable: { Table },
  } = props;
  const [form] = Form.useForm();
  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    const ok = await handleAdd(fieldsValue);
    if (ok === true) {
      form.resetFields();
    }
  };

  return (
    <Modal
      destroyOnClose
      title="编辑"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={onCancel}
      maskClosable={false}
    >
      <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 20 }}>
        {((Table && Table.length > 0 && Table[chooseRow]) || []).map((v, k) => (
          <FormItem
            label={Table[0][k]}
            name={['Row', k]}
            key={Table[1][k]}
            initialValue={Table[chooseRow][k]}
          >
            <Input placeholder={`${Table[chooseRow][k]}`} />
          </FormItem>
        ))}
      </Form>
    </Modal>
  );
};

type EditFormProps = {
  modalVisible: boolean;
  handleAdd: (fieldsValue: any) => Promise<boolean>;
  onCancel: () => void;
  tableContent: string;
};

const EditForm: React.FC<EditFormProps> = (props) => {
  const { modalVisible, handleAdd, onCancel, tableContent } = props;
  const [form] = Form.useForm();
  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    const ok = await handleAdd(fieldsValue);
    if (ok === true) {
      form.resetFields();
    }
  };

  return (
    <Modal
      destroyOnClose
      title="编辑"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={onCancel}
      maskClosable={false}
    >
      <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 24 }}>
        <FormItem name="content" key="content" initialValue={tableContent}>
          <Input.TextArea rows={10} />
        </FormItem>
      </Form>
    </Modal>
  );
};

const TableList: React.FC = () => {
  const [lineModalVisible, setLineModalVisible] = useState<boolean>(false);
  const [columns, setColumns] = useState<ProColumns<TableListItem>[]>([]);
  const [chooseRow, setChooseRow] = useState<number>(-1);
  const [configTable, setConfigTable] = useState<ConfigTable>({} as ConfigTable);
  const [isSubmitting, setSumbmitting] = useState<boolean>(false);

  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [tableContent, setTableContent] = useState<string>('');

  const actionRef = useRef<ActionType>();
  const configTableName = window.location.pathname.split('/').pop() || '';

  const showConfigTable = (tb: ConfigTable) => {
    const cols: ProColumns<TableListItem>[] = [
      {
        title: '',
        key: 'operate',
        render: (text, record) => (
          <>
            <EditOutlined
              onClick={() => {
                setChooseRow(record.rowid);
                setLineModalVisible(true);
              }}
            />
            <Divider type="vertical" />
            <CopyOutlined
              onClick={() => {
                const newConfigTable = configTable;
                const newRow = JSON.parse(JSON.stringify(newConfigTable.Rows[record.rowid]));

                let repeat = 1;
                let rowKey = '';
                if (newRow.Row) {
                  rowKey = `${newRow.Row[0]}`;
                }
                const match = rowKey.match(/\(\d+\)$/);
                if (match) {
                  rowKey = rowKey.substr(0, match.index || 0);
                }
                for (let i = 0; i < 999; i += 1) {
                  let isExist = false;
                  for (let k = 0; k < newConfigTable.Table.length; k += 1) {
                    if (`${newConfigTable.Table[k][0]}` === `${rowKey}(${repeat})`) {
                      isExist = true;
                    }
                  }
                  if (!isExist) {
                    break;
                  }
                  repeat += 1;
                }
                newRow.key = `${rowKey}(${repeat})`;
                newRow.Row[0] = `${rowKey}(${repeat})`;
                newConfigTable.Rows.splice(record.rowid + 1, 0, newRow);
                newConfigTable.Table.splice(record.rowid + 1, 0, newRow.Row);
                newConfigTable.Rows.forEach((v: TableListItem, k: number) => {
                  newConfigTable.Rows[k].rowid = k;
                });
                // setConfigTable(JSON.parse(JSON.stringify(newConfigTable)))
                setConfigTable({ ...newConfigTable });
              }}
            />
            <Divider type="vertical" />
            <DeleteOutlined
              onClick={() => {
                const newConfigTable = configTable;
                newConfigTable.Rows.splice(record.rowid, 1);
                newConfigTable.Table.splice(record.rowid, 1);
                newConfigTable.Rows.forEach((v: TableListItem, k: number) => {
                  newConfigTable.Rows[k].rowid = k;
                });
                setConfigTable({ ...newConfigTable });
              }}
            />
          </>
        ),
      },
    ];
    tb.Rows = [];
    if (tb.Table) {
      tb.Table[0].forEach((v, k) => {
        cols.push({ title: tb.Table[0][k], dataIndex: ['Row', k], key: v });
      });
      tb.Table.forEach((v, k) => {
        tb.Rows.push({ rowid: k, Row: v, key: v[0] });
      });
    }

    Object.keys(tb).forEach((key) => {
      configTable[key] = tb[key];
    });
    setColumns(cols);
    setConfigTable(configTable);
  };

  const handleLine = async (params: { Row: string[] }) => {
    const newRow = { ...params, key: params.Row[0], rowid: chooseRow };
    const newConfigTable = configTable;
    newConfigTable.Table[chooseRow] = JSON.parse(JSON.stringify(newRow.Row));
    newConfigTable.Rows[chooseRow] = JSON.parse(JSON.stringify(newRow));

    setLineModalVisible(false);
    setConfigTable({ ...newConfigTable });
    setChooseRow(-1);
    return true;
  };

  const handleEdit = async (params: { content: string }) => {
    const table: string[][] = [];
    const newConfigTable = configTable;
    const lines = params.content.replaceAll('\r\n', '\n').split('\n');
    lines.forEach((line: string) => {
      table.push(line.split('\t'));
    });
    newConfigTable.Table = table;

    setEditModalVisible(false);
    setTableContent('');
    showConfigTable({ ...newConfigTable });
    return true;
  };

  useEffect(() => {
    const query = async () => {
      const tb: ConfigTable = await getConfigTable({ Name: configTableName, Table: [] });
      showConfigTable(tb);
    };
    query();
  }, []);

  const submitConfigTable = async () => {
    setSumbmitting(true);
    updateConfigTable({ Name: configTableName, Table: configTable.Table });
    setSumbmitting(false);
    message.success(`配置表${configTableName}已更新`);
  };

  const editConfigTable = async () => {
    let content = '';
    configTable.Table.forEach((line: string[]) => {
      if (content) {
        content += '\n';
      }
      content += line.join('\t');
    });
    setEditModalVisible(true);
    setTableContent(content);
  };

  return (
    <PageContainer>
      <ProTable<TableListItem>
        tableLayout="fixed"
        actionRef={actionRef}
        columns={columns}
        dataSource={(configTable.Rows || []).slice(2)}
        rowKey="key"
        options={false}
        search={false}
        /* onRow={
          record =>{
            return {
              onClick: () => {
                setChooseRow(record.rowid)
                setModalVisible(true)
              }
             }
          } 
        } */
        toolBarRender={() => [
          <Button
            type="primary"
            key="edit_config_table"
            onClick={() => {
              editConfigTable();
            }}
          >
            编辑文本
          </Button>,
          <Button
            type="primary"
            key="sumit_config_table"
            loading={isSubmitting}
            onClick={() => {
              submitConfigTable();
            }}
          >
            保存生效
          </Button>,
        ]}
      />
      {chooseRow >= 0 ? (
        <LineForm
          handleAdd={handleLine}
          modalVisible={lineModalVisible}
          configTable={configTable}
          chooseRow={chooseRow}
          onCancel={() => {
            setLineModalVisible(false);
            // setTableData([])
            setChooseRow(-1);
          }}
        />
      ) : null}
      {tableContent.length > 0 ? (
        <EditForm
          handleAdd={handleEdit}
          modalVisible={editModalVisible}
          tableContent={tableContent}
          onCancel={() => {
            setEditModalVisible(false);
          }}
        />
      ) : null}
    </PageContainer>
  );
};

export default TableList;
