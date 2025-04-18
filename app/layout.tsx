import type { Metadata } from 'next'

import './globals.css'
import { Providers } from './_providers'
import { Lexend, Poppins } from 'next/font/google'
import Footer from '@/components/Footer'

const lexend = Lexend({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-lexend'
})

const poppins = Poppins({
	weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
	style: ['normal', 'italic'],
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-poppins'
})

export const metadata: Metadata = {
	metadataBase: new URL('https://npmfinder.com'),
	title: 'NPM Finder - NPM Paket Arama ve Analiz Aracı',
	description: 'NPM paketleri için gelişmiş arama, analiz ve karşılaştırma platformu',
	keywords: ['npm', 'paket yöneticisi', 'javascript', 'nodejs', 'paket analizi'],
	openGraph: {
		title: 'NPM Finder',
		description: 'NPM paketleri için gelişmiş arama ve analiz platformu',
		url: 'https://npmfinder.com',
		siteName: 'NPM Finder',
		images: [
			{
				url: '/og-image.png',
				width: 1200,
				height: 630
			}
		],
		locale: 'tr_TR',
		type: 'website'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'NPM Finder',
		description: 'NPM paketleri için gelişmiş arama ve analiz platformu',
		images: ['/og-image.png']
	}
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="tr" suppressHydrationWarning>
			<body className={`${lexend.variable} ${poppins.variable} font-lexend antialiased`}>
				<Providers>
					{children}
					<Footer />
				</Providers>
			</body>
		</html>
	)
}
