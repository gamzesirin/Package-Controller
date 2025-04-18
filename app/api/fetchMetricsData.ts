import fetch from 'cross-fetch'
import { MetricsData } from '../../types'

export async function fetchMetricsData(packageName: string): Promise<MetricsData> {
	try {
		const response = await fetch(`https://bundlephobia.com/api/size?package=${encodeURIComponent(packageName)}`)
		if (!response.ok) {
			throw new Error('Paket boyutu verileri alınamadı')
		}
		const data: { size: number; gzip: number; dependencyCount: number } = await response.json()
		return {
			minified: data.size,
			gzipped: data.gzip,
			dependencies: data.dependencyCount
		}
	} catch (error) {
		console.error('Paket boyutu verileri alınırken hata:', error)
		throw error
	}
}
