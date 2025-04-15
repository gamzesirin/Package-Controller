'use client'

import { useState, useEffect } from 'react'
import { fetchSizeData } from '../api/fetchSizeData'
import { SizeComparisonProps, SizeInfo } from '../types'

export default function SizeComparison({ packageName }: SizeComparisonProps) {
	const [loading, setLoading] = useState(true)
	const [currentSize, setCurrentSize] = useState<SizeInfo>({ minified: 0, gzipped: 0, dependencies: 0 })

	const getAlternatives = () => {
		if (packageName === 'react') return ['preact', 'vue', 'svelte']
		if (packageName === 'vue') return ['react', 'preact', 'svelte']
		if (packageName === 'axios') return ['ky', 'superagent', 'fetch']
		if (packageName === 'lodash') return ['ramda', 'underscore', 'native']
		return ['alternatif-1', 'alternatif-2']
	}

	const alternativeSizes = {
		preact: { minified: 10.2, gzipped: 4.1, dependencies: 0 },
		svelte: { minified: 4.8, gzipped: 1.8, dependencies: 0 },
		ky: { minified: 12.6, gzipped: 4.2, dependencies: 0 },
		superagent: { minified: 32.4, gzipped: 10.8, dependencies: 1 },
		fetch: { minified: 0, gzipped: 0, dependencies: 0 },
		ramda: { minified: 46.8, gzipped: 14.5, dependencies: 0 },
		underscore: { minified: 22.6, gzipped: 8.1, dependencies: 0 },
		native: { minified: 0, gzipped: 0, dependencies: 0 },
		'alternatif-1': { minified: 24.5, gzipped: 8.2, dependencies: 2 },
		'alternatif-2': { minified: 18.6, gzipped: 6.4, dependencies: 1 }
	}

	const alternatives = getAlternatives()

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await fetchSizeData(packageName)
				setCurrentSize(data)
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

	return (
		<div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
			<h3 className="text-lg font-semibold dark:text-white mb-2">Paket Boyutu</h3>
			<p className="text-sm text-gray-600 dark:text-gray-300 mb-5">
				{packageName} paketinin boyutu ve alternatiflerin karşılaştırması
			</p>

			{loading ? (
				<div className="h-52 flex items-center justify-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
				</div>
			) : (
				<div className="space-y-6">
					<div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
						<div className="flex justify-between items-center mb-2">
							<h4 className="font-medium text-blue-800 dark:text-blue-300">{packageName}</h4>
							<div className="text-xs text-gray-500 dark:text-gray-400">Aktif Kullanılan</div>
						</div>
						<div className="flex flex-wrap gap-2 mb-2">
							<div className={`px-2 py-1 text-xs rounded ${getBadge('minified', currentSize.minified)}`}>
								{currentSize.minified} KB (minified)
							</div>
							<div className={`px-2 py-1 text-xs rounded ${getBadge('gzipped', currentSize.gzipped)}`}>
								{currentSize.gzipped} KB (gzipped)
							</div>
							<div className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
								{currentSize.dependencies} bağımlılık
							</div>
						</div>
					</div>

					<div className="space-y-2">
						<h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Alternatifler</h4>
						{alternatives.map((alt, index) => {
							const size = alternativeSizes[alt as keyof typeof alternativeSizes]
							const savings = (((currentSize.gzipped - size.gzipped) / currentSize.gzipped) * 100).toFixed(0)

							return (
								<div key={index} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
									<div className="flex justify-between items-center mb-1">
										<h5 className="text-sm font-medium">{alt}</h5>
										<div className="text-xs text-green-600 dark:text-green-400">{savings}% daha küçük</div>
									</div>
									<div className="flex flex-wrap gap-2">
										<div className={`px-2 py-1 text-xs rounded ${getBadge('minified', size.minified)}`}>
											{size.minified} KB
										</div>
										<div className={`px-2 py-1 text-xs rounded ${getBadge('gzipped', size.gzipped)}`}>
											{size.gzipped} KB (gzip)
										</div>
									</div>
								</div>
							)
						})}
					</div>

					<div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
						Boyut verileri gerçek zamanlı olarak Bundlephobia&apos;dan alınmaktadır.
					</div>
				</div>
			)}
		</div>
	)
}
