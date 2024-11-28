import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './Login.css';

const Login = ({ onLoginSuccess }) => {
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    message.success('로그인 성공!');
    onLoginSuccess();
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>로그인</h2>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '사용자 이름을 입력해주세요!' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="사용자 이름" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '비밀번호를 입력해주세요!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="비밀번호"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              로그인
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;