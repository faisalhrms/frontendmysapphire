import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, XCircle } from "lucide-react";
import sapphireb from "@assets/images/company-logos/sapphireb.png";
import sapphirew from "@assets/images/company-logos/sapphirew.png";
import iconsblack from "@assets/images/company-logos/iconsblack.png";
import iconswhite from "@assets/images/company-logos/iconswhite.png";
import useDarkMode from "@redux/common/useDarkMode.js";
import { products } from "@modules/inlay/ProductData/productData.js";
import EmptyState from "@components/EmptyState.jsx";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules"; // Removed Autoplay
import "swiper/css";
import "swiper/css/navigation";

export default function PublicInlay() {
    const { code } = useParams();
    const isDark = useDarkMode();

    const product = products[code];

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <EmptyState
                    icon={XCircle}
                    heading="Product Not Found"
                    description={
                        <>
                            We couldn’t find a product for code:{" "}
                            <span className="font-mono font-bold">{code}</span>
                        </>
                    }
                />
            </div>
        );
    }

    const allImages = import.meta.glob("@assets/images/inlay-images/*.jpg", {
        eager: true,
    });

    const productImages = Object.keys(allImages)
        .filter((path) => path.includes(code))
        .sort((a, b) => {
            const getNum = (p) => {
                const match = p.match(/-(\d+)\.JPG$/);
                return match ? parseInt(match[1], 10) : 0;
            };
            return getNum(a) - getNum(b);
        })
        .map((path) => allImages[path].default);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-bodybg">
            <div className="w-full max-w-6xl bg-white dark:bg-gray-950 shadow-lg grid grid-cols-1 lg:grid-cols-2">

                {/* Left Section */}
                <div className="relative flex flex-col items-center justify-between bg-white dark:bg-gray-950 order-2 lg:order-1">
                    <div className="relative w-full flex flex-col items-center">
                        <div className="flex flex-col items-center mb-6 lg:hidden mt-4">
                            <img
                                src={isDark ? sapphirew : sapphireb}
                                alt="Logo"
                                className="h-10"
                            />

                            <h2 className="gotham-medium text-lg text-center text-black dark:text-gray-200 mt-3 leading-tight font-bold">
                                {product.name}
                            </h2>
                        </div>

                        <Swiper
                            modules={[Navigation]} // No Autoplay
                            loop={true}
                            navigation={{
                                nextEl: ".custom-next",
                                prevEl: ".custom-prev",
                            }}
                            className="w-full"
                        >
                            {productImages.map((src, index) => (
                                <SwiperSlide key={index}>
                                    <img
                                        src={src}
                                        alt={`Slide ${index + 1}`}
                                        className="w-full object-contain"
                                    />
                                </SwiperSlide>
                            ))}

                            <button className="custom-prev absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 dark:bg-gray-700/70 p-2 rounded-full z-10">
                                <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                            </button>
                            <button className="custom-next absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 dark:bg-gray-700/70 p-2 rounded-full z-10">
                                <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                            </button>
                        </Swiper>
                    </div>

                    <div className="w-full px-6 py-4 border-gray-200 dark:border-gray-700">
                        <h3 className="text-center text-sm text-black dark:text-white gotham-medium mb-2">
                            CARE INSTRUCTIONS
                        </h3>
                        <div className="flex justify-center mb-4">
                            <img
                                src={isDark ? iconswhite : iconsblack}
                                alt="Care Icons"
                                className="w-20"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 text-xs text-gray-700 dark:text-gray-200 max-w-md mx-auto">
                            <ul className="list-disc pl-5">
                                <li>Home laundering recommended</li>
                                <li>Do not expose damp fabric to strong sunlight</li>
                            </ul>
                            <ul className="list-disc pl-5">
                                <li>Iron at moderate temperature</li>
                                <li>Do not use any type of bleach or stain removing chemicals</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex flex-col justify-between p-10 order-1 lg:order-2 hidden lg:flex">
                    <div>
                        <div className="flex flex-col items-center mb-10">
                            <img
                                src={isDark ? sapphirew : sapphireb}
                                alt="Logo"
                                className="h-10"
                            />
                        </div>

                        <h2 className="gotham-medium text-lg text-center text-black dark:text-gray-200 mb-10 leading-tight whitespace-pre-line">
                            {product.name}
                        </h2>
                        <div className="space-y-3 gotham-normal text-sm text-gray-800 dark:text-gray-200">
                            {product.description.map((item, idx) => (
                                <div className="flex justify-between" key={idx}>
                                    <span>{item.label}</span>
                                    <span className="font-bold">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
