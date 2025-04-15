import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import { ScoreChartProps } from '../types'

export default function ScoreChart({ score }: ScoreChartProps) {
	const data = [
		{
			subject: 'Kalite',
			score: Math.round(score.detail.quality * 100)
		},
		{
			subject: 'Popülerlik',
			score: Math.round(score.detail.popularity * 100)
		},
		{
			subject: 'Bakım',
			score: Math.round(score.detail.maintenance * 100)
		}
	]

	return (
		<div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
			<h3 className="text-lg font-semibold mb-4 dark:text-white">Kalite Metrikleri</h3>
			<div className="h-64">
				<ResponsiveContainer width="100%" height="100%">
					<RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
						<PolarGrid stroke="#374151" />
						<PolarAngleAxis dataKey="subject" tick={{ fill: '#6B7280' }} />
						<Radar name="Skor" dataKey="score" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
					</RadarChart>
				</ResponsiveContainer>
			</div>
		</div>
	)
}
