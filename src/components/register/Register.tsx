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
    setLoading(true);
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      login({ id: data.id, name: data.name, role: data.role }, data.token);
      router.push('/home');
    } else {
      setErrorMsg(data.error || 'Something went wrong');
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <section className="w-full max-w-md" aria-labelledby="register-heading">
        <h1 id="register-heading" className="text-3xl font-bold text-blue-600 text-center mb-6">Create Your TechMart Account</h1>

        <Form onFinish={onFinish} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input autoComplete="name" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input autoComplete="email" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} className="w-full">
              Register
            </Button>
          </Form.Item>
          {errorMsg && <p className="text-red-500 text-sm text-center">{errorMsg}</p>}
        </Form>
      </section>
      <footer className="mt-4">
        <BackButton />
      </footer>
    </main>
  );
}