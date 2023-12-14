import { Input, Form, Button, message, DatePicker, Card } from 'antd';
import React, { useState, useEffect } from 'react';

import { PageContainer } from '@ant-design/pro-layout';
import type { Maintain, Config } from './data';
import { queryConfig, updateMaintain } from './service';
import moment from 'moment';

const TableList: React.FC = () => {
  const longDateFmt = 'YYYY-MM-DD HH:mm:ss';
  const [isSubmitting, setSumbmitting] = useState<boolean>(false);
  const [maintain, SetMaintain] = useState<Maintain>({} as Maintain);

  const load = async () => {
    const res = await queryConfig({ Name: 'maintain' } as Config);

    SetMaintain({
      Time: res?.Data?.Time?.map((v: string) => {
        return moment(v, longDateFmt);
      }),
      Content: res?.Data?.Content,
    });
  };
  useEffect(() => {
    load();
  }, []);

  const submit = (params: Maintain) => {
    setSumbmitting(true);
    updateMaintain({
      Time: params.Time.map((v) => {
        return (v as moment.Moment).format(longDateFmt);
      }),
      Content: params.Content,
    } as Maintain);
    setSumbmitting(false);
    message.success('已提交');
  };

  return (
    <PageContainer>
      <Card>
        {Object.keys(maintain).length > 0 && (
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            onFinish={(values) => submit(values)}
            initialValues={maintain}
          >
            <Form.Item label="更新时间" name={'Time'}>
              <DatePicker.RangePicker showTime />
            </Form.Item>
            <Form.Item label="更新内容" name={'Content'}>
              <Input.TextArea rows={10} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isSubmitting}>
                提交
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </PageContainer>
  );
};

export default TableList;
