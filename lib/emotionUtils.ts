export type EmotionCategory = 'emotion' | 'body'

const BODY_KEYWORDS = [
  'біль',
  'нудота',
  'набряк',
  'печія',
  'судом',
  'сверб',
  'виділення',
  'воруш',
  'поштовх',
  'токсикоз',
  'закреп',
  'здуття',
  'задишк',
  'головний',
  'сухість',
  'ламкість',
  'волос',
  'шкір',
  'ясен',
  'молозив',
  'присмак',
  'металевий',
  'приплив',
  'озноб',
  'запамороч',
  'оніміння',
  'поколюван',
  'тяга до',
  'крейдян',
  'сновид',
  'безсон',
  'сонлив',
  'кошмар',
  'гикавк',
  'скорочення',
  'риніт',
  'пігмент',
  'розтяж',
  'ваги',
  'апетит',
  'зміна смак',
  'зміна лібідо',
  'жирність',
  'важкість',
  'тремтіння',
  'дискомфорт',
  'здуття',
  'чутливість ясен',
]

export const POPULAR_EMOTION_TITLES = [
  'Втома',
  'Радість',
  'Тривога',
  'Ніжність',
  'Нудота',
  'Любов',
  'Спокій',
  'Стрес',
] as const

const EMOTION_EMOJI: Record<string, string> = {
  Апатія: '😶',
  Апетит: '🍽️',
  Бадьорість: '⚡',
  Байдужість: '😐',
  Безсилля: '😩',
  Безсоння: '🌙',
  Безтурботність: '😌',
  Блаженство: '😇',
  'Біль у попереку': '🦴',
  'Біль у спині': '🦴',
  'Біль у тазі': '🦴',
  Важкість: '🪨',
  Вдячність: '🙏',
  Ворушіння: '🤰',
  Вразливість: '🥺',
  Врівноваженість: '⚖️',
  Втома: '😴',
  Відкритість: '🌸',
  Відраза: '🤢',
  Гармонія: '☮️',
  Гнів: '😠',
  'Головний біль': '🤕',
  Гордість: '🦁',
  Депресія: '😔',
  Дискомфорт: '😣',
  Довіра: '🤝',
  Ейфорія: '🤩',
  Енергія: '⚡',
  Єднання: '💞',
  Задоволення: '😊',
  Заздрість: '😒',
  Запаморочення: '😵',
  Захоплення: '🤗',
  Зацікавленість: '🧐',
  Здивування: '😲',
  Здуття: '🎈',
  Любов: '🥰',
  Мотивація: '💪',
  Мрійливість: '💭',
  Набряки: '🦶',
  Надія: '🌟',
  Напруга: '😬',
  Натхнення: '✨',
  Невпевненість: '😟',
  Нервозність: '😰',
  Нудота: '🤢',
  Нудьга: '🥱',
  Ніжність: '🥰',
  Образа: '😤',
  Оптимізм: '🌈',
  Очікування: '👀',
  Паніка: '😱',
  'Перепади настрою': '🎭',
  Печія: '🔥',
  Плаксивість: '😢',
  Полегшення: '😮‍💨',
  Поштовхи: '👶',
  Прийняття: '🤲',
  Провина: '😞',
  Радість: '😄',
  Ревнощі: '💢',
  Роздратування: '😤',
  Розслабленість: '🧘',
  Розтяжки: '〰️',
  Самотність: '🫥',
  Сонливість: '😪',
  Спокій: '😌',
  Страх: '😨',
  Стрес: '😫',
  Сумніви: '🤔',
  Токсикоз: '🤮',
  Тривога: '😣',
  'Туман в голові': '🌫️',
  Умиротворення: '🕊️',
  Хвилювання: '😬',
  Цікавість: '🔍',
  Чутливість: '🌺',
  Щастя: '😁',
  'Ясність думки': '💡',
}

const RECENT_EMOTIONS_KEY = 'recent-emotion-ids'
const MAX_RECENT = 8

export function categorizeEmotion(title: string): EmotionCategory {
  const lower = title.toLowerCase()
  if (BODY_KEYWORDS.some(keyword => lower.includes(keyword))) {
    return 'body'
  }
  return 'emotion'
}

export function getEmotionEmoji(title: string): string {
  return EMOTION_EMOJI[title] ?? '💫'
}

export function getRecentEmotionIds(): string[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = localStorage.getItem(RECENT_EMOTIONS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? parsed.filter(id => typeof id === 'string') : []
  } catch {
    return []
  }
}

export function recordRecentEmotion(emotionId: string): void {
  if (typeof window === 'undefined') return

  const current = getRecentEmotionIds().filter(id => id !== emotionId)
  const next = [emotionId, ...current].slice(0, MAX_RECENT)
  localStorage.setItem(RECENT_EMOTIONS_KEY, JSON.stringify(next))
}
