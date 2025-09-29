import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay, EffectCoverflow } from "swiper/modules";
import { BookOpen, FileText, Sparkles, Palette, Eye } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";

import PdfModalViewer from "@modules/policies/components/PdfModalViewer.jsx";

const images = import.meta.glob(
    "/src/assets/images/brand-book/*.jpg",
    { eager: true }
);

const slideImages = Object.keys(images)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((key) => images[key].default || images[key]);

export default function BrandBook() {
    const [modal, setModal] = useState({ open: false, fileId: null });
    const [currentSlide, setCurrentSlide] = useState(1);

    const openPdf = () => setModal({ open: true, fileId: 1248 });

    return (
        <div className="min-h-screen relative wop">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-info bg-opacity-20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo bg-opacity-20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full shadow-lg mb-6 border border-slate-200 dark:border-slate-700">
                        <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Visual Identity Guide
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 dark:from-white dark:via-indigo-200 dark:to-white bg-clip-text text-transparent">
                        SAPPHIRE Brand Book
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8 leading-relaxed">
                        Explore our complete visual identity, design principles, and brand guidelines
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <button
                            type="button"
                            onClick={openPdf}
                            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-primary text-white text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                        >
                            <FileText className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                            View Full PDF
                            <div className="absolute inset-0 rounded-2xl bg-primary opacity-0 group-hover:opacity-20 blur-xl transition-opacity"></div>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-indigo to-info rounded-xl">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-slate-900 dark:text-white">{slideImages.length}</div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">Total Pages</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-purple to-pink rounded-xl">
                                <Palette className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-slate-900 dark:text-white">2025</div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">Latest Version</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl">
                                <Eye className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-slate-900 dark:text-white">HD</div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">High Quality</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="relative">
                    <div className="absolute top-4 right-4 z-10 px-4 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full shadow-lg border border-slate-200 dark:border-slate-700">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Page {currentSlide} / {slideImages.length}
                        </span>
                    </div>

                    <Swiper
                        modules={[Pagination, Navigation, Autoplay, EffectCoverflow]}
                        effect="coverflow"
                        grabCursor={true}
                        centeredSlides={true}
                        slidesPerView="auto"
                        coverflowEffect={{
                            rotate: 50,
                            stretch: 0,
                            depth: 100,
                            modifier: 1,
                            slideShadows: true,
                        }}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true
                        }}
                        navigation={{
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        }}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true
                        }}
                        loop={true}
                        onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex + 1)}
                        className="rounded-3xl"
                        style={{ paddingBottom: '60px' }}
                    >
                        {slideImages.map((src, idx) => (
                            <SwiperSlide key={idx} style={{ width: '80%', maxWidth: '900px' }}>
                                <div className="group relative overflow-hidden rounded-3xl shadow-2xl bg-white dark:bg-slate-800 p-2">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                                    <img
                                        src={src}
                                        alt={`Brand Book Page ${idx + 1}`}
                                        className="w-full h-auto rounded-2xl object-contain transform group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <button className="swiper-button-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full shadow-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 hover:scale-110 transition-all duration-300 after:content-none">
                        <svg className="w-6 h-6 text-slate-100 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button className="swiper-button-next absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full shadow-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 hover:scale-110 transition-all duration-300 after:content-none">
                        <svg className="w-6 h-6 text-slate-100 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                <div className="mt-16 text-center">
                    <div className="inline-block bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-xl">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                            Need the complete guidelines?
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md">
                            Access the full PDF version with all brand assets, color codes, typography, and usage guidelines.
                        </p>
                        <button
                            type="button"
                            onClick={openPdf}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        >
                            <FileText className="w-5 h-5" />
                            Open Full Brand Book
                        </button>
                    </div>
                </div>
            </div>

            <PdfModalViewer
                isOpen={modal.open}
                fileId={modal.fileId}
                onClose={() => setModal({ open: false, fileId: null })}
            />
        </div>
    );
}