"use client";
import { useEffect, useMemo, useState } from "react";

import Image from "next/image";
import { useInView } from "react-intersection-observer";
import s from "./LazyImage.module.scss";
import { urlFor } from "@/sanity/queries";
import { sanitizeFilename } from "@/utils/sanitizeFilename";

import { BASE_IMAGE_URL, BASE_IMAGE_WIDTH, BASE_IMAGE_HEIGHT, siteTitle } from "@/utils/seoHelper";

interface LazyImageProps {
    alt?: string;
    src: string;
    blurDataURL?: string;
    width: number;
    height: number;
    defaultInView?: boolean;
    disableOpacityAnimation?: boolean;
    backgroundColor?: string | null;
    fullHeight?: boolean;
    fullWidth?: boolean;
    fill?: boolean;
    sizes?: string;
    aspectRatio?: string;
    objectFit?: string;
    reference?: any;
    filename?: string;
    ignoreRichResults?: boolean;
}



// Modifica tu componente LazyImage
export default function LazyImage({
    alt = "",
    src = "",
    blurDataURL = "",
    width,
    height,
    defaultInView = true,
    disableOpacityAnimation = false,
    backgroundColor = "white",
    fullHeight = false,
    fullWidth = false,
    fill = false,
    sizes = "",
    aspectRatio,
    objectFit = "",
    reference,
    filename = "",
    ignoreRichResults = false
}: LazyImageProps) {
    const [loaded, setLoaded] = useState(false);
    const [inViewCheck, setInViewCheck] = useState(defaultInView);
    const { ref, inView } = useInView({
        threshold: 0.1,
        triggerOnce: true,
        initialInView: defaultInView,
    });

    useEffect(() => {
        setInViewCheck(inView);
    }, [inView]);

    const placeholderColor = backgroundColor == "darkgreen" ? "lightgreen" : "none";

    const memoizedBlurDataURL = useMemo(() => {
        return blurDataURL
            ? urlFor(blurDataURL)
                .width(width)
                .height(height)
                .blur(20)
                .url()
            : '/blur.png';
    }, [blurDataURL, width, height]);




    return (
        <div className={s.lazyImage} ref={reference}>
            <div
                ref={ref}
                style={{
                    width: "100%",
                    transition: "all 0.3s ease",
                    // opacity: loaded || disableOpacityAnimation ? 1 : 0,
                }}
                className={`${s.contentImage} ${loaded ? s.unblur : s.blur}`} // Apply unblur class when loaded is true
            >
                {/* Schema Markup for Rich Results */}
                {!ignoreRichResults && <script type="application/ld+json" dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ImageObject",
                        "name": alt ? alt : filename ? sanitizeFilename(filename) : siteTitle,
                        "caption": alt ? alt : filename ? sanitizeFilename(filename) : siteTitle,
                        "description": alt ? alt : filename ? sanitizeFilename(filename) : siteTitle,
                        "url": src,
                        "contentUrl": src,
                        "thumbnailUrl": src,
                        "width": width,
                        "height": height,
                    }),
                }} />
                }
                {fill ? (
                    <Image
                        alt={alt ? alt : filename ? sanitizeFilename(filename) : ""}
                        src={src}
                        placeholder={"blur"}
                        blurDataURL={memoizedBlurDataURL}
                        fill={true}
                        // objectFit={objectFit ? objectFit : "cover"}
                        sizes={sizes ? sizes : ""}
                        className={`${s.image} ${objectFit ? s[objectFit] : s.cover}`}
                        onLoad={() => setLoaded(true)} // Set loaded to true when loading completes
                        style={{
                            transition: "all 0.3s ease",
                            opacity: 1,
                            aspectRatio: aspectRatio ? aspectRatio : "",
                            objectFit: (objectFit ? objectFit : "fill") as React.CSSProperties["objectFit"]
                        }}
                    />
                ) : (
                    <Image
                        alt={alt ? alt : filename ? sanitizeFilename(filename) : ""}
                        src={src}
                        width={width}
                        height={height}
                        placeholder={"blur"}
                        blurDataURL={memoizedBlurDataURL}
                        className={s.image}
                        onLoad={() => setLoaded(true)} // Set loaded to true when loading completes
                        style={{
                            transition: "all 0.3s ease",
                            opacity: 1,
                            height: fullHeight ? "100%" : "",
                            width: fullWidth ? "100%" : "",
                            aspectRatio: aspectRatio ? aspectRatio : "",
                            objectFit: (objectFit ? objectFit : "fill") as React.CSSProperties["objectFit"]
                        }}
                    />
                )}
            </div>
        </div>
    );
}
