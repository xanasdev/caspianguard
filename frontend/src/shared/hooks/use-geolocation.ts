import {useEffect, useState} from 'react'

interface GeolocationState {
	latitude: number | null
	longitude: number | null
	error: string | null
	loading: boolean
}

export const useGeolocation = () => {
	const [location, setLocation] = useState<GeolocationState>(() => {
		if (typeof window === 'undefined' || !navigator.geolocation) {
			return {
				latitude: null,
				longitude: null,
				error: 'Geolocation is not supported by your browser',
				loading: false,
			}
		}
		return {
			latitude: null,
			longitude: null,
			error: null,
			loading: true,
		}
	})

	useEffect(() => {
		if (!navigator.geolocation || location.error) {
			return
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				setLocation({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					error: null,
					loading: false,
				})
			},
			(error) => {
				setLocation({
					latitude: null,
					longitude: null,
					error: error.message,
					loading: false,
				})
			},
		)
	}, [location.error])

	return location
}
