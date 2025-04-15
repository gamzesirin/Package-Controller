import fetch from 'cross-fetch'
import { PopularityData } from '../types'

export async function fetchPopularityData(packageName: string): Promise<PopularityData> {
	try {
		const response = await fetch(`https://api.npms.io/v2/package/${encodeURIComponent(packageName)}`)
		if (!response.ok) {
			throw new Error('Popülerlik verileri alınamadı')
		}
		const data = await response.json()
		return {
			downloads: data.collected.npm.downloads[0].count,
			stars: data.collected.github?.starsCount || 0,
			issues: data.collected.github?.issues?.openCount || 0
		}
	} catch (error) {
		console.error('Popülerlik verileri alınırken hata:', error)
		throw error
	}
}
