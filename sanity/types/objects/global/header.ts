// sanity/types/objects/global/header.ts

import type { Menu } from './menu';
import type { BrandImage } from './brand';

export type HeaderData = {
  headerMenu: Menu;
  logo?: BrandImage | null;
  cartLabel?: string | null;
};
