'use client'

import { fetchSimilarPackages } from '@/app/api/fetchPackageInfo'
import { SimilarPackage, SimilarPackagesProps } from '@/types'
import { useState, useEffect } from 'react'

import { useTranslation } from 'react-i18next'

export default function SimilarPackages({ packageName, onCompare }: SimilarPackagesProps) {
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [similarPackages, setSimilarPackages] = useState<SimilarPackage[]>([])
	const [selectedPackages, setSelectedPackages] = useState<string[]>([packageName])
	const { t } = useTranslation()

	useEffect(() => {
		const loadSimilarPackages = async () => {
			setLoading(true)
			setError(null)

			try {
				const packages = await fetchSimilarPackages(packageName)
				setSimilarPackages(packages)
			} catch (err) {
				setError('Benzer paketler yüklenirken bir hata oluştu')
				console.error(err)
			} finally {
				setLoading(false)
			}
		}

		loadSimilarPackages()
	}, [packageName])

	const togglePackageSelection = (packageName: string) => {
		setSelectedPackages((prev) => {
			if (prev.includes(packageName)) {
				return prev.filter((p) => p !== packageName)
			}

			if (prev.length >= 3) {
				return [...prev.slice(1), packageName]
			}

			return [...prev, packageName]
		})
	}

	const handleCompare = () => {
		if (onCompare && selectedPackages.length > 1) {
			onCompare(selectedPackages)
		}
	}

	return (
		<div className="bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-md p-6 backdrop-blur-sm">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">{t('similarPackages.title')}</h2>

				<button
					onClick={handleCompare}
					disabled={selectedPackages.length < 2}
					className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
						selectedPackages.length < 2
							? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
							: 'bg-blue-500 text-white hover:bg-blue-600'
					}`}
				>
					{selectedPackages.length < 2
						? t('similarPackages.compare')
						: `${selectedPackages.length} ${t('similarPackages.compare')}`}
				</button>
			</div>

			<p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
				{packageName} {t('similarPackages.alternativePackages')}
			</p>

			{loading && (
				<div className="flex justify-center items-center py-10">
					<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
				</div>
			)}

			{error && (
				<div className="p-4 bg-red-50/80 text-red-500 dark:bg-red-900/30 dark:text-red-400 rounded-lg backdrop-blur-sm">
					<p>{error}</p>
				</div>
			)}

			{!loading && !error && similarPackages.length === 0 && (
				<div className="p-4 bg-gray-50/80 dark:bg-gray-700/60 text-gray-500 dark:text-gray-400 rounded-lg backdrop-blur-sm">
					<p>{t('similarPackages.noSimilarPackages')}</p>
				</div>
			)}

			{!loading && !error && similarPackages.length > 0 && (
				<div className="space-y-3">
					<div className="p-3 rounded-lg bg-blue-50/90 dark:bg-blue-900/30 relative">
						<div className="flex items-center justify-between">
							<div className="flex-1">
								<div className="flex items-center gap-2">
									<input type="checkbox" checked={true} disabled={true} className="h-4 w-4 text-blue-500" />
									<h4 className="font-medium text-blue-600 dark:text-blue-400">
										{packageName}
										<span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300">
											{t('similarPackages.mainPackage')}
										</span>
									</h4>
								</div>
								<p className="text-sm text-gray-600 dark:text-gray-300 pl-6 mt-1">
									{t('similarPackages.mainPackageDesc')}
								</p>
							</div>
						</div>
					</div>

					{similarPackages.map((pkg) => {
						const isSelected = selectedPackages.includes(pkg.name)
						const isDisabled = selectedPackages.length >= 3 && !isSelected

						return (
							<div
								key={pkg.name}
								className={`p-3 rounded-lg relative ${
									isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
								} transition-colors ${
									isSelected
										? 'bg-green-50/90 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
										: 'bg-gray-50/80 dark:bg-gray-700/60 hover:bg-gray-100 dark:hover:bg-gray-600'
								}`}
								onClick={() => !isDisabled && togglePackageSelection(pkg.name)}
							>
								<div className="flex items-center justify-between">
									<div className="flex-1">
										<div className="flex items-center gap-2">
											<input
												type="checkbox"
												checked={isSelected}
												disabled={isDisabled}
												onChange={() => !isDisabled && togglePackageSelection(pkg.name)}
												className={`h-4 w-4 ${
													isSelected ? 'text-blue-500' : isDisabled ? 'text-gray-400' : 'text-gray-500'
												}`}
											/>
											<h4 className="font-medium text-gray-900 dark:text-gray-100">
												{pkg.name}
												{isDisabled && (
													<span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
														{t('similarPackages.maxAlternatives')}
													</span>
												)}
											</h4>
										</div>
										<p className="text-sm text-gray-600 dark:text-gray-300 pl-6 line-clamp-2 mt-1">{pkg.description}</p>
									</div>
									<div className="text-sm font-medium text-gray-500 dark:text-gray-400 ml-2">{pkg.score}%</div>
								</div>
							</div>
						)
					})}
				</div>
			)}

			{selectedPackages.length >= 2 && (
				<div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
					<div className="flex justify-between items-center">
						<span className="text-sm text-gray-600 dark:text-gray-300">
							{selectedPackages.length} {t('similarPackages.packagesSelected')}
						</span>
					</div>
				</div>
			)}
		</div>
	)
}
