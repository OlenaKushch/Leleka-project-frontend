import css from './mom-tip-card.module.css'

interface momDailyTipsProps {
  tipIndex: number
  momDailyTips: string[]
}
export const MomTipCard = ({ tipIndex, momDailyTips = [] }: momDailyTipsProps) => {
  return (
    <section className={css.card}>
      <h2 className={css.title}>Порада для мами</h2>
      <p className={css.text}>
        {momDailyTips[tipIndex] ? momDailyTips[tipIndex] : 'Порада відсутня'}
      </p>
    </section>
  )
}
