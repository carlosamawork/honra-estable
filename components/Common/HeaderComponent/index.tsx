'use client'

import Link from 'next/link'
import s from './HeaderComponent.module.scss'
import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { HeaderData } from '@/sanity/types'

type HeaderProps = {
  data?: HeaderData
}

export default function HeaderComponent({ data }: HeaderProps) {
  const headerRef = useRef<HTMLElement>(null)
  useEffect(() => {
    console.log(
      '<!-- ----------------------------------------------------- -->\n' +
      '<!-- Code by MGTZM, http://magatzem.studio (2026)                   -->\n' +
      '<!-- ----------------------------------------------------- -->');
  }, [])

  if (!data) return null // or render a skeleton / placeholder
  return (
    <motion.header
      className={`${s.header}`}
      ref={headerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      <h4>MGTZM&apos;s header</h4>
    </motion.header>
  )
}