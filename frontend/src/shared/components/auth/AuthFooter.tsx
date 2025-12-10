import Link from 'next/link'
import styles from '@/shared/styles/auth.module.css'

interface AuthFooterProps {
  text: string
  linkText: string
  linkHref: string
}

export function AuthFooter({ text, linkText, linkHref }: AuthFooterProps) {
  return (
    <p className={styles.footer}>
      {text}{' '}
      <Link href={linkHref} className={styles.link}>
        {linkText}
      </Link>
    </p>
  )
}
