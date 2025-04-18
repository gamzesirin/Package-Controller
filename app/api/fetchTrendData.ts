import fetch from 'cross-fetch'
import { TrendData, NpmDownloadItem } from '../../types'

export async function fetchTrendData(packageName: string): Promise<TrendData[]> {
	try {
		const response = await fetch(`https://api.npmjs.org/downloads/range/last-month/${encodeURIComponent(packageName)}`)

		if (!response.ok) {
			throw new Error('İndirme verileri alınamadı')
		}

		const data = await response.json()
		return data.downloads.map((item: NpmDownloadItem) => ({
			date: item.day,
			downloads: item.downloads
		}))
	} catch (error) {
		console.error('İndirme verileri alınırken hata:', error)
		throw error
	}
}
