import React from "react";
const SkeletonCategory = () => {
	return (
		<div className="grid grid-cols-2 gap-x-6 md:grid-cols-3">
			{Array(3)
				.fill(0)
				.map((_, index) => {
					return (
						<div
							key={index}
							className="h-[150px] animate-pulse rounded-md bg-neutral-200 md:h-[250px] lg:h-[306px] dark:bg-neutral-700"
						/>
					);
				})}
		</div>
	);
};

export default SkeletonCategory;
