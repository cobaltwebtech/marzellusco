import React from "react";
import { BsCart3 } from "react-icons/bs";

interface OpenCartProps {
	className?: string;
	quantity?: number;
}

const OpenCart: React.FC<OpenCartProps> = ({ className = "", quantity }) => {
	return (
		<div className="text-dark hover:text-primary dark:border-darkmode-border relative text-xl dark:text-white">
			<BsCart3 className={`dark:hover:text-darkmode-primary ${className}`} />

			{quantity ? (
				<div className="absolute -top-3 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-700 p-1 text-xs text-white dark:bg-red-400">
					{quantity}
				</div>
			) : null}
		</div>
	);
};

export default OpenCart;
