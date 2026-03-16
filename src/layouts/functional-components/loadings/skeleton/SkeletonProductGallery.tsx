import React from "react";
const SkeletonProductGallery = () => {
	return (
		<>
			<section className="md:section-sm">
				<div className="container">
					<div className="justify-center">
						{/* right side contents  */}
						<div className="col-10 md:col-8 lg:col-6">
							<div className="mb-4 h-[323px] animate-pulse rounded-md bg-neutral-200 md:h-[623px] dark:bg-neutral-700"></div>
							<div className="grid grid-cols-4 gap-x-4">
								{Array(4)
									.fill(0)
									.map((_, index) => {
										return (
											<div
												key={index}
												className="h-[80px] animate-pulse rounded-md bg-neutral-200 md:h-[146px] dark:bg-neutral-700"
											></div>
										);
									})}
							</div>
						</div>

						{/* left side contents  */}
						<div className="col-10 py-6 md:col-8 md:ml-7 lg:col-5 lg:py-0">
							{Array(8)
								.fill(0)
								.map((_, index) => {
									return (
										<div
											key={index}
											className="mb-4 h-20 animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-700"
										></div>
									);
								})}
						</div>
					</div>
				</div>
			</section>

			<section className="pt-14 xl:pt-28">
				<div className="container">
					<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
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
			</section>
		</>
	);
};

export default SkeletonProductGallery;
