import css from './CurrentWeek.module.css'

interface CurrentWeekProps {
  week: number
}

const CurrentWeek = ({ week }: CurrentWeekProps) => {
  return (
    <div className={css.statusItem}>
      <p className={css.text}>Поточний термін</p>
      <p className={css.value}>{week} тиждень</p>
    </div>
  )
}

export default CurrentWeek
