'use client'

import { fetchPopularPackages } from '@/app/api/fetchPopularPackages'
import { PackageSuggestionsProps, PopularPackage } from '@/types'
import { useState, useEffect } from 'react'

import { useTranslation } from 'react-i18next'

export default function PackageSuggestions({ currentPackage, onPackageSelect }: PackageSuggestionsProps) {
	const [loading, setLoading] = useState(true)
	const [packages, setPackages] = useState<PopularPackage[]>([])
	const [error, setError] = useState<string | null>(null)
	const { t, i18n } = useTranslation()

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true)
				const data = await fetchPopularPackages()
				const filteredPackages = currentPackage
					? data.filter((pkg) => pkg.name.toLowerCase() !== currentPackage.toLowerCase())
					: data
				setPackages(filteredPackages)
				setError(null)
			} catch (err) {
				setError(t('packageSuggestions.error'))
				console.error(err)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [currentPackage, t])

	if (loading) {
		return (
			<div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
				<h3 className="text-lg font-semibold mb-4 dark:text-white">{t('packageSuggestions.title')}</h3>
				<div className="h-48 flex items-center justify-center">
					<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
				<h3 className="text-lg font-semibold mb-4 dark:text-white">{t('packageSuggestions.title')}</h3>
				<div className="text-red-500 dark:text-red-400">{error}</div>
			</div>
		)
	}

	return (
		<div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
			<h3 className="text-lg font-semibold mb-4 dark:text-white">{t('packageSuggestions.title')}</h3>
			<div className="space-y-4">
				{packages.map((pkg) => (
					<button
						key={pkg.name}
						onClick={() => onPackageSelect(pkg.name)}
						className="w-full text-left p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
					>
						<div className="flex justify-between items-start mb-2">
							<span className="font-medium text-gray-900 dark:text-white">{pkg.name}</span>
							<span className="text-sm text-gray-500 dark:text-gray-400">{pkg.version || '-'}</span>
						</div>
						<p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">{pkg.description}</p>
						<div className="text-xs text-gray-500 dark:text-gray-400">
							{new Intl.NumberFormat(i18n.language === 'tr' ? 'tr-TR' : 'en-US').format(pkg.downloads)}{' '}
							{t('packageSuggestions.weeklyDownload')}
						</div>
					</button>
				))}
			</div>
		</div>
	)
}
