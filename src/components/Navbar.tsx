'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import CartIcon from './CartIcon';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Globe from '../components/ui/Globe'



export default function Navbar() {
  const { user, guest, logout } = useAuth();
  const [displayName, setDisplayName] = useState<string | undefined>(user?.fullname || guest?.fullname)
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    setIsOpen(false);
    if (i18n.language && (user?.id || guest))
    fetchTranslatedUser()
  }, [i18n.language, user?.id]);

  const fetchTranslatedUser = async () => {
    const res = await fetch('/api/navbar', {
      headers: {
        'id': String(user?.id),
        'Accept-Language': i18n.language.split('-')[0] || 'en'
      },
    })
    const data = await res.json();
    setDisplayName(data.name || user?.fullname);
  }


  return (
    <div dir={i18n.language === 'en' ? 'ltr' : 'rtl'}>
      <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <img src="/images/logo.png" alt="Logo" className="h-12 w-12" />
          <h1 className="text-xl font-semibold">{t('techMart')}</h1>
          <div className='relative group'>
            <button
              className="text-white-700 focus:outline-none hover:text-indigo-700"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Select Language"
            >
              < Globe />
              {/* <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >

              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg> */}
            </button>
            <span className="relative bottom-full mb-1 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded">
              {t('selectLang')}
            </span>

          </div>
          {isOpen && (
            <div className="relative hover:trnasition-105">
              <button onClick={() => i18n.changeLanguage('ar')} className="block w-full text-right text-white-700 hover:text-indigo-700">العربية</button>
              <button onClick={() => i18n.changeLanguage('he')} className="block w-full text-right text-white-700 hover:text-indigo-700">עברית</button>
              <button onClick={() => i18n.changeLanguage('en')} className="block w-full text-right text-white-700 hover:text-indigo-700">English</button>
            </div>
          )}
        </div>

        {user || guest ? (
          <div className="flex justify-center space-x-5">

            {/* <span dir={i18n.language === 'ar' || i18n.language === 'he' ? 'rtl' : 'ltr'} className='mt-2'>{t('hello')}, {user?.fullname || guest?.fullname}</span> */}
            {/* <span className='mt-2'>{t('hello')}, {user?.fullname || guest?.fullname}</span> */}
            <span className='mt-2'>{t('hello')}, {displayName || t('guest')}</span>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded">
              {t('logout')}
            </button>
            <div className="flex justify-center space-x-15 bg-blue-100">
              {user?.role === 'admin' ? null : <CartIcon />}
            </div>
          </div>
        ) : (
          <span className="text-sm text-gray-300 italic">{t('pleaseLogin')}</span>
        )}
      </nav>
    </div>
  );
}