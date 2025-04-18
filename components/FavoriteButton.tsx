'use client'

import { FavoriteButtonProps } from '@/types'
import { useState, useEffect } from 'react'

import { useTranslation } from 'react-i18next'

export default function FavoriteButton({ packageName, onFavoriteChange }: FavoriteButtonProps) {
	const [isFavorite, setIsFavorite] = useState(false)
	const { t } = useTranslation()

	useEffect(() => {
		const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
		setIsFavorite(favorites.includes(packageName))
	}, [packageName])

	const toggleFavorite = () => {
		const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
		let newFavorites

		if (isFavorite) {
			newFavorites = favorites.filter((name: string) => name !== packageName)
		} else {
			newFavorites = [...favorites, packageName]
		}

		localStorage.setItem('favorites', JSON.stringify(newFavorites))
		setIsFavorite(!isFavorite)

		if (onFavoriteChange) {
			onFavoriteChange()
		}
	}

	return (
		<button
			onClick={toggleFavorite}
			className="inline-flex items-center gap-1 text-gray-500 hover:text-yellow-500 transition-colors"
			title={isFavorite ? t('favorites.remove') : t('favorites.add')}
		>
			<svg
				className={`w-5 h-5 ${isFavorite ? 'text-yellow-500 fill-current' : 'stroke-current fill-none'}`}
				viewBox="0 0 24 24"
				strokeWidth="2"
			>
				<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
			</svg>
			<span className="text-sm">{isFavorite ? t('favorites.remove') : t('favorites.add')}</span>
		</button>
	)
}
