import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import sentry from "@sentry/astro";
import AutoImport from "astro-auto-import";
import { defineConfig } from "astro/config";
import remarkCollapse from "remark-collapse";
import remarkToc from "remark-toc";
import config from "./src/config/config.json";
import vercel from "@astrojs/vercel";
import minify from "@playform/compress";
import compressor from "astro-compressor";

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
	site: config.site.base_url ? config.site.base_url : "https://marzellusco.com",
	base: config.site.base_path ? config.site.base_path : "/",
	trailingSlash: config.site.trailing_slash ? "always" : "never",
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	prefetch: {
		prefetchAll: true,
	},
	output: "server",
	image: {},
	vite: {
		plugins: [tailwindcss()],
	},
	integrations: [
		react(),
		sitemap(),
		AutoImport({
			imports: [
				"@/shortcodes/Button",
				"@/shortcodes/Accordion",
				"@/shortcodes/Notice",
				"@/shortcodes/Video",
				"@/shortcodes/Youtube",
				"@/shortcodes/Tabs",
				"@/shortcodes/Tab",
			],
		}),
		mdx(),
		...(isProduction
			? [
					sentry({
						dsn: "https://74506a8a8661472c034c2d02ccb0f25f@o4508880993058816.ingest.us.sentry.io/4509155007070208",
						tracesSampleRate: 0,
						replaysSessionSampleRate: 0,
						replaysOnErrorSampleRate: 0,
						sourceMapsUploadOptions: {
							project: "marzellus",
							authToken: process.env.SENTRY_AUTH_TOKEN,
						},
					}),
				]
			: []),
		minify({
			CSS: false,
			HTML: true,
			Image: false,
			JavaScript: false,
			SVG: true,
		}),
		compressor({
			gzip: false,
			brotli: true,
		}),
	],
	markdown: {
		remarkPlugins: [
			remarkToc,
			[
				remarkCollapse,
				{
					test: "Table of contents",
				},
			],
		],
		shikiConfig: {
			theme: "one-dark-pro",
			wrap: true,
		},
		extendDefaultPlugins: true,
	},
	adapter: vercel({
		imageService: true,
		webAnalytics: {
			enabled: true,
		},
	}),
});
