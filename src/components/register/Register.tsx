'use client';

import { Form, Input, Button } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { SlimUser, TranslatedUser } from '@/types/user';
import BackButton from '../ui/BackButton';
import { useTranslation } from 'react-i18next';
import { headers } from 'next/headers';

export default function Register() {
  const router = useRouter();
  const { login } = useAuth();
  const { t, i18n } = useTranslation()
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const onFinish = async (values: TranslatedUser) => {
    const selectedDate = new Date(values.dateOfBirth);
    const now = new Date();

    if (selectedDate > now) {
      setErrorMsg("Date can't be in the future.");
      return;
    }

    setLoading(true);
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept-Language': i18n.language
       },
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
    <main className="min-h-screen flex flex-col items-center justify-center px-4" dir={i18n.language === 'en' ? 'ltr' : 'rtl'}>
      <section className="w-full max-w-md" aria-labelledby="register-heading">
        <h1 id="register-heading" className="text-3xl font-bold text-indigo-500 text-center mb-6">{t('registerTitle')}</h1>

        <Form name='register-form' onFinish={onFinish} onFinishFailed={onFinishFailed} layout="vertical">
          <Form.Item name="enName" label={t('enName')} rules={[{ required: true }]}>
            <Input autoComplete="name" id='register-name' />
          </Form.Item>
          <Form.Item name="arName" label={t('arName')} rules={[{ required: true }]}>
            <Input autoComplete="name" id='register-name-arabic' />
          </Form.Item>
          <Form.Item name="heName" label={t('heName')} rules={[{ required: true }]}>
            <Input autoComplete="name" id='register-name-hebrew' />
          </Form.Item>
          
          <Form.Item name="email" label={t('email')} rules={[{ required: true, type: 'email' }]}>
            <Input autoComplete="email" id='register-email' />
          </Form.Item>
          <Form.Item name="password" label={t('password')} rules={[
            {
              required: true,
              pattern: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
              message: 'Password must be at least 8 characters, contain a capital letter and a number'
            }
          ]}>
            <Input.Password autoComplete="new-password" id='register-password' />
          </Form.Item>
          <Form.Item name="dateOfBirth" label={t('dob')} rules={[{ required: true }]}>
            <input type='date' id='register-dob' className='antd-input' />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} className="w-full">
              {t('register')}
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