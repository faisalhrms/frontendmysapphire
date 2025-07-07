import { useState, useEffect } from "react"

const InteractiveMap = () => {
    const [selectedPin, setSelectedPin] = useState(null)
    const [mapScale, setMapScale] = useState(1)
    const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [animationOffset, setAnimationOffset] = useState(0)
    const [showLabelsCard, setShowLabelsCard] = useState(false)
    const [expandedSubItems, setExpandedSubItems] = useState({})

    useEffect(() => {
        const interval = setInterval(() => {
            setAnimationOffset((prev) => (prev + 1) % 100)
        }, 100)
        return () => clearInterval(interval)
    }, [])

    const calculateCardPosition = (point, index) => {
        let yOffset = 0

        for (let i = 0; i < index; i++) {
            const prevPoint = mapPoints[i]
            if (expandedSubItems[prevPoint.id] && prevPoint.subItems) {

                if (Math.abs(prevPoint.x - point.x) < 200 && prevPoint.y < point.y) {
                    yOffset += prevPoint.subItems.length * 70
                }
            }
        }

        return {
            x: point.x,
            y: point.y + yOffset
        }
    }
    const mapPoints1 = [
        {
            id: "fiber",
            x: 100,
            y: 170,
            title: "Fiber",
            icon: <img src="https://res.cloudinary.com/dtsguaevl/image/upload/v1751622582/fiber_svg_zawcar.svg" alt="Fiber" className="w-10 h-10" />,            color: "blue",
            flowPosition: 0.05,
            highlighted: true,
        },
        {
            id: "bci-cotton",
            x: 100,
            y: 235,
            title: "BCI Cotton",
            subtitle: "+",
            color: "blue",
            flowPosition: 0.1,
            subItems: [
                { description: "South Asian Sourcing Pvt Ltd" },
            ],
            expanded: false,
        },
        {
            id: "spinning",
            x: 350,
            y: 15,
            title: "Spinning",
            icon: <img src="https://res.cloudinary.com/dtsguaevl/image/upload/v1751622649/spinning_svg_ctprca.svg" alt="Fiber" className="w-6 h-6" />,
            color: "blue",
            flowPosition: 0.2,
            highlighted: true,
        },
        {
            id: "stm5",
            x: 350,
            y: 50,
            title: "STM - 5",
            color: "blue",
            flowPosition: 0.25,
        },
        {
            id: "yarn-dyeing",
            x: 640,
            y: 70,
            title: "Yarn Dyeing",
            icon: <img src="https://res.cloudinary.com/dtsguaevl/image/upload/v1751624020/yarn_dyeing_svg_hcjmi8.svg" alt="Fiber" className="w-10 h-10" />,
            color: "blue",
            flowPosition: 0.35,
            highlighted: true,
        },
        {
            id: "stm10",
            x: 640,
            y: 128,
            title: "STM - 10",
            color: "blue",
            flowPosition: 0.4,
        },
        {
            id: "Weaving",
            x: 899,
            y: 70,
            title: "Weaving",
            icon: <img src="https://res.cloudinary.com/dtsguaevl/image/upload/v1751623481/weaving_svg_bwdrg1.svg" alt="Fiber" className="w-10 h-10" />,

            highlighted: true,
            flowPosition: 0.5,
        },
        {
            id: "stm6",
            x: 899,
            y: 128,
            title: "STM - 6",
            color: "blue",
            flowPosition: 0.55,
        },
        {
            id: "Processing",
            x: 1140,
            y: 305,
            title: "Processing",
            icon: <img src="https://res.cloudinary.com/dtsguaevl/image/upload/v1751622978/processing_svg_ctwovk.svg" alt="Fiber" className="w-10 h-10" />,            color: "blue",
            flowPosition: 0.65,
            highlighted: true,
        },
        {
            id: "stm9",
            x: 1140,
            y: 364,
            title: "STM - 9",
            color: "blue",
            flowPosition: 0.7,
        },
        {
            id: "wadding",
            x: 1009,
            y: 540,
            title: "Wadding",
            icon: <img src="https://res.cloudinary.com/dtsguaevl/image/upload/v1751623012/wadding_svg_yvu1q1.svg" alt="Fiber" className="w-10 h-10" />,
            color: "red",
            flowPosition: 0.75,
            highlighted: true,
        },
        {
            id: "stitching",
            x: 830,
            y: 540,
            title: "Stitching",
            icon: <img src="https://res.cloudinary.com/dtsguaevl/image/upload/v1751623689/stitching_svg_b4zb8r.svg" alt="Fiber" className="w-10 h-10" />,
            color: "blue",
            flowPosition: 0.82,
            highlighted: true,
        },
        {
            id: "stm7",
            x: 830,
            y: 597,
            title: "STM - 9",
            flowPosition: 0.85,
        },
        {
            id: "accessories",
            x: 556,
            y: 540,
            title: "Accessories",
            icon: <img src="https://res.cloudinary.com/dtsguaevl/image/upload/v1751622705/accessories_svg_p011ii.svg" alt="Fiber" className="w-10 h-10" />,
            color: "blue",
            flowPosition: 0.88,
            highlighted: true,
        },
        {
            id: "labels",
            x: 556,
            y: 610,
            title: "Labels",
            subtitle: "+",
            flowPosition: 0.9,
            hasSubItems: true,
            subItems: [
                { description: "High quality woven" },
                { description: "Cost effective" },
                { description: "Washing instructions" },
            ],
            expanded: false,
        },
        {
            id: "sewing-thread",
            x: 556,
            y: 680,
            title: "Sewing Thread",
            subtitle: "+",
            flowPosition: 0.92,
            subItems: [
                { description: "Strong and durable" },
                { description: "Natural fiber" },
            ],
            expanded: false,
        },
        {
            id: "packaging",
            x: 300,
            y: 550,
            title: "Packaging",
            icon: <img src="https://res.cloudinary.com/dtsguaevl/image/upload/v1751622788/packaging_svg_iegi0r.svg" alt="Fiber" className="w-10 h-10" />,
            color: "red",
            flowPosition: 0.92,
            highlighted: true,
        },
        {
            id: "carton",
            x: 300,
            y: 620,
            title: "Carton",
            subtitle: "+",
            color: "red",
            flowPosition: 0.94,
            subItems: [
                { description: "Carton Tape" },
                { description: "Sundus Packages" },
            ],
            expanded: false,
        },
        {
            id: "carton-tape",
            x: 300,
            y: 684,
            title: "Carton Tape",
            subtitle: "+",
            color: "red",
            flowPosition: 0.96,
            subItems: [
                { description: "Strong seal" },
                { description: "Eco-friendly" },
            ],
            expanded: false,
        },
        {
            id: "poly-bags",
            x: 300,
            y: 754,
            title: "Rec Poly Bags",
            subtitle: "+",
            color: "red",
            flowPosition: 0.98,
            subItems: [
                { description: "South Asian Sourcing Pvt Ltd" },
            ],
            expanded: false,
        },
    ]

    const [mapPoints, setMapPoints] = useState(mapPoints1)

    const labelCompanies = [
        { name: "Sitara Labels", color: "bg-red" },
        { name: "Karim Labels", color: "bg-red" },
        { name: "Euro Labels", color: "bg-red" }
    ]

    const handleMouseDown = (e) => {
        setIsDragging(true)
        setDragStart({ x: e.clientX - mapPosition.x, y: e.clientY - mapPosition.y })
    }

    const handleMouseMove = (e) => {
        if (isDragging) {
            setMapPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y,
            })
        }
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    const handleWheel = (e) => {
        e.preventDefault()
        const delta = e.deltaY > 0 ? 0.9 : 1.1
        setMapScale((prev) => Math.max(0.5, Math.min(3, prev * delta)))
    }

    const handleCloseLabelsCard = () => {
        setShowLabelsCard(false)
        setSelectedPin(null)
    }

    const handlePinClick = (pinId) => {
        console.log(pinId)

        const clickedPoint = mapPoints.find(point => point.id === pinId)

        if (clickedPoint && clickedPoint.subItems && clickedPoint.subItems.length > 0) {
            setExpandedSubItems(prev => ({
                ...prev,
                [pinId]: !prev[pinId]
            }))
        }

        setSelectedPin(selectedPin === pinId ? null : pinId)
    }

    const handleSubItemClick = (parentId, subItemIndex) => {
        console.log(`Clicked sub-item ${subItemIndex} of ${parentId}`)
    }

    return (
        <div className="w-full h-screen mt-8 overflow-auto relative">
            <div className="w-full h-full cursor-grab active:cursor-grabbing">
                <div
                    className="relative"
                    style={{
                        width: "1400px",
                        height: "720px",
                        transform: `translate(${mapPosition.x}px, ${mapPosition.y}px) scale(${mapScale})`,
                        transformOrigin: "0 0",
                    }}
                >
                    <svg className="absolute inset-0 ml-4 w-full h-full" width="1100" height="700" viewBox="0 0 800 600">
                        <path
                            d="M  -500 300 L -5 300 L -5 80 L 220 80 L 220 180 L 650 180 L 650 399 L 450 399 L 450 320 L 310 320 L 310 400 L -190 400"

                            strokeWidth="32"
                            fill="none"
                            strokeLinejoin="round"
                            opacity="0.3"
                            transform="translate(3, 3)"
                        />


                        <path
                            d="M  -500 300 L -5 300 L -5 80 L 220 80 L 220 180 L 650 180 L 650 399 L 450 399 L 450 320 L 310 320 L 310 400 L -190 400"
                            stroke="url(#roadGradient)"
                            strokeWidth="45"
                            fill="none"
                            strokeLinejoin="round"
                        />


                        <path
                            d="M  -500 300 L -5 300 L -5 80 L 220 80 L 220 180 L 650 180 L 650 399 L 450 399 L 450 320 L 310 320 L 310 400 L -190 400"
                            stroke="white"
                            strokeWidth="1"
                            fill="none"
                            strokeDasharray="25,20"
                            strokeDashoffset={-animationOffset}
                            strokeLinecap="round"
                        />


                        <g>
                            {[...Array(15)].map((_, i) => (
                                <circle key={i} r="4" fill="url(#particleGradient)" opacity="0.8">
                                    <animateMotion dur="8s" repeatCount="indefinite" begin={`${i * 0.5}s`}>
                                        <mpath href="#roadPath"/>
                                    </animateMotion>
                                </circle>
                            ))}
                        </g>

                        <g filter="url(#glowFilter)">
                            <use href="#redMarker" x="-10" y="170"/>
                            <use href="#blueMarker" x="110" y="89"/>
                            <use href="#blueMarker" x="350" y="185"/>
                            <use href="#blueMarker" x="569" y="185"/>
                            <use href="#blueMarker" x="650" y="270"/>
                            <use href="#redBlueMarker" x="270" y="399"/>

                            <use href="#blueMarker" x="640" y="409"/>
                            <use href="#blueMarker" x="488" y="410"/>
                            <use href="#redMarker" x="49" y="410"/>
                        </g>

                        <defs>
                            <linearGradient id="roadGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#374151"/>
                                <stop offset="50%" stopColor="#1f2937"/>
                                <stop offset="100%" stopColor="#111827"/>
                            </linearGradient>

                            <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                <feMerge>
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>

                            <path
                                id="roadPath"
                                d="M 50 300 L 150 300 L 150 150 L 350 150 L 350 100 L 650 100 L 650 350 L 500 350 L 500 450 L 200 450 L 200 400 L 100 400"
                            />

                            <g id="blueMarker" transform="translate(-12, -24)">
                                <image
                                    href="https://res.cloudinary.com/dtsguaevl/image/upload/v1751621408/blue_location_icon_svg_itujxr.svg"
                                    x="0"
                                    y="0"
                                    width="34"
                                    height="32"
                                />
                            </g>

                            <g id="redMarker" transform="translate(-12, -24)">
                                <image
                                    href="https://res.cloudinary.com/dtsguaevl/image/upload/v1751621545/red_location_icon_svg_hfnkfi.svg"
                                    x="0"
                                    y="0"
                                    width="34"
                                    height="32"
                                />
                            </g>

                            <g id="redBlueMarker" transform="translate(-12, -24)">
                                <image
                                    href="https://res.cloudinary.com/dtsguaevl/image/upload/v1751621505/red_blue_location_icon_svg_ddoicg.svg"
                                    x="0"
                                    y="0"
                                    width="50"
                                    height="50"
                                />
                            </g>
                        </defs>
                    </svg>
                    {mapPoints?.map((point, index) => {
                        const position = calculateCardPosition(point, index)
                        const isExpanded = expandedSubItems[point.id]

                        return (
                            <div key={point.id}>

                                <div
                                    className="absolute transition-all duration-300 ease-in-out"
                                    style={{
                                        left: `${position.x}px`,
                                        top: `${position.y}px`,
                                        transform: "translate(-50%, -50%)",
                                        zIndex: selectedPin === point.id ? 1000 : 100,
                                    }}
                                >
                                    {!showLabelsCard && (
                                        <div
                                            className={`backdrop-blur-sm border-2 border-gray-200 rounded-xl shadow-xl p-1 min-w-[166px] ${
                                                selectedPin === point.id
                                                    ? "scale-110 shadow-2xl border-blue-400 bg-white"
                                                    : point.highlighted
                                                        ? "bg-success/5"
                                                        : "bg-white/95 hover:shadow-lg"
                                            }`}
                                            onClick={() => handlePinClick(point.id)}
                                        >
                                            {point.icon ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="text-2xl flex-shrink-0 p-1 rounded-lg bg-gray-50">
                                                        {point.icon}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-bold text-sm text-gray-800 leading-tight">
                                                            {point.title}
                                                        </div>
                                                        {point.subtitle && (
                                                            <div
                                                                className="text-xs text-green ml-14 mt-1 font-semibold cursor-pointer hover:text-blue-800"
                                                            >
                                                                {isExpanded ? "−" : "+"}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center ">
                                                    <div className="text-center">
                                                        <div className="font-bold text-sm text-gray-800 leading-tight">
                                                            {point.title}
                                                        </div>
                                                        {point.subtitle && (
                                                            <div
                                                                className="text-xs text-green mt-1 font-semibold cursor-pointer hover:text-blue-800"
                                                            >
                                                                {isExpanded ? "−" : "+"}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                                                <div
                                                    className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-transparent border-t-gray-200"></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {isExpanded && point.subItems && (
                                    <div
                                        className="absolute transition-all duration-300 ease-in-out"
                                        style={{
                                            left: `${position.x}px`,
                                            top: `${position.y + 40}px`,
                                            transform: "translate(-50%, 0)",
                                            zIndex: 1001,
                                        }}
                                    >
                                        <div className="space-y-4 min-w-[200px]">
                                            {point.subItems.map((subItem, idx) => (
                                                <div
                                                    key={idx}
                                                    onClick={() => handleSubItemClick(point.id, idx)}
                                                    className="bg-white border-2 border-gray-300 rounded-xl shadow-lg px-1 py-3 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-200"
                                                >
                                                    <div className="text-center">
                                                        <div className="font-semibold text-sm text-gray-800">
                                                            {subItem.description}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                        )
                    })}

                    {showLabelsCard && (
                        <div
                            className="absolute"
                            style={{
                                left: "600px",
                                top: "400px",
                                transform: "translate(-50%, -50%)",
                                zIndex: 2000,
                            }}
                        >
                            <div
                                className="bg-white/95 backdrop-blur-sm border-2 border-gray-200 rounded-xl shadow-2xl p-2 min-w-[200px] max-w-[250px] animate-in fade-in duration-300">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-lg text-gray-800">Labels</h3>
                                    <button
                                        onClick={handleCloseLabelsCard}
                                        className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                                    >
                                        ×
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {labelCompanies.map((company, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                                        >
                                            <div
                                                className={`w-full text-center px-4 py-2 rounded-full text-white font-medium ${company.color}`}>
                                                {company.name}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}

export default InteractiveMap