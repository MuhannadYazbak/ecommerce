// 'use client';

// import { useEffect, useState } from 'react';

// export default function LanguageWrapper({ children }: { children: React.ReactNode }) {
//   const [lang, setLang] = useState('ar');

//   useEffect(() => {
//     const browserLang = navigator.language.split('-')[0];
//     setLang(browserLang);
//     document.documentElement.lang = browserLang;
//     document.documentElement.dir = browserLang === 'ar' || browserLang === 'he' ? 'rtl' : 'ltr';
//   }, []);

//   return <>{children}</>;
// }