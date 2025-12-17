import React from "react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface ButtonProps {
	show: boolean;
	text: string;
	link: string;
}

interface SlideProps {
	title: string;
	description: string;
	image: string;
	alt: string;
	button: ButtonProps;
}

interface SlideShowProps {
	slides: SlideProps[];
}

const SlideShow: React.FC<SlideShowProps> = ({ slides }) => {
	return (
		<>
			<Swiper
				autoplay={{
					delay: 3000,
					pauseOnMouseEnter: true,
				}}
				navigation={{
					nextEl: ".custom-swiper-nav-next",
					prevEl: ".custom-swiper-nav-prev",
				}}
				pagination={{
					clickable: true,
					bulletClass: "banner-pagination-bullet",
					bulletActiveClass: "banner-pagination-bullet-active",
				}}
				modules={[Autoplay, Pagination, Navigation]}
				autoHeight={true}
			>
				{slides.map((slide, index) => (
					<SwiperSlide key={index}>
						<div className="grid grid-cols-1 items-center gap-4 px-12 py-12 md:grid-cols-2 lg:px-16">
							<div className="order-2 lg:order-0">
								<div className="py-10 text-center lg:py-0">
									<div>
										<h3 className="mx-auto mb-4 text-2xl font-bold md:text-4xl lg:mb-10">
											{slide.title}
										</h3>
									</div>
									<p className="text-light dark:text-darkmode-text mb-4 font-light md:text-xl lg:mb-8">
										{slide.description}
									</p>
									{slide.button && slide.button.show && (
										<a
											className="btn btn-sm md:btn-lg btn-primary"
											href={slide.button.link}
										>
											{slide.button.text}
										</a>
									)}
								</div>
							</div>

							<div>
								<img
									src={slide.image}
									className="mx-auto max-h-[350px] w-auto rounded-md sm:max-h-[500px]"
									alt={slide.alt}
								/>
							</div>
						</div>
					</SwiperSlide>
				))}
				<div className="custom-swiper-nav-next swiper-button-next"></div>
				<div className="custom-swiper-nav-prev swiper-button-prev"></div>
			</Swiper>
		</>
	);
};

export default SlideShow;
