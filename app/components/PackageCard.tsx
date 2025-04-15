import UsageChart from './UsageChart'
import ScoreChart from './ScoreChart'
import FavoriteButton from './FavoriteButton'
import VersionCompare from './VersionCompare'
import { PackageCardProps } from '../types'

export default function PackageCard({ packageInfo, onFavoriteChange }: PackageCardProps) {
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('tr-TR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	}

	const formatNumber = (num: number) => {
		return new Intl.NumberFormat('tr-TR').format(num)
	}

	return (
		<div className="space-y-6">
			<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
				<div className="space-y-6">
					<div className="flex justify-between items-start">
						<div>
							<h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
								{packageInfo.name}
								<span className="text-sm font-normal text-gray-500 dark:text-gray-400">v{packageInfo.version}</span>
							</h2>
							<p className="mt-2 text-gray-600 dark:text-gray-300">{packageInfo.description}</p>
						</div>
						<FavoriteButton packageName={packageInfo.name} onFavoriteChange={onFavoriteChange} />
					</div>

					<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
						<div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
							<div className="text-sm text-gray-500 dark:text-gray-400">Yayın Tarihi</div>
							<div className="font-medium dark:text-gray-200">{formatDate(packageInfo.publishedAt)}</div>
						</div>
						{packageInfo.downloads && (
							<div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
								<div className="text-sm text-gray-500 dark:text-gray-400">Haftalık İndirme</div>
								<div className="font-medium dark:text-gray-200">{formatNumber(packageInfo.downloads.weekly)}</div>
							</div>
						)}
						{packageInfo.score && (
							<>
								<div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
									<div className="text-sm text-gray-500 dark:text-gray-400">Kalite Skoru</div>
									<div className="font-medium dark:text-gray-200">{Math.round(packageInfo.score.final * 100)}%</div>
								</div>
								<div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
									<div className="text-sm text-gray-500 dark:text-gray-400">Popülerlik</div>
									<div className="font-medium dark:text-gray-200">
										{Math.round(packageInfo.score.detail.popularity * 100)}%
									</div>
								</div>
							</>
						)}
					</div>

					{packageInfo.repository && (
						<a
							href={packageInfo.repository.url.replace('git+', '').replace('.git', '')}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 text-blue-500 hover:underline"
						>
							<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
								<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
							</svg>
							GitHub&apos;da Görüntüle
						</a>
					)}
				</div>
			</div>

			<div className="grid gap-6 sm:grid-cols-2">
				<UsageChart packageName={packageInfo.name} />

				{packageInfo.score && <ScoreChart score={packageInfo.score} packageName={packageInfo.name} />}
			</div>

			<VersionCompare packageName={packageInfo.name} />
		</div>
	)
}
