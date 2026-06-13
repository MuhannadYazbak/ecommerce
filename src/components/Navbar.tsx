'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter, useParams } from 'next/navigation'; // Added useParams
import CartIcon from './CartIcon';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Globe from '../components/ui/Globe';

export default function Navbar() {
  const { user, guest, logout } = useAuth();
  const [displayName, setDisplayName] = useState<string | undefined>(user?.fullname || guest?.fullname);
  const router = useRouter();
  
  // 1. Extract the current active locale path parameters ([locale])
  const params = useParams();
  const currentLocale = params?.locale as string || 'en';

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    logout();
    // Redirect cleanly to home page of the current language on logout
    router.push(`/${currentLocale}`);
  };

  // 2. Updated Language Switcher to synchronize both context AND browser URL path folders
  const changeLanguageAndRoute = (newLang: string) => {
    i18n.changeLanguage(newLang);
    setIsOpen(false);

    // Replace the current localized URL root prefix with the newly selected language
    // e.g., if on /en/products -> changes to /he/products
    const currentPathname = window.location.pathname;
    const segments = currentPathname.split('/');
    
    // Check if the first URL parameter segment matches an active language path code
    if (['en', 'he', 'ar'].includes(segments[1])) {
      segments[1] = newLang;
      router.push(segments.join('/'));
    } else {
      router.push(`/${newLang}`);
    }
  };

  useEffect(() => {
    setIsOpen(false);
    if (i18n.language && (user?.id || guest)) {
      fetchTranslatedUser();
    }
  }, [i18n.language, user?.id]);

  const fetchTranslatedUser = async () => {
    const res = await fetch('/api/navbar', {
      headers: {
        'id': String(user?.id),
        'Accept-Language': i18n.language.split('-')[0] || 'en'
      },
    });
    const data = await res.json();
    setDisplayName(data.name || user?.fullname);
  };

  return (
    <div dir={i18n.language === 'en' ? 'ltr' : 'rtl'}>
      <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {/* Clicking the Logo routes back cleanly to the localized home dashboard screen */}
          <img 
            src="/images/logo.png" 
            alt="Logo" 
            className="h-12 w-12 cursor-pointer" 
            onClick={() => router.push(`/${currentLocale}`)}
          />
          <h1 
            className="text-xl font-semibold cursor-pointer" 
            onClick={() => router.push(`/${currentLocale}`)}
          >
            {t('techMart')}
          </h1>
          <div className='relative group'>
            <button
              className="text-white-700 focus:outline-none hover:text-indigo-700"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Select Language"
            >
              <Globe />
            </button>
            <span className="relative bottom-full mb-1 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded">
              {t('selectLang')}
            </span>
          </div>
          {isOpen && (
            <div className="relative hover:transition-105 bg-gray-700 p-2 rounded shadow-md z-50">
              <button onClick={() => changeLanguageAndRoute('ar')} className="block w-full text-right text-white hover:text-indigo-400 p-1">العربية</button>
              <button onClick={() => changeLanguageAndRoute('he')} className="block w-full text-right text-white hover:text-indigo-400 p-1">עברית</button>
              <button onClick={() => changeLanguageAndRoute('en')} className="block w-full text-right text-white hover:text-indigo-400 p-1">English</button>
            </div>
          )}
        </div>

        {user || guest ? (
          <div className="flex justify-center space-x-5 items-center">
            <span className='mt-0'>{t('hello')}, {displayName || t('guest')}</span>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition-colors text-sm font-medium">
              {t('logout')}
            </button>
            <div className="flex justify-center bg-transparent cursor-pointer">
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