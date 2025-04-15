'use client'

import { useState, useEffect, useRef } from 'react'
import { fetchSearchSuggestions } from '../api/fetchSearchSuggestions'
import { SearchSuggestion, SearchSuggestionsProps } from '../types'

export default function SearchSuggestions({ searchTerm, onSelectPackage }: SearchSuggestionsProps) {
	const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
	const [loading, setLoading] = useState(false)
	const [visible, setVisible] = useState(false)
	const suggestionRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const fetchSuggestions = async () => {
			if (searchTerm.length < 2) {
				setSuggestions([])
				setVisible(false)
				return
			}

			setLoading(true)
			setVisible(true)

			try {
				const results = await fetchSearchSuggestions(searchTerm)
				setSuggestions(results)
			} catch (error) {
				console.error('Öneri arama hatası:', error)
			} finally {
				setLoading(false)
			}
		}

		const timeoutId = setTimeout(() => {
			fetchSuggestions()
		}, 300)

		return () => clearTimeout(timeoutId)
	}, [searchTerm])

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
				setVisible(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	if (!visible || (suggestions.length === 0 && !loading)) return null

	return (
		<div
			ref={suggestionRef}
			className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden z-10 border border-gray-100 dark:border-gray-700"
		>
			{loading ? (
				<div className="p-4 flex items-center justify-center space-x-3">
					<div className="animate-pulse flex space-x-4 w-full">
						<div className="rounded-full bg-gray-200 dark:bg-gray-700 h-8 w-8"></div>
						<div className="flex-1 space-y-2 py-1">
							<div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
							<div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
						</div>
					</div>
				</div>
			) : (
				<ul className="max-h-60 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
					{suggestions.map((suggestion) => (
						<li
							key={suggestion.name}
							className="hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors duration-150"
							onClick={() => {
								onSelectPackage(suggestion.name)
								setVisible(false)
							}}
						>
							<div className="flex items-center px-4 py-3">
								<div className="flex-shrink-0 mr-3">
									<div className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-white font-medium">
										{suggestion.name.charAt(0).toUpperCase()}
									</div>
								</div>
								<div className="flex-1">
									<p className="text-sm font-medium text-gray-900 dark:text-white">{suggestion.name}</p>
									<p className="text-xs text-gray-500 dark:text-gray-400">{suggestion.description || 'NPM Paketi'}</p>
								</div>
								<div className="ml-2 flex-shrink-0">
									<div className="p-1 rounded-full bg-gray-100 dark:bg-gray-700">
										<svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="text-gray-400">
											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
												fill="currentColor"
											/>
										</svg>
									</div>
								</div>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}
