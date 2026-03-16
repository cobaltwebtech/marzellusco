import React, { useState } from "react";
import { slugify } from "@/lib/utils/textConverter";

const ShowTags = ({ tags }: { tags: string[] }) => {
	const [searchParams, setSearchParams] = useState(
		new URLSearchParams(window.location.search),
	);
	const selectedTag = searchParams.get("t");

	const updateSearchParams = (newParams: URLSearchParams) => {
		const newParamsString = newParams.toString();
		const newURL = newParamsString
			? `/products?${newParamsString}`
			: "/products";

		window.location.href = newURL.toString();
		setSearchParams(newParams);
	};

	const handleTagClick = (name: string) => {
		const slugName = slugify(name.toLowerCase());
		const newParams = new URLSearchParams(searchParams.toString());

		if (slugName === selectedTag) {
			newParams.delete("t");
		} else {
			newParams.set("t", slugName);
		}

		updateSearchParams(newParams);
	};

	return (
		<button className="flex flex-wrap gap-3">
			{tags.map((tag) => (
				<p
					key={tag}
					className={`border-border text-text dark:border-darkmode-border dark:text-darkmode-text cursor-pointer rounded-md border px-2 py-1 ${
						selectedTag === slugify(tag.toLowerCase()) &&
						"bg-theme-light dark:bg-theme-dark"
					}`}
					onClick={() => handleTagClick(tag)}
				>
					{tag}
				</p>
			))}
		</button>
	);
};

export default ShowTags;
