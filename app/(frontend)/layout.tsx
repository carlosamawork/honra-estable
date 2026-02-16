import "../../styles/main.scss";

import React, { Suspense } from 'react';
import WebProvider from '../../context/webContext';
import HeaderComponent from '../../components/Common/HeaderComponent';
import FooterComponent from '../../components/Common/FooterComponent';

import NewsletterComponent from '@/components/Common/NewsletterComponent';

import CookieConsent from '@/components/Common/CookieConsent/CookieConsent';
import ConsentGate from '@/components/Common/Analytics/consentGate';

import Analytics from '@/components/Common/Analytics/google';
import FacebookPixel from '@/components/Common/Analytics/facebook';
import PinterestTag from '@/components/Common/Analytics/pinterest';
import Hotjar from '@/components/Common/Analytics/hotjar';
import { getHeader } from "@/sanity/queries/common/header";
import { getFooter } from "@/sanity/queries/common/footer";
import { HeaderData } from '@/sanity/types';
import { FooterData } from '@/sanity/types';

const RawHTML = ({ html }: any) => <div className="credits" dangerouslySetInnerHTML={{ __html: html }} />;

export default async function RootLayout({ children, }: { children: React.ReactNode; }) {

  const results = await Promise.allSettled([getHeader(), getFooter()])

  const header: HeaderData | undefined = results[0].status === 'fulfilled' ? results[0].value : undefined
  const footer: FooterData | undefined = results[1].status === 'fulfilled' ? results[1].value : undefined

  return (
    <html lang="en">
      <body>
        <RawHTML html="<!-- ----------------------------------------------------- -->
        <!-- Code by AMA, http://ama.work (2026) -->
        <!-- ----------------------------------------------------- -->" />
        <WebProvider>
          <HeaderComponent data={header} />

          {children}

          {/* Cookie Consent */}
          <CookieConsent />
          {process.env.NODE_ENV === 'production' && (
            <>
              <ConsentGate category="analytics">
                <Analytics />
                {/* <Hotjar /> */}
              </ConsentGate>

              {/* <ConsentGate category="marketing">
                <FacebookPixel />
                <PinterestTag />
              </ConsentGate> */}
            </>
          )}
          {/* Cookie Consent */}

          <FooterComponent data={footer} />
        </WebProvider>
      </body>
    </html>
  )
}
