'use client'

import { fetchPackageInfo } from '@/app/api/fetchPackageInfo'
import { PackageComparisonProps, PackageDetails } from '@/types'
import { useState, useEffect } from 'react'

import { useTranslation } from 'react-i18next'

export default function PackageComparison({ packages }: PackageComparisonProps) {
	const [loading, setLoading] = useState(true)
	const [packageDetails, setPackageDetails] = useState<PackageDetails[]>([])
	const { t, i18n } = useTranslation()

	useEffect(() => {
		const fetchDetails = async () => {
			setLoading(true)

			try {
				const details = await Promise.all(
					packages.map(async (packageName) => {
						try {
							const info = await fetchPackageInfo(packageName)
							return {
								name: info.name,
								version: info.version,
								description: info.description,
								publishedAt: info.publishedAt,
								dependencies: Object.keys(info.dependencies || {}).length,
								downloads: info.downloads?.weekly,
								score: info.score
							}
						} catch {
							return {
								name: packageName,
								version: '-',
								description: 'Paket bilgisi alınamadı',
								publishedAt: '-',
								dependencies: 0,
								error: t('packageComparison.errorLoading')
							}
						}
					})
				)

				setPackageDetails(details)
			} catch {
				console.error('Paket karşılaştırma hatası')
			} finally {
				setLoading(false)
			}
		}

		if (packages.length > 0) {
			fetchDetails()
		}
	}, [packages, t])

	const formatDate = (dateString: string) => {
		if (dateString === '-') return '-'

		try {
			return new Date(dateString).toLocaleDateString(i18n.language === 'tr' ? 'tr-TR' : 'en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			})
		} catch {
			return dateString
		}
	}

	const formatNumber = (num?: number) => {
		if (num === undefined) return '-'

		if (num >= 1000000) {
			return (num / 1000000).toFixed(1) + 'M'
		}
		if (num >= 1000) {
			return (num / 1000).toFixed(1) + 'K'
		}
		return num.toString()
	}

	return (
		<div className="p-4 sm:p-6">
			{loading ? (
				<div className="flex justify-center items-center py-16">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
				</div>
			) : (
				<>
					<div className="overflow-x-auto -mx-4 sm:mx-0">
						<div className="inline-block min-w-full align-middle">
							<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
								<thead>
									<tr>
										<th
											scope="col"
											className="sticky left-0 bg-white dark:bg-gray-800 px-4 py-2 text-left text-gray-600 dark:text-gray-300 font-medium"
										>
											{t('packageComparison.feature')}
										</th>
										{packageDetails.map((pkg, index) => (
											<th
												key={index}
												scope="col"
												className={`px-4 py-2 text-left font-medium ${
													pkg.error ? 'text-red-500 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'
												}`}
											>
												{pkg.name}
											</th>
										))}
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
									<tr>
										<td className="sticky left-0 bg-white dark:bg-gray-800 px-4 py-3 text-gray-600 dark:text-gray-300 font-medium">
											{t('packageComparison.version')}
										</td>
										{packageDetails.map((pkg, index) => (
											<td key={index} className="px-4 py-3 text-gray-800 dark:text-gray-200">
												{pkg.error ? '-' : pkg.version}
											</td>
										))}
									</tr>

									<tr>
										<td className="sticky left-0 bg-white dark:bg-gray-800 px-4 py-3 text-gray-600 dark:text-gray-300 font-medium">
											{t('packageComparison.lastUpdate')}
										</td>
										{packageDetails.map((pkg, index) => (
											<td key={index} className="px-4 py-3 text-gray-800 dark:text-gray-200">
												{pkg.error ? '-' : formatDate(pkg.publishedAt)}
											</td>
										))}
									</tr>

									<tr>
										<td className="sticky left-0 bg-white dark:bg-gray-800 px-4 py-3 text-gray-600 dark:text-gray-300 font-medium">
											{t('packageComparison.dependencyCount')}
										</td>
										{packageDetails.map((pkg, index) => (
											<td key={index} className="px-4 py-3 text-gray-800 dark:text-gray-200">
												{pkg.error ? '-' : pkg.dependencies}
											</td>
										))}
									</tr>

									<tr>
										<td className="sticky left-0 bg-white dark:bg-gray-800 px-4 py-3 text-gray-600 dark:text-gray-300 font-medium">
											{t('packageComparison.weeklyDownloads')}
										</td>
										{packageDetails.map((pkg, index) => (
											<td key={index} className="px-4 py-3 text-gray-800 dark:text-gray-200">
												{pkg.error ? '-' : formatNumber(pkg.downloads)}
											</td>
										))}
									</tr>

									<tr>
										<td className="sticky left-0 bg-white dark:bg-gray-800 px-4 py-3 text-gray-600 dark:text-gray-300 font-medium">
											{t('packageComparison.score')}
										</td>
										{packageDetails.map((pkg, index) => (
											<td key={index} className="px-4 py-3">
												{pkg.error ? (
													'-'
												) : (
													<div className="flex items-center">
														<div className="w-16 sm:w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
															<div
																className="h-full bg-blue-500"
																style={{ width: `${pkg.score?.final ? Math.round(pkg.score.final * 100) : 0}%` }}
															></div>
														</div>
														<span className="ml-2 text-gray-800 dark:text-gray-200">
															{pkg.score?.final ? `${Math.round(pkg.score.final * 100)}%` : '-'}
														</span>
													</div>
												)}
											</td>
										))}
									</tr>

									<tr>
										<td className="sticky left-0 bg-white dark:bg-gray-800 px-4 py-3 text-gray-600 dark:text-gray-300 font-medium">
											{t('packageComparison.details')}
										</td>
										{packageDetails.map((pkg, index) => (
											<td key={index} className="px-4 py-3 text-sm">
												{pkg.error ? (
													<span className="text-red-500 dark:text-red-400">{pkg.error}</span>
												) : (
													<a
														href={`https://www.npmjs.com/package/${pkg.name}`}
														target="_blank"
														rel="noopener noreferrer"
														className="text-blue-500 hover:underline dark:text-blue-400"
													>
														{t('packageComparison.npmPage')}
													</a>
												)}
											</td>
										))}
									</tr>
								</tbody>
							</table>
						</div>
					</div>

					<div className="mt-6 space-y-2">
						<h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
							{t('packageComparison.descriptions')}
						</h3>
						{packageDetails.map((pkg, index) => (
							<div
								key={index}
								className={`p-3 rounded-lg ${
									index === 0 ? 'bg-blue-50/50 dark:bg-blue-900/20' : 'bg-gray-50/50 dark:bg-gray-700/50'
								}`}
							>
								<h4 className="font-medium text-gray-800 dark:text-gray-200">{pkg.name}</h4>
								<p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{pkg.description}</p>
							</div>
						))}
					</div>
				</>
			)}
		</div>
	)
}
