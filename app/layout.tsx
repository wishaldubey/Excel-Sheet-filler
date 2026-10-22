import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
    title: 'Auto Excel Sheet Filler',
    description: 'Generate employee data in Excel format',
    icons: {
        icon: '/favicon.png',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID

    return (
        <html lang="en">
            <body>
                {adsenseClientId && (
                    <Script
                        id="adsense-script"
                        async
                        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
                        crossOrigin="anonymous"
                        strategy="afterInteractive"
                    />
                )}
                {children}
            </body>
        </html>
    )
}
