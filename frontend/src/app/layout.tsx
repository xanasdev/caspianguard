import type {Metadata} from 'next'
import './globals.css'
import {ReactNode} from 'react'
import {defaultLocale} from '@/i18n/config'

export const metadata: Metadata = {
	title: 'Caspian Clean Map',
	description: 'Interactive pollution tracking platform for the Caspian Sea coastal region',
}

export default function RootLayout({children}: {children: ReactNode}) {
	return (
		<html lang={defaultLocale} suppressHydrationWarning>
			<body className='antialiased'>{children}</body>
		</html>
	)
}
