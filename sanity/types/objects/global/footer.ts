// sanity/types/objects/global/footer.ts

import type { Menu } from './menu';
import type { BrandImage } from './brand';

export type FooterData = {
  footerMenu?: Menu;
  footerSecondaryMenu?: Menu;
  claim?: string | null;
  copyright?: string | null;
  logoFooter?: BrandImage | null;
  socialHandle?: string | null;
  socialUrl?: string | null;
  contactEmail?: string | null;
};
