import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import { BookOpen, FileText } from "lucide-react";
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

    const openPdf = () => setModal({ open: true, fileId: 1248 });

    return (
        <>
            <IconPageHeader
                heading="Brand Book"
                description="View complete SAPPHIRE Brand Book pages or open the full PDF."
                icon={BookOpen}
            >
                <button
                    type="button"
                    onClick={openPdf}
                    title="View Brand Book in PDF"
                    className="inline-flex items-center gap-2 px-4 py-2
                     rounded-full bg-slate-700 text-white text-sm font-medium
                     hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500
                     transition-colors duration-200 shadow-sm"
                >
                    <FileText className="w-5 h-5" />
                    Read Brand Book
                </button>
            </IconPageHeader>

            <div className="w-full max-w-5xl mx-auto pb-10">
                <Swiper
                    modules={[Pagination, Navigation, Autoplay]}
                    pagination={{ clickable: true }}
                    navigation
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    loop
                    className="rounded-2xl shadow-lg"
                >
                    {slideImages.map((src, idx) => (
                        <SwiperSlide key={idx}>
                            <img
                                src={src}
                                alt={`Brand Book Page ${idx + 1}`}
                                className="w-full h-auto rounded-2xl object-contain"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <PdfModalViewer
                isOpen={modal.open}
                fileId={modal.fileId}
                onClose={() => setModal({ open: false, fileId: null })}
            />
        </>
    );
}
