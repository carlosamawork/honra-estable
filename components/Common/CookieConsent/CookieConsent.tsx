'use client';
import { useEffect, useState } from 'react';
import { hasCookie, setCookie } from 'cookies-next';
import s from "./CookieConsent.module.scss";
import Link from 'next/link';

const POPUP_DELAY = 5000; // 5 seconds

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [prefs, setPrefs] = useState({ analytics: true, marketing: true });

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
    setShowManage(false);
  };

  const acceptAll = () => saveConsent({ analytics: true, marketing: true });
  const denyAll = () => saveConsent({ analytics: false, marketing: false });

  if (!visible) return null;

  return (
    <div className={`fixed inset-0 bg-black/30 flex items-end justify-center z-[120] ${s.cookieConsent}`}>
      {!showManage ? (
        // FIRST POPUP
        <div className="w-full bg-white p-6 shadow-xl">
          <p className="mb-6">
            We use cookies and similar technologies to enhance your experience, provide personalized content,
            improve site functionality, and analyze traffic. You can accept all cookies or customize your preferences.
            Learn more in our <Link href="/faqs/#general-terms" className="underline">Privacy Policy</Link>.
          </p>

          {/* Buttons in one line */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-[10px]">
            <button
              className="flex-1 border py-3 px-4 bg-white hover:bg-black hover:text-white uppercase"
              onClick={() => setShowManage(true)}
            >
              Manage Preferences
            </button>
            <button
              className="flex-1 border py-3 px-4 bg-white hover:bg-black hover:text-white uppercase"
              onClick={acceptAll}
            >
              Accept All
            </button>
            <button
              className="flex-1 border py-3 px-4 bg-white hover:bg-black hover:text-white uppercase"
              onClick={denyAll}
            >
              Decline All
            </button>
          </div>
        </div>
      ) : (
        // SECOND POPUP
        <div className="w-full bg-white p-6 shadow-xl">
          <p className="mb-6">
            Learn more about the cookies we use, and choose which cookies to allow.
          </p>

          {/* Buttons first */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-[10px] mb-6">
            <button
              className="flex-1 border py-3 px-4 bg-white hover:bg-black hover:text-white uppercase"
              onClick={acceptAll}
            >
              Accept All
            </button>
            <button
              className="flex-1 border py-3 px-4 bg-white hover:bg-black hover:text-white uppercase"
              onClick={denyAll}
            >
              Decline All
            </button>
            <button
              className="flex-1 border py-3 px-4 bg-white hover:bg-black hover:text-white uppercase"
              onClick={() => saveConsent(prefs)}
            >
              Save Preferences
            </button>
          </div>

          {/* REQUIRED */}
          <label className={`${s.checkboxWrapper} mb-4`}>
            <input type="checkbox" checked disabled />
            <div className={`${s.checkboxSquare} ${s.disabled}`} />
            <div className={s.checkboxContent}>
              <p>REQUIRED</p>
              <p>
                These cookies are necessary for the website to function properly, including features like adding items
                to the cart. These cannot be disabled.
              </p>
            </div>
          </label>

          {/* MARKETING */}
          <label className={`${s.checkboxWrapper} mb-4`}>
            <input
              type="checkbox"
              checked={prefs.marketing}
              onChange={() => setPrefs((prev) => ({ ...prev, marketing: !prev.marketing }))}
            />
            <div className={`${s.checkboxSquare} ${prefs.marketing ? s.checked : ''}`} />
            <div className={s.checkboxContent}>
              <p>MARKETING</p>
              <p>
                These cookies help us optimize marketing communications and show you relevant ads on other websites.
              </p>
            </div>
          </label>

          {/* ANALYTICS */}
          <label className={s.checkboxWrapper}>
            <input
              type="checkbox"
              checked={prefs.analytics}
              onChange={() => setPrefs((prev) => ({ ...prev, analytics: !prev.analytics }))}
            />
            <div className={`${s.checkboxSquare} ${prefs.analytics ? s.checked : ''}`} />
            <div className={s.checkboxContent}>
              <p>ANALYTICS</p>
              <p>
                These cookies help us understand how users interact with our site, allowing us to improve functionality
                and user experience. Data may be anonymized.
              </p>
            </div>
          </label>
        </div>
      )}
    </div>
  );
};

export default CookieConsent;
