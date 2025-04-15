'use client'

import { useState, useEffect, Suspense } from 'react'
import PackageCard from './components/PackageCard'
import PackageSuggestions from './components/PackageSuggestions'
import FavoritesList from './components/FavoritesList'
import { fetchPackageInfo } from './api/fetchPackageInfo'
import ThemeToggle from './components/ThemeToggle'
import SearchSuggestions from './components/SearchSuggestions'
import MetricsChart from './components/MetricsChart'
import { WarpBackground } from '../components/ui/warp-background'
import SimilarPackages from './components/SimilarPackages'
import PackageComparison from './components/PackageComparison'
import { useSearchParams } from 'next/navigation'
import { PackageInfo } from './types'

// Ana sayfa içeriği için ayrı bir bileşen
function HomeContent() {
	const [packageName, setPackageName] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const [packageInfo, setPackageInfo] = useState<PackageInfo | null>(null)
	const [favoritesKey, setFavoritesKey] = useState(0)
	const [isDarkMode, setIsDarkMode] = useState(false)
	const [comparePackages, setComparePackages] = useState<string[]>([])
	const [showComparison, setShowComparison] = useState(false)
	const searchParams = useSearchParams()

	useEffect(() => {
		const isDark = document.documentElement.classList.contains('dark')
		setIsDarkMode(isDark)

		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.attributeName === 'class') {
					const isDark = document.documentElement.classList.contains('dark')
					setIsDarkMode(isDark)
				}
			})
		})

		observer.observe(document.documentElement, { attributes: true })

		return () => observer.disconnect()
	}, [])

	const handleSearch = async (e: React.FormEvent) => {
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
			setError(err instanceof Error ? err.message : 'Paket bilgileri alınırken bir hata oluştu')
			setPackageInfo(null)
		} finally {
			setIsLoading(false)
		}
	}

	const handleFavoriteChange = () => {
		setFavoritesKey((prev) => prev + 1)
	}

	const handleSelectPackage = (name: string) => {
		setPackageName(name)

		setTimeout(() => {
			const formElement = document.querySelector('form')
			if (formElement) {
				formElement.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
			}
		}, 100)
	}

	const handleComparePackages = (packages: string[]) => {
		setComparePackages(packages)
		setShowComparison(true)
	}

	const closeComparison = () => {
		setShowComparison(false)
	}

	return (
		<WarpBackground
			className="min-h-screen w-full p-0 border-0 bg-white dark:bg-gray-900"
			perspective={200}
			beamsPerSide={4}
			beamSize={6}
			gridColor={isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
		>
			<div className="relative min-h-screen w-full">
				<ThemeToggle />
				<main className="container mx-auto px-4 py-8">
					<div className="text-center mb-12">
						<h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
							Package Controller
						</h1>
						<p className="text-gray-600 dark:text-gray-300">NPM paketleri hakkında detaylı bilgi edinin</p>
					</div>

					<form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
						<div className="relative">
							<input
								type="text"
								value={packageName}
								onChange={(e) => setPackageName(e.target.value)}
								placeholder="Paket adını girin (örn: react, next, tailwindcss)"
								className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 
								focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800/90
								dark:text-white text-lg bg-white/90"
							/>
							<button
								type="submit"
								disabled={isLoading}
								className="absolute right-2 top-1/2 transform -translate-y-1/2
								bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md
								disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isLoading ? 'Aranıyor...' : 'Ara'}
							</button>

							<SearchSuggestions searchTerm={packageName} onSelectPackage={handleSelectPackage} />
						</div>
					</form>

					<div className="max-w-7xl mx-auto">
						<div className="grid gap-6 lg:grid-cols-[1fr_300px]">
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
									<div className="bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-md overflow-hidden backdrop-blur-sm">
										<div className="p-5">
											{error && (
												<div className="flex items-start mb-6">
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
														<h3 className="text-lg font-medium text-red-600 dark:text-red-400">Paket Bulunamadı</h3>
														<div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
															<p>{error}</p>
														</div>
													</div>
												</div>
											)}

											<h2 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400">Biliyor musunuz?</h2>
											<p className="text-gray-600 dark:text-gray-300 mb-4">
												JavaScript dünyasında keşfedilmeyi bekleyen birçok yararlı paket var. İşte az bilinen birkaç
												harika paket:
											</p>

											<div className="space-y-3">
												<div
													className="p-3 rounded-lg bg-gray-50/80 dark:bg-gray-700/60 relative group cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors backdrop-blur-sm"
													onClick={() => handleSelectPackage('zx')}
												>
													<div className="flex items-center justify-between">
														<div>
															<h4 className="font-medium flex items-center gap-2 group-hover:underline text-blue-600 dark:text-blue-400">
																zx
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
															<p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
																JavaScript ile Bash komut dosyalarını yazmayı kolaylaştıran, Google tarafından
																geliştirilen bir araç.
															</p>
														</div>
														<div className="text-sm font-medium text-gray-500 dark:text-gray-400">82%</div>
													</div>
												</div>

												<div
													className="p-3 rounded-lg bg-gray-50/80 dark:bg-gray-700/60 relative group cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors backdrop-blur-sm"
													onClick={() => handleSelectPackage('sharp')}
												>
													<div className="flex items-center justify-between">
														<div>
															<h4 className="font-medium flex items-center gap-2 group-hover:underline text-blue-600 dark:text-blue-400">
																sharp
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
															<p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
																Yüksek performanslı görüntü işleme kütüphanesi. JPEG, PNG, WebP gibi formatları
																destekler ve hızlı dönüşüm sağlar.
															</p>
														</div>
														<div className="text-sm font-medium text-gray-500 dark:text-gray-400">90%</div>
													</div>
												</div>

												<div
													className="p-3 rounded-lg bg-gray-50/80 dark:bg-gray-700/60 relative group cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors backdrop-blur-sm"
													onClick={() => handleSelectPackage('commander')}
												>
													<div className="flex items-center justify-between">
														<div>
															<h4 className="font-medium flex items-center gap-2 group-hover:underline text-blue-600 dark:text-blue-400">
																commander
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
															<p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
																Node.js komut satırı uygulamaları için tam özellikli çözüm. Komut argümanlarını ve
																seçeneklerini kolayca yönetin.
															</p>
														</div>
														<div className="text-sm font-medium text-gray-500 dark:text-gray-400">95%</div>
													</div>
												</div>

												<div
													className="p-3 rounded-lg bg-gray-50/80 dark:bg-gray-700/60 relative group cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors backdrop-blur-sm"
													onClick={() => handleSelectPackage('superjson')}
												>
													<div className="flex items-center justify-between">
														<div>
															<h4 className="font-medium flex items-center gap-2 group-hover:underline text-blue-600 dark:text-blue-400">
																superjson
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
															<p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
																JSON&apos;u genişleten, Date, Map, Set gibi JavaScript veri tiplerini destekleyen güçlü
																bir serileştirme kütüphanesi.
															</p>
														</div>
														<div className="text-sm font-medium text-gray-500 dark:text-gray-400">88%</div>
													</div>
												</div>

												<div
													className="p-3 rounded-lg bg-gray-50/80 dark:bg-gray-700/60 relative group cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors backdrop-blur-sm"
													onClick={() => handleSelectPackage('nanoid')}
												>
													<div className="flex items-center justify-between">
														<div>
															<h4 className="font-medium flex items-center gap-2 group-hover:underline text-blue-600 dark:text-blue-400">
																nanoid
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
															<p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
																UUID&apos;den çok daha küçük, URL dostu ve benzersiz ID&apos;ler üreten minimalist
																kütüphane. React ve diğer modern frameworklerde sıkça kullanılır.
															</p>
														</div>
														<div className="text-sm font-medium text-gray-500 dark:text-gray-400">92%</div>
													</div>
												</div>
											</div>
										</div>

										{error && (
											<div className="px-5 py-4 bg-red-50/60 dark:bg-red-900/20 border-t border-red-100 dark:border-red-900/30">
												<div className="flex flex-wrap gap-2 mb-4">
													<span className="text-sm font-medium text-gray-600 dark:text-gray-300">
														Popüler paketleri deneyin:
													</span>
													{['react', 'next', 'tailwindcss', 'express', 'typescript'].map((pkg) => (
														<button
															key={pkg}
															onClick={() => handleSelectPackage(pkg)}
															className="px-3 py-1 text-xs bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 text-blue-600 dark:text-blue-400 rounded-full border border-blue-200 dark:border-blue-900/40 transition-colors"
														>
															{pkg}
														</button>
													))}
												</div>

												<div className="mt-4 pt-4 border-t border-red-100 dark:border-red-900/30">
													<p className="text-sm text-gray-600 dark:text-gray-300">
														Paket adını doğru yazdığınızdan emin olun veya benzer paketleri aramayı deneyin.
													</p>
												</div>
											</div>
										)}
									</div>
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
					<div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-0 sm:p-4 overflow-y-auto">
						<div className="max-w-4xl w-full h-full sm:h-auto sm:max-h-[90vh] my-0 sm:my-8 bg-white dark:bg-gray-800 rounded-none sm:rounded-lg overflow-hidden shadow-xl">
							<div className="sticky top-0 z-10 bg-white dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
								<h2 className="text-lg font-semibold text-gray-900 dark:text-white">Paket Karşılaştırması</h2>
								<button
									onClick={closeComparison}
									className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
									aria-label="Kapat"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6 text-gray-500 dark:text-gray-400"
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
		</WarpBackground>
	)
}

// Ana sayfa bileşeni
export default function Home() {
	return (
		<Suspense fallback={<div>Yükleniyor...</div>}>
			<HomeContent />
		</Suspense>
	)
}
