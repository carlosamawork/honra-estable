import type { FooterData } from '@/sanity/types'
import { getSettings } from './settings';

export const getFooter = async (): Promise<FooterData> => {
  const settings = await getSettings()
  return {
    footerMenu: settings.footerMenu || {links: []},
    footerSecondaryMenu: settings.footerSecondaryMenu || {links: []},
    claim: settings.claim,
    copyright: settings.copyright,
  }
};
