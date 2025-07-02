'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Item } from '@/types/item'

export default function AdminEditItemPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { id } = useParams()        // `id` is the `[id]` from the URL
  const [loading, setLoading] = useState(true)
  const [item, setItem] = useState<Item | null>(null)
  const [form, setForm] = useState({
    name:       '',
    description:'',
    price:      '',
    photo:      '',
  })

  // 1) Redirect non-admins away
  useEffect(() => {
    if (!user) return
    if (user.role !== 'admin') router.replace('/') 
  }, [user])

  // 2) Fetch existing item
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/items/${id}`)
        if (!res.ok) throw new Error('Item not found')
        const data: Item = await res.json()
        setItem(data)
        setForm({
          name: data.name,
          description: data.description,
          price: data.price.toString(),
          photo: data.photo,
        })
      } catch (err) {
        console.error(err)
        router.replace('/admin/items')  // back to list if not found
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, router])

  // 3) Form handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/items/${id}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          name:        form.name,
          description: form.description,
          price:       Number(form.price),
          photo:       form.photo,
        }),
      })
      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error || 'Update failed')
      }
      router.push('/admin/items')
    } catch (err: any) {
      console.error(err)
      alert(err.message)
    }
  }

  if (loading) return <p className="p-6">Loading…</p>
  if (!item)   return <p className="p-6">Item not found</p>

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Item #{id}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Price</label>
          <input
            name="price"
            type="number"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Photo URL</label>
          <input
            name="photo"
            value={form.photo}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="flex space-x-2">
          <button
            type="submit"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded"
          >
            Update
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}