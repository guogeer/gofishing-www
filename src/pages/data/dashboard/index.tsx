import { Card, Row, Select, Form, DatePicker, Col, Button } from 'antd';
import React, { useState, useEffect } from 'react';

import { PageContainer } from '@ant-design/pro-layout';
import { Chart, Line, Tooltip, Legend } from 'bizcharts';

import moment from 'moment';
import { getItemList } from './service';
import type { TableListParams } from './data';

const TableList: React.FC = () => {
  const [data, setData] = useState([]);
  const [gameList, setGameList] = useState([]);

  const [form] = Form.useForm();
  useEffect(() => {
    const initPage = async () => {
      const params = await form.getFieldsValue();
      params.day = params.day.format('YYYY-MM-DD');
      const req = await getItemList(params as TableListParams);
      setData(req.data);
      setGameList(req.game_list);
    };
    initPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              <Form.Item label="日期" name="day" initialValue={moment()}>
                <DatePicker />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label="游戏" name="game" initialValue="ALL">
                <Select>
                  <Select.Option key="ALL" value="ALL">
                    全部游戏
                  </Select.Option>
                  {Object.keys(gameList).map((v) => {
                    return (
                      <Select.Option key={v} value={v}>
                        {gameList[v]}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              onClick={async () => {
                const params = await form.getFieldsValue();
                params.day = params.day.format('YYYY-MM-DD');
                const req = await getItemList(params as TableListParams);
                setData(req.data);
                setGameList(req.game_list);
              }}
            >
              查看
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card bordered={false}>
        <Chart scale={{ v: { min: 0 } }} autoFit height={500} data={data}>
          <Line shape="smooth" position="x*v" color="y" />
          <Tooltip shared />
          <Legend />
        </Chart>
      </Card>
    </PageContainer>
  );
};

export default TableList;
