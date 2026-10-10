// sanity/types/objects/global/settings.ts

import { SEO } from '../seo';
import type { Menu } from './menu';
import type { BrandData, CookieData, LabelsData, NotFoundData } from './brand';

export type SettingsData = {
  headerMenu?: Menu;
  footerMenu?: Menu;
  footerSecondaryMenu?: Menu;
  claim?: string | null;
  copyright?: string | null;
  brand?: BrandData | null;
  labels?: LabelsData | null;
  cookies?: CookieData | null;
  notFoundPage?: NotFoundData | null;
  seo: SEO;
};
