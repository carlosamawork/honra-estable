'use client';
import React, { useEffect, useRef, useState } from 'react';
import s from './Newsletter.module.scss'; // Adjust the path as necessary
import { PortableText } from '@portabletext/react';
import { portableBlockComponentsAbout } from '@/utils/portableText/portableTextAbout';
import Link from 'next/link';

export default function NewsletterComponent({ data, type = "banner" }: { data: any, type: string }) {

    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');

    const [email, setEmail] = useState<string>('');
    const [consent, setConsent] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ email?: string; consent?: string }>({});
    const [result, setResult] = useState<Response | null>(null);

    const subscribeUser = async (e: any) => {
        e.preventDefault()

        const res = await fetch('/api/subscribeUser', {
            body: JSON.stringify({
                email: email ? email : '',
                firstName: firstName ? firstName : '',
                lastName: lastName ? lastName : ''
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        })

        setResult(res);

        return res
    }
    return (
        <section className={`${s.newsletter} ${s.type}`}>
            <div className={s.newsletterContent}>
                <h3>{data.title}</h3>
                {data.content && data.content.map((block: any, index: number) => (
                    <PortableText
                        key={index}
                        value={block}
                        components={portableBlockComponentsAbout}
                    />
                ))}
            </div>
            <div className={s.newsletterFormContainer}>
                <form className={s.newsletterForm} onSubmit={subscribeUser}>
                    <input type="text" name={"firstName"} placeholder="NAME" required value={firstName} onChange={e => setFirstName(e.target.value)} />
                    <input type="text" name={"lastName"} placeholder="SURNAME" required value={lastName} onChange={e => setLastName(e.target.value)} />
                    <input type="email" name={"email"} placeholder="EMAIL" required value={email} onChange={e => setEmail(e.target.value)} />
                    <div className={s.consent}>
                        <div className={s.checkboxWrp}>
                            <input type="checkbox" id={"consent"} name={"consent"} required checked={consent} onChange={e => setConsent(e.target.checked)} />
                        </div>
                        <label htmlFor="consent">By accepting, I confirm that I am over 18 years old and that I accept the <Link href="/legal/#terms-conditions">Terms and Conditions</Link>*.</label>
                    </div>
                    <button type="submit">Subscribe</button>
                    <div className={s.answer}>{result && result.status == 200 ? <p className={s.success}>{"You’re suscribed, thank you!"}</p> : result && result.status == 400 ? <p className={s.error}>{"You’re already subscribed!"}</p> : errors ? <p className={s.error} data-text={errors.email || errors.consent}>{errors.email || errors.consent}</p> : undefined}</div>

                </form>
                <p>*Around the World Art S.L. is responsible for the processing of your personal data, which will be handled for the purpose of sending you our newsletter and communications about our activity/project. You can exercise your data protection rights by emailing info@the99.art.</p>
            </div>
        </section>
    )

}
