import type { APIRoute } from "astro";

interface Favicon {
	purpose: "any" | "maskable";
	sizes: number[];
}

const sizes = [192, 512];
const favicons: Favicon[] = [
	{
		purpose: "any",
		sizes,
	},
	{
		purpose: "maskable",
		sizes,
	},
];

export const GET: APIRoute = async () => {
	const icons = favicons.flatMap((favicon) =>
		sizes.map((size) => ({
			src: `/icons/${favicon.purpose}-${size}.png`,
			sizes: `${size}x${size}`,
			type: "image/png",
			purpose: favicon.purpose,
		})),
	);

	const manifest = {
		short_name: "Marzellus",
		name: "Marzellus",
		icons,
		display: "minimal-ui",
		id: "/",
		start_url: "/",
		theme_color: "#262626",
		background_color: "#404040",
	};

	return new Response(JSON.stringify(manifest));
};
