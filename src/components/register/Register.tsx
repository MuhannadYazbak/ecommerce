'use client';

import { Form, Input, Button } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { SlimUser } from '@/types/user';
import BackButton from '../ui/BackButton';

export default function Register() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const onFinish = async (values: SlimUser) => {
    const selectedDate = new Date(values.dateOfBirth);
    const now = new Date();

    if (selectedDate > now) {
      setErrorMsg("Date can't be in the future.");
      return;
    }

    setLoading(true);
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      console.log('Registering with:', values);
      login({ id: data.id, fullname: data.name, role: data.role, dateOfBirth: data.dateOfBirth }, data.token);
      router.push('/home');
    } else {
      setErrorMsg(data.error || 'Something went wrong');
    }
  };
  const onFinishFailed = async (errorInfo: any) => {
    console.warn('Validation failed:', errorInfo);
    alert(`Validation Failed: ${errorInfo}`);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <section className="w-full max-w-md" aria-labelledby="register-heading">
        <h1 id="register-heading" className="text-3xl font-bold text-blue-600 text-center mb-6">Create Your TechMart Account</h1>

        <Form name='register-form' onFinish={onFinish} onFinishFailed={onFinishFailed} layout="vertical">
          <Form.Item name="fullname" label="Name" rules={[{ required: true }]}>
            <Input autoComplete="name" id='register-name' />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input autoComplete="email" id='register-email' />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[
            {
              required: true,
              pattern: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
              message: 'Password must be at least 8 characters, contain a capital letter and a number'
            }
          ]}>
            <Input.Password autoComplete="new-password" id='register-password' />
          </Form.Item>
          <Form.Item name="dateOfBirth" label="Date of Birth" rules={[{ required: true }]}>
            <input type='date' id='register-dob' className='antd-input' />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} className="w-full">
              Register
            </Button>
          </Form.Item>
          {process.env.NODE_ENV !== 'test' && errorMsg && (
            <p className="text-red-500 text-sm text-center">{errorMsg}</p>
          )}
        </Form>
      </section>
      <footer className="mt-4">
        <BackButton />
      </footer>
    </main>
  );
}