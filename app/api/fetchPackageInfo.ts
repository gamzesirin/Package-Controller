import fetch from 'cross-fetch'
import { PackageInfo, SearchResult } from '../types'

export async function fetchPackageInfo(packageName: string): Promise<PackageInfo> {
	try {
		const normalizedPackageName = packageName.toLowerCase().trim()

		// Paralel olarak tüm API isteklerini yap
		const [npmData, scoreData, downloadsData] = await Promise.all([
			// NPM Registry'den paket bilgileri
			fetch(`https://registry.npmjs.org/${normalizedPackageName}`).then((res) => {
				if (!res.ok) {
					if (res.status === 404) {
						throw new Error(`"${packageName}" adlı paket bulunamadı`)
					}
					throw new Error("NPM Registry'e erişim sırasında bir hata oluştu")
				}
				return res.json()
			}),

			// NPMS.io'dan skor bilgileri
			fetch(`https://api.npms.io/v2/package/${encodeURIComponent(normalizedPackageName)}`)
				.then((res) => (res.ok ? res.json() : null))
				.catch(() => null),

			// NPM'den indirme istatistikleri
			fetch(`https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent(normalizedPackageName)}`)
				.then((res) => (res.ok ? res.json() : { downloads: 0 }))
				.catch(() => ({ downloads: 0 }))
		])

		return {
			name: npmData.name,
			version: npmData.version,
			description: npmData.description || 'Açıklama bulunamadı',
			publishedAt: npmData.time?.modified || new Date().toISOString(),
			repository: npmData.repository,
			dependencies: npmData.dependencies || {},
			downloads: {
				weekly: downloadsData.downloads
			},
			score: scoreData?.score
		}
	} catch (error) {
		console.error('Paket bilgileri alınırken hata:', error)
		throw error instanceof Error ? error : new Error('Paket bilgileri alınırken bilinmeyen bir hata oluştu')
	}
}

export async function fetchSimilarPackages(
	packageName: string
): Promise<Array<{ name: string; description: string; score: number }>> {
	try {
		const normalizedPackageName = packageName.toLowerCase().trim()

		// NPMS.io API'sini kullanarak benzer paketleri bul
		const response = await fetch(
			`https://api.npms.io/v2/search?q=keywords:${encodeURIComponent(normalizedPackageName)}&size=10`
		)

		if (!response.ok) {
			throw new Error('Benzer paketler alınamadı')
		}

		const data = await response.json()

		// Mevcut paketi sonuçlardan çıkar ve en yüksek skorlu 5 paketi döndür
		return data.results
			.filter((result: SearchResult) => result.package.name !== normalizedPackageName)
			.slice(0, 5)
			.map((result: SearchResult) => ({
				name: result.package.name,
				description: result.package.description || '',
				score: Math.round(result.score.final * 100)
			}))
	} catch (error) {
		console.error('Benzer paketler alınırken hata:', error)
		// Hata durumunda popüler alternatifleri döndür
		return [
			{
				name: 'react',
				description: 'Kullanıcı arayüzleri oluşturmak için JavaScript kütüphanesi',
				score: 95
			},
			{
				name: 'express',
				description: 'Hızlı, önyargısız, minimalist web çerçevesi',
				score: 93
			},
			{
				name: 'lodash',
				description: 'Modern JavaScript yardımcı programı',
				score: 91
			},
			{
				name: 'axios',
				description: 'Promise tabanlı HTTP istemcisi',
				score: 89
			},
			{
				name: 'next',
				description: 'React Framework',
				score: 88
			}
		]
	}
}
