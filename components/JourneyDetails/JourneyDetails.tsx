'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import TasksReminderCard from '../tasks/TasksReminderCard'
import css from './JourneyDetails.module.css'
import { apiClient } from '@/lib/apiClient'
import { Loader } from '@/components/Loader/Loader'
import { BabyInfo, MomInfo } from '@/types/babyData'

interface JourneyDetailsProps {
  weekNumber: number
}

type Tab = 'baby' | 'mom'

type ApiError = {
  response?: { status?: number }
}

export default function JourneyDetails({ weekNumber }: JourneyDetailsProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<number | null>(null)
  const [tab, setTab] = useState<Tab>('baby')
  const [babyData, setBabyData] = useState<BabyInfo | null>(null)
  const [momData, setMomData] = useState<MomInfo | null>(null)

  useEffect(() => {
    if (!weekNumber) return

    const fetchData = async () => {
      setLoading(true)
      setError(null)
      if (tab === 'baby') {
        setBabyData(null)
      } else {
        setMomData(null)
      }

      try {
        const res = await apiClient.get(`/weeks/me/journey/${tab}/${weekNumber}`)
        console.log('DATA FROM BACK:', res.data)
        if (tab === 'baby') {
          setBabyData(res.data)
        } else {
          setMomData(res.data)
        }
      } catch (e) {
        const err = e as ApiError
        setMomData(null)
        setBabyData(null)
        setError(err.response?.status ?? 500)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [weekNumber, tab])

  return (
    <section className={css.container}>
      <div className={css.tabsplug}>
        <button
          type="button"
          className={`${css.tabbutton} ${tab === 'baby' ? css.active : ''}`}
          onClick={() => setTab('baby')}
          disabled={loading}
        >
          Розвиток малюка
        </button>
        <button
          type="button"
          className={`${css.tabbutton} ${tab === 'mom' ? css.active : ''}`}
          onClick={() => setTab('mom')}
          disabled={loading}
        >
          Тіло мами
        </button>
      </div>
      {loading && <Loader />}
      {!loading && error && <div style={{ padding: 16 }}>Error {error}</div>}

      {tab === 'baby'  && babyData && (
        <div className={css.babytab}>
          <div className={css.imagebox}>
            <Image
              className={css.picture}
              src={babyData.image}
              alt={babyData.imageAlt ?? 'fruit like'}
              width={287}
              height={379}
            />
            <p className={css.textinfo}>Ваш малюк зараз розміом з {babyData.analogy}</p>
          </div>

          <div className={css.infobox}>
            <p className={css.textinfo}>{babyData.babyActivity}</p>
            <p className={css.textinfo}>{babyData?.babyDevelopment}</p>
          </div>
          <div className={css.factbox}>
            <p className={css.facttitle}>
              <svg className={css.facticon} width={21} height={18}>
                <use href="/icons/star-journey.svg" />
              </svg>
              Цікавий факт з життя
            </p>
            <p className={css.textinfo}>{babyData.interestingFact}</p>
          </div>
        </div>
      )}

      {tab === 'mom' && momData && (
        <div className={css.momtab}>
          <div className={css.itembox}>
            <p className={css.title}>Як ви можете почуватись</p>
            <div className={css.feelingsbox}>
              {momData?.feelings.states.map((state: string, index: number) => {
                return (
                  <div key={index} className={css.feeling}>
                    {state}
                  </div>
                )
              })}
            </div>
            <p className={css.textinfo}>{momData?.feelings.sensationDescr}</p>
          </div>
          <div className={css.itembox}>
            <p className={css.title}>Поради для вашого комфорту</p>
            <div className={css.categorybox}>
              <div className={css.wrap}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.73162 22.1497C6.48996 22.1497 6.28829 22.0679 6.12663 21.9042C5.96513 21.7406 5.88438 21.5385 5.88438 21.298V12.7712C4.88654 12.5211 4.10163 12.0478 3.52963 11.3515C2.95779 10.6551 2.67188 9.84039 2.67188 8.90723V2.67848C2.67188 2.44481 2.75229 2.24748 2.91313 2.08648C3.07396 1.92531 3.27104 1.84473 3.50437 1.84473C3.73771 1.84473 3.93421 1.92531 4.09387 2.08648C4.25337 2.24748 4.33313 2.44481 4.33313 2.67848V8.05573H5.90813V2.67848C5.90813 2.44481 5.98863 2.24748 6.14963 2.08648C6.31046 1.92531 6.50754 1.84473 6.74087 1.84473C6.97421 1.84473 7.17062 1.92531 7.33012 2.08648C7.48979 2.24748 7.56963 2.44481 7.56963 2.67848V8.05573H9.16963V2.67848C9.16963 2.44481 9.25004 2.24748 9.41087 2.08648C9.57188 1.92531 9.76904 1.84473 10.0024 1.84473C10.2357 1.84473 10.4321 1.92531 10.5916 2.08648C10.7513 2.24748 10.8311 2.44481 10.8311 2.67848V8.89548C10.8311 9.83231 10.5431 10.6459 9.96712 11.3362C9.39129 12.0267 8.59812 12.5028 7.58763 12.7645V21.298C7.58763 21.5385 7.50537 21.7406 7.34087 21.9042C7.17637 22.0679 6.97329 22.1497 6.73162 22.1497ZM17.3371 22.1497C17.0958 22.1497 16.8943 22.0679 16.7326 21.9042C16.5711 21.7406 16.4904 21.5385 16.4904 21.298V12.3397C15.5364 12.0001 14.7742 11.3689 14.2039 10.4462C13.6335 9.52356 13.3484 8.43156 13.3484 7.17023C13.3484 5.68956 13.7383 4.43181 14.5181 3.39698C15.2981 2.36214 16.2394 1.84473 17.3419 1.84473C18.4445 1.84473 19.3858 2.36389 20.1656 3.40223C20.9455 4.44073 21.3354 5.69673 21.3354 7.17023C21.3354 8.42923 21.0502 9.52156 20.4799 10.4472C19.9097 11.3731 19.1496 12.0126 18.1996 12.366V21.298C18.1996 21.5385 18.1162 21.7406 17.9494 21.9042C17.7824 22.0679 17.5783 22.1497 17.3371 22.1497Z"
                    fill="black"
                  />
                </svg>
                <p className={css.category}>Харчування</p>
              </div>
              <p className={css.categorydescr}>{momData?.comfortTips[0].tip}</p>
            </div>

            <div className={css.categorybox}>
              <div className={css.wrap}>
                <svg className={css.facticon} width={22} height={22}>
                  <use href="/icons/chair.svg" />
                </svg>

                <p className={css.category}>Активність</p>
              </div>
              <p className={css.categorydescr}>{momData?.comfortTips[1].tip}</p>
            </div>

            <div className={css.categorybox}>
              <div className={css.wrap}>
                <svg className={css.facticon} width={22} height={22}>
                  <use href="/icons/fitness_center.svg" />
                </svg>

                <p className={css.category}>Відпочинок</p>
              </div>
              <p className={css.categorydescr}>{momData?.comfortTips[2].tip}</p>
            </div>
          </div>

          <TasksReminderCard />
        </div>
      )}
    </section>
  )
}
