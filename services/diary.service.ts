import { apiClient } from '@/lib/apiClient'
import { DiaryEntry, Emotion } from '@/interfaces/diary'

export interface DiaryEntryDTO {
  title: string
  emotions: string[]
  description: string
}

export const DiaryService = {

  async getEntries(): Promise<DiaryEntry[]> {
    const { data } = await apiClient.get<DiaryEntry[]>('/diaries/me')
    return data
  },

  async getEmotions(): Promise<Emotion[]> {
    const { data } = await apiClient.get<Emotion[]>('/emotions')
    return data
  },

  async createEntry(payload: DiaryEntryDTO): Promise<DiaryEntry> {
    const { data } = await apiClient.post<DiaryEntry>('/diaries/me', payload)
    return data
  },

  async updateEntry(id: string, payload: DiaryEntryDTO): Promise<DiaryEntry> {
    const { data } = await apiClient.patch<DiaryEntry>(`/diaries/me/${id}`, payload)
    return data
  },

  async deleteEntry(id: string): Promise<void> {
    await apiClient.delete(`/diaries/me/${id}`)
  },
}