import css from './baby-today-card.module.css'
import Image from 'next/image'

interface BabyTodayCardProp {
  image: string
  imageAlt: string
  babySize: number
  babyWeight: number
  babyActivity: string
  babyDevelopment: string
}

export const BabyTodayCard = ({
  image,
  imageAlt,
  babySize,
  babyWeight,
  babyActivity,
  babyDevelopment,
}: BabyTodayCardProp) => {
  return (
    <section className={css.card}>
      <h2 className={css.title}>Малюк сьогодні</h2>
      <div className={css.imageWrapper}>
        <Image src={image} alt={imageAlt} fill sizes="(max-width: 767px) 287px, 273px" />
      </div>
      {imageAlt && (
        <p className={css.analogy}>Ваш малюк зараз розміром з {imageAlt}</p>
      )}
      <div className={css.stats}>
        <p>
          <span className={css.label}>Розмір:</span> приблизно {babySize} см
        </p>
        <p>
          <span className={css.label}>Вага:</span> близько {babyWeight} грамів
        </p>
        <p>
          <span className={css.label}>Активність:</span> {babyActivity}
        </p>
      </div>
      {babyDevelopment && babyDevelopment !== imageAlt && (
        <p className={css.text}>{babyDevelopment}</p>
      )}
    </section>
  )
}
