import React, { useState, useRef, useEffect } from "react";

interface VariantDropDownProps {
	sizeOption: {
		name: string;
		values: string[];
	};
	selectedSize: string | undefined;
	onSizeChange: (value: string) => void;
	combinations: {
		id: string;
		availableForSale: boolean;
		[key: string]: string | boolean;
	}[];
	selectedOptions: Record<string, string | undefined>;
}

const VariantDropDown: React.FC<VariantDropDownProps> = ({
	sizeOption,
	selectedSize,
	onSizeChange,
	combinations,
	selectedOptions,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selected, setSelected] = useState(selectedSize || "Select Size");
	const dropdownRef = useRef<HTMLDivElement>(null);

	const updateUrl = (param: string, value: string) => {
		const searchParams = new URLSearchParams(window.location.search);
		searchParams.set(param.toLowerCase(), value);
		const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
		window.history.replaceState({}, "", newUrl);
	};

	const handleSizeChanged = (value: string) => {
		setSelected(value);
		updateUrl(sizeOption.name, value);
		setIsOpen(false);
		onSizeChange(value);
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		if (selectedSize) {
			setSelected(selectedSize);
		}
	}, [selectedSize]);

	return (
		<div className="relative w-72" ref={dropdownRef}>
			<button
				className="bg-theme-light w-full cursor-pointer rounded-md py-2 pr-10 pl-3 text-left focus:outline-none sm:text-sm"
				onClick={() => setIsOpen(!isOpen)}
				aria-haspopup="listbox"
				aria-expanded={isOpen}
			>
				<span className="text-light block truncate">{selected}</span>
				<span className="absolute inset-y-0 right-0 flex items-center pr-2">
					<svg
						className={`text-light h-5 w-5 transform transition-transform ${isOpen ? "rotate-180" : ""}`}
						fill="currentColor"
						viewBox="0 0 20 20"
						aria-hidden="true"
					>
						<path
							fillRule="evenodd"
							d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
							clipRule="evenodd"
						/>
					</svg>
				</span>
			</button>

			{isOpen && (
				<ul
					className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
					role="listbox"
				>
					{sizeOption.values.map((size: string) => {
						const isAvailable = combinations.some((combination) => {
							const matchesSelectedOptions = Object.entries(
								selectedOptions,
							).every(
								([key, value]) =>
									key === sizeOption.name.toLowerCase() ||
									combination[key] === value,
							);
							return (
								matchesSelectedOptions &&
								combination[sizeOption.name.toLowerCase()] === size &&
								combination.availableForSale
							);
						});
						return (
							<li
								key={size}
								className={`cursor-pointer px-4 py-2 ${
									isAvailable
										? "text-light hover:bg-light hover:text-white"
										: "cursor-not-allowed text-gray-400"
								}`}
								onClick={() => isAvailable && handleSizeChanged(size)}
								role="option"
								aria-selected={selected === size}
							>
								{size} {!isAvailable && "(Out of Stock)"}
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
};

export default VariantDropDown;
