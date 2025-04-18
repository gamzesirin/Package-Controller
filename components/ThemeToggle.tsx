'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function ThemeToggle() {
	const [isDark, setIsDark] = useState(false)
	const { t } = useTranslation()

	useEffect(() => {
		const savedTheme = localStorage.getItem('theme')
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

		setIsDark(savedTheme === 'dark' || (!savedTheme && prefersDark))

		document.documentElement.classList.toggle('dark', savedTheme === 'dark' || (!savedTheme && prefersDark))
	}, [])

	const toggleTheme = () => {
		const newTheme = !isDark
		setIsDark(newTheme)

		document.documentElement.classList.toggle('dark', newTheme)

		localStorage.setItem('theme', newTheme ? 'dark' : 'light')
	}

	return (
		<button
			onClick={toggleTheme}
			className="relative inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-blue-500/40 dark:focus:ring-offset-gray-900"
			title={isDark ? t('theme.light') : t('theme.dark')}
		>
			<span className="sr-only">{isDark ? t('theme.light') : t('theme.dark')}</span>
			{isDark ? (
				<svg
					className="h-5 w-5 text-gray-900 dark:text-gray-200"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
					/>
				</svg>
			) : (
				<svg
					className="h-5 w-5 text-gray-900 dark:text-gray-200"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
					/>
				</svg>
			)}
		</button>
	)
}
