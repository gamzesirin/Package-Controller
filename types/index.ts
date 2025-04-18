export interface PackageInfo {
	name: string
	version: string
	description: string
	publishedAt: string
	repository?: {
		url: string
	}
	dependencies: Record<string, string>
	downloads: {
		weekly: number
	}
	score?: {
		final: number
		detail: {
			quality: number
			popularity: number
			maintenance: number
		}
	}
}

export interface PopularPackage {
	name: string
	description: string
	version: string
	downloads: number
}

export interface SearchResult {
	package: {
		name: string
		description: string
	}
	score: {
		final: number
	}
}

export interface PackageSuggestionsProps {
	currentPackage?: string
	onPackageSelect: (packageName: string) => void
}

export interface DependencyGraphProps {
	packageName: string
}

export interface DependencyNode {
	name: string
	version: string
	dependencies?: { [key: string]: DependencyNode }
}

export interface MetricsChartProps {
	packageName: string
}

export interface PackageComparisonProps {
	packages: string[]
	onClose?: () => void
}

export interface SimilarPackagesProps {
	packageName: string
	onCompare?: (packages: string[]) => void
}

export interface FavoritesListProps {
	onSelectPackage?: (packageName: string) => void
}

export interface SearchSuggestionsProps {
	searchTerm: string
	onSelectPackage: (packageName: string) => void
}

export interface SizeComparisonProps {
	packages: string[]
}

export interface ScoreChartProps {
	packageName: string
}

export interface VersionCompareProps {
	packageName: string
}

export interface PackageCardProps {
	packageInfo: PackageInfo
	onFavoriteChange?: () => void
}

export interface FavoriteButtonProps {
	packageName: string
	onFavoriteChange?: () => void
}

export interface UsageChartProps {
	packageName: string
}

export interface MetricsData {
	gzipped: number
	minified: number
	dependencies: number
}

export interface TrendData {
	date: string
	downloads: number
}

export interface SizeData {
	size: number
	gzipSize: number
}

export interface PopularityData {
	downloads: number
	stars: number
	issues: number
}

export interface SearchSuggestion {
	name: string
	description: string
	score: number
}

export interface Version {
	version: string
	date: string
	dependencies: Record<string, string>
}

export interface VersionDetails {
	dependencies?: Record<string, string>
}

export interface VersionCompareProps {
	packageName: string
}

export interface DownloadData {
	date: string
	downloads: number
}

export interface UsageChartProps {
	packageName: string
}

export interface SizeComparisonProps {
	packageName: string
}

export interface SizeInfo {
	minified: number
	gzipped: number
	dependencies: number
}

export interface SimilarPackagesProps {
	packageName: string
	onCompare?: (packages: string[]) => void
}

export interface SimilarPackage {
	name: string
	description: string
	score: number
}

export interface SearchSuggestionsProps {
	searchTerm: string
	onSelectPackage: (packageName: string) => void
}

export interface ScoreChartProps {
	score: {
		detail: {
			quality: number
			popularity: number
			maintenance: number
		}
	}
}

export interface DependencyNode {
	name: string
	version: string
	dependencies?: { [key: string]: DependencyNode }
}

export interface DependencyGraphProps {
	packageName: string
}

export interface FavoritePackage {
	name: string
	version: string
	description: string
	score?: {
		final: number
	}
}

export interface FavoritesListProps {
	onSelectPackage?: (packageName: string) => void
}

export interface MetricsChartProps {
	packageName: string
}

export interface PackageMetrics {
	minified: number
	gzipped: number
	dependencies: number
}

export interface PackageCardInfo {
	name: string
	version: string
	description: string
	publishedAt: string
	repository?: {
		url: string
	}
	dependencies?: Record<string, string>
	downloads?: {
		weekly: number
	}
	score?: {
		final: number
		detail: {
			popularity: number
			quality: number
			maintenance: number
		}
	}
}

export interface PackageCardProps {
	packageInfo: PackageInfo
	onFavoriteChange?: () => void
}

export interface PackageComparisonProps {
	packages: string[]
}

export interface PackageDetails {
	name: string
	version: string
	description: string
	publishedAt: string
	dependencies: number
	downloads?: number
	score?: {
		final: number
		detail?: {
			popularity: number
			quality: number
			maintenance: number
		}
	}
	error?: string
}

export interface SearchSuggestion {
	name: string
	description: string
	score: number
}

export interface NpmSearchResponse {
	package: {
		name: string
		description?: string
	}
	score: {
		final: number
	}
}

export interface ScoreData {
	final: number
	detail: {
		quality: number
		popularity: number
		maintenance: number
	}
}

export interface NpmDownloadData {
	day: string
	downloads: number
}

export interface NpmDownloadItem {
	day: string
	downloads: number
}
