'use client';

import { useEffect } from 'react';

declare global {
    interface Window {
        adsbygoogle?: unknown[];
    }
}

interface AdsenseAdProps {
    slot: string;
    className?: string;
}

export default function AdsenseAd({ slot, className }: AdsenseAdProps) {
    const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

    useEffect(() => {
        if (!adsenseClientId || !slot) {
            return;
        }

        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (error) {
            console.error('Adsense ad render failed:', error);
        }
    }, [adsenseClientId, slot]);

    if (!adsenseClientId || !slot) {
        return null;
    }

    return (
        <ins
            className={`adsbygoogle ${className ?? ''}`}
            style={{ display: 'block' }}
            data-ad-client={adsenseClientId}
            data-ad-slot={slot}
            data-ad-format="auto"
            data-full-width-responsive="true"
        />
    );
}
