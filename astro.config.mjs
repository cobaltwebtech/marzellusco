import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import minify from "@playform/compress";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import AutoImport from "astro-auto-import";
import compressor from "astro-compressor";
import remarkCollapse from "remark-collapse";
import remarkToc from "remark-toc";
import config from "./src/config/config.json";

export default defineConfig({
	site: "https://marzellusco.com",
	base: config.site.base_path ? config.site.base_path : "/",
	trailingSlash: config.site.trailing_slash ? "always" : "never",
	prefetch: {
		prefetchAll: true,
	},
	output: "server",
	vite: {
		plugins: [tailwindcss()],
	},
	adapter: cloudflare({
		imageService: "compile",
		platformProxy: {
			enabled: true,
		},
	}),
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
});
