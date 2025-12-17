import React, { useEffect, useState } from "react";

const Tabs = ({ descriptionHtml }: { descriptionHtml: string }) => {
	const [description, setDescription] = useState("");
	const [loading, setLoading] = useState(true);
	const [selectedTab, setSelectedTab] = useState(0);
	const contentArray = description.split(`--- split content ---`);

	useEffect(() => {
		setDescription(descriptionHtml);
		setLoading(false);
	}, [descriptionHtml]);

	if (loading) {
		return <h1>Loading...</h1>;
	}

	return (
		<div>
			<div className="border-border dark:border-darkmode-border relative flex border-b-2">
				<button
					onClick={() => setSelectedTab(0)}
					className={`${
						selectedTab === 0
							? "border-border bg-theme-light dark:border-darkmode-border dark:bg-darkmode-theme-light translate-y-[2px] border-t-2 border-r-2 border-b-0 border-l-2"
							: "border-transparent"
					} h-12 cursor-pointer rounded-tl-md rounded-tr-md border-t-2 border-r-2 border-b-0 border-l-2 px-6 py-2 focus:outline-none`}
				>
					Description
				</button>
				{contentArray[1] && (
					<button
						onClick={() => setSelectedTab(1)}
						className={`${
							selectedTab === 1
								? "border-border bg-body dark:border-light dark:bg-darkmode-body translate-y-[2px] border-t-2 border-r-2 border-b-0 border-l-2"
								: "border-transparent"
						} ml-8 h-12 cursor-pointer rounded-tl-md rounded-tr-md border-t-2 border-r-2 border-b-0 border-l-2 px-6 py-2 focus:outline-none`}
					>
						More Info
					</button>
				)}
			</div>
			<div className="border-border dark:border-darkmode-border bg-theme-light dark:bg-darkmode-theme-light rounded-br-md rounded-bl-md border-r-2 border-b-2 border-l-2 p-6">
				{selectedTab === 0 && (
					<div
						className="space-y-4"
						dangerouslySetInnerHTML={{ __html: contentArray[0] }}
					/>
				)}
				{selectedTab === 1 && contentArray[1] && (
					<div
						className="space-y-4"
						dangerouslySetInnerHTML={{ __html: contentArray[1] }}
					/>
				)}
			</div>
		</div>
	);
};

export default Tabs;
