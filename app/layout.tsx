import type { Metadata } from 'next'
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
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
