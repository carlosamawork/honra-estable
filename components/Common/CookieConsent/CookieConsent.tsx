'use client';
import { useEffect, useState } from 'react';
import { hasCookie, setCookie } from 'cookies-next';
import s from "./CookieConsent.module.scss";
import Link from 'next/link';

const POPUP_DELAY = 5000; // 5 seconds

const CookieConsent = () => {
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
          <h3>USAMOS COOKIES PARA MEJORAR TU EXPERIENCIA</h3>
          <p>
            En Honra (<Link href="https://www.honra.com" target="_blank" rel="noopener noreferrer">www.honra.com</Link>), utilizamos cookies y tecnologías similares para asegurarnos de que tengas la mejor experiencia posible en nuestro sitio web. Las cookies nos ayudan a recordar tus preferencias, entender cómo usas nuestro sitio y mostrarte contenido relevante.
          </p>
          <p>
            Al hacer clic en &quot;Aceptar todas las cookies&quot;, aceptas el uso de cookies para mejorar la funcionalidad del sitio, análisis de uso y marketing. Puedes administrar tus preferencias de cookies o rechazarlas seleccionando &quot;Aceptar solo funcionamiento&quot;.
          </p>
        </div>

        <div className={s.right}>
          <h3>POLÍTICA DE PRIVACIDAD</h3>
          <p>
            Para obtener más información sobre cómo manejamos tus datos personales, puedes leer nuestra{' '}
            <Link href="/faqs/#general-terms">Política de Privacidad</Link>.
          </p>

          <div className={s.actions}>
            <button onClick={acceptAll}>ACEPTAR TODAS LAS COOKIES</button>
            <button onClick={acceptRequiredOnly}>ACEPTAR SOLO FUNCIONAMIENTO</button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default CookieConsent;
