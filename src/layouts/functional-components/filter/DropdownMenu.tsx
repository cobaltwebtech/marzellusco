import React, { useEffect, useRef, useState } from "react";
import { FilterDropdownItem } from "./FilterDropdownItem";
import type { ListItem } from "../product/ProductLayouts";

const DropdownMenu = ({ list }: { list: ListItem[] }) => {
	const [active, setActive] = useState<string>("");
	const [openSelect, setOpenSelect] = useState<boolean>(false);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setOpenSelect(false);
			}
		};

		window.addEventListener("click", handleClickOutside);
		return () => window.removeEventListener("click", handleClickOutside);
	}, []);

	useEffect(() => {
		const currentPath = window.location.pathname;
		const searchParams = new URLSearchParams(window.location.search);

		list.forEach((listItem) => {
			if (
				("path" in listItem && currentPath === listItem.path) ||
				("slug" in listItem && searchParams.get("sort") === listItem.slug)
			) {
				setActive(listItem.title);
			}
		});
	}, [list]);

	return (
		<div className="text-light relative inline-block text-left" ref={menuRef}>
			<button
				type="button"
				className="hover:bg-light/10 inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-gray-300 ring-inset"
				onClick={() => {
					setOpenSelect(!openSelect);
				}}
				id="menu-button"
				aria-haspopup="true"
			>
				<div>{active}</div>
				<svg
					className={`-mr-1 h-5 w-5 transform text-gray-400 ${
						openSelect ? "rotate-180" : ""
					} transition-transform`}
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
			</button>

			{openSelect && (
				<div
					className="ring-opacity-5 absolute right-0 z-10 mt-2 w-56 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black focus:outline-none"
					onClick={() => {
						setOpenSelect(false);
					}}
				>
					<div
						role="menu"
						aria-orientation="vertical"
						aria-labelledby="menu-button"
					>
						{list.map((item, i) => (
							<FilterDropdownItem key={i} item={item} />
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default DropdownMenu;
