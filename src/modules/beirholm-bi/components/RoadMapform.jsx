import React, { useState } from 'react';
import { FaSearch, FaUsers, FaCalendarAlt, FaLightbulb, FaBullseye, FaCogs, FaMapMarkerAlt, FaRocket, FaChartLine, FaTrophy, FaGlobe } from 'react-icons/fa';

const RoadmapUI = () => {
    const [steps, setSteps] = useState([
        { id: 1, title: "STEP 01", icon: <FaSearch className="w-5 h-5" />, description: "Research and analyze market trends to identify opportunities and challenges in the current landscape." },
        { id: 2, title: "STEP 02", icon: <FaCogs className="w-5 h-5" />, description: "Develop comprehensive strategies and methodologies to address identified market needs." },
        { id: 3, title: "STEP 03", icon: <FaUsers className="w-5 h-5" />, description: "Build strategic partnerships and establish key relationships with industry stakeholders." },
        { id: 4, title: "STEP 04", icon: <FaCalendarAlt className="w-5 h-5" />, description: "Create detailed project timelines and milestone tracking systems for execution." },
        { id: 5, title: "STEP 05", icon: <FaLightbulb className="w-5 h-5" />, description: "Implement innovative solutions and optimize processes for maximum efficiency." },
        { id: 6, title: "STEP 06", icon: <FaBullseye className="w-5 h-5" />, description: "Achieve project goals and establish metrics for continuous improvement and growth." },
        { id: 7, title: "STEP 07", icon: <FaRocket className="w-5 h-5" />, description: "Launch and scale solutions while monitoring performance and gathering user feedback." },
        { id: 8, title: "STEP 08", icon: <FaChartLine className="w-5 h-5" />, description: "Analyze performance data and optimize strategies for sustained growth and success." },
        { id: 9, title: "STEP 09", icon: <FaTrophy className="w-5 h-5" />, description: "Celebrate achievements and establish long-term sustainability frameworks." },
        { id: 10, title: "STEP 10", icon: <FaGlobe className="w-5 h-5" />, description: "Expand globally and share knowledge to create positive industry impact." }
    ]);

    const cardWidth = 280;
    const cardHeight = 180;
    const leftMargin = 120;
    const minPadding = 200;
    const rightMargin = 200;
    const stepSpacing = 350;
    const roadCenterY = 400;
    const cardGap = 120;
    const containerWidth = Math.max(1600, (steps.length * stepSpacing) + leftMargin + rightMargin);

    const containerHeight = 1000;
    const viewBoxWidth = containerWidth;
    const viewBoxHeight = containerHeight;

    const addNewCard = () => {
        const icons = [FaLightbulb, FaMapMarkerAlt, FaRocket, FaChartLine, FaTrophy, FaGlobe];
        const newId = Math.max(...steps.map(s => s.id)) + 1;
        const randomIcon = icons[Math.floor(Math.random() * icons.length)];

        const newStep = {
            id: newId,
            title: `STEP ${newId.toString().padStart(2, '0')}`,
            icon: React.createElement(randomIcon, { className: "w-5 h-5" }),
            description: `Execute phase ${newId} of the roadmap with focus on deliverables and measurable outcomes for project success.`
        };

        setSteps([...steps, newStep]);
    };

    const removeCard = () => {
        if (steps.length > 1) {
            setSteps(steps.slice(0, -1));
        }
    };

    const generateRoadPath = () => {
        if (steps.length === 0) return "";

        let path = "M 100 400";
        const totalWidth = viewBoxWidth - 200;
        const segmentWidth = totalWidth / Math.max(1, steps.length - 1);

        for (let i = 0; i < steps.length; i++) {
            const x = 100 + i * segmentWidth;
            const isEven = i % 2 === 0;
            const currentY = isEven ? 350 : 450;

            if (i === 0) {
                path += ` L ${x + segmentWidth * 0.2} ${currentY}`;
            } else if (i === steps.length - 1) {
                const prevIsEven = (i - 1) % 2 === 0;
                const prevY = prevIsEven ? 350 : 450;

                if (prevY !== currentY) {
                    const controlX = x - segmentWidth * 0.4;
                    path += ` Q ${controlX} ${prevY} ${controlX} ${(prevY + currentY) / 2}`;
                    path += ` Q ${controlX} ${currentY} ${x} ${currentY}`;
                } else {
                    path += ` L ${x} ${currentY}`;
                }
                path += ` L ${x + 50} ${currentY}`;
            } else {
                const prevIsEven = (i - 1) % 2 === 0;
                const prevY = prevIsEven ? 350 : 450;

                if (prevY !== currentY) {
                    const controlX = x - segmentWidth * 0.3;
                    path += ` Q ${controlX} ${prevY} ${controlX} ${(prevY + currentY) / 2}`;
                    path += ` Q ${controlX} ${currentY} ${x} ${currentY}`;
                } else {
                    path += ` L ${x} ${currentY}`;
                }

                if (i < steps.length - 1) {
                    path += ` L ${x + segmentWidth * 0.3} ${currentY}`;
                }
            }
        }

        return path;
    };

    const getLocationPinPosition = (index) => {
        const totalWidth = viewBoxWidth - 200;
        const segmentWidth = totalWidth / Math.max(1, steps.length - 1);
        const x = 100 + index * segmentWidth;
        const isEven = index % 2 === 0;
        const y = isEven ? 350 : 450;
        return { x, y };
    };

    const getCardPosition = (index) => {
        const totalWidth = viewBoxWidth - 200;
        const segmentWidth = totalWidth / Math.max(1, steps.length - 1);
        const x = 100 + index * segmentWidth;
        const isEven = index % 2 === 0;

        const roadY = isEven ? 350 : 450;
        const cardY = isEven ? roadY - cardGap - (cardHeight / 2) : roadY + cardGap + (cardHeight / 2);

        return {
            x: x,
            y: cardY,
            leftPercent: (x / viewBoxWidth) * 100,
            topPercent: (cardY / viewBoxHeight) * 100
        };
    };

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50">


            <div className="overflow-x-auto relative z-10">
                <div className="relative" style={{ width: `${containerWidth}px`, height: `${containerHeight}px` }}>
                    <svg
                        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
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
                                            transform: scale(1.15);
                                            opacity: 0.8;
                                        }
                                        100% {
                                            transform: scale(1);
                                            opacity: 1;
                                        }
                                    }
                                `}
                            </style>

                            {/* Gradients */}
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

                        <path
                            d={generateRoadPath()}
                            stroke="#374151"
                            strokeWidth="60"
                            fill="none"
                            // strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {/* Road Center Line */}
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
                            const { x, y } = getLocationPinPosition(index);
                            return (
                                <g key={`pin-${step.id}`}>
                                    <ellipse
                                        cx={x}
                                        cy={y + 35}
                                        rx="12"
                                        ry="4"
                                        fill="rgba(0,0,0,0.3)"
                                        style={{
                                            animation: `pinPulse 2s ease-in-out infinite ${index * 0.3}s`
                                        }}
                                    />

                                    <g style={{
                                        animation: `pinBounce 2s ease-in-out infinite ${index * 0.5}s`,
                                        transformOrigin: `${x}px ${y + 30}px`
                                    }}>
                                        <path
                                            d={`M ${x} ${y - 25}
                                                C ${x - 15} ${y - 25} ${x - 25} ${y - 15} ${x - 25} ${y}
                                                C ${x - 25} ${y + 15} ${x} ${y + 35} ${x} ${y + 35}
                                                C ${x} ${y + 35} ${x + 25} ${y + 15} ${x + 25} ${y}
                                                C ${x + 25} ${y - 15} ${x + 15} ${y - 25} ${x} ${y - 25} Z`}
                                            fill="url(#pinGradient)"
                                            stroke="#fff"
                                            strokeWidth="3"
                                        />

                                        <circle
                                            cx={x}
                                            cy={y - 8}
                                            r="10"
                                            fill="white"
                                        />

                                        <circle
                                            cx={x}
                                            cy={y - 8}
                                            r="5"
                                            fill="#EF4444"
                                        />

                                        <text
                                            x={x}
                                            y={y - 5}
                                            textAnchor="middle"
                                            className="text-xs font-bold fill-white"
                                            style={{ fontSize: '8px' }}
                                        >
                                            {index + 1}
                                        </text>
                                    </g>
                                </g>
                            );
                        })}

                        {steps.map((step, index) => {
                            const pinPos = getLocationPinPosition(index);
                            const cardPos = getCardPosition(index);

                            return (
                                <g key={`connector-${step.id}`}>
                                    {/*<line*/}
                                    {/*    x1={pinPos.x}*/}
                                    {/*    y1={pinPos.y - 25}*/}
                                    {/*    x2={cardPos.x}*/}
                                    {/*    y2={cardPos.y}*/}
                                    {/*    stroke="url(#lineGradient)"*/}
                                    {/*    strokeWidth="2"*/}
                                    {/*    strokeDasharray="8,4"*/}
                                    {/*    opacity="0.7"*/}
                                    {/*    style={{*/}
                                    {/*        animation: `dash 3s linear infinite ${index * 0.2}s`*/}
                                    {/*    }}*/}
                                    {/*/>*/}

                                    {/* Connection Dot at Card */}
                                    {/*<circle*/}
                                    {/*    cx={cardPos.x}*/}
                                    {/*    cy={cardPos.y}*/}
                                    {/*    r="4"*/}
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
                    </svg>

                    {steps.map((step, index) => {
                        const cardPos = getCardPosition(index);

                        return (
                            <div
                                key={step.id}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                                style={{
                                    left: `${cardPos.leftPercent}%`,
                                    top: `${cardPos.topPercent}%`,
                                    marginLeft: index === 0 ? '100px' : '0'
                                }}
                            >
                                <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/30 w-72 hover:scale-110 hover:shadow-3xl transition-all duration-500 group hover:bg-white">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl text-gray-700 group-hover:from-pink-100 group-hover:to-orange-100 group-hover:scale-110 transition-all duration-300">
                                            {step.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                                                {step.title}
                                            </h3>
                                            <div className="text-xs text-gray-500 font-medium">
                                                Position {index + 1} of {steps.length}
                                            </div>
                                        </div>
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