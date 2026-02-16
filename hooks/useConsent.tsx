'use client';
import { useEffect, useState } from 'react';
import { getCookie, setCookie, hasCookie } from 'cookies-next';

export type ConsentPreferences = {
  analytics: boolean;
  marketing: boolean;
};

export function useConsent() {
  const [consent, setConsent] = useState<ConsentPreferences | null>(null);

  // Make cookieName accessible to both useEffect and updateConsent
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  const cookieName = `${clientId}_localConsent_25`;

  useEffect(() => {
    if (hasCookie(cookieName)) {
      const stored = JSON.parse(getCookie(cookieName) as string || '{}');
      setConsent(stored);
    } else {
      setConsent(null);
    }
  }, [cookieName]);

  const updateConsent = (prefs: ConsentPreferences) => {
    setCookie(cookieName, JSON.stringify(prefs), { maxAge: 60 * 60 * 24 * 60 }); // 60 days
    setConsent(prefs);
  };

  return { consent, updateConsent };
}
