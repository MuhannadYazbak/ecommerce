'use client';
import '@ant-design/v5-patch-for-react-19';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import React, { useEffect } from 'react';

interface I18nWrapperProps {
  children: React.ReactNode;
  locale: string;
}

export default function I18nWrapper({ children, locale }: I18nWrapperProps) {
  // Sync the client-side language state safely without altering the document context
  useEffect(() => {
    if (locale && i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}