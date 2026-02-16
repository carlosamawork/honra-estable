'use client';
import React, { useRef, useState } from 'react';
import s from './FooterComponent.module.scss'; // Adjust the path as necessary
import LazyImage from '../LazyImage';
import { PortableText } from '@portabletext/react';
import Link from 'next/link';
import { motion } from 'framer-motion'
import { FooterData } from '@/sanity/types';

type FooterProps = {
    data?: FooterData
}

export default function FooterComponent({ data }: FooterProps) {
    const footerRef = useRef<HTMLElement>(null)
    if (!data) return null // or render a skeleton / placeholder

    return (
        <motion.footer
            className={`${s.footer}`}
            ref={footerRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
        >
            <h4>AMA&apos;s footer</h4>
        </motion.footer>
    )

}
