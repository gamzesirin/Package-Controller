import fetch from 'cross-fetch'

export async function fetchPackageComparisonData(packageNames: string[]) {
	try {
		const packageData = await Promise.all(
			packageNames.map(async (packageName) => {
				const response = await fetch(`https://registry.npmjs.org/${encodeURIComponent(packageName)}`)
				if (!response.ok) {
					throw new Error(`Veri alınamadı: ${packageName}`)
				}
				const data: {
					name: string
					'dist-tags': { latest: string }
					description: string
					time: Record<string, string>
					versions: Record<string, { dependencies: Record<string, string> }>
				} = await response.json()
				return {
					name: data.name,
					version: data['dist-tags'].latest,
					description: data.description,
					publishedAt: data.time[data['dist-tags'].latest],
					dependencies: Object.keys(data.versions[data['dist-tags'].latest].dependencies || {}).length
				}
			})
		)
		return packageData
	} catch (error) {
		console.error('Paket karşılaştırma verileri alınırken hata:', error)
		throw error
	}
}
