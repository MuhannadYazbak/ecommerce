'use client';

import { Form, Button, Input } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { User } from '@/types/user';
import { useAuth } from '@/context/AuthContext';
import BackButton from '../ui/BackButton';

type LoginUser = Pick<User, 'email' | 'password'>;
export default function Login() {
    const { login } = useAuth();
    const router = useRouter();
    const [user, setUser] = useState<LoginUser>({
        email: '',
        password: ''
    })
    const [loading,setLoading] = useState(false);

    const onFinish = async (values: User) => {

        setLoading(true);
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: values.email,
                password: values.password,
            }),

        });

        const data = await response.json();
        console.log("Login Response:", data);

        if (response.ok) {
            // Use the context login function instead of directly modifying localStorage
            login({ id: data.id, name: data.name, role: data.role }, data.token);
            await router.push('/home'); // Wait for navigation after state update
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
        <main className="min-h-screen flex flex-col items-center justify-center px-4">
                <section aria-labelledby='login-heading' className='w-full max-w-md'>
                    <h1 id="login-heading" className='text-3xl font-bold text-blue-600 text-center mb-6'>Login to TechMart</h1>
                    <Form name='login-form' onFinish={onFinish} onFinishFailed={onFinishFailed} layout='vertical'>
                        <Form.Item name='email' label='Email' rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name='password' label='Password' rules={[{ required: true }]}>
                            <Input.Password />
                        </Form.Item>
                        <Form.Item label={null}>
                            <Button htmlType='submit' type='primary' loading={loading} className='w-full'>Login</Button>
                        </Form.Item>
                    </Form>
                </section>
            <footer className='flex content-center justify-center align-middle'>
                <BackButton />
            </footer>
        </main>
    );
}