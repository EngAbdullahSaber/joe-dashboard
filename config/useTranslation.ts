'use client';
import { useEffect, useState } from 'react';
import { getDictionary } from '@/app/dictionaries';
import { useRouter } from 'next/navigation'; // Import next-intl client router
import { usePathname } from 'next/navigation';

interface Props {
  lang: any;
}

export function useTranslate() {
  const [trans, setTrans] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const lang: any =
    typeof window !== "undefined"
      ? window.location.pathname.split("/")[1] ||
        localStorage.getItem("lang") ||
        "en"
      : null;
  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const data = await getDictionary(lang);
        setTrans(data);
        setLoading(false);
        localStorage.setItem('lang', lang); // Save language in localStorage
      } catch (err) {
        setError('Failed to load translations');
        setLoading(false);
      }
    };

    fetchTranslations();
  }, [lang]);

  const t = (key: string) => {  
    const keys = key?.split('.');
    const translation = keys?.reduce((acc, part) => acc?.[part], trans);
  
    return translation || `${"❌"} "${key}"`; // Return "Not Found" if the key is not found
  };

  const Navigate = (href: string) => {
    const currentLang = typeof window !== 'undefined' ? localStorage.getItem('lang') || 'en' : 'en';
    return `/${currentLang}${href}`;
  };

  return { t, Navigate, loading, error, lang };
}
