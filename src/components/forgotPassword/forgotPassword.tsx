'use client'

import BackButton from "@/components/ui/BackButton"
import { useState } from "react"

export default function ForgotPassword() {
    const [form, setForm] = useState({
        email: ''
    })
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async () => {
        const payload = {
            email: form.email,
        };
        console.log('Forgot Password for: ', form.email)
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (res.ok) {
                alert(data.message); // or set a success state to show in the UI
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
                <h1 id='forgotH1' className="text-2xl font-semibold text-center text-indigo-500 mb-6">
                    Forgot Your Password?
                </h1>
                <form role='form' className="space-y-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Enter your email:
                    </label>
                    <input type="email"
                        id="email"
                        name="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                        placeholder="you@example.com"
                        onChange={handleChange}
                        required
                    />
                    <button type="submit"
                        id="submitBtn"
                        onClick={handleSubmit}
                        className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition"
                    >
                        Submit
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <BackButton />
                </div>
            </div>
        </main>
    )
}