'use client'

import Link from 'next/link'
import s from './HeaderComponent.module.scss'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { HeaderData } from '@/sanity/types'

type HeaderProps = {
  data?: HeaderData
}

export default function HeaderComponent({ data }: HeaderProps) {
  const headerRef = useRef<HTMLElement>(null)

  const fallbackLinks = [
    {title: 'Collection', url: '/'},
    {title: 'About', url: '/'},
    {title: 'Explore', url: '/'},
  ]

  const links = data?.headerMenu?.links?.length ? data.headerMenu.links : fallbackLinks

  useEffect(() => {
    console.log(
      '<!-- ----------------------------------------------------- -->\n' +
      '<!-- Code by MGTZM, http://magatzem.studio (2026)                   -->\n' +
      '<!-- ----------------------------------------------------- -->');
  }, [])

  return (
    <motion.header
      className={`${s.header}`}
      ref={headerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      <Link href="/" className={s.brand} aria-label="Honra home">
        honra<span>®</span>
      </Link>

      <nav className={s.nav} aria-label="Main navigation">
        {links.slice(0, 3).map((item) => {
          const href = 'url' in item && item.url ? item.url : '/'
          const title = item.title || 'Link'
          const isExternal = href.startsWith('http')
          const openInNewWindow = 'newWindow' in item && !!item.newWindow
          if (isExternal) {
            return (
              <a
                key={title}
                href={href}
                target={openInNewWindow ? '_blank' : undefined}
                rel={openInNewWindow ? 'noopener noreferrer' : undefined}
              >
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

      <button className={s.cart} type="button" aria-label="Open cart">
        CART (0)
      </button>
    </motion.header>
  )
}
