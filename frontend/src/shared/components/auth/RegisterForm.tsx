import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, RegisterFormData } from '@/shared/schemas/auth.schema'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Label } from '@/shared/components/ui/Label'
import styles from '@/shared/styles/form.module.css'

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void
  isLoading: boolean
}

export function RegisterForm({ onSubmit, isLoading }: RegisterFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.formGroup}>
        <Label htmlFor="username">Username</Label>
        <Input {...register('username')} placeholder="username" />
        {errors.username && <p className={styles.errorText}>{errors.username.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <Label htmlFor="email">Email</Label>
        <Input {...register('email')} type="email" placeholder="your@email.com" />
        {errors.email && <p className={styles.errorText}>{errors.email.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <Label htmlFor="password">Password</Label>
        <Input {...register('password')} type="password" placeholder="••••••••" />
        {errors.password && <p className={styles.errorText}>{errors.password.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <Label htmlFor="password_confirm">Confirm Password</Label>
        <Input {...register('password_confirm')} type="password" placeholder="••••••••" />
        {errors.password_confirm && <p className={styles.errorText}>{errors.password_confirm.message}</p>}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Creating account...' : 'Create Account'}
      </Button>
    </form>
  )
}
