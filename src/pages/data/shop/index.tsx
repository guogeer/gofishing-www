import { Card, Row, Form, DatePicker, Col, Button } from 'antd';
import React, { useState, useEffect } from 'react';

import { PageContainer } from '@ant-design/pro-layout';
import { Chart, Tooltip, Interval } from 'bizcharts';

import moment from 'moment';
import type { TableListParams } from './data';
import { reportPayOrder } from './service';

const TableList: React.FC = () => {
  const [data, setData] = useState([]);

  const [form] = Form.useForm();
  const reload = async () => {
    const params = await form.getFieldsValue();

    const createTime: string[] = [];
    const formCreateTime: moment.Moment[] = params.create_time as moment.Moment[];
    for (let i = 0; formCreateTime && i < formCreateTime.length; i += 1) {
      createTime.push(formCreateTime[i].format('YYYY-MM-DD'));
    }
    params.create_time = createTime;

    const req = await reportPayOrder(params as TableListParams);
    setData(req.data);
  };
  useEffect(() => {
    reload();
  }, []);
  if (!data) {
    return null;
  }

  return (
    <PageContainer>
      <Card bordered={false}>
        <Form form={form} layout="inline">
          <Row>
            <Col>
              <Form.Item label="日期" name="create_time" initialValue={[moment(), moment()]}>
                <DatePicker.RangePicker />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              onClick={async () => {
                reload();
              }}
            >
              查看
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card bordered={false}>
        <Chart
          height={400}
          autoFit
          data={data}
          interactions={['active-region']}
          padding={[30, 30, 30, 50]}
        >
          <Interval position="item_id*num" />
          <Tooltip shared />
        </Chart>
      </Card>
    </PageContainer>
  );
};

export default TableList;
