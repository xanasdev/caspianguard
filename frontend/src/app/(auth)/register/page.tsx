'use client'

import {useAuth} from '@/modules/auth'
import {AuthCard, AuthFooter, RegisterForm} from '@/modules/auth/ui'
import {RegisterFormData} from '@/shared/schemas/auth.schema'

export default function RegisterPage() {
	const {register: registerUser, isRegisterLoading} = useAuth()

	const handleSubmit = (data: RegisterFormData) => {
		registerUser(data)
	}

	return (
		<AuthCard
			title='Create Account'
			subtitle='Join us in cleaning the Caspian Sea'
		>
			<RegisterForm onSubmit={handleSubmit} isLoading={isRegisterLoading} />
			<AuthFooter
				text='Already have an account?'
				linkText='Sign in'
				linkHref='/login'
			/>
		</AuthCard>
	)
}
