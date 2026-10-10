'use client';
import { useEffect, useState } from 'react';
import { hasCookie, setCookie } from 'cookies-next';
import s from "./CookieConsent.module.scss";
import Link from 'next/link';
import type { CookieData } from '@/sanity/types';

const POPUP_DELAY = 5000; // 5 seconds

type Props = {
  data?: CookieData
}

const CookieConsent = ({ data }: Props) => {
  const [visible, setVisible] = useState(false);

  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  const cookieName = `${clientId}_localConsent_25`;


  useEffect(() => {
    if (hasCookie(cookieName)) {
      // cookie exists, do nothing
      return;
    }

    const timer = setTimeout(() => {
      setVisible(true);
    }, POPUP_DELAY);

    return () => clearTimeout(timer);
    // cookieName is static (from env) and we intentionally want this to run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveConsent = (preferences: { analytics: boolean; marketing: boolean }) => {
    setCookie(cookieName, JSON.stringify(preferences), { maxAge: 60 * 60 * 24 * 60 });
    setVisible(false);
  };

  const acceptAll = () => saveConsent({ analytics: true, marketing: true });
  const acceptRequiredOnly = () => saveConsent({ analytics: false, marketing: false });

  if (!visible) return null;

  return (
    <aside className={s.cookieConsent} role="dialog" aria-live="polite" aria-label="Cookie consent">
      <div className={s.inner}>
        <div className={s.left}>
          <h3>{data?.title || 'We use cookies to improve your experience'}</h3>
          <p>
            {data?.text ||
              'We use cookies and similar technologies to make sure you have the best possible experience on our website. Cookies help us remember your preferences, understand how you use the site and show you relevant content.'}
          </p>
        </div>

        <div className={s.right}>
          <h3>{data?.privacyTitle || 'Privacy policy'}</h3>
          <p>
            {data?.privacyText || 'To learn more about how we handle your personal data, please read our'}{' '}
            <Link href={data?.privacyLinkUrl || '/legals/privacy-policy'}>
              {data?.privacyLinkLabel || 'Privacy Policy'}
            </Link>
            .
          </p>

          <div className={s.actions}>
            <button onClick={acceptAll}>
              <span className={s.labelLong}>{data?.acceptAllLabel || 'Accept all cookies'}</span>
              <span className={s.labelShort}>{data?.acceptAllLabel || 'Accept'}</span>
            </button>
            <button onClick={acceptRequiredOnly}>
              <span className={s.labelLong}>{data?.acceptEssentialLabel || 'Essential only'}</span>
              <span className={s.labelShort}>{data?.acceptEssentialLabel || 'Decline'}</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default CookieConsent;
