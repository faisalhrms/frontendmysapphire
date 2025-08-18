import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductShowcase() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const productImages = [
        "https://res.cloudinary.com/dtsguaevl/image/upload/v1755498700/7_u3xxug.jpg",
        "https://res.cloudinary.com/dtsguaevl/image/upload/v1755498754/5_yjr3ar.jpg",
        "https://res.cloudinary.com/dtsguaevl/image/upload/v1755501413/8_n6hprp.jpg",
    ];

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex(
            (prev) => (prev - 1 + productImages.length) % productImages.length
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-5xl mx-auto shadow-lg">
                <div className="grid grid-cols-1 lg:grid-cols-2 h-auto lg:h-screen">

                    <div className="relative bg-white flex flex-col justify-between">

                        <div className="block lg:hidden text-center p-4">
                            <img
                                src="https://res.cloudinary.com/dtsguaevl/image/upload/v1746519526/srl_logo_1_mabkez.jpg"
                                className="mx-auto"
                            />
                            <p className="text-base text-center text-black tracking-widest font-bold mt-2">
                                DAILY
                            </p>
                            <h2 className="text-base font-bold text-black mt-2 leading-tight">
                                3 PIECE - EMBROIDERED <br /> ZARI LAWN SUIT
                            </h2>
                        </div>

                        <div className="flex-1 relative flex items-center justify-center p-4">
                            <img
                                src={productImages[currentImageIndex]}
                                alt="Sapphire Daily Embroidered Suit"
                                className="max-h-[80vh] lg:max-h-[90%] w-auto object-contain"
                            />

                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-sm"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-700" />
                            </button>

                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-sm"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-700" />
                            </button>

                            <div className="absolute bottom-2 lg:bottom-6 left-6 lg:left-4 text-[15px] lg:text-xs text-gray-700 transform -rotate-90 origin-bottom-left font-light">
                                Not Actual product colour may vary slightly from the image
                            </div>
                        </div>

                        <div className="block lg:hidden px-6 pb-6">
                            <div className="mt-4 space-y-2 text-sm text-gray-800">
                                <div className="flex justify-between">
                                    <span>Printed Zari Lawn Shirt</span>
                                    <span className="font-semibold text-black">3.00m</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Printed Blended Chiffon Dupatta</span>
                                    <span className="font-semibold text-black">2.50m</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Dyed Embroidered Cotton Trouser</span>
                                    <span className="font-semibold text-black">2pc</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Embroidered Neckline</span>
                                    <span className="font-semibold text-black">1pc</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-2 mb-4">
                            <h3 className="text-sm font-bold text-black mb-4 tracking-wide text-center">
                                CARE INSTRUCTIONS
                            </h3>

                            <div className="flex justify-center space-x-3 mb-6">
                                {["🧺", "❌", "🔥", "📋"].map((icon, i) => (
                                    <div
                                        key={i}
                                        className="w-8 h-8 border border-gray-600 flex items-center justify-center bg-white"
                                    >
                                        <span className="text-sm">{icon}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs text-gray-800 max-w-md mx-auto text-left">
                                <div className="flex items-start">
                                    <span className="w-1.5 h-1.5 bg-black rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                                    <span>Home laundering recommended</span>
                                </div>
                                <div className="flex items-start">
                                    <span className="w-1.5 h-1.5 bg-black rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                                    <span>Iron at moderate temperature</span>
                                </div>
                                <div className="flex items-start">
                                    <span className="w-1.5 h-1.5 bg-black rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                                    <span>Do not expose damp fabric to strong sunlight</span>
                                </div>
                                <div className="flex items-start">
                                    <span className="w-1.5 h-1.5 bg-black rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                                    <span>Do not use any type of bleach or stain removing chemicals</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:flex bg-white p-12 flex-1 justify-center relative">
                        <div className="text-right w-full mb-16">
                            <div className="mb-12">
                                <h1 className="text-6xl font-black text-center text-black tracking-wider leading-none">
                                    <img
                                        src="https://res.cloudinary.com/dtsguaevl/image/upload/v1746519526/srl_logo_1_mabkez.jpg"
                                        className="mx-auto"
                                    />
                                </h1>
                                <p className="text-base text-center text-black tracking-widest font-bold mt-2">
                                    DAILY
                                </p>
                            </div>

                            <div className="mb-16">
                                <h2 className="text-xl text-center font-bold text-black leading-tight tracking-wide">
                                    3 PIECE - EMBROIDERED <br /> ZARI LAWN SUIT
                                </h2>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-800 font-normal">Printed Zari Lawn Shirt</span>
                                    <span className="text-black font-semibold">3.00m</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-800 font-normal">Printed Blended Chiffon Dupatta</span>
                                    <span className="text-black font-semibold">2.50m</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-800 font-normal">Dyed Embroidered Cotton Trouser</span>
                                    <span className="text-black font-semibold">2pc</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-800 font-normal">Embroidered Neckline</span>
                                    <span className="text-black font-semibold">1pc</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
