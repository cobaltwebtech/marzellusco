import React, { useState, useEffect } from "react";
import { useCollapse } from "react-collapsed";
import { useStore } from "@nanostores/react";
import { layoutView, setLayoutView } from "@/cartStore";
import { BsGridFill } from "react-icons/bs";
import { FaList } from "react-icons/fa6";
import { TbFilter, TbFilterX } from "react-icons/tb";
import DropdownMenu from "../filter/DropdownMenu";
import { type SortFilterItem, sorting } from "@/lib/constants";
import ProductFilters from "../ProductFilters";

export type ListItem = SortFilterItem | PathFilterItem;
export type PathFilterItem = { title: string; path: string };

const ProductLayouts = ({
	categories,
	vendors,
	tags,
	maxPriceData,
	vendorsWithCounts,
	categoriesWithCounts,
}: any) => {
	const { getCollapseProps, getToggleProps, isExpanded, setExpanded } =
		useCollapse();
	const [isInputEditing, setInputEditing] = useState(false);
	const layout = useStore(layoutView);

	const layoutChange = (isCard: string) => {
		setLayoutView(isCard === "list" ? "list" : "card");
	};

	useEffect(() => {
		const inputField = document.getElementById(
			"searchInput",
		) as HTMLInputElement;
		if (
			isInputEditing ||
			new URLSearchParams(window.location.search).get("q")
		) {
			inputField?.focus();
		}
	}, [isInputEditing]);

	useEffect(() => {
		const handleOutsideClick = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			if (
				!target.closest(".collapse-container-class") &&
				!target.closest(".filter-button-container") &&
				isExpanded
			) {
				setExpanded(false);
			}

			if (!target.closest("#searchInput") && isInputEditing) {
				setInputEditing(false);
			}
		};

		document.addEventListener("click", handleOutsideClick);
		return () => document.removeEventListener("click", handleOutsideClick);
	}, [isExpanded, isInputEditing]);

	return (
		<section className="pt-4">
			<div className="container">
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
					<div className="max-lg:hidden" />

					<div className="col-span-1 lg:col-span-3">
						<div className="mb-4 flex items-center justify-between">
							<div className="flex items-center gap-x-4 text-xs font-medium md:text-base">
								<p className="text-dark dark:text-darkmode-dark max-md:hidden">
									Views
								</p>
								<div className="flex gap-2">
									<button
										onClick={() => layoutChange("card")}
										className={`btn dark:border-darkmode-border border ${
											layout === "list" ? "btn-outline-primary" : "btn-primary"
										} p-2 duration-300 hover:scale-105`}
									>
										<BsGridFill />
									</button>
									<button
										onClick={() => layoutChange("list")}
										className={`btn dark:border-darkmode-border border ${
											layout === "list" ? "btn-primary" : "btn-outline-primary"
										} p-2 duration-300 hover:scale-105`}
									>
										<FaList />
									</button>
								</div>
							</div>

							<div className="flex gap-x-8">
								<div className="filter-button-container mt-1 block lg:hidden">
									<button {...getToggleProps()}>
										{isExpanded ? (
											<span className="flex items-center justify-center gap-x-1 text-base font-medium">
												<TbFilterX /> Filter
											</span>
										) : (
											<span className="flex items-center justify-center gap-x-1 text-base font-medium">
												<TbFilter /> Filter
											</span>
										)}
									</button>
								</div>

								<div className="relative z-20 flex items-center gap-x-4 text-sm font-medium md:text-base">
									<p className="text-dark dark:text-darkmode-dark max-md:hidden">
										Sort By
									</p>
									<DropdownMenu list={sorting} />
								</div>
							</div>
						</div>
					</div>

					<div className="col-span-1 lg:col-span-3">
						<div className="relative lg:block">
							<div className="block w-full lg:hidden">
								<section
									className="collapse-container-class bg-body dark:bg-darkmode-body z-20 w-full rounded-md px-4"
									{...getCollapseProps()}
								>
									<div className="pb-8">
										<ProductFilters
											categories={categories}
											vendors={vendors}
											tags={tags}
											maxPriceData={maxPriceData}
											vendorsWithCounts={vendorsWithCounts}
											categoriesWithCounts={categoriesWithCounts}
										/>
									</div>
								</section>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default ProductLayouts;
