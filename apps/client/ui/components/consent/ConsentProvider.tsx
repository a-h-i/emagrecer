'use client';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import React, { useEffect, useRef, useState } from 'react';
import ConsentBanner from '@/ui/components/consent/ConsentBanner';

export type Consent = {
  analytics: boolean;
  ts: number;
};

const LS_KEY = 'consent.v1';

function readConsent(): Consent | null {
  const raw = localStorage.getItem(LS_KEY);
  if (raw) {
    return JSON.parse(raw);
  } else {
    return null;
  }
}

function writeConsent(consent: Consent) {
  const raw = JSON.stringify(consent);
  localStorage.setItem(LS_KEY, raw);
}

export default function ConsentProvider({
                                          children,
                                        }: {
  children: React.ReactNode;
}) {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [bannerOpen, setBannerOpen] = useState<boolean>(false);
  const initialized = useRef(false);

  // read consent on mount
  useEffect(() => {
    const c = readConsent();
    setConsent(c);
    setBannerOpen(!c); // show banner if missing
  }, []);

  useEffect(() => {
    if (!consent) return;

    if (!initialized.current) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST!,
        autocapture: true,
        capture_pageview: true,
        capture_pageleave: true,
        persistence: consent.analytics ? 'localStorage+cookie' : 'memory',
      });
      initialized.current = true;
    } else if (!consent.analytics && initialized.current) {
      posthog.opt_out_capturing();
      posthog.set_config({ persistence: 'memory' });
      initialized.current = false;
    } else if (consent.analytics && initialized.current) {
      posthog.opt_in_capturing();
      initialized.current = true;
      posthog.set_config({ persistence: 'localStorage+cookie' });
    }
  }, [consent]);

  return (
    <PostHogProvider client={posthog}>
      {children}
      <ConsentBanner
        open={bannerOpen}
        onClose={() => setBannerOpen(false)}
        onSave={(c) => {
          const consent = { ...c, ts: Date.now() };
          writeConsent(consent);
          setConsent(consent);
          setBannerOpen(false);
        }}
      />
    </PostHogProvider>
  );
}