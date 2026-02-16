'use client';
import { useConsent } from '@/hooks/useConsent';

export default function ConsentGate({ category, children }: { category: 'analytics' | 'marketing', children: React.ReactNode }) {
  const { consent } = useConsent();

  if (!consent) return null; // Still loading or not given
  if (!consent[category]) return null; // Not allowed

  return <>{children}</>;
}