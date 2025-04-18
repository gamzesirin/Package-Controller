'use client'

import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import * as Switch from '@radix-ui/react-switch'

export default function LanguageSwitcher() {
	const { i18n } = useTranslation()
	const [currentLang, setCurrentLang] = useState(i18n.language)

	useEffect(() => {
		setCurrentLang(i18n.language)
	}, [i18n.language])

	const toggleLanguage = (checked: boolean) => {
		const newLang = checked ? 'tr' : 'en'
		i18n.changeLanguage(newLang)
		setCurrentLang(newLang)
	}

	return (
		<div className="flex items-center gap-3 px-2 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800/80">
			<span
				className={`text-sm font-medium transition-colors duration-200 ${
					currentLang === 'en' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
				}`}
			>
				EN
			</span>
			<Switch.Root
				checked={currentLang === 'tr'}
				onCheckedChange={toggleLanguage}
				className="group relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 dark:bg-gray-700 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-blue-500/40 dark:focus:ring-offset-gray-900"
			>
				<span className="sr-only">Dil değiştir</span>
				<span
					aria-hidden="true"
					className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
						currentLang === 'tr' ? 'translate-x-5' : 'translate-x-0'
					}`}
				/>
			</Switch.Root>
			<span
				className={`text-sm font-medium transition-colors duration-200 ${
					currentLang === 'tr' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
				}`}
			>
				TR
			</span>
		</div>
	)
}
