import '@/styles/sanity/sanity_styles.css';

import React, { Suspense } from 'react'; // adjust the path accordingly

export const metadata = {
  title: '',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}

