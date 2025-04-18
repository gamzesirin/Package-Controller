'use client'

import { fetchDependencyData } from '@/app/api/fetchDependencyData'
import { DependencyGraphProps, DependencyNode } from '@/types'
import { useState, useEffect } from 'react'

import { useTranslation } from 'react-i18next'

export default function DependencyGraph({ packageName }: DependencyGraphProps) {
	const [loading, setLoading] = useState(true)
	const [dependencies, setDependencies] = useState<DependencyNode | null>(null)
	const [error, setError] = useState<string | null>(null)
	const { t } = useTranslation()

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true)
				const data = await fetchDependencyData(packageName)
				setDependencies(data)
				setError(null)
			} catch (err) {
				setError(t('dependencyGraph.error'))
				console.error(err)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [packageName, t])

	const renderDependencyTree = (node: DependencyNode, level: number = 0) => {
		return (
			<div key={node.name} style={{ marginLeft: `${level * 20}px` }} className="mt-2">
				<div className="flex items-center">
					<span className="text-sm font-medium text-gray-700 dark:text-gray-300">{node.name}</span>
					<span className="ml-2 text-xs text-gray-500 dark:text-gray-400">v{node.version}</span>
				</div>
				{node.dependencies &&
					Object.entries(node.dependencies).map(([name, dep]) =>
						renderDependencyTree({ name, version: dep.version, dependencies: dep.dependencies }, level + 1)
					)}
			</div>
		)
	}

	if (loading) {
		return (
			<div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
				<h3 className="text-lg font-semibold mb-4 dark:text-white">{t('dependencyGraph.title')}</h3>
				<div className="h-64 flex items-center justify-center">
					<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
				<h3 className="text-lg font-semibold mb-4 dark:text-white">{t('dependencyGraph.title')}</h3>
				<div className="text-red-500 dark:text-red-400">{error}</div>
			</div>
		)
	}

	return (
		<div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
			<h3 className="text-lg font-semibold mb-4 dark:text-white">{t('dependencyGraph.title')}</h3>
			<div className="overflow-auto max-h-96">{dependencies && renderDependencyTree(dependencies)}</div>
		</div>
	)
}
