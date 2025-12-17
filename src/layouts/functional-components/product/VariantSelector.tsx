import React, { useState, useEffect } from "react";
import { BsCheckLg } from "react-icons/bs";
import VariantDropDown from "./VariantDropDown";
import type { ImageItem } from "./ProductGallery";
import type { ProductOption, ProductVariant } from "@/lib/shopify/types";

type Combination = {
	id: string;
	availableForSale: boolean;
	[key: string]: string | boolean;
};

export const generateImageMap = (images: ImageItem[]) => {
	const imageMap: { [altText: string]: string } = {};

	images.forEach((image) => {
		if (!(image.altText in imageMap)) {
			imageMap[image.altText] = image.url;
		}
	});

	return imageMap;
};

export function VariantSelector({
	options,
	variants,
	images,
}: {
	options: ProductOption[];
	variants: ProductVariant[];
	images: ImageItem[];
}) {
	const [selectedOptions, setSelectedOptions] = useState<
		Record<string, string | undefined>
	>({});

	const imageMap = generateImageMap(images);

	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		const newSelectedOptions: Record<string, string | undefined> = {};

		options.forEach((option) => {
			const value = searchParams.get(option.name.toLowerCase());
			if (value) {
				newSelectedOptions[option.name.toLowerCase()] = value;
			}
		});

		setSelectedOptions(newSelectedOptions);
	}, [options]);

	const updateUrl = (param: string, value: string) => {
		const params = new URLSearchParams(window.location.search);
		params.set(param, value);
		window.history.replaceState(
			{},
			"",
			`${window.location.pathname}?${params.toString()}`,
		);
	};

	const handleOptionChange = (optionName: string, value: string) => {
		setSelectedOptions((prev) => ({
			...prev,
			[optionName]: value,
		}));
		updateUrl(optionName, value);

		const updatedOptions = { ...selectedOptions, [optionName]: value };
		const allOptionsSelected = options.every(
			(option) => updatedOptions[option.name.toLowerCase()] !== undefined,
		);

		if (allOptionsSelected) {
			const selectedVariant = variants.find((variant) =>
				variant.selectedOptions.every(
					(option) =>
						updatedOptions[option.name.toLowerCase()] === option.value,
				),
			);

			if (selectedVariant) {
				const event = new CustomEvent("variantChanged", {
					detail: {
						variantId: selectedVariant.id,
						availableForSale: selectedVariant.availableForSale,
					},
				});
				window.dispatchEvent(event);
			}
		}
	};

	const combinations = variants.map((variant) => ({
		id: variant.id,
		availableForSale: variant.availableForSale,
		...variant.selectedOptions.reduce(
			(accumulator, option) => ({
				...accumulator,
				[option.name.toLowerCase()]: option.value,
			}),
			{},
		),
	}));

	const filteredOptions = options.filter(
		(option) =>
			!(option.name === "Title" && option.values.includes("Default Title")),
	);

	const sizeOption = options.find(
		(option) => option.name.toLowerCase() === "size",
	);

	return (
		<div>
			{filteredOptions
				.filter((option) => option.name.toLowerCase() !== "size")
				.map((option) => (
					<div key={option.id} className="mb-8">
						<h5 className="mb-2 max-md:text-base">{option.name}</h5>
						<div className="flex flex-wrap gap-3">
							{option.values.map((value) => {
								const optionNameLowerCase = option.name.toLowerCase();
								const isAvailableForSale = combinations.some(
									(combination: Combination) =>
										combination[optionNameLowerCase] === value &&
										combination.availableForSale,
								);

								const isActive = selectedOptions[optionNameLowerCase] === value;

								if (option.name.toLowerCase() === "size") {
									return null;
								}

								return (
									<div key={value}>
										<button
											aria-label={`${option.name} ${value}${!isAvailableForSale ? " (Out of Stock)" : ""}`}
											aria-disabled={!isAvailableForSale}
											disabled={!isAvailableForSale}
											onClick={() =>
												handleOptionChange(optionNameLowerCase, value)
											}
											className={`flex min-w-[48px] items-center justify-center rounded-md border text-sm ${isActive ? "ring-dark dark:ring-darkmode-dark cursor-default ring-2" : ""} ${!isActive && isAvailableForSale ? "hover:ring-dark hover:dark:ring-darkmode-dark ring-1 ring-transparent transition duration-300 ease-in-out hover:scale-110" : ""} ${!isAvailableForSale ? "relative z-10 cursor-not-allowed overflow-hidden bg-neutral-100 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400" : ""}`}
										>
											{option.name.toLowerCase() === "color" ? (
												<div
													className={`relative overflow-visible rounded-md ${isActive ? "outline-dark dark:outline-darkmode-dark bg-black outline outline-1" : ""}`}
												>
													<img
														src={imageMap[value]}
														alt={value}
														width={50}
														height={50}
														className={`${isActive ? "opacity-60" : ""}`}
													/>
													{isActive && (
														<div className="absolute top-2 right-2 h-full text-inherit opacity-100">
															<BsCheckLg size={35} className="text-green-400" />
														</div>
													)}
													{isActive && (
														<div className="absolute -bottom-8 font-semibold text-inherit">
															{value}
														</div>
													)}
												</div>
											) : (
												value
											)}
										</button>
									</div>
								);
							})}
						</div>
					</div>
				))}

			{sizeOption && (
				<div className="mt-12 mb-8">
					<h5 className="mb-2 max-md:text-base">{sizeOption.name}</h5>
					<VariantDropDown
						sizeOption={sizeOption}
						selectedSize={selectedOptions[sizeOption.name.toLowerCase()]}
						onSizeChange={(value: string) =>
							handleOptionChange(sizeOption.name.toLowerCase(), value)
						}
						combinations={combinations}
						selectedOptions={selectedOptions}
					/>
				</div>
			)}
		</div>
	);
}
