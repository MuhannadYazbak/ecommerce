'use client'

import BackButton from "@/components/ui/BackButton"
import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
// {params} : { params : { token : string}}
type Props = {
    tokenId : string
}
export default function ResetPassword({ tokenId } : Props) {
    const [form, setForm] = useState({
        password: '',
        confirmPassword: '',
    })
    const router = useRouter()
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };
    const { token } = useParams()
    const handleSubmit = async () => {
        const payload = {
            password: form.password,
            token: token
        };
        console.log('Forgot Password for: ', form.password)
        if (form.password !== form.confirmPassword || form.password.length == 0) {
            console.error('Password and Confirm Password must be matched, please try again');
            return;
        }
        console.log('Hashed token:', token);
        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (res.ok) {
                alert(data.message);
                router.push('/login')
            } else {
                alert(data.error || 'Something went wrong');
            }
        } catch (err) {
            console.warn('Error during Password rest - ', err);
        }


    }
    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h1 id='forgotYourPassowrdTitle' className='text-2xl font-semibold text-center text-indigo-500 mb-6'>
                    Reset Password
                </h1>
                <section>
                    <form className="spay-y-4">
                        <label htmlFor='password' className="block text-sm font-medium text-gray-700">
                            Enter new password:
                        </label>
                        <input type="password" id='password' name='password' value={form.password} placeholder="Password" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400" required />
                        <label htmlFor='confirmPassword' className="block text-sm font-medium text-gray-700">
                            Confirm password:
                        </label>
                        <input type="password" id='confirmPassword' name='confirmPassword' value={form.confirmPassword} placeholder="Confirm Password" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400" required />
                        <button type='submit' className='w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition' onClick={handleSubmit}>
                            Submit
                        </button>
                    </form>
                </section>
                <BackButton />
            </div>
        </main>
    )
}