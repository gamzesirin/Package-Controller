import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { DownloadData, UsageChartProps, NpmDownloadData } from '../types'

export default function UsageChart({ packageName }: UsageChartProps) {
	const [data, setData] = useState<DownloadData[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		const fetchDownloads = async () => {
			try {
				const endDate = new Date()
				const startDate = new Date()
				startDate.setDate(startDate.getDate() - 30)

				const response = await fetch(
					`https://api.npmjs.org/downloads/range/${startDate.toISOString().split('T')[0]}:${
						endDate.toISOString().split('T')[0]
					}/${packageName}`
				)

				if (!response.ok) {
					throw new Error('İndirme verileri alınamadı')
				}

				const result = await response.json()
				const formattedData = result.downloads.map((item: NpmDownloadData) => ({
					date: new Date(item.day).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' }),
					downloads: item.downloads
				}))

				setData(formattedData)
			} catch (err) {
				setError('Grafik verileri yüklenirken bir hata oluştu')
				console.error(err)
			} finally {
				setIsLoading(false)
			}
		}

		fetchDownloads()
	}, [packageName])

	if (isLoading) {
		return (
			<div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
				<div className="text-gray-500 dark:text-gray-400">Veriler yükleniyor...</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
				<div className="text-red-500 dark:text-red-400">{error}</div>
			</div>
		)
	}

	return (
		<div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
			<h3 className="text-lg font-semibold mb-4 dark:text-white">Son 30 Gün İndirme Trendi</h3>
			<div className="h-64">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
						<CartesianGrid strokeDasharray="3 3" stroke="#374151" />
						<XAxis dataKey="date" stroke="#6B7280" tick={{ fill: '#6B7280' }} tickLine={{ stroke: '#6B7280' }} />
						<YAxis
							stroke="#6B7280"
							tick={{ fill: '#6B7280' }}
							tickLine={{ stroke: '#6B7280' }}
							tickFormatter={(value) => new Intl.NumberFormat('tr-TR', { notation: 'compact' }).format(value)}
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: '#1F2937',
								border: 'none',
								borderRadius: '0.5rem',
								color: '#F3F4F6'
							}}
							formatter={(value: number) => [new Intl.NumberFormat('tr-TR').format(value), 'İndirme']}
						/>
						<Line
							type="monotone"
							dataKey="downloads"
							stroke="#3B82F6"
							strokeWidth={2}
							dot={false}
							activeDot={{ r: 6, fill: '#3B82F6' }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	)
}
