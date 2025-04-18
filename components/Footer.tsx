'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'

export default function Footer() {
	const { t } = useTranslation()

	return (
		<footer className="w-full border-t border-gray-200 dark:border-gray-800 py-6 mt-auto">
			<div className="container mx-auto px-4">
				<div className="flex flex-col md:flex-row justify-between items-center">
					<div className="mb-4 md:mb-0">
						<p className="text-sm text-gray-600 dark:text-gray-400">
							© {new Date().getFullYear()} {t('title')}. {t('footer.copyright')}
						</p>
					</div>
					<div className="flex space-x-6">
						<Link
							href="https://github.com/gamzesirin/npm-finder"
							className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
						>
							GitHub
						</Link>
						<Link
							href="/privacy"
							className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
						>
							{t('footer.privacyPolicy')}
						</Link>
						<Link
							href="/terms"
							className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
						>
							{t('footer.termsOfUse')}
						</Link>
					</div>
				</div>
			</div>
		</footer>
	)
}
