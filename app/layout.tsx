import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

const ADSENSE_CLIENT_ID = 'ca-pub-XXXXXXXXXXXXXXXX'

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
    return (
        <html lang="en">
            <body>
                <Script
                    id="adsense-script"
                    async
                    src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
                    crossOrigin="anonymous"
                    strategy="afterInteractive"
                />
                {children}
            </body>
        </html>
    )
}
