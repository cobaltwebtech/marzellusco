import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const markdownIn = (dir: string) =>
	glob({ pattern: "**/*.{md,mdx}", base: `./src/content/${dir}` });

export const collections = {
	about: defineCollection({ loader: markdownIn("about") }),
	policies: defineCollection({ loader: markdownIn("policies") }),
	sections: defineCollection({ loader: markdownIn("sections") }),
};
