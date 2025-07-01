import React, { useState } from 'react';
import { FaSearch, FaUsers, FaCalendarAlt, FaLightbulb, FaBullseye, FaCogs, FaMapMarkerAlt } from 'react-icons/fa';

const RoadmapUI = () => {
    const [steps, setSteps] = useState([
        { id: 1, title: "STEP 01", icon: <FaSearch className="w-5 h-5" />, description: "Research and analyze market trends to identify opportunities and challenges in the current landscape." },
        { id: 2, title: "STEP 02", icon: <FaCogs className="w-5 h-5" />, description: "Develop comprehensive strategies and methodologies to address identified market needs." },
        { id: 3, title: "STEP 03", icon: <FaUsers className="w-5 h-5" />, description: "Build strategic partnerships and establish key relationships with industry stakeholders." },
        { id: 4, title: "STEP 04", icon: <FaCalendarAlt className="w-5 h-5" />, description: "Create detailed project timelines and milestone tracking systems for execution." },
        { id: 5, title: "STEP 05", icon: <FaLightbulb className="w-5 h-5" />, description: "Implement innovative solutions and optimize processes for maximum efficiency." },
        { id: 6, title: "STEP 06", icon: <FaBullseye className="w-5 h-5" />, description: "Achieve project goals and establish metrics for continuous improvement and growth." },
    ]);

    // Dynamic calculations
    const cardWidth = 280;
    const minPadding = 350;
    const stepSpacing = 400;
    const containerWidth = Math.max(1600, (steps.length * stepSpacing) + (minPadding * 2));
    const viewBoxWidth = containerWidth;

    // Generate dynamic road path
    const generateRoadPath = () => {
        if (steps.length === 0) return "";

        let path = "M 150 400";
        const totalWidth = viewBoxWidth - 300;
        const segmentWidth = totalWidth / Math.max(1, steps.length - 1);

        for (let i = 0; i < steps.length; i++) {
            const x = 150 + i * segmentWidth;
            const isEven = i % 2 === 0;

            if (i === 0) {
                path += ` L ${x + segmentWidth * 0.3} 400`;
            } else if (i === steps.length - 1) {
                const prevIsEven = (i - 1) % 2 === 0;
                const startY = prevIsEven ? 400 : 600;
                const endY = 400;

                if (startY !== endY) {
                    path += ` Q ${x - segmentWidth * 0.3} ${startY} ${x - segmentWidth * 0.3} ${(startY + endY) / 2}`;
                    path += ` Q ${x - segmentWidth * 0.3} ${endY} ${x} ${endY}`;
                }
                path += ` L ${x + segmentWidth * 0.2} ${endY}`;
            } else {
                const prevIsEven = (i - 1) % 2 === 0;
                const currentY = isEven ? 400 : 600;
                const prevY = prevIsEven ? 400 : 600;

                if (prevY !== currentY) {
                    const midX = x - segmentWidth * 0.3;
                    path += ` Q ${midX} ${prevY} ${midX} ${(prevY + currentY) / 2}`;
                    path += ` Q ${midX} ${currentY} ${x} ${currentY}`;
                } else {
                    path += ` L ${x} ${currentY}`;
                }

                if (i < steps.length - 1) {
                    path += ` L ${x + segmentWidth * 0.4} ${currentY}`;
                }
            }
        }

        return path;
    };

    const getLocationPinPosition = (index) => {
        const totalWidth = viewBoxWidth - 300;
        const segmentWidth = totalWidth / Math.max(1, steps.length - 1);
        const x = 150 + index * segmentWidth;
        const y = index % 2 === 0 ? 400 : 600;
        return { x, y };
    };

    const getCardYPosition = (index) => {
        const isEven = index % 2 === 0;
        const baseTopPercent = isEven ? 30 : 70;

        if (index === 1 || index === 3) {
            return isEven ? '10%' : '90%';
        }

        return `${baseTopPercent}%`;
    };

    const getCardSVGY = (index) => {
        const isEven = index % 2 === 0;

        if (index === 1 || index === 3) {
            return isEven ? 80 : 720;
        }

        return isEven ? 240 : 560;
    };

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50">


            <div className="overflow-x-auto relative z-10">
                <div className="relative" style={{ width: `${containerWidth}px`, height: '900px' }}>
                    <svg
                        viewBox={`0 0 ${viewBoxWidth} 800`}
                        className="absolute top-0 left-0 w-full h-full z-30"
                        style={{ minWidth: '100%' }}
                    >
                        <defs>
                            <style>
                                {`
                                    @keyframes dash {
                                        to {
                                            stroke-dashoffset: -40;
                                        }
                                    }
                                    @keyframes pinBounce {
                                        0%, 20%, 50%, 80%, 100% {
                                            transform: translateY(0);
                                        }
                                        40% {
                                            transform: translateY(-8px);
                                        }
                                        60% {
                                            transform: translateY(-4px);
                                        }
                                    }
                                    @keyframes pinPulse {
                                        0% {
                                            transform: scale(1);
                                            opacity: 1;
                                        }
                                        50% {
                                            transform: scale(1.1);
                                            opacity: 0.8;
                                        }
                                        100% {
                                            transform: scale(1);
                                            opacity: 1;
                                        }
                                    }
                                `}
                            </style>
                        </defs>

                        <path
                            d={generateRoadPath()}
                            stroke="#374151"
                            strokeWidth="50"
                            fill="none"

                        />

                        <path
                            d={generateRoadPath()}
                            stroke="#FFFFFF"
                            strokeWidth="3"
                            fill="none"
                            strokeDasharray="20,20"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                                animation: 'dash 4s linear infinite',
                                strokeDashoffset: 0
                            }}
                        />

                        {steps.map((step, index) => {
                            if (index === 5) return null;

                            const { x, y } = getLocationPinPosition(index);
                            return (
                                <g key={`pin-${step.id}`}>
                                    <ellipse
                                        cx={x}
                                        cy={y + 35}
                                        rx="8"
                                        ry="3"
                                        fill="rgba(0,0,0,0.2)"
                                        style={{
                                            animation: `pinPulse 2s ease-in-out infinite ${index * 0.3}s`
                                        }}
                                    />

                                    <g style={{
                                        animation: `pinBounce 2s ease-in-out infinite ${index * 0.5}s`,
                                        transformOrigin: `${x}px ${y + 30}px`
                                    }}>
                                        <path
                                            d={`M ${x} ${y - 20} 
                                                C ${x - 12} ${y - 20} ${x - 22} ${y - 10} ${x - 22} ${y + 2}
                                                C ${x - 22} ${y + 14} ${x} ${y + 30} ${x} ${y + 30}
                                                C ${x} ${y + 30} ${x + 22} ${y + 14} ${x + 22} ${y + 2}
                                                C ${x + 22} ${y - 10} ${x + 12} ${y - 20} ${x} ${y - 20} Z`}
                                            fill="url(#pinGradient)"
                                            stroke="#fff"
                                            strokeWidth="2"
                                        />

                                        <circle
                                            cx={x}
                                            cy={y - 5}
                                            r="8"
                                            fill="white"
                                        />

                                        <circle
                                            cx={x}
                                            cy={y - 5}
                                            r="4"
                                            fill="#EF4444"
                                        />
                                    </g>
                                </g>
                            );
                        })}

                        {steps.map((step, index) => {
                            if (index === 5) return null;

                            const { x, y } = getLocationPinPosition(index);
                            const totalWidth = viewBoxWidth - 300;
                            const segmentWidth = totalWidth / Math.max(1, steps.length - 1);
                            const cardX = 150 + index * segmentWidth;
                            const cardY = getCardSVGY(index);

                            return (
                                <g key={`line-${step.id}`}>
                                    {/*<line*/}
                                    {/*    x1={x}*/}
                                    {/*    y1={y - 20}*/}
                                    {/*    x2={cardX}*/}
                                    {/*    y2={cardY}*/}
                                    {/*    stroke="url(#lineGradient)"*/}
                                    {/*    */}
                                    {/*    strokeWidth="3"*/}
                                    {/*    strokeDasharray="6,4"*/}
                                    {/*    opacity="0.6"*/}
                                    {/*    style={{*/}
                                    {/*        animation: `dash 3s linear infinite ${index * 0.2}s`*/}
                                    {/*    }}*/}
                                    {/*/>*/}

                                    {/*<circle*/}
                                    {/*    cx={cardX}*/}
                                    {/*    cy={cardY}*/}
                                    {/*    r="6"*/}
                                    {/*    fill="url(#dotGradient)"*/}
                                    {/*    stroke="white"*/}
                                    {/*    strokeWidth="2"*/}
                                    {/*    style={{*/}
                                    {/*        animation: `pinPulse 1.5s ease-in-out infinite ${index * 0.3}s`*/}
                                    {/*    }}*/}
                                    {/*/>*/}
                                </g>
                            );
                        })}

                        <defs>
                            <linearGradient id="pinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#EF4444" />
                                <stop offset="100%" stopColor="#DC2626" />
                            </linearGradient>
                            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#EF4444" />
                                <stop offset="100%" stopColor="#F97316" />
                            </linearGradient>
                            <radialGradient id="dotGradient" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#EF4444" />
                                <stop offset="100%" stopColor="#DC2626" />
                            </radialGradient>
                        </defs>
                    </svg>

                    {/* Step Cards */}
                    {steps.map((step, index) => {
                        const totalWidth = viewBoxWidth - 300;
                        const segmentWidth = totalWidth / Math.max(1, steps.length - 1);
                        const xPosition = 150 + index * segmentWidth;
                        const leftPercent = (xPosition / viewBoxWidth) * 100;
                        const topPercent = getCardYPosition(index);

                        return (
                            <div
                                key={step.id}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                                style={{
                                    left: `${leftPercent}%`,
                                    top: topPercent
                                }}
                            >
                                <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/30 w-72 hover:scale-105 hover:shadow-3xl transition-all duration-500 group">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl text-gray-700 group-hover:from-pink-100 group-hover:to-orange-100 transition-all duration-300">
                                            {step.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                                            {step.title}
                                        </h3>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed text-sm group-hover:text-gray-700 transition-colors">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default RoadmapUI;