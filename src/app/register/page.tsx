'use client'

import { Form, Button, Input, DatePicker } from 'antd'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@/types/user'
import dayjs from 'dayjs'


export default function RegisterPage() {
    const [user, setUser] = useState<User>({
        name: '',
        email: '',
        dateOfBirth: new Date(),
        password: ''
    })
    const router = useRouter();
    const onFinish = async (values: User) => {
        const formattedDate = dayjs(values.dateOfBirth).format('YYYY-MM-DD');
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fullname: values.name,
                email: values.email,
                dateOfBirth: formattedDate,
                password: values.password,
            }),
        });

        const data = await response.json();
        console.log('data= ',data);
        router.push('/login');
    };

    const onFinishFailed = () => {
        console.warn('Error creating new user');
    }
    return (
        <div>
            <Form name='form' onFinish={onFinish} onFinishFailed={onFinishFailed} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                <Form.Item name='name' label='Name' rules={[{ required: true }]}>
                    <Input value='name' />
                </Form.Item>
                <Form.Item name='email' label='Email' rules={[{ required: true }]}>
                    <Input value='email'/>
                </Form.Item>
                <Form.Item name='dateOfBirth' label='Date Of Birth' rules={[{ required: true }]}>
                    <DatePicker value='dateOfBirth' />
                </Form.Item>
                <Form.Item name='password' label='Password' rules={[{ required: true }]}>
                    <Input.Password value='password' />
                </Form.Item>
                <Form.Item label={null}>
                    <Button htmlType='submit' type='primary'>Create User</Button>
                </Form.Item>
            </Form>
        </div>
    )


}