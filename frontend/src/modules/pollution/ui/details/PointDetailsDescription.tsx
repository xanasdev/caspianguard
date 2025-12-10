interface PointDetailsDescriptionProps {
	description: string
}

import {useTranslations} from 'next-intl'

export const PointDetailsDescription = ({description}: PointDetailsDescriptionProps) => {
	const t = useTranslations('home.details')
	return (
		<section className='space-y-3 rounded-lg border border-border bg-muted/30 p-4'>
			<h4 className='text-sm font-semibold uppercase tracking-wide text-muted-foreground'>{t('descriptionTitle')}</h4>
			<p className='text-sm leading-relaxed text-foreground'>{description}</p>
		</section>
	)
}
