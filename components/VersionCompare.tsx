import { Version, VersionCompareProps, VersionDetails } from '@/types'
import { useState, useEffect } from 'react'

import { useTranslation } from 'react-i18next'

export default function VersionCompare({ packageName }: VersionCompareProps) {
	const [versions, setVersions] = useState<Version[]>([])
	const [selectedVersions, setSelectedVersions] = useState<string[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState('')
	const { t, i18n } = useTranslation()

	useEffect(() => {
		const fetchVersions = async () => {
			try {
				const response = await fetch(`https://registry.npmjs.org/${packageName}`)
				if (!response.ok) throw new Error(t('versionCompare.error'))

				const data = await response.json()
				const versionList = Object.entries(data.versions).map(([version, details]) => ({
					version,
					date: data.time[version],
					dependencies: (details as VersionDetails).dependencies || {}
				}))

				setVersions(versionList.slice(-5).reverse())
				setSelectedVersions([versionList[versionList.length - 1].version])
			} catch (err) {
				setError(t('versionCompare.error'))
				console.error(err)
			} finally {
				setIsLoading(false)
			}
		}

		fetchVersions()
	}, [packageName, t])

	const handleVersionSelect = (version: string) => {
		setSelectedVersions((prev) => {
			if (prev.includes(version)) {
				return prev.filter((v) => v !== version)
			}
			if (prev.length < 2) {
				return [...prev, version]
			}
			return [prev[1], version]
		})
	}

	if (isLoading) {
		return (
			<div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
				<h3 className="text-lg font-semibold mb-4 dark:text-white">{t('versionCompare.title')}</h3>
				<div className="flex items-center justify-center py-8">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
					<span className="ml-3 text-gray-500 dark:text-gray-400">{t('versionCompare.loading')}</span>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
				<h3 className="text-lg font-semibold mb-4 dark:text-white">{t('versionCompare.title')}</h3>
				<div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-lg">
					<p>{error}</p>
				</div>
			</div>
		)
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString(i18n.language === 'tr' ? 'tr-TR' : 'en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	}

	const hasDependencies = (dependencies: Record<string, string>) => {
		return Object.keys(dependencies).length > 0
	}

	return (
		<div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
			<h3 className="text-lg font-semibold mb-4 dark:text-white">{t('versionCompare.title')}</h3>

			<div className="space-y-4">
				<div className="flex flex-wrap gap-2">
					{versions.map((version) => (
						<button
							key={version.version}
							onClick={() => handleVersionSelect(version.version)}
							className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
								selectedVersions.includes(version.version)
									? 'bg-blue-500 hover:bg-blue-600 text-white'
									: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
							}`}
						>
							{version.version}
						</button>
					))}
				</div>

				{selectedVersions.length === 0 ? (
					<div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center text-gray-500 dark:text-gray-400">
						{t('versionCompare.selectAtLeastOne')}
					</div>
				) : (
					<div className="grid gap-4">
						{selectedVersions.map((selectedVersion) => {
							const version = versions.find((v) => v.version === selectedVersion)!
							const deps = version.dependencies

							return (
								<div key={version.version} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
									<div className="flex items-center justify-between mb-3">
										<div>
											<span className="font-medium text-lg dark:text-white">{version.version}</span>
											<span className="text-sm text-gray-500 dark:text-gray-400 ml-2">{formatDate(version.date)}</span>
										</div>
										<span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs">
											{Object.keys(deps).length} {t('versionCompare.dependencies').toLowerCase()}
										</span>
									</div>

									<div className="border-t border-gray-200 dark:border-gray-600 pt-3 mt-1">
										<h4 className="text-sm font-medium mb-2 dark:text-gray-300">{t('versionCompare.dependencies')}:</h4>

										{hasDependencies(deps) ? (
											<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
												{Object.entries(deps)
													.slice(0, 6)
													.map(([name, ver]) => (
														<div
															key={name}
															className="text-sm bg-white dark:bg-gray-600 p-2 rounded border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
														>
															<span className="font-medium dark:text-gray-200">{name}</span>
															<span className="text-gray-500 dark:text-gray-400"> {ver}</span>
														</div>
													))}

												{Object.keys(deps).length > 6 && (
													<div className="text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded text-center text-gray-500 dark:text-gray-400">
														+{Object.keys(deps).length - 6} {t('versionCompare.moreDependencies')}
													</div>
												)}
											</div>
										) : (
											<div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg flex items-center">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-5 w-5 text-yellow-500 mr-2"
													viewBox="0 0 20 20"
													fill="currentColor"
												>
													<path
														fillRule="evenodd"
														d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
														clipRule="evenodd"
													/>
												</svg>
												<span className="text-sm text-yellow-700 dark:text-yellow-400">
													{t('versionCompare.noDependenciesMessage')}
												</span>
											</div>
										)}
									</div>
								</div>
							)
						})}
					</div>
				)}
			</div>
		</div>
	)
}
