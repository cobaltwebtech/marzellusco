import config from "@/config/config.json";
import { defaultSort, sorting } from "@/lib/constants";
import type { PageInfo, Product } from "@/lib/shopify/types";
import React, { useEffect, useRef, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { AddToCart } from "./cart/AddToCart";
import Price from "@/functional-components/Price";

const ProductList = ({
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
			setProducts([]); // Clear products to load new set based on params
			setPageInfo(initialPageInfo); // Reset page info
			setSortChanged(true); // Set the flag to load products based on new sortKey and reverse
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
			// Load products if sorting has changed
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
		<div className="mx-auto">
			{searchValue ? (
				<p className="mb-4 text-center">
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

			<div className="space-y-10">
				{products?.map((product: Product) => {
					const {
						id,
						title,
						variants,
						handle,
						featuredImage,
						priceRange,
						description,
						compareAtPriceRange,
					} = product;

					const defaultVariantId =
						variants.length > 0 ? variants[0].id : undefined;

					return (
						<div key={id}>
							<div className="flex flex-row gap-4">
								<div className="basis-1/3">
									<a href={`/products/${handle}`}>
										<img
											src={featuredImage?.url || "/images/product_image404.jpg"}
											// fallback={'/images/category-1.png'}
											width={312}
											height={269}
											alt={featuredImage?.altText || "fallback image"}
											className="border-border dark:border-darkmode-border h-[150px] w-[312px] rounded-md border object-cover md:h-[269px]"
										/>
									</a>
								</div>

								<div className="basis-2/3 py-3 max-md:pt-4">
									<h2 className="h4 font-bold md:font-normal">
										<a href={`/products/${handle}`}>{title}</a>
									</h2>

									<div className="mt-2 flex items-center gap-x-2">
										<span className="text-text dark:text-darkmode-text text-xs font-bold md:text-lg">
											<Price amount={priceRange?.minVariantPrice.amount} />
										</span>
										{parseFloat(compareAtPriceRange?.maxVariantPrice?.amount) >
										0 ? (
											<s className="text-light dark:text-darkmode-light text-xs font-medium md:text-base">
												<Price
													amount={compareAtPriceRange?.maxVariantPrice?.amount}
												/>
											</s>
										) : (
											""
										)}
									</div>

									<p className="text-light dark:text-darkmode-light my-4 line-clamp-1 max-md:text-xs md:mb-8 md:line-clamp-3">
										{description}
									</p>
									<AddToCart
										variants={product?.variants}
										availableForSale={product?.availableForSale}
										handle={product?.handle}
										defaultVariantId={defaultVariantId}
										stylesClass={
											"btn btn-outline-primary max-md:btn-sm drop-shadow-md"
										}
									/>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{pageInfo?.hasNextPage && (
				<div ref={loaderRef} className="py-4 text-center">
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

export default ProductList;
