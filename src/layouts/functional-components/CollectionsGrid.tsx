import React, { useEffect, useState } from "react";
import SkeletonCategory from "./loadings/skeleton/SkeletonCategory";

const CollectionsGrid = ({ collections }: { collections: any }) => {
	const [collectionsData, setCollectionsData] = useState([]);
	const [loadingCollectionsData, setLoadingCollectionsData] = useState(true);

	useEffect(() => {
		setCollectionsData(collections);
		setLoadingCollectionsData(false);
	}, [collections]);

	if (loadingCollectionsData) {
		return <SkeletonCategory />;
	}

	return (
		<div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
			{collectionsData?.map((item: any) => {
				const { title, handle, image } = item;
				return (
					<div className="relative text-center">
						<img
							src={image?.url}
							width={424}
							height={306}
							alt={title}
							className="h-[150px] rounded-md object-cover md:h-[250px] lg:h-[306px]"
						/>
						<div className="py-6">
							<h3 className="mb-2 text-2xl font-medium md:text-3xl">
								<a
									className="after:absolute after:inset-0"
									href={`/products?c=${handle}`}
								>
									{title}
								</a>
							</h3>
							<p className="text-light dark:text-darkmode-light text-sm md:text-xl">
								{item.products?.edges.length} items
							</p>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default CollectionsGrid;
