import config from "@/config/config.json";
import { defaultSort, sorting } from "@/lib/constants";
import type { PageInfo, Product } from "@/lib/shopify/types";
import React, { useEffect, useRef, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { AddToCart } from "./cart/AddToCart";
import Price from "@/functional-components/Price";

const ProductGrid = ({
	initialProducts,
	initialPageInfo,
	sortKey,
	reverse,
	searchValue,
}: {
	initialProducts: Product[];
	initialPageInfo: PageInfo;
	sortKey: string;
	reverse: boolean;
	searchValue: string | null;
}) => {
	const { currencySymbol } = config.shopify;
	const [products, setProducts] = useState(initialProducts);
	const [pageInfo, setPageInfo] = useState(initialPageInfo);
	const [loading, setLoading] = useState(false);
	const [currentSortKey, setCurrentSortKey] = useState(sortKey);
	const [currentReverse, setCurrentReverse] = useState(reverse);
	const [sortChanged, setSortChanged] = useState(false);
	const loaderRef = useRef(null);

	const getSortParams = (sortKey: string) => {
		const sortOption =
			sorting.find((item) => item.slug === sortKey) || defaultSort;
		return { sortKey: sortOption.sortKey, reverse: sortOption.reverse };
	};

	const loadMoreProducts = async () => {
		if (loading || !pageInfo.hasNextPage) return;

		setLoading(true);
		try {
			const response = await fetch(
				`/api/products.json?cursor=${pageInfo.endCursor || ""}&sortKey=${currentSortKey}&reverse=${currentReverse}`,
			);
			if (!response.ok) throw new Error("Failed to fetch");
			const { products: newProducts, pageInfo: newPageInfo } =
				await response.json();

			setProducts((prevProducts) => [...prevProducts, ...newProducts]);
			setPageInfo(newPageInfo);
			setSortChanged(false);
		} catch (error) {
			console.error("Error loading more products:", error);
		} finally {
			setLoading(false);
		}
	};

	const updateStateFromURL = () => {
		const params = new URLSearchParams(window.location.search);
		const newSortKey = params.get("sortKey") || sortKey;

		const { sortKey: mappedSortKey, reverse: mappedReverse } =
			getSortParams(newSortKey);

		// Update only if URL params differ from current state
		if (mappedSortKey !== currentSortKey || mappedReverse !== currentReverse) {
			setCurrentSortKey(mappedSortKey);
			setCurrentReverse(mappedReverse);
			setProducts([]);
			setPageInfo(initialPageInfo);
			setSortChanged(true);
		}
	};

	useEffect(() => {
		// Listen for URL changes and handle state updates
		window.addEventListener("popstate", updateStateFromURL);

		// Cleanup event listener on component unmount
		return () => {
			window.removeEventListener("popstate", updateStateFromURL);
		};
	}, [initialPageInfo]);

	// Intersection observer to trigger loading more products
	useEffect(() => {
		if (sortChanged) {
			loadMoreProducts();
		} else {
			const observer = new IntersectionObserver(
				(entries) => {
					if (entries[0].isIntersecting) {
						loadMoreProducts();
					}
				},
				{ threshold: 1.0 },
			);

			if (loaderRef.current) {
				observer.observe(loaderRef.current);
			}

			return () => {
				if (loaderRef.current) {
					observer.unobserve(loaderRef.current);
				}
			};
		}
	}, [pageInfo?.endCursor, currentSortKey, currentReverse, sortChanged]);

	const resultsText = products.length > 1 ? "results" : "result";

	return (
		<div>
			<div className="mx-auto grid grid-cols-2 gap-4 md:grid-cols-3">
				{searchValue ? (
					<p className="col-span-full mb-4 text-center">
						{products.length === 0
							? "There are no products that match "
							: `Showing ${products.length} ${resultsText} for `}
						<span className="font-bold">&quot;{searchValue}&quot;</span>
					</p>
				) : null}

				{products?.length === 0 && (
					<div className="mx-auto pt-5 text-center">
						<img
							className="mx-auto mb-6"
							src="/images/no-search-found.png"
							alt="no-search-found"
							width={211}
							height={184}
						/>
						<h1 className="h2 mb-4">No Product Found!</h1>
						<p>
							We couldn&apos;t find what you filtered for. Try filtering again.
						</p>
					</div>
				)}

				{products.map((product, index) => {
					const defaultVariantId =
						product?.variants.length > 0 ? product?.variants[0].id : undefined;
					return (
						<div key={index} className="text-center">
							<div className="overflow-hidden md:relative">
								<a href={`/products/${product?.handle}`}>
									<img
										src={
											product.featuredImage?.url ||
											"/images/product_image404.jpg"
										}
										width={312}
										height={269}
										alt={product.featuredImage?.altText || "fallback image"}
										className="border-border dark:border-darkmode-border mx-auto h-[200px] w-full rounded-md border object-cover sm:w-[312px] md:h-[269px]"
									/>
								</a>
							</div>
							<div className="z-20 py-2 text-center md:py-4">
								<h2 className="text-base font-medium md:text-xl">
									<a href={`/products/${product?.handle}`}>{product?.title}</a>
								</h2>
								<div className="mt-2 flex flex-wrap items-center justify-center gap-x-2 md:mt-4">
									<span className="text-dark dark:text-darkmode-dark text-base font-bold md:text-xl">
										<Price
											amount={product?.priceRange?.minVariantPrice.amount}
										/>
									</span>
									{parseFloat(
										product?.compareAtPriceRange?.maxVariantPrice?.amount,
									) > 0 ? (
										<s className="text-light dark:text-darkmode-light text-xs font-medium md:text-base">
											<Price
												amount={
													product?.compareAtPriceRange?.maxVariantPrice?.amount
												}
											/>
										</s>
									) : (
										""
									)}
								</div>
							</div>
						</div>
					);
				})}
			</div>
			{pageInfo?.hasNextPage && (
				<div ref={loaderRef} className="flex justify-center py-4 text-center">
					{loading ? (
						<BiLoaderAlt className={`animate-spin`} size={30} />
					) : (
						"Scroll for more"
					)}
				</div>
			)}
		</div>
	);
};

export default ProductGrid;
