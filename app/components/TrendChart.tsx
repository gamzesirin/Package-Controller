'use client'

import { useState, useEffect } from 'react'
import { fetchTrendData } from '../api/fetchTrendData'
import { DownloadData, TrendChartProps } from '../types'

export default function TrendChart({ packageName }: TrendChartProps) {
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [data, setData] = useState<DownloadData[]>([])

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true)
				const trendData = await fetchTrendData(packageName)
				setData(trendData)
				setError(null)
			} catch (err) {
				setError('İndirme verileri alınamadı')
				console.error(err)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [packageName])

	if (loading) {
		return (
			<div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
				<h3 className="text-lg font-semibold mb-4 dark:text-white">İndirme Trendi</h3>
				<div className="h-48 flex items-center justify-center">
					<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
				<h3 className="text-lg font-semibold mb-4 dark:text-white">İndirme Trendi</h3>
				<div className="text-red-500 dark:text-red-400">{error}</div>
			</div>
		)
	}

	const maxDownloads = Math.max(...data.map((item) => item.downloads))
	const chartHeight = 200
	const points = data
		.map((item, index) => {
			const x = (index / (data.length - 1)) * 100
			const y = ((maxDownloads - item.downloads) / maxDownloads) * chartHeight
			return `${x},${y}`
		})
		.join(' ')

	return (
		<div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
			<h3 className="text-lg font-semibold mb-4 dark:text-white">İndirme Trendi</h3>
			<div className="relative h-52">
				<svg className="w-full h-full" viewBox={`0 0 100 ${chartHeight}`} preserveAspectRatio="none">
					<polyline points={points} fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500" />
				</svg>
				<div className="absolute bottom-0 left-0 w-full h-px bg-gray-200 dark:bg-gray-700"></div>
				<div className="absolute left-0 top-0 h-full w-px bg-gray-200 dark:bg-gray-700"></div>
			</div>
			<div className="mt-4 flex justify-between text-sm text-gray-500 dark:text-gray-400">
				<span>30 gün önce</span>
				<span>Bugün</span>
			</div>
			<div className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
				Son 30 günde toplam {data.reduce((sum, item) => sum + item.downloads, 0).toLocaleString('tr-TR')} indirme
			</div>
		</div>
	)
}
