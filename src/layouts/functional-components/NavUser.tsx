import { getUserDetails } from "@/lib/shopify";
import type { user } from "@/lib/shopify/types";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import Gravatar from "react-gravatar";
import { BsPerson } from "react-icons/bs";

export const fetchUser = async () => {
	try {
		const accessToken = Cookies.get("token");

		if (!accessToken) {
			return null;
		} else {
			const userDetails: user = await getUserDetails(accessToken);
			const userInfo = userDetails.customer;
			return userInfo;
		}
	} catch (error) {
		// console.log("Error fetching user details:", error);
		return null;
	}
};

const NavUser = ({ pathname }: { pathname: string }) => {
	const [user, setUser] = useState<any>();
	const [dropdownOpen, setDropdownOpen] = useState(false);

	useEffect(() => {
		const getUser = async () => {
			const userInfo = await fetchUser();
			setUser(userInfo);
		};
		getUser();
	}, [pathname]);

	const handleLogout = () => {
		Cookies.remove("token");
		localStorage.removeItem("user");
		setUser(null);
	};

	const toggleDropdown = () => {
		setDropdownOpen(!dropdownOpen);
	};

	return (
		<div className="relative">
			{user ? (
				<button
					onClick={toggleDropdown}
					className="relative flex cursor-pointer items-center justify-center text-left sm:text-xs"
				>
					<div className="flex items-center gap-x-1">
						<div className="border-darkmode-border dark:border-border h-6 w-6 rounded-full border">
							<Gravatar email={user?.email} style={{ borderRadius: "50px" }} />
						</div>
						<div className="leading-none max-md:hidden">
							<div className="flex items-center">
								<p className="text-dark dark:text-darkmode-dark block truncate text-base">
									{user?.firstName}
								</p>
								<svg
									className={`text-dark dark:text-darkmode-dark dark:hover:text-darkmode-primary w-5`}
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
							</div>
						</div>
					</div>
				</button>
			) : (
				<a
					className="text-dark hover:text-primary dark:border-darkmode-border flex items-center text-xl dark:text-white"
					href="/login"
					aria-label="login"
				>
					<BsPerson className="dark:hover:text-darkmode-primary" />
				</a>
			)}

			{dropdownOpen && (
				<div className="absolute z-20 mt-2 w-full rounded bg-white text-center shadow-md">
					<button
						onClick={handleLogout}
						className="btn btn-primary max-md:btn-sm mt-2"
					>
						Logout
					</button>
				</div>
			)}
		</div>
	);
};

export default NavUser;
