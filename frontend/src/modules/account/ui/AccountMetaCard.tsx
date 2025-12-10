import {AuthUser} from '@/modules/auth'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/shared/components/ui/Card'
import styles from '@/shared/styles/account-page.module.css'
import {useTranslations} from 'next-intl'

interface AccountMetaCardProps {
	user: AuthUser
}

const renderValue = (value?: string | null) =>
	value && value.trim().length > 0 ? value : '—'

export const AccountMetaCard = ({user}: AccountMetaCardProps) => {
	const t = useTranslations('account')

	return (
		<Card>
			<CardHeader>
				<CardTitle className={styles.sectionTitle}>{t('details')}</CardTitle>
			</CardHeader>
			<CardContent className={styles.cardContent}>
				<div className={styles.metaList}>
					<div className={styles.metaItem}>
						<span className={styles.metaLabel}>Имя пользователя</span>
						<span className={styles.metaValue}>{user.username}</span>
					</div>
					<div className={styles.metaItem}>
						<span className={styles.metaLabel}>Имя</span>
						<span className={styles.metaValue}>
							{renderValue(user.first_name)}
						</span>
					</div>
					<div className={styles.metaItem}>
						<span className={styles.metaLabel}>Фамилия</span>
						<span className={styles.metaValue}>
							{renderValue(user.last_name)}
						</span>
					</div>
					<div className={styles.metaItem}>
						<span className={styles.metaLabel}>Телефон</span>
						<span className={styles.metaValue}>{renderValue(user.phone)}</span>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
