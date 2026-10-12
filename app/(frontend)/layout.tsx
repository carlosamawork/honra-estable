import "../../styles/main.scss";

import localFont from 'next/font/local';
import React, { Suspense } from 'react';

// Self-hosted (variable font, latin subset) to avoid fetching Google Fonts at build time.
// See https://github.com/vercel/next.js/issues/99114
const outfit = localFont({
  src: '../../styles/fonts/Outfit-Variable-latin.woff2',
  weight: '400 700',
  variable: '--font-outfit',
  display: 'swap',
});
import WebProvider from '../../context/webContext';
import ShopProvider from '../../context/shopContext';
import HeaderComponent from '../../components/Common/HeaderComponent';
import FooterComponent from '../../components/Common/FooterComponent';

import CartDrawer from '@/components/Common/CartDrawer';

import CookieConsent from '@/components/Common/CookieConsent/CookieConsent';
import ConsentGate from '@/components/Common/Analytics/consentGate';

import Analytics from '@/components/Common/Analytics/google';
import FacebookPixel from '@/components/Common/Analytics/facebook';
import PinterestTag from '@/components/Common/Analytics/pinterest';
import Hotjar from '@/components/Common/Analytics/hotjar';
import { getHeader } from "@/sanity/queries/common/header";
import { getFooter } from "@/sanity/queries/common/footer";
import { getCookieConsent, getLabels } from "@/sanity/queries/common/labels";
import { HeaderData } from '@/sanity/types';
import { FooterData, CookieData, LabelsData } from '@/sanity/types';

const RawHTML = ({ html }: any) => <div className="credits" dangerouslySetInnerHTML={{ __html: html }} />;

export default async function RootLayout({ children, }: { children: React.ReactNode; }) {

  const results = await Promise.allSettled([getHeader(), getFooter(), getCookieConsent(), getLabels()])

  const header: HeaderData | undefined = results[0].status === 'fulfilled' ? results[0].value : undefined
  const footer: FooterData | undefined = results[1].status === 'fulfilled' ? results[1].value : undefined
  const cookies: CookieData | undefined = results[2].status === 'fulfilled' ? results[2].value : undefined
  const labels: LabelsData | undefined = results[3].status === 'fulfilled' ? results[3].value : undefined

  return (
    <html lang="en" className={outfit.variable}>
      <body>
        <RawHTML html="<!-- ----------------------------------------------------- -->
        <!-- Code by MGTZM, http://magatzem.studio (2026) -->
        <!-- ----------------------------------------------------- -->" />
        <ShopProvider>
          <WebProvider>
            <HeaderComponent data={header} />
            <CartDrawer labels={labels} />

            {children}

            {/* Cookie Consent */}
            <CookieConsent data={cookies} />
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
        </ShopProvider>
      </body>
    </html>
  )
}
