import React from "react";
const SkeletonCards = () => {
	return (
		<section>
			<div className="container">
				<div>
					<div className="col-12 mx-auto">
						<div>
							<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{Array(9)
									.fill(0)
									.map((_, index) => {
										return (
											<div key={index}>
												<div className="h-[200px] animate-pulse rounded-md bg-neutral-200 md:h-[269px] dark:bg-neutral-700" />
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

export default SkeletonCards;
