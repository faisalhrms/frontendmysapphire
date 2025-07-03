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
        { id: 10, title: "STEP 10", icon: <FaGlobe className="w-5 h-5" />, description: "Expand globally and share knowledge to create positive industry impact." },
    ]);

    const cardWidth = 280;
    const cardHeight = 180;
    const leftMargin = 120;
    const rightMargin = 200;
    const stepSpacing = 350;
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

    // const generateRoadPath = () => {
    //     if (steps.length === 0) return "";
    //
    //     let path = "M 100 400";
    //     const totalWidth = viewBoxWidth - 200;
    //     const segmentWidth = totalWidth / Math.max(1, steps.length - 1);
    //
    //     for (let i = 0; i < steps.length; i++) {
    //         const x = 100 + i * segmentWidth;
    //         const isEven = i % 2 === 0;
    //         const currentY = isEven ? 350 : 450;
    //
    //         if (i === 0) {
    //             path += ` L ${x + segmentWidth * 0.2} ${currentY}`;
    //         } else if (i === steps.length - 1) {
    //             const prevIsEven = (i - 1) % 2 === 0;
    //             const prevY = prevIsEven ? 350 : 450;
    //
    //             if (prevY !== currentY) {
    //                 const controlX = x - segmentWidth * 0.4;
    //                 path += ` Q ${controlX} ${prevY} ${controlX} ${(prevY + currentY) / 2}`;
    //                 path += ` Q ${controlX} ${currentY} ${x} ${currentY}`;
    //             } else {
    //                 path += ` L ${x} ${currentY}`;
    //             }
    //             path += ` L ${x + 50} ${currentY}`;
    //         } else {
    //             const prevIsEven = (i - 1) % 2 === 0;
    //             const prevY = prevIsEven ? 350 : 450;
    //
    //             if (prevY !== currentY) {
    //                 const controlX = x - segmentWidth * 0.3;
    //                 path += ` Q ${controlX} ${prevY} ${controlX} ${(prevY + currentY) / 2}`;
    //                 path += ` Q ${controlX} ${currentY} ${x} ${currentY}`;
    //             } else {
    //                 path += ` L ${x} ${currentY}`;
    //             }
    //
    //             if (i < steps.length - 1) {
    //                 path += ` L ${x + segmentWidth * 0.3} ${currentY}`;
    //             }
    //         }
    //     }
    //
    //     return path;
    // };

    const generateRoadPath = () => {
        if (steps.length === 0) return ""

        const segmentLength = 300
        const cornerRadius = 40
        const verticalOffset = 80 // Controlled vertical movement
        let path = ""
        let currentX = 0
        let currentY = 500 // Center Y position
        let direction = "right"

        // Start the path
        path = `M ${currentX} ${currentY}`

        for (let i = 0; i < (steps.length*2)-1; i++) {
            if (i === 0) {
                // First segment - go right
                currentX += segmentLength
                path += ` L ${currentX} ${currentY}`
                direction = "right"
            } else {
                // Create balanced zigzag pattern
                const segmentIndex = i % 4
                let nextDirection = direction

                if (segmentIndex === 1) {
                    // Go down (but not too much)
                    nextDirection = "down"
                } else if (segmentIndex === 2) {
                    // Go right
                    nextDirection = "right"
                } else if (segmentIndex === 3) {
                    // Go up (back to balance)
                    nextDirection = "up"
                } else {
                    // Go right
                    nextDirection = "right"
                }

                // Add smooth corner transitions
                if (direction !== nextDirection) {
                    if (direction === "right" && nextDirection === "down") {
                        path += ` Q ${currentX + cornerRadius} ${currentY} ${currentX + cornerRadius} ${currentY + cornerRadius}`
                        currentX += cornerRadius
                        currentY += cornerRadius
                    } else if (direction === "down" && nextDirection === "right") {
                        path += ` Q ${currentX} ${currentY + cornerRadius} ${currentX + cornerRadius} ${currentY + cornerRadius}`
                        currentX += cornerRadius
                        currentY += cornerRadius
                    } else if (direction === "right" && nextDirection === "up") {
                        path += ` Q ${currentX + cornerRadius} ${currentY} ${currentX + cornerRadius} ${currentY - cornerRadius}`
                        currentX += cornerRadius
                        currentY -= cornerRadius
                    } else if (direction === "up" && nextDirection === "right") {
                        path += ` Q ${currentX} ${currentY - cornerRadius} ${currentX + cornerRadius} ${currentY - cornerRadius}`
                        currentX += cornerRadius
                        currentY -= cornerRadius
                    }
                }

                // Add straight segment with controlled length
                if (nextDirection === "right") {
                    currentX += segmentLength
                    path += ` L ${currentX} ${currentY}`
                } else if (nextDirection === "down") {
                    currentY += verticalOffset
                    path += ` L ${currentX} ${currentY}`
                } else if (nextDirection === "up") {
                    currentY -= verticalOffset
                    path += ` L ${currentX} ${currentY}`
                }

                direction = nextDirection
            }
        }

        return path
    }
    const getLocationPinPosition = (index) => {
        const totalWidth = viewBoxWidth - 200;
        const segmentWidth = totalWidth / Math.max(1, steps.length - 1);
        const x = 100 + index * segmentWidth;
        const isEven = index % 2 === 0;
        const y = isEven ? 430 : 670;
        return { x, y };
    };

    const getCardPosition = (index) => {
        const totalWidth = viewBoxWidth - 200;
        const segmentWidth = totalWidth / Math.max(1, steps.length - 1);
        const x = 100 + index * segmentWidth;
        const isEven = index % 2 === 0;

        const roadY = isEven ? 430 : 670;
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


            <div className="overflow-x-auto relative">
                <div className="relative" style={{ width: `${containerWidth}px`, height: `${containerHeight}px` }}>
                    {/* SVG Layer - Behind everything */}
                    <svg
                        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
                        className="absolute top-0 left-0 w-full h-full"
                        style={{ minWidth: '100%', zIndex: 1 }}
                    >
                        <defs>
                            <style>
                                {`
                                    @keyframes dash {
                                        to {
                                            stroke-dashoffset: -40;
                                        }
                                    }
                                    @keyframes dotMoveUp {
                                        0%, 100% {
                                            transform: translateY(0);
                                        }
                                        50% {
                                            transform: translateY(-15px);
                                        }
                                    }
                                    @keyframes dotMoveDown {
                                        0%, 100% {
                                            transform: translateY(0);
                                        }
                                        50% {
                                            transform: translateY(15px);
                                        }
                                    }
                                    @keyframes pinPulse {
                                        0% {
                                            transform: scale(1);
                                            opacity: 0.6;
                                        }
                                        50% {
                                            transform: scale(1.2);
                                            opacity: 0.8;
                                        }
                                        100% {
                                            transform: scale(1);
                                            opacity: 0.6;
                                        }
                                    }
                                    @keyframes lineGlow {
                                        0%, 100% {
                                            opacity: 0.4;
                                        }
                                        50% {
                                            opacity: 0.8;
                                        }
                                    }
                                `}
                            </style>

                            {/* Gradients */}
                            <linearGradient id="pinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#EF4444" />
                                <stop offset="100%" stopColor="#DC2626" />
                            </linearGradient>
                            <linearGradient id="grayGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#9CA3AF" />
                                <stop offset="100%" stopColor="#6B7280" />
                            </linearGradient>
                            <linearGradient id="connectorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#3B82F6" />
                                <stop offset="100%" stopColor="#1E40AF" />
                            </linearGradient>
                        </defs>

                        {/* Road */}
                        <path
                            d={generateRoadPath()}
                            stroke="#374151"
                            strokeWidth="60"
                            fill="none"
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

                        {/* Connector Lines from pins to cards */}
                        {steps.map((step, index) => {
                            const pinPos = getLocationPinPosition(index);
                            const cardPos = getCardPosition(index);
                            const isEven = index % 2 === 0;

                            return (
                                <g key={`connector-${step.id}`}>
                                    {/* Main connector line */}
                                    <line
                                        x1={pinPos.x}
                                        y1={pinPos.y}
                                        x2={cardPos.x}
                                        y2={cardPos.y}
                                        stroke="url(#connectorGradient)"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        style={{
                                            animation: `lineGlow 2s ease-in-out infinite ${index * 0.2}s`
                                        }}
                                    />

                                    {/* Glowing effect line */}
                                    <line
                                        x1={pinPos.x}
                                        y1={pinPos.y}
                                        x2={cardPos.x}
                                        y2={cardPos.y}
                                        stroke="#60A5FA"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        opacity="0.6"
                                        style={{
                                            filter: 'blur(2px)',
                                            animation: `lineGlow 2s ease-in-out infinite ${index * 0.2}s`
                                        }}
                                    />
                                </g>
                            );
                        })}

                        {/* Location Pins - Red pins with numbers */}
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
                                    />

                                    <g>
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

                        {/* Gray Dots - Alternating movement */}
                        {steps.map((step, index) => {
                            const pinPos = getLocationPinPosition(index);
                            const cardPos = getCardPosition(index);
                            const isEven = index % 2 === 0;

                            // Position gray dot between pin and card
                            const dotX = pinPos.x;
                            const dotY = (pinPos.y + cardPos.y) / 2;

                            return (
                                <g key={`gray-dot-${step.id}`}>
                                    <circle
                                        cx={dotX}
                                        cy={dotY}
                                        r="6"
                                        fill="url(#grayGradient)"
                                        stroke="#ffffff"
                                        strokeWidth="2"
                                        style={{
                                            animation: `${isEven ? 'dotMoveUp' : 'dotMoveDown'} 2s ease-in-out infinite ${index * 0.3}s, pinPulse 2s ease-in-out infinite ${index * 0.3}s`,
                                            transformOrigin: `${dotX}px ${dotY}px`
                                        }}
                                    />
                                </g>
                            );
                        })}
                    </svg>

                    {/* Cards Layer - Above everything */}
                    <div className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 50 }}>
                        {steps.map((step, index) => {
                            const cardPos = getCardPosition(index);

                            return (
                                <div
                                    key={step.id}
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                                    style={{
                                        left: `${cardPos.leftPercent}%`,
                                        top: `${cardPos.topPercent}%`,
                                        marginLeft: index === 0 ? '100px' : '0'
                                    }}
                                >
                                    <div className="bg-white rounded-3xl p-6 shadow-2xl border border-white/30 w-72 hover:scale-110 hover:shadow-3xl transition-all duration-500 group hover:bg-white/95 backdrop-blur-md">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="p-4 bg-primary/10 rounded-2xl text-gray-700 group-hover:from-pink-200 group-hover:to-orange-200 group-hover:scale-110 transition-all duration-300">
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
        </div>
    );
};

export default RoadmapUI;
// import React, { useState } from 'react';
// import { FaMapMarkerAlt } from 'react-icons/fa';
// const ManufacturingFlowDiagram = () => {
//     const [hoveredNode, setHoveredNode] = useState(null);
//
//     // Process nodes with exact positioning matching your image
//     const processes = [
//         // Top row
//         { id: 'spinning', name: 'Spinning', icon: '⚙️', x: 320, y: 160, type: 'inhouse', station: 'STM - 5' },
//         { id: 'yarn-dyeing', name: 'Yarn Dyeing', icon: '🎨', x: 600, y: 220, type: 'inhouse', station: 'STM - 10' },
//         { id: 'weaving', name: 'Weaving', icon: '🏗️', x: 880, y: 220, type: 'inhouse', station: 'STM - 6' },
//
//         // Left side inputs
//         { id: 'fiber', name: 'Fiber', icon: '🧵', x: 120, y: 280, type: 'outsource' },
//         { id: 'bci-cotton', name: 'BCI Cotton', icon: '🌱', x: 120, y: 380, type: 'outsource' },
//
//         // Middle row
//         { id: 'accessories', name: 'Accessories', icon: '🏷️', x: 600, y: 520, type: 'outsource' },
//         { id: 'packaging', name: 'Packaging', icon: '📦', x: 320, y: 640, type: 'outsource' },
//
//         // Bottom row
//         { id: 'stitching', name: 'Stitching', icon: '✂️', x: 760, y: 720, type: 'inhouse', station: 'STM - 7' },
//         { id: 'wadding', name: 'Wadding', icon: '🧽', x: 1040, y: 720, type: 'inhouse' },
//
//         // Right side
//         { id: 'processing', name: 'Processing', icon: '⚡', x: 1200, y: 380, type: 'inhouse', station: 'STM - 9' }
//     ];
//
//     // Sub-processes
//     const subProcesses = [
//         { id: 'labels', name: 'Labels', parent: 'accessories', x: 600, y: 580 },
//         { id: 'sewing-threads', name: 'Sewing Threads', parent: 'accessories', x: 600, y: 640 },
//         { id: 'carton', name: 'Carton', parent: 'packaging', x: 320, y: 700 },
//         { id: 'carton-tape', name: 'Carton Tape', parent: 'packaging', x: 320, y: 760 },
//         { id: 'poly-bags', name: 'Rec Poly Bags', parent: 'packaging', x: 320, y: 820 }
//     ];
//
//     // Flow connections with curves
//     const flowPaths = [
//         { path: "M 140 300 Q 220 300 300 300 Q 310 290 310 280 Q 310 190 310 180 Q 315 175 320 180", type: "road" },
//         { path: "M 340 180 Q 460 180 580 180 Q 590 200 590 220 Q 590 235 595 240 Q 597 240 600 240", type: "road" },
//         { path: "M 620 240 Q 750 240 860 240 Q 870 240 880 240", type: "road" },
//         { path: "M 900 240 Q 1040 240 1180 240 Q 1190 300 1190 350 Q 1195 355 1200 360", type: "road" },
//         { path: "M 580 540 Q 660 540 740 540 Q 750 620 750 680 Q 755 695 760 700", type: "road" },
//         { path: "M 340 660 Q 540 660 740 660 Q 750 690 750 710 Q 755 715 760 720", type: "road" },
//         { path: "M 780 720 Q 900 720 1020 720 Q 1030 720 1040 720", type: "road" },
//         { path: "M 1060 720 Q 1120 720 1180 720 Q 1190 560 1190 420 Q 1195 405 1200 400", type: "road" }
//     ];
//
//     const getLocationIconColor = (type) => {
//         return type === 'outsource' ? 'text-red' : 'text-blue';
//     };
//
//     const CardWithTail = ({ children, x, y, isStation = false, tailDirection = 'bottom' }) => {
//         const cardStyle = {
//             left: x,
//             top: y,
//             transform: 'translate(-50%, -50%)'
//         };
//
//         return (
//             <div className="absolute" style={cardStyle}>
//                 <div className={`relative ${isStation ? 'bg-gray-100 border-gray-300' : 'bg-white border-gray-200'} border rounded-lg px-3 py-2 shadow-md`}>
//                     {children}
//                     <div className={`absolute w-0 h-0 ${
//                         tailDirection === 'bottom'
//                             ? 'left-1/2 top-full transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white'
//                             : tailDirection === 'top'
//                                 ? 'left-1/2 bottom-full transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-white'
//                                 : tailDirection === 'left'
//                                     ? 'right-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-white'
//                                     : 'left-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-white'
//                     }`}></div>
//                     <div className={`absolute w-0 h-0 ${
//                         tailDirection === 'bottom'
//                             ? 'left-1/2 top-full transform -translate-x-1/2 translate-y-px border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-200'
//                             : tailDirection === 'top'
//                                 ? 'left-1/2 bottom-full transform -translate-x-1/2 -translate-y-px border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-200'
//                                 : tailDirection === 'left'
//                                     ? 'right-full top-1/2 transform -translate-y-1/2 -translate-x-px border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-gray-200'
//                                     : 'left-full top-1/2 transform -translate-y-1/2 translate-x-px border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-gray-200'
//                     }`} style={{ zIndex: -1 }}></div>
//                 </div>
//             </div>
//         );
//     };
//
//     return (
//         <div className="w-full h-screen  p-4 overflow-auto">
//             <div className="relative w-full h-full min-w-[1400px] min-h-[900px]">
//
//                 {/* Road/Path Network */}
//                 <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
//                     {flowPaths.map((road, index) => (
//                         <g key={index}>
//                             {/* Road shadow */}
//                             <path
//                                 d={road.path}
//                                 stroke="#1f2937"
//                                 strokeWidth="44"
//                                 fill="none"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 opacity="0.3"
//                                 transform="translate(2, 2)"
//                             />
//                             <path
//                                 d={road.path}
//                                 stroke="#374151"
//                                 strokeWidth="40"
//                                 fill="none"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                             />
//                             {/* Road inner surface */}
//                             <path
//                                 d={road.path}
//                                 stroke="#4b5563"
//                                 strokeWidth="36"
//                                 fill="none"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                             />
//                             {/* Road center line */}
//                             <path
//                                 d={road.path}
//                                 stroke="white"
//                                 strokeWidth="2"
//                                 fill="none"
//                                 strokeDasharray="10,10"
//                                 strokeLinecap="round"
//                                 className="animate-pulse"
//                             />
//                         </g>
//                     ))}
//                 </svg>
//
//                 {/* Process Location Pins */}
//                 {processes.map((process) => (
//                     <div
//                         key={process.id}
//                         className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
//                         style={{ left: process.x, top: process.y, zIndex: 10 }}
//                         onMouseEnter={() => setHoveredNode(process.id)}
//                         onMouseLeave={() => setHoveredNode(null)}
//                     >
//                         {/* Location Pin Icon */}
//                         <div className={`relative transition-all duration-300 ${hoveredNode === process.id ? 'scale-200' : 'scale-100'}`}>
//                             <FaMapMarkerAlt
//                                 size={48}
//                                 className={`${getLocationIconColor(process.type)} drop-shadow-lg`}
//                                 fill="currentColor"
//                             />
//
//                         </div>
//                     </div>
//                 ))}
//
//                 {processes.map((process) => {
//                     let cardX, cardY, tailDirection;
//
//                     switch(process.id) {
//                         case 'spinning':
//                             cardX = process.x;
//                             cardY = process.y - 80;
//                             tailDirection = 'bottom';
//                             break;
//                         case 'yarn-dyeing':
//                             cardX = process.x;
//                             cardY = process.y - 80;
//                             tailDirection = 'bottom';
//                             break;
//                         case 'weaving':
//                             cardX = process.x;
//                             cardY = process.y - 80;
//                             tailDirection = 'bottom';
//                             break;
//                         case 'fiber':
//                             cardX = process.x - 80;
//                             cardY = process.y - 40;
//                             tailDirection = 'right';
//                             break;
//                         case 'bci-cotton':
//                             cardX = process.x - 80;
//                             cardY = process.y + 40;
//                             tailDirection = 'right';
//                             break;
//                         case 'accessories':
//                             cardX = process.x - 100;
//                             cardY = process.y;
//                             tailDirection = 'right';
//                             break;
//                         case 'packaging':
//                             cardX = process.x - 100;
//                             cardY = process.y;
//                             tailDirection = 'right';
//                             break;
//                         case 'stitching':
//                             cardX = process.x;
//                             cardY = process.y + 80;
//                             tailDirection = 'top';
//                             break;
//                         case 'wadding':
//                             cardX = process.x;
//                             cardY = process.y + 80;
//                             tailDirection = 'top';
//                             break;
//                         case 'processing':
//                             cardX = process.x + 80;
//                             cardY = process.y;
//                             tailDirection = 'left';
//                             break;
//                         default:
//                             cardX = process.x;
//                             cardY = process.y > 400 ? process.y - 60 : process.y + 60;
//                             tailDirection = process.y > 600 ? 'bottom' : 'top';
//                     }
//
//                     return (
//                         <CardWithTail
//                             key={`card-${process.id}`}
//                             x={cardX}
//                             y={cardY}
//                             tailDirection={tailDirection}
//                         >
//                             <div className="text-sm font-medium text-gray-800 whitespace-nowrap flex items-center">
//                                 <span className="mr-2">{process.icon}</span>
//                                 {process.name}
//                             </div>
//                         </CardWithTail>
//                     );
//                 })}
//
//                 {/* Station Cards */}
//                 {processes.filter(p => p.station).map((process) => {
//                     let stationX, stationY, tailDirection;
//
//                     // Custom positioning for station cards to avoid overlaps
//                     switch(process.id) {
//                         case 'spinning':
//                             stationX = process.x;
//                             stationY = process.y - 120;
//                             tailDirection = 'bottom';
//                             break;
//                         case 'yarn-dyeing':
//                             stationX = process.x;
//                             stationY = process.y - 120;
//                             tailDirection = 'bottom';
//                             break;
//                         case 'weaving':
//                             stationX = process.x;
//                             stationY = process.y - 120;
//                             tailDirection = 'bottom';
//                             break;
//                         case 'stitching':
//                             stationX = process.x;
//                             stationY = process.y + 120;
//                             tailDirection = 'top';
//                             break;
//                         case 'processing':
//                             stationX = process.x + 120;
//                             stationY = process.y;
//                             tailDirection = 'left';
//                             break;
//                         default:
//                             stationX = process.x;
//                             stationY = process.y > 400 ? process.y - 100 : process.y + 100;
//                             tailDirection = process.y > 600 ? 'bottom' : 'top';
//                     }
//
//                     return (
//                         <CardWithTail
//                             key={`station-${process.id}`}
//                             x={stationX}
//                             y={stationY}
//                             isStation={true}
//                             tailDirection={tailDirection}
//                         >
//                             <div className="text-xs font-medium text-gray-700 whitespace-nowrap">
//                                 {process.station}
//                             </div>
//                         </CardWithTail>
//                     );
//                 })}
//
//                 {/* Sub-process Cards */}
//                 {subProcesses.map((subProcess) => (
//                     <CardWithTail
//                         key={subProcess.id}
//                         x={subProcess.x}
//                         y={subProcess.y}
//                         tailDirection="top"
//                     >
//                         <div className="text-sm text-gray-600 whitespace-nowrap text-center">
//                             {subProcess.name}
//                             <div className="text-gray-400 text-xs mt-1">+</div>
//                         </div>
//                     </CardWithTail>
//                 ))}
//
//                 {/* Process Info Panel */}
//                 {hoveredNode && (
//                     <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg border max-w-xs" style={{ zIndex: 20 }}>
//                         <div className="flex items-center mb-2">
//                             <FaMapMarkerAlt
//                                 size={24}
//                                 className={`${getLocationIconColor(processes.find(p => p.id === hoveredNode)?.type)} mr-2`}
//                                 fill="currentColor"
//                             />
//                             <h4 className="font-bold text-gray-800">
//                                 {processes.find(p => p.id === hoveredNode)?.name}
//                             </h4>
//                         </div>
//                         <p className="text-sm text-gray-600 mb-1">
//                             <span className="font-medium">Type:</span> {processes.find(p => p.id === hoveredNode)?.type === 'outsource' ? 'Outsourced' : 'In-house'}
//                         </p>
//                         {processes.find(p => p.id === hoveredNode)?.station && (
//                             <p className="text-sm text-gray-600">
//                                 <span className="font-medium">Station:</span> {processes.find(p => p.id === hoveredNode)?.station}
//                             </p>
//                         )}
//                     </div>
//                 )}
//
//             </div>
//         </div>
//     );
// };
//
// export default ManufacturingFlowDiagram;