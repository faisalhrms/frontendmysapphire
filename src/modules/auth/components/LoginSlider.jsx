import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, EffectCreative, Pagination} from "swiper/modules";
import img1 from "@assets/signInimgs/1.jpg";
import img2 from "@assets/signInimgs/2.jpg";
import img3 from "@assets/signInimgs/3.jpg";
import img4 from "@assets/signInimgs/4.webp";
import img5 from "@assets/signInimgs/5.webp";

const LoginSlider = () => {
    return (
        <div className="h-full w-full relative">
            <Swiper
                grabCursor={true}
                effect={'creative'}
                creativeEffect={{
                    prev: {
                        shadow: true,
                        translate: ['-20%', 0, -1],
                        opacity: 0,
                    },
                    next: {
                        translate: ['100%', 0, 0],
                        opacity: 0,
                    },
                }}
                speed={1400}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    dynamicBullets: false,
                }}
                loop={true}
                modules={[EffectCreative, Autoplay, Pagination]}
                className="h-full w-full"
            >
                <SwiperSlide>
                    <div className="relative h-full w-full">
                        <div className="absolute inset-0 overflow-hidden">
                            <img
                                src={img1}
                                className="h-full w-full object-cover scale-105 animate-slow-zoom"
                                alt="Sapphire Fashion"
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20"></div>
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div className="relative h-full w-full">
                        <div className="absolute inset-0 overflow-hidden">
                            <img
                                src={img2}
                                className="h-full w-full object-cover scale-105 animate-slow-zoom"
                                alt="Sapphire Collection"
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-pink-600/20"></div>
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div className="relative h-full w-full">
                        <div className="absolute inset-0 overflow-hidden">
                            <img
                                src={img3}
                                className="h-full w-full object-cover scale-105 animate-slow-zoom"
                                alt="Sapphire Style"
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 via-transparent to-blue-600/20"></div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="relative h-full w-full">
                        <div className="absolute inset-0 overflow-hidden">
                            <img
                                src={img4}
                                className="h-full w-full object-cover scale-105 animate-slow-zoom"
                                alt="Sapphire Style"
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 via-transparent to-blue-600/20"></div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="relative h-full w-full">
                        <div className="absolute inset-0 overflow-hidden">
                            <img
                                src={img5}
                                className="h-full w-full object-cover scale-105 animate-slow-zoom"
                                alt="Sapphire Style"
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 via-transparent to-blue-600/20"></div>
                    </div>
                </SwiperSlide>
            </Swiper>

            <style jsx>{`
                @keyframes slowZoom {
                    0% {
                        transform: scale(1.05);
                    }
                    100% {
                        transform: scale(1.15);
                    }
                }

                .animate-slow-zoom {
                    animation: slowZoom 10s ease-out infinite alternate;
                }

                /* Custom Pagination */
                :global(.swiper-pagination) {
                    bottom: 40px !important;
                    left: 40px !important;
                    width: auto !important;
                    text-align: left;
                }

                :global(.swiper-pagination-bullet) {
                    background: white;
                    opacity: 0.5;
                    width: 10px;
                    height: 10px;
                    margin: 0 6px !important;
                    transition: all 0.3s ease;
                }

                :global(.swiper-pagination-bullet-active) {
                    opacity: 1;
                    width: 32px;
                    border-radius: 5px;
                    background: white;
                }
            `}</style>
        </div>
    )
}

export default LoginSlider