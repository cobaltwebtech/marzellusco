import React from "react";

const SkeletonProductThumb = () => {
	return (
		<div className="justify-center">
			<div>
				<div className="mb-4 h-[323px] animate-pulse rounded-md bg-neutral-200 md:h-[623px] dark:bg-neutral-700"></div>

				<div className="grid grid-cols-4 gap-x-4">
					{Array(4)
						.fill(0)
						.map((_, index) => {
							return (
								<div
									key={index}
									className="h-[80px] animate-pulse rounded-md bg-neutral-200 md:h-[146px] dark:bg-neutral-700"
								/>
							);
						})}
				</div>
			</div>
		</div>
	);
};

export default SkeletonProductThumb;
