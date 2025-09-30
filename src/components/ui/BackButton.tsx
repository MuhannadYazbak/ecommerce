'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next'

type Props = {
  label?: string;
  className?: string;
};

export default function BackButton({ label = "Back", className = "" }: Props) {
  const router = useRouter();
  const { t, i18n } = useTranslation()

  return (
    <button
      onClick={() => router.back()}
      id = 'backButton'
      className={`px-4 py-2 bg-silver text-blue-600 rounded hover:bg-gray-300 ${className}`}
    >
      {t('back')}
    </button>
  );
}