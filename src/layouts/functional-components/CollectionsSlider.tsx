import React, { useEffect, useRef, useState } from "react";
import {
	HiOutlineArrowNarrowLeft,
	HiOutlineArrowNarrowRight,
} from "react-icons/hi";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import SkeletonCategory from "./loadings/skeleton/SkeletonCategory";

const CollectionsSlider = ({ collections }: { collections: any }) => {
	const [_, setInit] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const [collectionsData, setCollectionsData] = useState([]);
	const [loadingCollectionsData, setLoadingCollectionsData] = useState(true);

	const prevRef = useRef(null);
	const nextRef = useRef(null);

	useEffect(() => {
		setCollectionsData(collections);
		setLoadingCollectionsData(false);
	}, [collections]);

	if (loadingCollectionsData) {
		return <SkeletonCategory />;
	}

	return (
		<section
			className="relative"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			aria-label="Collections Slider"
		>
			<Swiper
				modules={[Pagination, Navigation]}
				// navigation={true}
				slidesPerView={2}
				spaceBetween={10}
				breakpoints={{
					640: {
						slidesPerView: 2,
						spaceBetween: 20,
					},
					768: {
						slidesPerView: 3,
						spaceBetween: 24,
					},
					1024: {
						slidesPerView: 3,
						spaceBetween: 24,
					},
				}}
				navigation={{
					prevEl: prevRef.current,
					nextEl: nextRef.current,
				}}
				//trigger a re-render by updating the state on swiper initialization
				onInit={() => setInit(true)}
			>
				{collectionsData?.map((item: any) => {
					const { title, handle, image } = item;
					return (
						<SwiperSlide key={handle}>
							<div className="relative text-center">
								<img
									src={image?.url}
									width={424}
									height={306}
									alt={title}
									className="h-[150px] rounded-md object-cover md:h-[250px] lg:h-[306px]"
								/>
								<div className="py-6">
									<h3 className="h4 mb-2 font-medium">
										<a
											className="after:absolute after:inset-0"
											href={`/products?c=${handle}`}
										>
											{title}
										</a>
									</h3>
									<p className="text-light dark:text-darkmode-light text-xs md:text-xl">
										{item.products?.edges.length} items
									</p>
								</div>
							</div>
						</SwiperSlide>
					);
				})}

				<div
					className={`text-dark absolute top-[33%] z-10 hidden w-full px-4 md:block ${
						isHovered
							? "opacity-100 transition-opacity duration-300 ease-in-out"
							: "opacity-0 transition-opacity duration-300 ease-in-out"
					}`}
				>
					<div
						ref={prevRef}
						className="bg-body absolute left-4 cursor-pointer rounded-md p-2 shadow-sm lg:p-3"
					>
						<HiOutlineArrowNarrowLeft size={24} />
					</div>
					<div
						ref={nextRef}
						className="bg-body absolute right-4 cursor-pointer rounded-md p-2 shadow-sm lg:p-3"
					>
						<HiOutlineArrowNarrowRight size={24} />
					</div>
				</div>
			</Swiper>
		</section>
	);
};

export default CollectionsSlider;
