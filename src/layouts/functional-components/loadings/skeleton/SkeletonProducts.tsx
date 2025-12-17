import React from "react";

const SkeletonProducts = () => {
	return (
		<section className="pt-14 xl:pt-28">
			<div className="container">
				<div>
					<div className="col-12 lg:col-3">
						<div className="mb-4 hidden h-8 animate-pulse rounded-md bg-neutral-200 lg:block dark:bg-neutral-700" />
						<div className="hidden h-full animate-pulse rounded-md bg-neutral-200 lg:block dark:bg-neutral-700" />
					</div>

					<div className="col-12 lg:col-9">
						<div>
							<div className="flex justify-between">
								<div className="mb-4 h-8 w-2/12 animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-700" />
								<div className="mb-4 h-8 w-3/12 animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-700" />
							</div>
							<div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
								{Array(9)
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
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default SkeletonProducts;
