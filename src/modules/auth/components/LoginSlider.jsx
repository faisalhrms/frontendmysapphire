import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, Navigation, Pagination} from "swiper/modules";
import img1 from "@assets/signInimgs/img1.jpg";
import img2 from "@assets/signInimgs/img2.jpeg";
import img3 from "@assets/signInimgs/img3.png";

const LoginSlider = () => {
    return (
        <>
            <div className="authentication-cover">
                <div className="aunthentication-cover-content rounded">
                    <div className="swiper keyboard-control">
                        <Swiper
                            spaceBetween={30}
                            navigation={true}
                            centeredSlides={true}
                            autoplay={{delay: 2500, disableOnInteraction: false}}
                            pagination={{clickable: true}}
                            modules={[Pagination, Autoplay, Navigation]}
                            className="mySwiper"
                        >
                            <SwiperSlide>
                                <div className="text-white text-center p-[3rem] flex items-center justify-center">
                                    <div>
                                        <div className="mb-[3rem]">
                                            <img src={img1} className="authentication-image" alt=""/>
                                        </div>
                                        <h6 className="font-semibold text-[1rem]">Sign In</h6>
                                        {/* <p className="font-normal text-[.875rem] opacity-[0.7]">
                                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsa eligendi
                                            expedita
                                            aliquam quaerat nulla voluptas facilis. Porro rem voluptates possimus, ad,
                                            autem
                                            quae culpa architecto, quam labore blanditiis at ratione.
                                        </p> */}
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="text-white text-center p-[3rem] flex items-center justify-center">
                                    <div>
                                        <div className="mb-[3rem]">
                                            <img src={img2} className="authentication-image" alt=""/>
                                        </div>
                                        <h6 className="font-semibold text-[1rem]">Sign In</h6>
                                        {/* <p className="font-normal text-[.875rem] opacity-[0.7]">
                                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsa eligendi
                                            expedita
                                            aliquam quaerat nulla voluptas facilis. Porro rem voluptates possimus, ad,
                                            autem
                                            quae culpa architecto, quam labore blanditiis at ratione.
                                        </p> */}
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="text-white text-center p-[3rem] flex items-center justify-center">
                                    <div>
                                        <div className="mb-[3rem]">
                                            <img src={img3} className="authentication-image" alt=""/>
                                        </div>
                                        <h6 className="font-semibold text-[1rem]">Sign In</h6>
                                        {/* <p className="font-normal text-[.875rem] opacity-[0.7]">
                                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsa eligendi
                                            expedita
                                            aliquam quaerat nulla voluptas facilis. Porro rem voluptates possimus, ad,
                                            autem
                                            quae culpa architecto, quam labore blanditiis at ratione.
                                        </p> */}
                                    </div>
                                </div>
                            </SwiperSlide>
                        </Swiper>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoginSlider