import {ReactNode} from 'react'
import styles from '@/shared/styles/dashboard.module.css'

interface DashboardLayoutProps {
	sidebar: ReactNode
	map: ReactNode
	header?: ReactNode
}

export function DashboardLayout({sidebar, map, header}: DashboardLayoutProps) {
	return (
		<div className={styles.container}>
			{header && <div className={styles.header}>{header}</div>}
			<div className={styles.content}>
				<aside className={styles.sidebar}>{sidebar}</aside>
				<main className={styles.main}>{map}</main>
			</div>
		</div>
	)
}
