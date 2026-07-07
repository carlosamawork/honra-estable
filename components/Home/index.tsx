'use client';

import { PortableText } from '@portabletext/react';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import s from './Home.module.scss';
import { portableBlockComponents } from '@/utils/portableText/portableText';
import LazyImage from '../Common/LazyImage';

type SanityImage = {
  imageUrl?: string;
  alt?: string;
  metadata: {
    dimensions: {
      width: number;
      height: number;
    };
  };
};

type Hero = {
  image?: SanityImage;
  logo?: SanityImage;
};

type ProductItem = {
  _key?: string;
  _type?: string;
  title?: string;
  handle?: string | null;
  color?: string | null;
  featuredImage?: string;
  price?: number;
};

type ImageItem = {
  _key?: string;
  _type?: 'imageItem';
  image?: SanityImage;
};

type TextItem = {
  _key?: string;
  _type?: 'textItem';
  body?: any[];
};

type ModuleItem = ProductItem | ImageItem | TextItem;

type HomeModule = {
  _key?: string;
  columns?: number;
  height?: 'auto' | 'medium' | 'full' | string;
  items?: ModuleItem[];
};

type HomeData = {
  hero?: Hero;
  modules?: HomeModule[];
};

type HomeProps = {
  data?: HomeData;
};

const formatPrice = (value?: number) => {
  if (typeof value !== 'number') return '';
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
};

const getHeightClass = (height?: string) => {
  if (height === 'full') return s.isFull;
  if (height === 'medium') return s.isMedium;
  return s.isAuto;
};

export default function HomeComponent({ data }: HomeProps) {
  const hero = data?.hero;
  const modules = data?.modules || [];

  console.log('Home data:', data);

  return (
    <div className={s.home}>
      <section
        className={s.hero}
        style={
          hero?.image?.imageUrl
            ? ({ '--hero-bg': `url(${hero.image.imageUrl})` } as CSSProperties)
            : undefined
        }
      >
        {hero?.logo?.imageUrl ? (
          <img className={s.heroLogo} src={hero.logo.imageUrl} alt={hero.logo.alt || 'Logo'} />
        ) : (
          <div className={s.heroLogoFallback} aria-hidden />
        )}
      </section>

      {modules.map((module, moduleIndex) => {
        const columns = Math.min(Math.max(module.columns || 1, 1), 8);
        const moduleHeightClass = getHeightClass(module.height);

        return (
          <section
            key={module._key || `module-${moduleIndex}`}
            className={`${s.module} ${moduleHeightClass}`}
            style={
              {
                '--module-columns': columns,
                '--module-columns-mobile': Math.min(columns, 2),
              } as CSSProperties
            }
          >
            {(module.items || []).map((item, itemIndex) => {
              const key = item._key || `item-${itemIndex}`;
              const isImage = item._type === 'imageItem';
              const isText = item._type === 'textItem';
              const isProduct = !isImage && !isText;
              const imageItem = item as ImageItem;
              const textItem = item as TextItem;
              const productItem = item as ProductItem;

              return (
                <article key={key} className={`${s.moduleItem} ${isImage ? s.imageModuleItem : ''}`}>
                  {isImage && (
                    <div className={s.imageItem}>
                      {imageItem.image?.imageUrl ? (
                        <LazyImage
                          src={imageItem.image.imageUrl}
                          alt={imageItem.image.alt || ''}
                          width={imageItem.image.metadata.dimensions.width}
                          height={imageItem.image.metadata.dimensions.height}
                          fill={true}
                          sizes={
                            columns > 1
                              ? `(max-width: 768px) 50vw, ${Math.round(100 / columns)}vw`
                              : '100vw'
                          }
                          objectFit="cover"
                         />
                      ) : (
                        <div className={s.imageFallback} />
                      )}
                    </div>
                  )}

                  {isText && (
                    <div className={s.textItem}>
                      <PortableText value={textItem.body || []} components={portableBlockComponents()} />
                    </div>
                  )}

                  {isProduct && (() => {
                    const productContent = (
                      <>
                        <div className={s.productItem}>
                          {productItem.featuredImage ? (
                            <LazyImage
                              src={productItem.featuredImage}
                              alt={
                                productItem.color
                                  ? `${productItem.title || 'Product'} — ${productItem.color}`
                                  : productItem.title || 'Product image'
                              }
                              width={500}
                              height={500}
                              fill={true}
                              sizes={
                                columns > 1
                                  ? `(max-width: 768px) 100vw, ${Math.round(100 / columns)}vw`
                                  : '100vw'
                              }
                              objectFit='cover'
                            />
                          ) : (
                            <div className={s.imageFallback} />
                          )}
                        </div>
                        <div className={s.productInfo}>
                          <h3>{productItem.title || 'Product'}</h3>
                          {/* <p>{formatPrice(productItem.price)}</p> */}
                        </div>
                      </>
                    );

                    return productItem.handle ? (
                      <Link
                        className={s.productLink}
                        href={
                          productItem.color
                            ? `/products/${productItem.handle}?color=${encodeURIComponent(productItem.color)}`
                            : `/products/${productItem.handle}`
                        }
                      >
                        {productContent}
                      </Link>
                    ) : (
                      productContent
                    );
                  })()}
                </article>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}
