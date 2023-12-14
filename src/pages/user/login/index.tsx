import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, message } from 'antd';
import React, { useState } from 'react';
import { ProFormText, LoginForm } from '@ant-design/pro-form';
import { history, useModel } from 'umi';
import Footer from '@/components/Footer';
import type { LoginParamsType as LoginParams } from '@/services/login';
import { fakeAccountLogin as login } from '@/services/login';

import styles from './index.less';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginStateType>({});
  const [type] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((params) => ({
        ...params,
        currentUser: userInfo,
      }));
    }
  };

  const handleSubmit = async (values: LoginParams) => {
    try {
      // 登录
      const msg = await login({ ...values });
      if (msg.status === 'ok') {
        message.success('登录成功！');
        await fetchUserInfo();

        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const { query } = history.location;
        const { redirect } = query as { redirect: string };
        history.push(redirect || '/');

        return;
      }
      console.log(msg);
      // 如果失败去设置用户错误信息
      setUserLoginState(msg);
    } catch (error) {
      message.error('登录失败，请重试！');
    }
  };
  const { status, type: loginType } = userLoginState;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          title="运营管理"
          subTitle="深圳帝国在线互动娱乐有限公司"
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as LoginParams);
          }}
        >
          {status === 'error' && loginType === 'account' && (
            <LoginMessage content="用户名或密码错误" />
          )}
          {type === 'account' && (
            <>
              <ProFormText
                name="userName"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder="账号"
                rules={[
                  {
                    required: true,
                    message: '请输入账号!',
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder="密码"
                rules={[
                  {
                    required: true,
                    message: '请输入密码！',
                  },
                ]}
              />
            </>
          )}
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
