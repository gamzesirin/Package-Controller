'use client'

import { ThemeProvider } from './ThemeProvider'
import { I18nProvider } from './I18nProvider'
import { Suspense } from 'react'

interface ProvidersProps {
	children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
	return (
		<ThemeProvider>
			<Suspense fallback={<div>Yükleniyor...</div>}>
				<I18nProvider>{children}</I18nProvider>
			</Suspense>
		</ThemeProvider>
	)
}
