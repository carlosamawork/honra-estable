'use client';
import React, { useRef } from 'react';
import s from './FooterComponent.module.scss'; // Adjust the path as necessary
import Link from 'next/link';
import { motion } from 'framer-motion'
import { FooterData } from '@/sanity/types';

type FooterProps = {
    data?: FooterData
}

export default function FooterComponent({ data }: FooterProps) {
    const footerRef = useRef<HTMLElement>(null)
    const primaryLinks = data?.footerMenu?.links?.length
        ? data.footerMenu.links
        : [
            {title: 'Shop', url: '/'},
            {title: 'About', url: '/about'},
            {title: 'Explore', url: '/explore'},
            {title: 'Extraordinary World', url: '/extraordinary-world'},
        ]

    const secondaryLinks = data?.footerSecondaryMenu?.links?.length
        ? data.footerSecondaryMenu.links
        : [
            {title: 'Contact', url: '/contact'},
            {title: 'Material Care Guide', url: '/legals/material-care-guide'},
            {title: 'Terms of Use', url: '/legals/terms-of-use'},
            {title: 'Privacy Policy', url: '/legals/privacy-policy'},
            {title: 'Shipping and Return', url: '/legals/shipping-and-return'},
        ]

    return (
        <motion.footer
            className={`${s.footer}`}
            ref={footerRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
        >
            <div className={s.top}>
                <div className={s.logo} aria-hidden>
                    <Link href="/" className={s.brand} aria-label="Honra home">
                        <svg width="72" height="61" viewBox="0 0 72 61" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M39.5078 0C39.7131 0.0944956 39.9123 0.225661 40.1249 0.279256C41.0077 0.503506 41.2794 1.2764 40.6768 2.0648C40.341 2.50343 39.8942 2.86026 39.445 3.14374C38.7083 3.60917 37.9305 3.98574 37.1468 4.41168C37.2301 4.58092 37.3533 4.71914 37.3521 4.85595C37.3497 5.16764 37.3702 5.5555 37.2253 5.76564C37.096 5.95181 36.7567 6.004 36.5115 5.99977C36.2543 5.99553 35.9995 5.84603 35.741 5.7741C35.0962 5.59358 34.7785 4.92223 35.1734 4.31718C35.5285 3.77418 36.0224 3.30594 36.5321 2.95898C37.253 2.46676 38.0441 2.11698 38.8049 1.70656C38.4317 0.70237 38.4643 0.504917 39.0778 0C39.2215 0 39.3653 0 39.509 0H39.5078Z" fill="black"/>
                        <path d="M35.5873 30C34.7758 33.4836 33.4552 36.7582 32.0791 40.0413C32.2122 39.9297 32.3468 39.818 32.4786 39.7034C33.0931 39.1694 33.7146 38.6425 34.3208 38.0984C35.9813 36.6064 37.8582 36.3702 39.7878 37.3252C42.4956 38.6639 45.1992 40.0313 47.8002 41.5763C52.9759 44.6518 58.0628 47.8863 63.219 50.9948C65.8852 52.6027 68.6249 54.0803 71.3314 55.6181C71.5089 55.7198 71.6823 55.8272 72 56.0176C69.5821 56.7636 67.3099 57.5124 65.0127 58.1653C60.6 59.4182 56.1151 60.3216 51.5831 60.9803C51.1226 61.0476 50.8521 60.9559 50.601 60.4992C48.0402 55.84 45.467 51.1881 42.859 46.5576C42.3028 45.571 41.6341 44.6432 40.9447 43.7483C38.334 40.3606 34.0836 41.0193 31.8141 42.9179C30.3659 44.1292 29.2769 45.6369 28.3447 47.2821C25.9324 51.5389 23.5089 55.7871 21.1091 60.051C20.8691 60.4777 20.6527 60.6066 20.1477 60.5207C13.3615 59.3652 6.75013 57.5396 0.301023 55.0812C0.224727 55.0525 0.152592 55.0082 0 54.9308C0.238599 54.7991 0.424484 54.6917 0.614531 54.5929C7.37299 51.0993 14.1009 47.5469 20.507 43.3889C24.72 40.6542 28.7803 37.7046 32.2747 34.0163C33.3234 32.9095 34.2417 31.6709 35.2183 30.4911C35.3487 30.3336 35.4652 30.1661 35.5873 30.0029V30Z" fill="black"/>
                        <path d="M36.6783 27.1605C36.8331 27.2519 36.9459 27.3053 37.0491 27.3812C37.4343 27.6595 37.5675 28.1388 37.3683 28.5618C37.1463 29.0313 36.8091 29.0861 36.4083 28.902C36.2608 28.8345 36.1048 28.7825 35.9488 28.7502C35.104 28.5703 34.8556 28.0938 35.206 27.1521C36.1156 24.7079 37.0563 22.2792 37.9826 19.8435C38.4818 18.5307 38.9798 17.218 39.5305 15.7689C38.8322 15.6537 38.2094 15.5609 37.5903 15.4428C37.0467 15.3402 36.4911 15.2671 35.9692 15.0774C34.9624 14.7092 34.6985 13.7998 35.374 12.8694C35.8156 12.2622 36.3915 11.7745 36.9471 11.2966C37.5627 10.7667 38.225 10.3085 38.8646 9.81519C38.9054 9.78427 38.9318 9.72524 38.9726 9.66762C38.867 9.52144 38.7002 9.39495 38.681 9.24315C38.6438 8.93535 38.5994 8.54883 38.723 8.31833C38.831 8.11734 39.1706 7.98944 39.4021 8.00069C39.7285 8.01615 40.0537 8.17637 40.3729 8.29584C40.9068 8.49683 41.1552 9.06746 40.8649 9.61983C40.6009 10.123 40.2577 10.6107 39.8605 10.9677C39.1418 11.6128 38.3522 12.1497 37.5987 12.7429C37.2951 12.9818 37.0083 13.2488 36.7455 13.655C37.5627 13.7886 38.381 13.908 39.1958 14.0598C39.5449 14.1245 39.9001 14.2144 40.2265 14.3662C40.9284 14.6951 41.1744 15.3135 40.8744 16.1245C39.9685 18.5715 39.0314 21.0016 38.1038 23.4359C37.6347 24.6686 37.1607 25.8998 36.6783 27.1591V27.1605Z" fill="black"/>
                        </svg>

                    </Link>
                </div>

                <nav className={s.nav} aria-label="Footer links primary">
                    {primaryLinks.slice(0, 5).map((item) => {
                        const href = 'url' in item && item.url ? item.url : '/'
                        const title = item.title || 'Link'
                        const openInNewWindow = 'newWindow' in item && !!item.newWindow
                        if (href.startsWith('http')) {
                            return (
                                <a key={title} href={href} target={openInNewWindow ? '_blank' : undefined} rel={openInNewWindow ? 'noopener noreferrer' : undefined}>
                                    {title}
                                </a>
                            )
                        }
                        return (
                            <Link key={title} href={href}>
                                {title}
                            </Link>
                        )
                    })}
                </nav>

                <nav className={s.nav} aria-label="Footer links legal">
                    {secondaryLinks.slice(0, 5).map((item) => {
                        const href = 'url' in item && item.url ? item.url : '/'
                        const title = item.title || 'Link'
                        const openInNewWindow = 'newWindow' in item && !!item.newWindow
                        if (href.startsWith('http')) {
                            return (
                                <a key={title} href={href} target={openInNewWindow ? '_blank' : undefined} rel={openInNewWindow ? 'noopener noreferrer' : undefined}>
                                    {title}
                                </a>
                            )
                        }
                        return (
                            <Link key={title} href={href}>
                                {title}
                            </Link>
                        )
                    })}
                </nav>

                <div className={s.claim}>
                    <p>{data?.claim || 'Honra mission is to be a progressive luxury house responding to the significant questions of our time.'}</p>
                    <p className={s.legal}>
                        {data?.copyright || 'HERON PRESTON SRL | VIA TURATI 12 | 20121 MILANO | REA MI-2109363 | P.IVA 09719570963 | HERONPRESTON@PEC.NET | SHARE CAPITAL DECLARED ON THE FORM USED TO FILE THE LIST OF SHAREHOLDERS: 10.000,00 EURO | CORPORATION COMPANY SUBJECT TO MANAGEMENT AND COORDINATION BY NEW GUARDS GROUP HOLDING S.P.A, PURSUANT TO ART. 2497 AND FOLLOWING OF THE ITALIAN CIVIL CODE. ©️ 2024 Heron Preston. All Rights Reserved.‍'}
                    </p>
                </div>
            </div>

            
        </motion.footer>
    )

}
