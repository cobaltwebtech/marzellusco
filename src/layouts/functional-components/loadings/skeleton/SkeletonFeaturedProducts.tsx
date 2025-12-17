import React from "react";

const SkeletonFeaturedProducts = () => {
	return (
		<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
			{Array(8)
				.fill(0)
				.map((_, index) => {
					return (
						<div key={index}>
							<div className="h-[150px] animate-pulse rounded-md bg-neutral-200 md:h-[269px] dark:bg-neutral-700" />
							<div className="flex flex-col items-center justify-center">
								<div className="mt-4 h-3 w-24 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
								<div className="mt-2 h-2 w-16 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
							</div>
						</div>
					);
				})}
		</div>
	);
};

export default SkeletonFeaturedProducts;
