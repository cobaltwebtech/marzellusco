import React, { useEffect, useRef, useState } from "react";
import {
	HiOutlineArrowNarrowLeft,
	HiOutlineArrowNarrowRight,
} from "react-icons/hi";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/styles.min.css";
import type { Swiper as TSwiper } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import SkeletonProductThumb from "../loadings/skeleton/SkeletonProductThumb";

export interface ImageItem {
	url: string;
	altText: string;
	width: number;
	height: number;
}

const ProductGallery = ({ images }: { images: ImageItem[] }) => {
	const [thumbsSwiper, setThumbsSwiper] = useState<TSwiper | null>(null);
	const [activeIndex, setActiveIndex] = useState(0);
	const [isHovered, setIsHovered] = useState(false);
	const [loadingThumb, setLoadingThumb] = useState(true);
	const [picUrl, setPicUrl] = useState(images.length > 0 ? images[0].url : "");

	const prevRef = useRef(null);
	const nextRef = useRef(null);

	const altTextArray = images.map((item) => item.altText);
	const filteredImages = images.filter(
		(item) => item.altText === altTextArray[activeIndex],
	);

	// Listen to URL changes using popstate and polling
	useEffect(() => {
		const updateStateFromURL = () => {
			const params = new URLSearchParams(window.location.search);
			const searchParam = params.get("color");

			if (searchParam) {
				const foundIndex = altTextArray.indexOf(searchParam);
				if (foundIndex !== -1) {
					setActiveIndex(foundIndex);
					setPicUrl(images[foundIndex].url);
				}
			}
			setLoadingThumb(false);
		};

		// Initial check on component mount
		updateStateFromURL();

		// Listen for back/forward button events (popstate)
		window.addEventListener("popstate", updateStateFromURL);

		// Polling to detect manual URL changes
		const polling = setInterval(() => {
			updateStateFromURL();
		}, 500);

		// Cleanup event listener and polling
		return () => {
			window.removeEventListener("popstate", updateStateFromURL);
			clearInterval(polling);
		};
	}, [altTextArray, images]);

	const handleSlideChange = (swiper: TSwiper) => {
		setActiveIndex(swiper.activeIndex);
		setPicUrl(filteredImages[swiper.activeIndex]?.url);
	};

	const handleThumbSlideClick = (clickedUrl: string) => {
		const foundIndex = filteredImages.findIndex(
			(item) => item.url === clickedUrl,
		);
		if (foundIndex !== -1) {
			setActiveIndex(foundIndex);
			setPicUrl(clickedUrl);
		}
	};

	if (loadingThumb) {
		return <SkeletonProductThumb />;
	}

	return (
		<>
			<div
				className="relative"
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<Swiper
					spaceBetween={10}
					thumbs={{ swiper: thumbsSwiper }}
					modules={[FreeMode, Navigation, Thumbs]}
					navigation={{
						prevEl: prevRef.current,
						nextEl: nextRef.current,
					}}
					onSlideChange={handleSlideChange}
				>
					{filteredImages.map((item) => (
						<SwiperSlide key={item.url}>
							<InnerImageZoom
								src={item.url}
								zoomSrc={item.url}
								width={722}
								height={623}
								zoomType="hover"
								className="border-border dark:border-darkmode-border mb-6 max-h-[623px] rounded-md border"
							/>
						</SwiperSlide>
					))}
					<div
						id="navigation"
						className={`text-dark absolute top-1/2 z-10 block w-full -translate-y-1/2 px-6`}
					>
						<div
							ref={prevRef}
							className="bg-body absolute left-4 cursor-pointer rounded-md p-2 shadow-sm lg:p-4"
						>
							<HiOutlineArrowNarrowLeft size={24} />
						</div>
						<div
							ref={nextRef}
							className="bg-body absolute right-4 cursor-pointer rounded-md p-2 shadow-sm lg:p-4"
						>
							<HiOutlineArrowNarrowRight size={24} />
						</div>
					</div>
				</Swiper>
			</div>
			<Swiper
				onSwiper={setThumbsSwiper}
				spaceBetween={10}
				slidesPerView={4}
				freeMode
				watchSlidesProgress
				modules={[FreeMode, Navigation, Thumbs]}
			>
				{filteredImages.map((item) => (
					<SwiperSlide key={item.url}>
						<div
							onClick={() => handleThumbSlideClick(item.url)}
							className={`cursor-pointer overflow-hidden rounded-md ${
								picUrl === item.url
									? "border-theme-dark dark:border-darkmode-dark border"
									: "border-border dark:border-darkmode-border border"
							}`}
						>
							<img
								src={item.url}
								alt={item.altText}
								width={168}
								height={146}
								className="max-h-[146px]"
							/>
						</div>
					</SwiperSlide>
				))}
			</Swiper>
		</>
	);
};

export default ProductGallery;
