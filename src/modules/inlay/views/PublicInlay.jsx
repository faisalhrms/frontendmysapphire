import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "@css/inlay/inalay.css";

import sapphireb from "@assets/images/company-logos/sapphireb.png";
import sapphirew from "@assets/images/company-logos/sapphirew.png";
import iconsblack from "@assets/images/company-logos/iconsblack.png";
import iconswhite from "@assets/images/company-logos/iconswhite.png";

export default function PublicInlay() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const scrollRef = useRef(null);

    const productImages = [
        "https://be.mysapphire.co/media/uploads/2025/08/20/1.JPG",
        "https://be.mysapphire.co/media/uploads/2025/08/20/2.JPG",
        "https://be.mysapphire.co/media/uploads/2025/08/20/3.JPG",
        "https://be.mysapphire.co/media/uploads/2025/08/20/4.JPG",
        "https://be.mysapphire.co/media/uploads/2025/08/20/5.JPG",
        "https://be.mysapphire.co/media/uploads/2025/08/20/6.JPG",
        "https://be.mysapphire.co/media/uploads/2025/08/20/7.JPG",
        "https://be.mysapphire.co/media/uploads/2025/08/20/8.JPG",
    ];

    const nextImage = () => {
        const newIndex = (currentImageIndex + 1) % productImages.length;
        setCurrentImageIndex(newIndex);
        scrollToImage(newIndex);
    };

    const prevImage = () => {
        const newIndex =
            (currentImageIndex - 1 + productImages.length) % productImages.length;
        setCurrentImageIndex(newIndex);
        scrollToImage(newIndex);
    };

    const scrollToImage = (index) => {
        if (scrollRef.current) {
            const container = scrollRef.current;
            const child = container.children[index];
            container.scrollTo({
                left: child.offsetLeft,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-bodybg">
            <div className="w-full max-w-6xl bg-white dark:bg-gray-800 shadow-lg grid grid-cols-1 lg:grid-cols-2">

                <div className="relative flex flex-col items-center justify-between bg-white dark:bg-gray-800 order-2 lg:order-1">
                    <div className="relative w-full flex flex-col items-center">

                        <div className="flex flex-col items-center mb-6 lg:hidden mt-4">
                            <img src={sapphireb} alt="Logo" className="h-7 dark:hidden" />
                            <img src={sapphirew} alt="Logo Dark" className="h-7 hidden dark:block" />
                            <p className="gotham-medium text-sm tracking-widest mt-2 text-black dark:text-white font-bold">
                                DAILY
                            </p>
                            <h2 className="gotham-medium text-lg text-center text-black dark:text-gray-200 mt-3 leading-tight font-bold">
                                3 PIECE - EMBROIDERED <br /> ZARI LAWN SUIT
                            </h2>
                        </div>

                        <div
                            ref={scrollRef}
                            className="relative w-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                        >
                            {productImages.map((src, index) => (
                                <img
                                    key={index}
                                    src={src}
                                    alt={`Slide ${index + 1}`}
                                    className="w-full flex-shrink-0 snap-center object-contain"
                                    onLoad={() => {
                                        if (index === currentImageIndex) scrollToImage(index);
                                    }}
                                />
                            ))}
                        </div>

                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 dark:bg-gray-700/70 p-2 rounded-full mt-16"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 dark:bg-gray-700/70 p-2 rounded-full mt-16"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                        </button>

                        <div className="flex justify-center mt-4 space-x-2">
                            {productImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setCurrentImageIndex(index);
                                        scrollToImage(index);
                                    }}
                                    className={`w-2 h-2 rounded-full ${
                                        index === currentImageIndex
                                            ? " "
                                            : ""
                                    }`}
                                ></button>
                            ))}
                        </div>
                    </div>

                    <div className="block lg:hidden w-full px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="space-y-2 text-sm text-gray-800 dark:text-gray-200 max-w-md mx-auto text-left">
                            <div className="flex justify-between">
                                <span>Printed Zari Lawn Shirt</span>
                                <span className="gotham-medium">3.00m</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Printed Blended Chiffon Dupatta</span>
                                <span className="gotham-medium">2.50m</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Dyed Embroidered Cotton Trouser</span>
                                <span className="gotham-medium">2pc</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Embroidered Neckline</span>
                                <span className="gotham-medium">1pc</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-center text-sm text-black dark:text-white gotham-medium mb-2">
                            CARE INSTRUCTIONS
                        </h3>
                        <div className="flex justify-center mb-4">
                            <img src={iconsblack} alt="Care Icons" className="dark:hidden w-20"/>
                            <img src={iconswhite} alt="Care Icons Dark" className="hidden dark:block w-20"/>
                        </div>
                        <div
                            className="grid grid-cols-1 sm:grid-cols-2  text-xs text-gray-700 dark:text-gray-200 max-w-md mx-auto">
                            <ul className="list-disc pl-5 ">
                                <li>Home laundering recommended</li>
                                <li>Do not expose damp fabric to strong sunlight</li>
                            </ul>
                            <ul className="list-disc pl-5 ">
                                <li>Iron at moderate temperature</li>
                                <li>Do not use any type of bleach or stain removing chemicals</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-between p-10 order-1 lg:order-2 hidden lg:flex">
                    <div>
                        <div className="flex flex-col items-center mb-10">
                            <img src={sapphireb} alt="Logo" className="h-10 dark:hidden"/>
                            <img src={sapphirew} alt="Logo Dark" className="h-10 hidden dark:block"/>
                            <p className="gotham-medium text-sm tracking-widest mt-2 text-black dark:text-white">
                                DAILY
                            </p>
                        </div>
                        <h2 className="gotham-medium text-lg text-center text-black dark:text-gray-200 mb-10 leading-tight">
                            3 PIECE - EMBROIDERED <br /> ZARI LAWN SUIT
                        </h2>
                        <div className="space-y-3 gotham-normal text-sm text-gray-800 dark:text-gray-200">
                            <div className="flex justify-between">
                                <span>Printed Zari Lawn Shirt</span>
                                <span className="gotham-medium">3.00m</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Printed Blended Chiffon Dupatta</span>
                                <span className="gotham-medium">2.50m</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Dyed Embroidered Cotton Trouser</span>
                                <span className="gotham-medium">2pc</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Embroidered Neckline</span>
                                <span className="gotham-medium">1pc</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
