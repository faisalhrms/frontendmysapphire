

import React from 'react';
import {
    FaSearch,
    FaUsers,
    FaCalendarAlt,
    FaLightbulb,
    FaBullseye,
    FaCogs,
    FaMapMarkerAlt
} from 'react-icons/fa';

const RoadmapUI = () => {
    const steps = [
        {
            id: 1,
            title: "STEP 01",
            icon: <FaSearch className="w-4 h-4" />,
            description: "Research and analyze market trends...",
            position: { top: "35%", left: "7%" }
        },
        {
            id: 2,
            title: "STEP 02",
            icon: <FaCogs className="w-4 h-4" />,
            description: "Develop comprehensive strategies ...",
            position: { top: "12%", left: "28%" }
        },
        {
            id: 3,
            title: "STEP 03",
            icon: <FaUsers className="w-4 h-4" />,
            description: "Build strategic partnerships....",
            position: { top: "38%", left: "54%" }
        },
        {
            id: 4,
            title: "STEP 04",
            icon: <FaCalendarAlt className="w-4 h-4" />,
            description: "Create detailed project timelines...",
            position: { top: "66%", left: "50%" }
        },
        {
            id: 5,
            title: "STEP 05",
            icon: <FaLightbulb className="w-4 h-4" />,
            description: "Implement innovative solutions...",
            position: { top: "55%", left: "72%" }
        },
        {
            id: 6,
            title: "STEP 06",
            icon: <FaBullseye className="w-4 h-4" />,
            description: "Monitor performance metrics...",
            position: { top: "25%", left: "89%" }
        },
    ];

    return (
        <div className="min-h-screen p-4 overflow-x-auto">
            <div className="relative w-[1500px] h-[1000px]">

                <svg viewBox="0 0 1400 800" className="absolute top-0 left-0 w-full h-full z-10">
                    <path
                        d="M 5 400 L 200 400 Q 250 400 250 350 L 250 200 Q 250 150 300 150 L 500 150 Q 550 150 550 200 L 550 350 Q 550 400 600 400 L 800 400 Q 850 400 850 450 L 850 550 Q 850 600 900 600 L 1100 600 Q 1150 600 1150 550 L 1150 300 Q 1150 250 1200 250 L 1350 250"
                        stroke="#4B5563"
                        strokeWidth="40"
                        fill="none"
                    />
                    <path
                        d="M 5 400 L 200 400 Q 250 400 250 350 L 250 200 Q 250 150 300 150 L 500 150 Q 550 150 550 200 L 550 350 Q 550 400 600 400 L 800 400 Q 850 400 850 450 L 850 550 Q 850 600 900 600 L 1100 600 Q 1150 600 1150 550 L 1150 300 Q 1150 250 1200 250 L 1350 250"
                        stroke="#FFFFFF"
                        strokeWidth="1"
                        fill="none"
                        strokeDasharray="20,20"
                        style={{ animation: 'dash 3s linear infinite', strokeDashoffset: 0 }}
                    />
                </svg>

                {/* Desktop Cards */}
                <div className="hidden md:block absolute top-0 left-0 w-full h-full z-20">
                    {steps.map((step, index) => (
                        <div
                            key={step.id}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                            style={{
                                top: step.position.top,
                                left: step.position.left,
                            }}
                        >
                            {(  step.id === 4 || step.id === 7) && (
                                <div className="absolute inset-x-0 -top-9 left-1/2 transform -translate-x-1/2 z-10">
                                    <div
                                        className="w-8 h-8 bg-primary/40 rounded-full shadow-lg flex items-center justify-center animate-bounce">
                                        <div className="w-4 h-4 bi bi-geo-alt-fill   rounded-full"></div>
                                    </div>
                                </div>
                            )}

                            {(step.id === 1  || step.id === 5 || step.id === 7  || step.id === 6 || step.id === 8 || step.id === 2 || step.id === 3 ) && (
                                <div className="absolute inset-x-0 -bottom-9 left-1/2 transform -translate-x-1/2 z-10">
                                    <div
                                        className="w-8 h-8 bg-primary/40  rounded-full shadow-lg flex items-center justify-center animate-bounce">
                                        <div className="w-4 h-4 bi bi-geo-alt-fill  rounded-full"></div>
                                    </div>
                                </div>
                            )}





                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-white/20 w-60 hover:scale-105 transition-transform duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-gradient-to-br bg-primary/20 rounded-xl text-gray-700">
                                        {step.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800">{step.title}</h3>
                                </div>
                                <p className="text-gray-600 leading-relaxed text-sm">{step.description}</p>
                            </div>
                        </div>
))}
                </div>
            </div>
        </div>
    );
};

export default RoadmapUI;
