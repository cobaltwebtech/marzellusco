import React, { useState, useEffect, useRef } from "react";
import type { ProductVariant } from "@/lib/shopify/types";
import { BiLoaderAlt } from "react-icons/bi";
import { addItemToCart } from "@/cartStore";

interface SubmitButtonProps {
	availableForSale: boolean;
	selectedVariantId: string | undefined;
	stylesClass: string;
	handle: string | null;
	pending: boolean;
	onClick: (e: React.FormEvent) => void;
	hasMultipleVariants: boolean;
	allOptionsSelected: boolean;
}

function SubmitButton({
	availableForSale,
	selectedVariantId,
	stylesClass,
	handle,
	pending,
	onClick,
	hasMultipleVariants,
	allOptionsSelected,
}: SubmitButtonProps) {
	const buttonClasses = stylesClass;
	const disabledClasses = "cursor-not-allowed flex";

	const DynamicTag = handle === null ? "button" : "a";

	if (!availableForSale) {
		return (
			<button
				disabled
				aria-disabled
				className={`${buttonClasses} ${disabledClasses}`}
			>
				Out Of Stock
			</button>
		);
	}

	if (hasMultipleVariants && !allOptionsSelected) {
		return (
			<DynamicTag
				href={`/products/${handle}`}
				aria-label="Please select an option"
				aria-disabled
				className={`${buttonClasses} ${DynamicTag === "button" ? disabledClasses : ""}`}
			>
				Select Options
			</DynamicTag>
		);
	}

	if (!selectedVariantId) {
		return (
			<DynamicTag
				href={`/products/${handle}`}
				aria-label="Please select an option"
				aria-disabled
				className={`${buttonClasses} ${DynamicTag === "button" ? disabledClasses : ""}`}
			>
				Select Options
			</DynamicTag>
		);
	}

	return (
		<button
			onClick={onClick}
			aria-label="Add to cart"
			aria-disabled={pending ? "true" : "false"}
			className={`${buttonClasses}`}
		>
			{pending ? (
				<BiLoaderAlt
					className={`w-[70px] animate-spin md:w-[85px]`}
					size={26}
				/>
			) : (
				"Add To Cart"
			)}
		</button>
	);
}

interface AddToCartProps {
	variants: ProductVariant[];
	stylesClass: string;
	handle: string | null;
	defaultVariantId: string | undefined;
	availableForSale?: boolean | undefined; // Optional prop for availableForSale
}

export function AddToCart({
	variants,
	stylesClass,
	handle,
	defaultVariantId,
}: AddToCartProps) {
	const [message, setMessage] = useState<string | null>(null);
	const [pending, setPending] = useState(false);
	const [selectedVariantId, setSelectedVariantId] = useState<
		string | undefined
	>(defaultVariantId);
	const [allOptionsSelected, setAllOptionsSelected] = useState(false);
	const [availableForSale, setAvailableForSale] = useState<boolean>(true); // Added state for availableForSale
	const lastUrl = useRef(window.location.href);

	const updateSelectedVariantFromUrl = () => {
		const searchParams = new URLSearchParams(window.location.search);
		const selectedOptions = Array.from(searchParams.entries());

		const variant = variants.find((variant) =>
			selectedOptions.every(([key, value]) =>
				variant.selectedOptions.some(
					(option) =>
						option.name.toLowerCase() === key && option.value === value,
				),
			),
		);

		setSelectedVariantId(variant?.id || defaultVariantId);
		setAllOptionsSelected(
			selectedOptions.length === variants[0].selectedOptions.length,
		);
	};

	useEffect(() => {
		updateSelectedVariantFromUrl();

		const handlePopState = () => {
			updateSelectedVariantFromUrl();
		};

		const detectUrlChange = () => {
			const currentUrl = window.location.href;
			if (currentUrl !== lastUrl.current) {
				lastUrl.current = currentUrl;
				updateSelectedVariantFromUrl();
			}
		};

		window.addEventListener("popstate", handlePopState);
		const urlCheckInterval = setInterval(detectUrlChange, 100);

		return () => {
			window.removeEventListener("popstate", handlePopState);
			clearInterval(urlCheckInterval);
		};
	}, [variants, defaultVariantId]);

	useEffect(() => {
		const originalPushState = history.pushState;
		const originalReplaceState = history.replaceState;

		history.pushState = function (...args) {
			originalPushState.apply(this, args);
			updateSelectedVariantFromUrl();
		};

		history.replaceState = function (...args) {
			originalReplaceState.apply(this, args);
			updateSelectedVariantFromUrl();
		};

		return () => {
			history.pushState = originalPushState;
			history.replaceState = originalReplaceState;
		};
	}, []);

	useEffect(() => {
		const handleVariantChanged = (event: CustomEvent) => {
			const { variantId, availableForSale } = event.detail;
			setSelectedVariantId(variantId);
			setAllOptionsSelected(true);
			setAvailableForSale(availableForSale); // Update availableForSale state
		};

		window.addEventListener(
			"variantChanged",
			handleVariantChanged as EventListener,
		);

		return () => {
			window.removeEventListener(
				"variantChanged",
				handleVariantChanged as EventListener,
			);
		};
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedVariantId) return;

		setPending(true);
		try {
			const result = await addItemToCart(selectedVariantId);
			setMessage(result);
		} catch (error: any) {
			setMessage(error.message);
		} finally {
			setPending(false);
		}
	};

	const hasMultipleVariants = variants.length > 1;

	return (
		<form onSubmit={handleSubmit}>
			<SubmitButton
				availableForSale={availableForSale} // Updated prop
				selectedVariantId={selectedVariantId}
				stylesClass={stylesClass}
				handle={handle}
				pending={pending}
				onClick={handleSubmit}
				hasMultipleVariants={hasMultipleVariants}
				allOptionsSelected={allOptionsSelected}
			/>
			<p aria-live="polite" className="sr-only" role="status">
				{message}
			</p>
		</form>
	);
}
