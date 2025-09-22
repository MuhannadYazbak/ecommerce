'use client'

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { OrderItem } from "@/types/order";
import { useAuth } from "@/context/AuthContext";
import { SlimUser } from "@/types/user";
import { useTranslation } from "react-i18next";
import '../../i18n'
import { Trans } from 'react-i18next';
import Link from 'next/link';



export default function HomeLanding() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [top5, setTop5] = useState<OrderItem[]>([]);
  const token = 'guest-token'
  const { asGuest, login } = useAuth();
  const guestData: SlimUser = {
    id: 999,
    role: 'guest',
    fullname: 'Guest',
    dateOfBirth: new Date('1990-01-01')
  };

  const handleGuestEntry = () => {
    asGuest(guestData, token)
  }

  const changeLanguage = (lng: 'en' | 'ar' | 'he') => {
    i18n.changeLanguage(lng);
  };


  const fetchTop5 = async () => {
    const res = await fetch('api/top5');
    const json = await res.json();
    const parsed = json.flatMap((entry: any) => entry.items_json);
    setTop5(parsed.slice(0, 5));
  };

  useEffect(() => {
    fetchTop5();
  }, []);

  return (
    <main className="p-6">
      <header className="text-center mb-4">
        <h1 id='header' className="text-4xl font-bold text-red-500">{t('techMart')}</h1>
        <h2 className="text-xl mt-2">{t('welcome')}</h2>
        <p className="mt-2 text-gray-700">
          {t('homeLandingText')}
        </p>
      </header>

      <section aria-label="Top 5 Products" className="mt-8">
        <h3 className="text-2xl font-semibold mb-4 text-center">Top 5 Picks for You</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {top5.map((item, index) => (
            <article
              key={`${item.id}-${index}`}
              className="border rounded-lg shadow-md p-4 bg-white hover:shadow-xl transition cursor-pointer"
              onClick={() => router.push(`/product/${item.id}`)}
              role="button"
              tabIndex={0}
              aria-label={`View details for ${item.name}`}
            >
              <div className="aspect-[16/9] overflow-hidden">
                <Image
                  width={500}
                  height={500}
                  loading="lazy"
                  src={item.photo}
                  alt={`Buy ${item.name} online at TechMart`}
                  className="w-full h-35 object-contain bg-white p-2 rounded"
                />
              </div>
              <h4 className="text-xl font-semibold mt-2">{item.name}</h4>
              <p className="text-blue-600 font-bold text-lg">₪{item.price}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="mt-8 text-center">
        <Trans i18nKey="guestPrompt" className="text-gray-600">
          <Link href="/home" className="text-blue-600 italic hover:underline hover:text-blue-800 mr-1" onClick={handleGuestEntry} id="guest">Guest</Link>
          <Link href="/login" className="text-blue-600 italic hover:underline hover:text-blue-800 mr-1">login</Link>
          <Link href="/register" className="text-blue-600 italic hover:underline hover:text-blue-800 mr-1">register</Link>
        </Trans>
        {/* <Trans i18nKey='guestPrompt' className="text-gray-600">
          Continue as a <Link href='/home' className="text-blue-600 italic hover:underline hover:text-blue-800 mr-1" onClick={handleGuestEntry} id='guest'>
            Guest
          </Link>
          Or, to enjoy full features, please{" "}
          <Link
            href="/login"
            className="text-blue-600 italic hover:underline hover:text-blue-800"
          >
            login
          </Link>{" "}
          or{" "}
          <Link
            href="/register"
            className="text-blue-600 italic hover:underline hover:text-blue-800"
          >
            register
          </Link>
        </Trans> */}
      </footer>
    </main>
  );
}
