// sanity/types/objects/global/footer.ts

import type { Menu } from './menu';

export type FooterData = {
  footerMenu?: Menu;
  footerSecondaryMenu?: Menu;
  claim?: string;
  copyright?: string;
};
