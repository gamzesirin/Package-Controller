'use client'

import { fetchPackageInfo } from '@/app/api/fetchPackageInfo'
import { FavoritePackage, FavoritesListProps } from '@/types'
import { useState, useEffect } from 'react'

import { useTranslation } from 'react-i18next'

export default function FavoritesList({ onSelectPackage }: FavoritesListProps) {
	const [favorites, setFavorites] = useState<FavoritePackage[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const { t } = useTranslation()

	useEffect(() => {
		const loadFavorites = async () => {
			try {
				const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]')
				const packagesData = await Promise.all(savedFavorites.map((name: string) => fetchPackageInfo(name)))
				setFavorites(packagesData)
			} catch (error) {
				console.error('Favoriler yüklenirken hata:', error)
			} finally {
				setIsLoading(false)
			}
		}

		loadFavorites()
	}, [])

	const removeFavorite = (packageName: string, e: React.MouseEvent) => {
		e.stopPropagation()

		const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]')
		const newFavorites = savedFavorites.filter((name: string) => name !== packageName)
		localStorage.setItem('favorites', JSON.stringify(newFavorites))
		setFavorites(favorites.filter((pkg) => pkg.name !== packageName))
	}

	const handlePackageClick = (packageName: string) => {
		if (onSelectPackage) {
			onSelectPackage(packageName)
		} else {
			window.location.href = `/?package=${packageName}`
		}
	}

	if (isLoading) {
		return (
			<div className="bg-white/90 dark:bg-gray-800/90 p-4 rounded-xl shadow-lg backdrop-blur-sm">
				<h3 className="text-lg font-semibold mb-4 text-blue-600 dark:text-blue-400">{t('favorites.title')}</h3>
				<div className="flex flex-col items-center justify-center py-4 space-y-2">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
					<p className="text-sm text-gray-500 dark:text-gray-400">{t('search.loading')}</p>
				</div>
			</div>
		)
	}

	if (favorites.length === 0) {
		return (
			<div className="bg-white/90 dark:bg-gray-800/90 p-4 rounded-xl shadow-lg backdrop-blur-sm">
				<h3 className="text-lg font-semibold mb-4 text-blue-600 dark:text-blue-400">{t('favorites.title')}</h3>
				<div className="text-gray-500 dark:text-gray-400">{t('favorites.empty')}</div>
			</div>
		)
	}

	return (
		<div className="bg-white/90 dark:bg-gray-800/90 p-4 rounded-xl shadow-lg backdrop-blur-sm">
			<h3 className="text-lg font-semibold mb-4 text-blue-600 dark:text-blue-400">{t('favorites.title')}</h3>
			<div className="space-y-3">
				{favorites.map((pkg) => (
					<div
						key={pkg.name}
						className="p-3 rounded-lg bg-gray-50/80 dark:bg-gray-700/60 relative group cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors backdrop-blur-sm"
						onClick={() => handlePackageClick(pkg.name)}
					>
						<div className="flex items-center justify-between">
							<div>
								<h4 className="font-medium flex items-center gap-2 group-hover:underline text-blue-600 dark:text-blue-400">
									{pkg.name}
									{pkg.version && (
										<span className="text-sm font-normal text-gray-500 dark:text-gray-400 no-underline">
											{pkg.version}
										</span>
									)}
									<svg
										className="w-3.5 h-3.5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
											clipRule="evenodd"
										/>
									</svg>
								</h4>
								<p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{pkg.description}</p>
							</div>
							{pkg.score && (
								<div className="text-sm font-medium text-gray-500 dark:text-gray-400">
									{Math.round(pkg.score.final * 100)}%
								</div>
							)}
						</div>
						<button
							onClick={(e) => removeFavorite(pkg.name, e)}
							className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
							title={t('favorites.remove')}
						>
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
				))}
			</div>
		</div>
	)
}
