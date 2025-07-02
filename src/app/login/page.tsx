'use client';

import { Form, Button, Input } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { User, SlimUser } from '@/types/user';
import { useAuth } from '@/context/AuthContext';

type LoginUser = Pick<User, 'email' | 'password'>;
export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [user, setUser] = useState<LoginUser>({
        email: '',
        password: ''
    })

    const onFinish = async (values: User) => {


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
        }
    };
    const onFinishFailed = () => {
        console.warn('Error! failed to log in')
    }

    return (
        <div>
            <Form name='login-form' onFinish={onFinish} onFinishFailed={onFinishFailed} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                <Form.Item name='email' label='Email' rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name='password' label='Password' rules={[{ required: true }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item label={null}>
                    <Button htmlType='submit' type='primary'>Login</Button>
                </Form.Item>
            </Form>
        </div>
    );
}