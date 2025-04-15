'use client'

import { useState, useEffect } from 'react'
import { fetchMetricsData } from '../api/fetchMetricsData'
import { MetricsChartProps, PackageMetrics } from '../types'

const formatBytes = (bytes: number): string => {
	if (bytes === 0) return '0 B'
	const k = 1024
	const sizes = ['B', 'KB', 'MB', 'GB']
	const i = Math.floor(Math.log(bytes) / Math.log(k))
	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export default function MetricsChart({ packageName }: MetricsChartProps) {
	const [loading, setLoading] = useState(true)
	const [packageData, setPackageData] = useState<PackageMetrics | null>(null)

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await fetchMetricsData(packageName)
				setPackageData(data)
			} catch (error) {
				console.error('Veri alınırken hata:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [packageName])

	const getBadge = (type: 'minified' | 'gzipped', size: number) => {
		if (type === 'minified') {
			if (size < 20) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
			if (size < 80) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
			return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
		} else {
			if (size < 10) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
			if (size < 30) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
			return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
		}
	}

	const minifiedSize = packageData?.minified || 0
	const gzippedSize = packageData?.gzipped || 0

	return (
		<div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
			<h3 className="text-lg font-semibold dark:text-white mb-4">Paket Boyutu</h3>

			{loading ? (
				<div className="h-64 flex flex-col items-center justify-center space-y-3">
					<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
					<p className="text-sm text-gray-500 dark:text-gray-400">Boyut verileri yükleniyor...</p>
				</div>
			) : (
				<div className="space-y-6">
					<div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
						<div className="flex justify-between items-center mb-3">
							<h4 className="font-medium text-blue-800 dark:text-blue-300">{packageName}</h4>
						</div>
						{packageData && (
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
								<div className={`p-4 rounded-lg ${getBadge('minified', minifiedSize)}`}>
									<h3 className="text-lg font-semibold mb-2">Minified Size</h3>
									<p className="text-2xl font-bold">{formatBytes(minifiedSize)}</p>
								</div>
								<div className={`p-4 rounded-lg ${getBadge('gzipped', gzippedSize)}`}>
									<h3 className="text-lg font-semibold mb-2">Gzipped Size</h3>
									<p className="text-2xl font-bold">{formatBytes(gzippedSize)}</p>
								</div>
								<div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
									<h3 className="text-lg font-semibold mb-2">Dependencies</h3>
									<p className="text-2xl font-bold">{packageData.dependencies || 0}</p>
								</div>
							</div>
						)}
						<div className="text-xs text-gray-500 dark:text-gray-400">
							Paket boyutu, JS projelerinizde yükleme performansını etkiler.
						</div>
					</div>

					<div>
						<h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Boyut Analizi</h4>
						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-2">
								<div className="text-xs text-gray-500 dark:text-gray-400">Minified Boyut</div>
								<div className="relative pt-1">
									<div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
										<div
											className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center 
                            ${
															minifiedSize < 50 ? 'bg-green-500' : minifiedSize < 200 ? 'bg-yellow-500' : 'bg-red-500'
														}`}
											style={{ width: `${Math.min(100, (minifiedSize / 50) * 20)}%` }}
										/>
									</div>
								</div>
								<div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
									<span>0 KB</span>
									<span>50 KB</span>
									<span>250 KB+</span>
								</div>
							</div>
							<div className="space-y-2">
								<div className="text-xs text-gray-500 dark:text-gray-400">Gzip Boyut</div>
								<div className="relative pt-1">
									<div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
										<div
											className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center 
                            ${gzippedSize < 20 ? 'bg-green-500' : gzippedSize < 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
											style={{ width: `${Math.min(100, (gzippedSize / 20) * 25)}%` }}
										/>
									</div>
								</div>
								<div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
									<span>0 KB</span>
									<span>20 KB</span>
									<span>80 KB+</span>
								</div>
							</div>
						</div>
					</div>

					<div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
						Boyut verileri Bundlephobia&apos;dan alınmıştır. Daha küçük paketler daha hızlı yüklenir.
					</div>
				</div>
			)}
		</div>
	)
}
