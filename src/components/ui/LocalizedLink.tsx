'use client';

import Link, { LinkProps } from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';

// Extend BOTH Next.js LinkProps AND standard HTML anchor element attributes
interface LocalizedLinkProps extends Omit<React.ComponentPropsWithoutRef<'a'>, keyof LinkProps>, LinkProps {
  children: React.ReactNode;
}

export default function LocalizedLink({ href, children, ...props }: LocalizedLinkProps) {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  // Safely cast href to string if it's an object or path
  const stringHref = typeof href === 'string' ? href : href.pathname || '';

  // Only prepend locale if it's an internal relative path and doesn't already have it
  const isInternal = stringHref.startsWith('/');
  const hasLocale = ['/en', '/he', '/ar'].some(
    lang => stringHref.startsWith(lang + '/') || stringHref === lang
  );

  const localizedHref = isInternal && !hasLocale ? `/${locale}${stringHref}` : href;

  return (
    <Link href={localizedHref} {...props}>
      {children}
    </Link>
  );
}