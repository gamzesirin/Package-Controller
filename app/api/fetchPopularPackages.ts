import fetch from 'cross-fetch'
import { PopularPackage } from '../../types'

export async function fetchPopularPackages(): Promise<PopularPackage[]> {
	try {
		const response = await fetch(
			'https://api.npmjs.org/downloads/point/last-week/react,vue,angular,next,express,typescript'
		)
		const downloadsData = await response.json()

		const packagePromises = Object.keys(downloadsData).map(async (pkg) => {
			const detailResponse = await fetch(`https://registry.npmjs.org/${pkg}/latest`)
			const detailData = await detailResponse.json()

			return {
				name: pkg,
				description: detailData.description || '',
				version: detailData.version,
				downloads: downloadsData[pkg].downloads
			}
		})

		const packages = await Promise.all(packagePromises)
		return packages.sort((a, b) => b.downloads - a.downloads)
	} catch (error) {
		console.error('Popüler paketler alınırken hata:', error)
		throw error
	}
}
