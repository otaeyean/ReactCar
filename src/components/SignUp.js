import React from 'react';
import { Form, Input, Button, DatePicker, Select, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import './SignUp.css';

const { Option } = Select;

const SignUp = ({ onSignUpSuccess, onLoginClick }) => {
    const [form] = Form.useForm();

    const onFinish = (values) => {
      console.log('Received values of form: ', values);
      message.success('회원가입이 완료되었습니다!');
      form.resetFields();
      onSignUpSuccess();
    };

  return (
    <div className="signup-container">
      <h2>환영합니다!</h2>
      <h2>간단한 정보를 입력해주세요 </h2>
      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        scrollToFirstError
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: '사용자 이름을 입력해주세요!', whitespace: true }]}
        >
          <Input prefix={<UserOutlined />} placeholder="사용자 이름" />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            { type: 'email', message: '유효한 이메일 주소를 입력해주세요!' },
            { required: true, message: '이메일을 입력해주세요!' },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="이메일" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: '비밀번호를 입력해주세요!' }]}
          hasFeedback
        >
          <Input.Password prefix={<LockOutlined />} placeholder="비밀번호" />
        </Form.Item>

        <Form.Item
          name="confirm"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: '비밀번호를 확인해주세요!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('비밀번호가 일치하지 않습니다!'));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="비밀번호 확인" />
        </Form.Item>

        <Form.Item
          name="phone"
          rules={[{ required: true, message: '전화번호를 입력해주세요!' }]}
        >
          <Input prefix={<PhoneOutlined />} placeholder="전화번호" />
        </Form.Item>

        <Form.Item
          name="gender"
          rules={[{ required: true, message: '성별을 선택해주세요!' }]}
        >
          <Select placeholder="성별 선택">
            <Option value="male">남성</Option>
            <Option value="female">여성</Option>
            <Option value="other">기타</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="birth"
          rules={[{ required: true, message: '생년월일을 선택해주세요!' }]}
        >
          <DatePicker style={{ width: '100%' }} placeholder="생년월일" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="signup-form-button">
            가입하기
          </Button>
          <div className="login-link">
            이미 계정이 있으신가요? <Button type="link" onClick={onLoginClick}>로그인하기</Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignUp;
