'use client'

import { useState, useEffect } from 'react'
import { fetchPopularityData } from '../api/fetchPopularityData'
import { PopularityChartProps, ScoreData } from '../types'

export default function PopularityChart({ packageName }: PopularityChartProps) {
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [scores, setScores] = useState<ScoreData>({
		final: 0,
		detail: {
			quality: 0,
			popularity: 0,
			maintenance: 0
		}
	})

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true)
				const data = await fetchPopularityData(packageName)

				setScores({
					final: Math.round((data.stars + data.downloads + (100 - data.issues)) / 3),
					detail: {
						quality: Math.round((data.stars / 1000) * 100),
						popularity: Math.round((data.downloads / 100000) * 100),
						maintenance: Math.round((100 - data.issues / 100) * 100)
					}
				})
				setError(null)
			} catch (err) {
				setError('Popülerlik verileri alınamadı')
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
				<h3 className="text-lg font-semibold mb-4 dark:text-white">Popülerlik Metrikleri</h3>
				<div className="h-48 flex items-center justify-center">
					<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
				<h3 className="text-lg font-semibold mb-4 dark:text-white">Popülerlik Metrikleri</h3>
				<div className="text-red-500 dark:text-red-400">{error}</div>
			</div>
		)
	}

	return (
		<div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
			<h3 className="text-lg font-semibold mb-4 dark:text-white">Popülerlik Metrikleri</h3>
			<div className="space-y-4">
				<div>
					<div className="flex justify-between mb-1">
						<span className="text-gray-600 dark:text-gray-300">Kalite</span>
						<span className="text-gray-600 dark:text-gray-300">{scores.detail.quality}%</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
						<div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${scores.detail.quality}%` }}></div>
					</div>
				</div>
				<div>
					<div className="flex justify-between mb-1">
						<span className="text-gray-600 dark:text-gray-300">Popülerlik</span>
						<span className="text-gray-600 dark:text-gray-300">{scores.detail.popularity}%</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
						<div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${scores.detail.popularity}%` }}></div>
					</div>
				</div>
				<div>
					<div className="flex justify-between mb-1">
						<span className="text-gray-600 dark:text-gray-300">Bakım</span>
						<span className="text-gray-600 dark:text-gray-300">{scores.detail.maintenance}%</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
						<div className="bg-yellow-600 h-2.5 rounded-full" style={{ width: `${scores.detail.maintenance}%` }}></div>
					</div>
				</div>
			</div>
		</div>
	)
}
