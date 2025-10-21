'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Trans, useTranslation } from 'react-i18next'
import BackButton from '@/components/ui/BackButton'
import { TranslatedItem } from '@/types/translatedItem'

export default function AdminEditItem() {
  const { user } = useAuth()
  const router = useRouter()
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [item, setItem] = useState<TranslatedItem | null>(null)
  const [form, setForm] = useState({
    enName:       '',
    enDescription:'',
    arName:       '',
    arDescription:'',
    heName:       '',
    heDescription:'',
    price:      '',
    photo:      '',
    quantity: ''
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
        const res = await fetch(`/api/items/${id}`,{
          headers: {
            'Accept-Language': i18n.language.split('-')[0] || 'en'
          }
        })
        if (!res.ok) throw new Error('Item not found')
        const data: TranslatedItem = await res.json()
        setItem(data)
        setForm({
          enName:       data.name,
          enDescription: data.description,
          arName:       data.arName,
          arDescription: data.arDescription,
          heName:       data.heName,
          heDescription: data.heDescription,
          price: data.price.toString(),
          photo: data.photo,
          quantity: data.quantity.toString()
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
          name:        form.enName,
          description: form.enDescription,
          arName: form.arName,
          arDescription: form.arDescription,
          heName: form.heName,
          heDescription: form.heDescription,
          price:       Number(form.price),
          photo:       form.photo,
          quantity:    Number(form.quantity)
        }),
      })
      if (!res.ok) {
        const body = await res.json();
        alert(`Update failed ${body.error}`);
        throw new Error(body.error || 'Update failed')
        
      }
      router.push('/admin/items')
    } catch (err: any) {
      console.error(err)
      alert(err.message)
    }
  }

  if (loading) return <p className="p-6">{t('loading')}</p>
  if (!item)   return <p className="p-6">Item not found</p>

  if (!user || user.role !== 'admin') {
    return <p role='adminOnly' className="text-red-600">{t('adminOnly')}</p>;
  }

  return (
    <main className="max-w-xl mx-auto p-6" dir={i18n.language === 'en' ? 'ltr': 'rtl'}>
      <header className='flex w-full justify-center' id='admin item header'>
        <h1 role='editItemTitle' className='text-2xl font-bold mb-4 text-indigo-500'>
          <Trans i18nKey="adminEditTitle" values={{ id: item.item_id }}>
                                      Image of {{ id: item.item_id }}
                                  </Trans>
        </h1>
      </header>
      <section className='form flex w-auto justify-center border hover:transition p-2'>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div id='name'>
          <label className="block font-medium">{t('name')}</label>
          <input
            name="name"
            role="enName"
            value={form.enName}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div id='description'>
          <label className="block font-medium">{t('description')}</label>
          <textarea
            name="description"
            role="enDescription"
            value={form.enDescription}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div id='arName'>
          <label className="block font-medium">{t('name')}</label>
          <input
            name="arName"
            role="arName"
            value={form.arName}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div id='arDescription'>
          <label className="block font-medium">{t('description')}</label>
          <textarea
            name="arDescription"
            role="arDescription"
            value={form.arDescription}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div id='heName'>
          <label className="block font-medium">{t('name')}</label>
          <input
            name="heName"
            role="heName"
            value={form.heName}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div id='heDescription'>
          <label className="block font-medium">{t('description')}</label>
          <textarea
            name="heDescription"
            role="heDescription"
            value={form.heDescription}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div id='price'>
          <label className="block font-medium">{t('price')}</label>
          <input
            name="price"
            role="price"
            type="number"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div id='photo'>
          <label className="block font-medium">{t('photoURL')}</label>
          <input
            name="photo"
            value={form.photo}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div id='quantity'>
          <label className="block font-medium">{t('quantity')}</label>
          <input
            name="quantity"
            type="number"
            step="1"
            value={form.quantity}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="flex space-x-2">
          <nav className='flex w-full justify-center space-x-2'>
          <button
            type="submit"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded"
          >
            {t('update')}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded"
            role='cancel'
          >
            {t('cancel')}
          </button>
          </nav>
        </div>
      </form>
      </section>
      <nav>
        <BackButton />
      </nav>
    </main>
  )
}