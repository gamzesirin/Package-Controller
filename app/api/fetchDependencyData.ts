import fetch from 'cross-fetch'

interface DependencyNode {
	name: string
	version: string
	dependencies?: { [key: string]: DependencyNode }
}

export async function fetchDependencyData(packageName: string): Promise<DependencyNode> {
	try {
		const response = await fetch(`https://registry.npmjs.org/${packageName}/latest`)
		const data = await response.json()

		const dependencies = data.dependencies || {}

		return {
			name: packageName,
			version: data.version,
			dependencies: dependencies
		}
	} catch (error) {
		console.error('Bağımlılık verileri alınırken hata:', error)
		throw error
	}
}
