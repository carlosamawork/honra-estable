// lib/seoHelper.js

// 🧭 Determine the base URL depending on the environment
export const BASE_URL = new URL(
	process.env.NODE_ENV === "production"
		? "https://www.ama.work"
		: "https://staging.ama.work"
);

// 🧱 Helper function for consistent URL creation
export const buildUrl = (path = "/") => new URL(path, BASE_URL).toString();

// 🌍 Global site metadata
export const siteTitle = "SITE TITLE TO SET";
export const siteDescription =
	"SITE DESCRIPTION TO SET";

// ⚠️ Warn developer if siteTitle or siteDescription are not set
if (process.env.NODE_ENV === "development") {
	if (BASE_URL.href.includes("ama")) {
		console.warn(
			"%c⚠️ You should update BASE_URL in lib/seoHelper.js with your project URL!",
			"color: orange; font-weight: bold;"
		);
	}
	if (siteTitle === "SITE TITLE TO SET") {
		console.warn(
			"%c⚠️ You should update siteTitle in lib/seoHelper.js with your project name and information!",
			"color: orange; font-weight: bold;"
		);
	}
	if (siteDescription === "SITE DESCRIPTION TO SET") {
		console.warn(
			"%c⚠️ You should update siteDescription in lib/seoHelper.js with your project description!",
			"color: orange; font-weight: bold;"
		);
	}
}

// 🔗 Social & canonical links
export const linkInstagram = "https://www.instagram.com/ama.work_/";
export const canonicalStudio = buildUrl("/studio");
export const canonicalHome = buildUrl("/");
export const canonicalAbout = buildUrl("/about"); // example if needed

// 🖼️ Images & favicons
export const BASE_IMAGE_URL = buildUrl("/images/cc_ama_fbshare_1200x800.jpg");
export const BASE_IMAGE_WIDTH = 1200;
export const BASE_IMAGE_HEIGHT = 800;

export const FAVICON_CLEAR = buildUrl("/favicon/favicon_clear.png");
export const FAVICON_DARK = buildUrl("/favicon/favicon_dark.png");

export function getFavicons() {
	return {
		icon: [
			{ media: '(prefers-color-scheme: light)', url: FAVICON_CLEAR, href: FAVICON_CLEAR },
			{ media: '(prefers-color-scheme: dark)', url: FAVICON_DARK, href: FAVICON_DARK },
		],
		shortcut: FAVICON_CLEAR,
		apple: FAVICON_CLEAR,
		other: { rel: 'apple-touch-icon-precomposed', url: FAVICON_CLEAR },
	};
}

export function formatSlug(slug: string) {
	if (!slug) return '';
	// Replace dashes/underscores with spaces and capitalize first letter of each word
	return slug
		.replace(/[-_]/g, ' ')
		.replace(/\b\w/g, (c) => c.toUpperCase());
}