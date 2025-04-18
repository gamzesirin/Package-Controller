'use client'

import { useTranslation } from 'react-i18next'

interface DidYouKnowProps {
	onSelectPackage: (name: string) => void
}

export default function DidYouKnow({ onSelectPackage }: DidYouKnowProps) {
	const { t } = useTranslation()

	return (
		<div className="bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-md overflow-hidden backdrop-blur-sm">
			<div className="p-5">
				<h2 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400">{t('didYouKnow')}</h2>
				<p className="text-gray-600 dark:text-gray-300 mb-4">{t('popular.heading')}</p>

				<div className="space-y-3">
					<div
						className="p-3 rounded-lg bg-gray-50/80 dark:bg-gray-700/60 relative group cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors backdrop-blur-sm"
						onClick={() => onSelectPackage('zx')}
					>
						<div className="flex items-center justify-between">
							<div>
								<h4 className="font-medium flex items-center gap-2 group-hover:underline text-blue-600 dark:text-blue-400">
									zx
									<svg
										className="w-3.5 h-3.5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
											clipRule="evenodd"
										/>
									</svg>
								</h4>
								<p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{t('popular.zx')}</p>
							</div>
							<div className="text-sm font-medium text-gray-500 dark:text-gray-400">82%</div>
						</div>
					</div>

					<div
						className="p-3 rounded-lg bg-gray-50/80 dark:bg-gray-700/60 relative group cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors backdrop-blur-sm"
						onClick={() => onSelectPackage('sharp')}
					>
						<div className="flex items-center justify-between">
							<div>
								<h4 className="font-medium flex items-center gap-2 group-hover:underline text-blue-600 dark:text-blue-400">
									sharp
									<svg
										className="w-3.5 h-3.5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
											clipRule="evenodd"
										/>
									</svg>
								</h4>
								<p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{t('popular.sharp')}</p>
							</div>
							<div className="text-sm font-medium text-gray-500 dark:text-gray-400">90%</div>
						</div>
					</div>

					<div
						className="p-3 rounded-lg bg-gray-50/80 dark:bg-gray-700/60 relative group cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors backdrop-blur-sm"
						onClick={() => onSelectPackage('commander')}
					>
						<div className="flex items-center justify-between">
							<div>
								<h4 className="font-medium flex items-center gap-2 group-hover:underline text-blue-600 dark:text-blue-400">
									commander
									<svg
										className="w-3.5 h-3.5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
											clipRule="evenodd"
										/>
									</svg>
								</h4>
								<p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{t('popular.commander')}</p>
							</div>
							<div className="text-sm font-medium text-gray-500 dark:text-gray-400">95%</div>
						</div>
					</div>

					<div
						className="p-3 rounded-lg bg-gray-50/80 dark:bg-gray-700/60 relative group cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors backdrop-blur-sm"
						onClick={() => onSelectPackage('superjson')}
					>
						<div className="flex items-center justify-between">
							<div>
								<h4 className="font-medium flex items-center gap-2 group-hover:underline text-blue-600 dark:text-blue-400">
									superjson
									<svg
										className="w-3.5 h-3.5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
											clipRule="evenodd"
										/>
									</svg>
								</h4>
								<p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{t('popular.superjson')}</p>
							</div>
							<div className="text-sm font-medium text-gray-500 dark:text-gray-400">88%</div>
						</div>
					</div>

					<div
						className="p-3 rounded-lg bg-gray-50/80 dark:bg-gray-700/60 relative group cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors backdrop-blur-sm"
						onClick={() => onSelectPackage('nanoid')}
					>
						<div className="flex items-center justify-between">
							<div>
								<h4 className="font-medium flex items-center gap-2 group-hover:underline text-blue-600 dark:text-blue-400">
									nanoid
									<svg
										className="w-3.5 h-3.5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
											clipRule="evenodd"
										/>
									</svg>
								</h4>
								<p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{t('popular.nanoid')}</p>
							</div>
							<div className="text-sm font-medium text-gray-500 dark:text-gray-400">92%</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
