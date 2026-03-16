import React, { useEffect, useState } from "react";
import { IoSearch, IoClose } from "react-icons/io5";

const SearchBar = () => {
	const [isInputEditing, setInputEditing] = useState(false);
	const [inputValue, setInputValue] = useState("");

	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		const query = searchParams.get("q");
		if (query) {
			setInputValue(query);
			setInputEditing(true);
		}

		const inputField = document.getElementById(
			"searchInput",
		) as HTMLInputElement;
		if (isInputEditing || query) {
			inputField.focus();
		}
	}, [isInputEditing]);

	const updateURL = (query: string) => {
		const newURL = query
			? `/products?q=${encodeURIComponent(query)}`
			: "/products";
		window.history.pushState({}, "", newURL);
		// Trigger a custom event to notify that the URL has changed
		window.dispatchEvent(new Event("popstate"));
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputEditing(true);
		setInputValue(e.target.value);
	};

	const handleClear = () => {
		setInputValue("");
		setInputEditing(false);
		updateURL("");
	};

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		updateURL(inputValue);
	};

	return (
		<form
			onSubmit={onSubmit}
			className="border-border bg-light/10 dark:border-darkmode-border relative flex rounded-full border pl-4"
		>
			<input
				type="text"
				name="search"
				placeholder="Search for products"
				autoComplete="off"
				value={inputValue}
				onChange={handleChange}
				id="searchInput"
				className="search-input w-full border-none bg-transparent p-2 focus:ring-transparent"
			/>
			<div className="absolute top-0 right-0 flex h-full items-center">
				{inputValue && (
					<button
						type="button"
						onClick={handleClear}
						className="m-1 rounded-full p-2"
					>
						<IoClose className="h-4 w-4" />
					</button>
				)}
				<button type="submit" className="search-icon m-1 rounded-full p-2">
					<IoSearch className="h-5 w-5" />
				</button>
			</div>
		</form>
	);
};

export default SearchBar;
