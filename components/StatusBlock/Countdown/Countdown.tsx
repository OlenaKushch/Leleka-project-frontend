import css from './Countdown.module.css'

interface CountdownProps {
  daysLeft: number
}

const Countdown = ({ daysLeft }: CountdownProps) => {
  return (
    <div className={css.statusItem}>
      <p className={css.text}>Залишилось до зустрічі</p>
      <p className={css.value}>{daysLeft} днів</p>
    </div>
  )
}

export default Countdown
