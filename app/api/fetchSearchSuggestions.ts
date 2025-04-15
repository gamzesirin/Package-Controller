import fetch from 'cross-fetch'
import { SearchSuggestion } from '../types'

interface NpmSearchResponse {
	package: {
		name: string
		description?: string
	}
	score: {
		final: number
	}
}

export async function fetchSearchSuggestions(query: string): Promise<SearchSuggestion[]> {
	try {
		const response = await fetch(`https://api.npms.io/v2/search/suggestions?q=${encodeURIComponent(query)}`)
		if (!response.ok) {
			throw new Error('Arama önerileri alınamadı')
		}
		const data: NpmSearchResponse[] = await response.json()
		return data.map((item: NpmSearchResponse) => ({
			name: item.package.name,
			description: item.package.description || '',
			score: Math.round(item.score.final * 100)
		}))
	} catch (error) {
		console.error('Arama önerileri alınırken hata:', error)
		throw error
	}
}
