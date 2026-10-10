import type { LabelsData, CookieData, NotFoundData } from '@/sanity/types'
import { getSettings } from './settings'

export async function getLabels(): Promise<LabelsData> {
  const settings = await getSettings()
  return settings.labels ?? {}
}

export async function getCookieConsent(): Promise<CookieData> {
  const settings = await getSettings()
  return settings.cookies ?? {}
}

export async function getNotFoundPage(): Promise<NotFoundData> {
  const settings = await getSettings()
  return settings.notFoundPage ?? {}
}
