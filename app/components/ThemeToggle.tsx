'use client'

import { useState, useEffect } from 'react'

export default function ThemeToggle() {
	const [isDark, setIsDark] = useState(false)

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
			className="fixed top-4 right-4 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 
                 text-gray-800 dark:text-gray-200 hover:bg-gray-200 
                 dark:hover:bg-gray-700 transition-colors z-50"
			title={isDark ? 'Açık Temaya Geç' : 'Koyu Temaya Geç'}
		>
			{isDark ? (
				<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
					/>
				</svg>
			) : (
				<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
