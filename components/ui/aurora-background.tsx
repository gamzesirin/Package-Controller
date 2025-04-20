'use client'

import { cn } from '@/lib/utils'
import React, { ReactNode, memo, useEffect, useState } from 'react'

interface AuroraBackgroundProps {
	children: ReactNode
	className?: string
	showRadialGradient?: boolean
}

const AuroraBackgroundComponent = ({ className, children, showRadialGradient = true }: AuroraBackgroundProps) => {
	const [isMobile, setIsMobile] = useState(false)

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768)
		}
		checkMobile()
		window.addEventListener('resize', checkMobile)
		return () => window.removeEventListener('resize', checkMobile)
	}, [])

	return (
		<div className={cn('relative w-full', className)}>
			{!isMobile && (
				<div className="absolute inset-0 overflow-hidden">
					<div
						className={cn(
							`
							[--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)]
							[background-image:var(--aurora)]
							[background-size:200%]
							[background-position:50%_50%]
							filter blur-[20px]
							after:content-[""] after:absolute after:inset-0 
							after:[background-image:var(--aurora)]
							after:[background-size:200%] 
							after:animate-aurora-optimized after:[background-attachment:fixed]
							pointer-events-none
							absolute -inset-[10px] opacity-40
							will-change-transform
							translate-z-0`,
							showRadialGradient && '[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]'
						)}
						style={{
							transform: 'translate3d(0,0,0)',
							backfaceVisibility: 'hidden',
							perspective: 1000,
							WebkitFontSmoothing: 'antialiased'
						}}
					/>
				</div>
			)}
			<div
				className={cn(
					'relative z-10',
					isMobile && 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800'
				)}
			>
				{children}
			</div>
		</div>
	)
}

export const AuroraBackground = memo(AuroraBackgroundComponent)
