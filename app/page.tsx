'use client'

import { useState, Suspense, useCallback, useMemo } from 'react'

import { useSearchParams } from 'next/navigation'
import { PackageInfo } from '../types'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import ThemeToggle from '@/components/ThemeToggle'
import SearchSuggestions from '@/components/SearchSuggestions'
import PackageCard from '@/components/PackageCard'
import MetricsChart from '@/components/MetricsChart'
import SimilarPackages from '@/components/SimilarPackages'
import DidYouKnow from '@/components/DidYouKnow'
import FavoritesList from '@/components/FavoritesList'
import PackageSuggestions from '@/components/PackageSuggestions'
import PackageComparison from '@/components/PackageComparison'

import { fetchPackageInfo } from './api/fetchPackageInfo'
import { AuroraBackground } from '@/components/ui/aurora-background'

function HomeContent() {
	const [packageName, setPackageName] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const [packageInfo, setPackageInfo] = useState<PackageInfo | null>(null)
	const [favoritesKey, setFavoritesKey] = useState(0)
	const [comparePackages, setComparePackages] = useState<string[]>([])
	const [showComparison, setShowComparison] = useState(false)
	const searchParams = useSearchParams()
	const { t } = useTranslation()

	const handleSearch = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault()
			if (!packageName.trim()) return

			setIsLoading(true)
			setError('')
			setPackageInfo(null)

			try {
				const data = await fetchPackageInfo(packageName)
				setPackageInfo(data)
				setError('')
			} catch (err) {
				setError(err instanceof Error ? err.message : t('packageNotFound.description'))
				setPackageInfo(null)
			} finally {
				setIsLoading(false)
			}
		},
		[packageName, t]
	)

	const handleFavoriteChange = useCallback(() => {
		setFavoritesKey((prev) => prev + 1)
	}, [])

	const handleSelectPackage = useCallback((name: string) => {
		setPackageName(name)

		setTimeout(() => {
			const formElement = document.querySelector('form')
			if (formElement) {
				formElement.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
			}
		}, 100)
	}, [])

	const handleComparePackages = useCallback((packages: string[]) => {
		setComparePackages(packages)
		setShowComparison(true)
	}, [])

	const closeComparison = useCallback(() => {
		setShowComparison(false)
	}, [])

	const headerContent = useMemo(
		() => (
			<div className="text-center mb-16">
				<h1 className="text-4xl lg:text-5xl font-medium tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-500 to-teal-400 font-poppins">
					npm finder
				</h1>
				<p className="text-base text-gray-600 dark:text-gray-400 font-normal max-w-xl mx-auto">{t('subtitle')}</p>
			</div>
		),
		[t]
	)

	return (
		<AuroraBackground className="min-h-screen">
			<div className="relative min-h-screen">
				<div className="absolute right-4 top-4 flex items-center gap-3">
					<LanguageSwitcher />
					<ThemeToggle />
				</div>
				<main className="container mx-auto px-4 py-12">
					{headerContent}

					<form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
						<div className="relative">
							<input
								type="text"
								value={packageName}
								onChange={(e) => setPackageName(e.target.value)}
								placeholder={t('search.placeholder')}
								className="w-full px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 
								focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30
								dark:text-white text-[15px] bg-white/90 dark:bg-gray-800/90 font-normal
								placeholder:text-gray-500 dark:placeholder:text-gray-400"
							/>
							<button
								type="submit"
								disabled={isLoading}
								className="absolute right-2 top-1/2 transform -translate-y-1/2
								bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg
								text-[15px] font-medium transition-colors
								disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isLoading ? t('search.loading') : t('search.button')}
							</button>

							<SearchSuggestions searchTerm={packageName} onSelectPackage={handleSelectPackage} />
						</div>
					</form>

					<div className="max-w-7xl mx-auto">
						<div className="grid gap-8 lg:grid-cols-[1fr_320px]">
							<div>
								{packageInfo && (
									<>
										<PackageCard packageInfo={packageInfo} onFavoriteChange={handleFavoriteChange} />

										<div className="mt-6">
											<MetricsChart packageName={packageInfo.name} />
										</div>

										<div className="mt-6">
											<SimilarPackages packageName={packageInfo.name} onCompare={handleComparePackages} />
										</div>
									</>
								)}

								{!packageInfo && !isLoading && (
									<>
										{error && (
											<div className="flex items-start mb-6 bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-md p-5 backdrop-blur-sm">
												<div className="flex-shrink-0">
													<svg
														className="h-6 w-6 text-red-500"
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth="2"
															d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
														/>
													</svg>
												</div>
												<div className="ml-3 flex-1">
													<h3 className="text-lg font-medium text-red-600 dark:text-red-400">
														{t('packageNotFound.title')}
													</h3>
													<div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
														<p>{error}</p>
													</div>
												</div>
											</div>
										)}

										<DidYouKnow onSelectPackage={handleSelectPackage} />
									</>
								)}

								{isLoading && (
									<div className="bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-md p-6 backdrop-blur-sm">
										<div className="flex justify-center items-center py-12">
											<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
										</div>
									</div>
								)}
							</div>
							<div className="space-y-6">
								<FavoritesList key={favoritesKey} onSelectPackage={handleSelectPackage} />
								<PackageSuggestions
									currentPackage={searchParams.get('package') || undefined}
									onPackageSelect={handleSelectPackage}
								/>
							</div>
						</div>
					</div>
				</main>

				{showComparison && (
					<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center p-0 sm:p-4 overflow-y-auto">
						<div className="max-w-4xl w-full h-full sm:h-auto sm:max-h-[90vh] my-0 sm:my-8 bg-white dark:bg-gray-800 rounded-none sm:rounded-xl overflow-hidden shadow-xl">
							<div className="sticky top-0 z-10 bg-white dark:bg-gray-800 px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
								<h2 className="text-lg font-medium text-gray-900 dark:text-white">{t('comparison.title')}</h2>
								<button
									onClick={closeComparison}
									className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
									aria-label="Kapat"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 text-gray-500 dark:text-gray-400"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							</div>
							<div className="overflow-y-auto max-h-[calc(100vh-70px)] sm:max-h-[calc(90vh-70px)]">
								<PackageComparison packages={comparePackages} />
							</div>
						</div>
					</div>
				)}
			</div>
		</AuroraBackground>
	)
}

export default function Home() {
	return (
		<Suspense fallback={<div>Yükleniyor...</div>}>
			<HomeContent />
		</Suspense>
	)
}
