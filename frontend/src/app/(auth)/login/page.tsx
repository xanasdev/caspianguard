'use client'

import {useAuth} from '@/modules/auth'
import {AuthCard, AuthFooter, LoginForm} from '@/modules/auth/ui'
import {LoginFormData} from '@/shared/schemas/auth.schema'

export default function LoginPage() {
	const {login, isLoginLoading} = useAuth()

	const handleSubmit = (data: LoginFormData) => {
		login(data)
	}

	return (
		<AuthCard title='Welcome Back' subtitle='Sign in to your account'>
			<LoginForm onSubmit={handleSubmit} isLoading={isLoginLoading} />
			<AuthFooter
				text="Don't have an account?"
				linkText='Register'
				linkHref='/register'
			/>
		</AuthCard>
	)
}
