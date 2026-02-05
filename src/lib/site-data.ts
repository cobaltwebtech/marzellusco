export const siteMeta = {
	title: "Marzellus",
	tagline: "Giving luxury back its meaning",
	description:
		"Marzellus focuses on creating high-quality, timeless fashion pieces that transcend temporary trends.",
	description_short:
		"Marzellus focuses on creating high-quality, timeless fashion pieces that transcend temporary trends.",
	url: "https://marzellus.com/",
	author: "Marzellus",
};

export const seoMeta = {
	title: siteMeta.title,
	description: siteMeta.description,
	structuredData: {
		"@context": "https://schema.org",
		"@type": "WebPage",
		inLanguage: "en-US",
		"@id": siteMeta.url,
		url: siteMeta.url,
		name: siteMeta.title,
		description: siteMeta.description,
		isPartOf: {
			"@type": "WebSite",
			url: siteMeta.url,
			name: siteMeta.title,
			description: siteMeta.description,
		},
	},
};

export const openGraph = {
	locale: "en_US",
	type: "website",
	url: siteMeta.url,
	title: `${siteMeta.title}`,
	description:
		"Marzellus focuses on creating high-quality, timeless fashion pieces that transcend temporary trends.",
};
