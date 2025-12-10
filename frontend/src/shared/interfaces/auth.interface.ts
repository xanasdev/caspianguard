import { LoginFormData, RegisterFormData } from '@/shared/schemas/auth.schema'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
}

export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void
  isLoading: boolean
}

export interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void
  isLoading: boolean
}
