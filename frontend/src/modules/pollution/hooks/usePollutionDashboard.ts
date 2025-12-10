import {useCallback, useMemo, useState} from 'react'
import {toast} from 'sonner'
import {useAuth} from '@/modules/auth'
import {pollutionApi} from '../api/pollution.api'
import {PollutionStatus} from '../domain/pollution.model'
import {usePollution} from './usePollution'

interface UsePollutionDashboardParams {
	initialStatus?: PollutionStatus
}

export const usePollutionDashboard = ({
	initialStatus = PollutionStatus.REPORTED,
}: UsePollutionDashboardParams = {}) => {
	const {user} = useAuth()
	const [activeStatus, setActiveStatus] = useState<PollutionStatus>(initialStatus)
	const {markers, stats} = usePollution({status: activeStatus})

	const canManage = useMemo(() => {
		const role = user?.role_name ?? user?.role
		return role === 'ACTIVIST' || role === 'ADMIN'
	}, [user?.role, user?.role_name])

	const handleStatusChange = useCallback((status: PollutionStatus) => {
		setActiveStatus(status)
	}, [])

	const handleExport = useCallback(async () => {
		try {
			const blob = await pollutionApi.exportReport()
			const url = window.URL.createObjectURL(blob)
			const link = document.createElement('a')
			link.href = url
			link.download = `pollution-report-${Date.now()}.csv`
			link.click()
			toast.success('Отчет успешно экспортирован')
		} catch {
			toast.error('Не удалось экспортировать отчет')
		}
	}, [])

	return {
		user,
		canManage,
		activeStatus,
		markers,
		stats,
		handleStatusChange,
		handleExport,
	}
}
