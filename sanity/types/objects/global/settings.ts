// sanity/types/objects/global/settings.ts

import { SEO } from '../seo';
import type { Menu } from './menu';

export type SettingsData = {
  headerMenu?: Menu;
  footerMenu?: Menu;
  footerSecondaryMenu?: Menu;
  claim?: string;
  copyright?: string;
  seo: SEO;
};
