import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
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

// The Cloudflare adapter runs dev/prerender inside workerd, which can't execute
// CommonJS. Pre-bundle CJS-only server dependencies so they load in workerd.
function prebundleCjsDeps() {
	return {
		name: "prebundle-cjs-deps",
		configEnvironment(environment) {
			if (environment !== "client") {
				return {
					optimizeDeps: {
						include: ["klaviyo-api"],
					},
				};
			}
		},
	};
}

export default defineConfig({
	site: "https://marzellusco.com",
	base: config.site.base_path ? config.site.base_path : "/",
	trailingSlash: config.site.trailing_slash ? "always" : "never",
	prefetch: {
		prefetchAll: true,
	},
	output: "server",
	// Astro 7 defaults to "jsx", which drops whitespace between inline elements.
	// Keep the Astro 5 behavior so existing markup renders the same.
	compressHTML: true,
	// Cart state lives in a cookie, so Astro Sessions (and the KV binding the
	// Cloudflare adapter would provision for them) aren't needed.
	session: false,
	vite: {
		plugins: [tailwindcss(), prebundleCjsDeps()],
	},
	adapter: cloudflare({
		imageService: "compile",
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
			zstd: false,
		}),
	],
	markdown: {
		// remark plugins only run on the unified processor (Astro 7 defaults to Sätteri)
		processor: unified({
			remarkPlugins: [
				remarkToc,
				[
					remarkCollapse,
					{
						test: "Table of contents",
					},
				],
			],
		}),
		shikiConfig: {
			theme: "one-dark-pro",
			wrap: true,
		},
	},
});
