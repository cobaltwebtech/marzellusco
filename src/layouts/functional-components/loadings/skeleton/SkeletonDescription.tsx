import React from "react";

const SkeletonDescription = () => {
	return (
		<div>
			<div className="border-border dark:border-light flex gap-x-6 border-b-2">
				<div
					className={`border-border dark:border-light h-12 w-[13%] animate-pulse rounded-tl-md rounded-tr-md border-t-2 border-r-2 border-b-0 border-l-2 bg-neutral-200 px-6 dark:bg-neutral-700`}
				/>
				<div
					className={`border-border dark:border-light h-12 w-[13%] animate-pulse rounded-tl-md rounded-tr-md border-t-2 border-r-2 border-b-0 border-l-2 bg-neutral-200 px-6 dark:bg-neutral-700`}
				/>
			</div>
			<div className="border-border dark:border-light rounded-br-md rounded-bl-md border border-r-2 border-b-2 border-l-2 p-6">
				<div className="mb-4 h-10 animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-700" />
				<div>
					<div className="mb-4 h-10 animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-700" />
				</div>
			</div>
		</div>
	);
};

export default SkeletonDescription;
