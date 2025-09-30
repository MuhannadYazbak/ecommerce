'use client';

import { Form, Button, Input } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { User } from '@/types/user';
import { useAuth } from '@/context/AuthContext';
import BackButton from '../ui/BackButton';
import { useTranslation } from 'react-i18next';

type LoginUser = Pick<User, 'email' | 'password'>;
export default function Login() {
    const { login } = useAuth();
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const [user, setUser] = useState<LoginUser>({
        email: '',
        password: ''
    })
    const [loading, setLoading] = useState(false);

    function routeAfterLogin(role: string) {
        return role === 'admin' ? '/admin/items' : '/home';
    }


    const onFinish = async (values: User) => {

        setLoading(true);
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept-Language' : i18n.language },
            body: JSON.stringify({
                email: values.email,
                password: values.password,
            }),

        });

        const data = await response.json();
        console.log("Login Response:", data);

        if (response.ok) {
            // Use the context login function instead of directly modifying localStorage
            login({ id: data.id, fullname: data.name, role: data.role, dateOfBirth: data.dateOfBirth }, data.token);
            await router.push(routeAfterLogin(data.role));

            // login({ id: data.id, name: data.name, role: data.role }, data.token);
            // if (data.role =='admin') {
            //     await router.push('/admin/items');
            // } else {
            //     await router.push('/home');
            // }
        } else {
            alert(`Login failed: ${data.error}`);
            setLoading(false);
        }
    };
    const onFinishFailed = () => {
        console.warn('Error! failed to log in')
        setLoading(false);
    }

    return (
        <main className="min-h-screen flex flex-col items-center justify-center px-4" dir={i18n.language === 'en' ? 'ltr' : 'rtl'}>
            <section aria-labelledby='login-heading' className='w-full max-w-md'>
                <h1 id="login-heading" className='text-3xl font-bold text-indigo-500 text-center mb-6'>{t('loginTitle')}</h1>
                <Form name='login-form' onFinish={onFinish} onFinishFailed={onFinishFailed} layout='vertical'>
                    <Form.Item name='email' label={t('email')} rules={[{ required: true }]}>
                        <Input id='login-email' />
                    </Form.Item>
                    <Form.Item name='password' label={t('password')} rules={[{ required: true }]}>
                        <Input.Password id='login-password' />
                    </Form.Item>
                    <Form.Item label={null}>
                        <Button htmlType='submit' type='primary' loading={loading} className='w-full'>{t('login')}</Button>
                    </Form.Item>
                </Form>
            </section>
            <section aria-label='Forgot your password' className='w-full max-w-md'>
                <a href='/forgotPassword' className='flex text-blue-600 italic hover:underline hover:text-blue-800 content-center justify-center'>
                    {t('forgotPassword')}
                </a>
            </section>
            <footer className='flex content-center justify-center align-middle'>
                <BackButton />
            </footer>
        </main>
    );
}