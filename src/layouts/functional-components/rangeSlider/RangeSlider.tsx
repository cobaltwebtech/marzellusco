import config from "@/config/config.json";
import MultiRangeSlider from "multi-range-slider-react";
import React, { useEffect, useState } from "react";
import "./rangeSlider.css";

function createUrl(path: string, params: URLSearchParams) {
	return `${path}?${params.toString()}`;
}

const RangeSlider = ({
	maxPriceData,
}: {
	maxPriceData: { amount: string; currencyCode: string };
}) => {
	const { currencyCode, currencySymbol } = config.shopify;

	const [minValue, setMinValue] = useState(0);
	const [maxValue, setMaxValue] = useState(parseInt(maxPriceData?.amount));

	// Initialize state from current URL parameters
	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		const minPrice = parseInt(searchParams.get("minPrice") || "0");
		const maxPrice = parseInt(
			searchParams.get("maxPrice") || maxPriceData?.amount,
		);

		setMinValue(minPrice);
		setMaxValue(maxPrice);
	}, [maxPriceData]);

	function priceChange(min: number, max: number) {
		const searchParams = new URLSearchParams(window.location.search);

		// Update or add minPrice and maxPrice parameters
		searchParams.set("minPrice", min.toString());
		searchParams.set("maxPrice", max.toString());

		const newUrl = createUrl("/products", searchParams);
		window.location.href = newUrl.toString();
	}

	return (
		<div>
			<div className="flex justify-between">
				<p>
					{currencySymbol}
					{minValue} {maxPriceData?.currencyCode || currencyCode}
				</p>
				<p>
					{currencySymbol}
					{maxValue} {maxPriceData?.currencyCode || currencyCode}
				</p>
			</div>

			<MultiRangeSlider
				style={{ border: "none", boxShadow: "none" }}
				ruler="false"
				label="false"
				min="0"
				max={`${maxPriceData?.amount}`}
				minValue={minValue}
				maxValue={maxValue}
				onInput={(e) => {
					setMinValue(e.minValue);
					setMaxValue(e.maxValue);
				}}
			/>

			{(minValue === 0 && maxValue === parseInt(maxPriceData?.amount)) || (
				<button
					className="btn btn-sm btn-primary w-full"
					onClick={() => {
						priceChange(minValue, maxValue);
					}}
				>
					Apply
				</button>
			)}
		</div>
	);
};

export default RangeSlider;
