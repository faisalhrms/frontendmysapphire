import { useState, useEffect } from "react"
import { FaSpinner, FaTint, FaIndustry, FaCog, FaBox, FaTag, FaSeedling, FaCut, FaLayerGroup } from "react-icons/fa"

const InteractiveMap = () => {
    const [selectedPin, setSelectedPin] = useState(null)
    const [mapScale, setMapScale] = useState(1)
    const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [animationOffset, setAnimationOffset] = useState(0)
    const [showLabelsCard, setShowLabelsCard] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            setAnimationOffset((prev) => (prev + 1) % 100)
        }, 100)
        return () => clearInterval(interval)
    }, [])

    const mapPoints = [
        {
            id: "fiber",
            x: 169,
            y: 314,
            title: "Fiber",
            icon: <FaSeedling className="text-green" />,
            color: "blue",
            flowPosition: 0.05,
        },
        {
            id: "bci-cotton",
            x: 169,
            y: 380,
            title: "BCI Cotton",
            subtitle: "+",
            icon: <FaSeedling className="text-green" />,
            color: "blue",
            flowPosition: 0.1,
        },
        {
            id: "spinning",
            x: 420,
            y: 76,
            title: "Spinning",
            icon: <FaSpinner className="text-amber-600" />,
            color: "blue",
            flowPosition: 0.2,
        },
        {
            id: "stm5",
            x: 420,
            y: 122,
            title: "STM - 5",

            color: "blue",
            flowPosition: 0.25,
        },
        {
            id: "yarn-dyeing",
            x: 780,
            y: 75,
            title: "Yarn Dyeing",
            icon: <FaTint className="text-orange" />,
            color: "blue",
            flowPosition: 0.35,
        },
        {
            id: "stm10",
            x: 780,
            y: 122,
            title: "STM - 10",

            color: "blue",
            flowPosition: 0.4,
        },
        {
            id: "weaving",
            x: 1059,
            y: 75,
            title: "Weaving",
            icon: <FaIndustry className="text-blue" />,
            color: "blue",
            flowPosition: 0.5,
        },
        {
            id: "stm6",
            x: 1059,
            y: 120,
            title: "STM - 6",

            color: "blue",
            flowPosition: 0.55,
        },
        {
            id: "processing",
            x: 1240,
            y: 338,
            title: "Processing",
            icon: <FaCog className="text-blue" />,
            color: "blue",
            flowPosition: 0.65,
        },
        {
            id: "stm9",
            x: 1240,
            y: 379,
            title: "STM - 9",

            color: "blue",
            flowPosition: 0.7,
        },
        {
            id: "wadding",
            x: 1085,
            y: 650,
            title: "wadding",
            icon: <FaLayerGroup className="text-orange" />,
            color: "red",
            flowPosition: 0.75,
        },
        {
            id: "stitching",
            x: 820,
            y: 800,
            title: "Stitching",
            icon: <FaCut className="text-primary" />,
            color: "blue",
            flowPosition: 0.82,
        },
        {
            id: "wadding-blue",
            x: 820,
            y: 870,
            title: "Wadding",
            icon: <FaTag className="text-red" />,

            flowPosition: 0.85,
        },
        {
            id: "accessories",
            x: 420,
            y: 795,
            title: "Accessories",
            icon: <FaCog className="text-success" />,
            color: "blue",
            flowPosition: 0.88,
        },
        {
            id: "labels",
            x: 420,
            y: 860,
            title: "Labels",
            subtitle: "+",
            icon: <FaCut className="text-danger" />,
            color: "red",
            flowPosition: 0.9,
            hasSubItems: true,
        },
        {
            id: "sewing-thread",
            x: 420,
            y: 940,
            title: "Sewing Thread",
            subtitle: "+",
            icon: <FaCut className="text-pink" />,
            color: "red",
            flowPosition: 0.92,
        },
        {
            id: "packaging",
            x: 130,
            y: 660,
            title: "Packaging",
            icon: <FaBox className="text-red" />,
            color: "red",
            flowPosition: 0.92,
        },
        {
            id: "carton",
            x: 130,
            y: 720,
            title: "Carton",
            subtitle: "+",
            icon: <FaBox className="text-green" />,
            color: "red",
            flowPosition: 0.94,
        },
        {
            id: "carton-tape",
            x: 130,
            y: 790,
            title: "Carton Tape",
            subtitle: "+",
            icon: <FaBox className="text-red"  />,
            color: "red",
            flowPosition: 0.96,
        },
        {
            id: "poly-bags",
            x: 130,
            y: 850,
            title: "Rec Poly Bags",
            subtitle: "+",
            icon: <FaBox  className="text-red"  />,
            color: "red",
            flowPosition: 0.98,
        },
    ]

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

    const handlePinClick = (pinId) => {
        if (pinId === "labels") {
            setShowLabelsCard(true)
            setSelectedPin(pinId)
        } else {
            setSelectedPin(selectedPin === pinId ? null : pinId)
            setShowLabelsCard(false)
        }
    }

    const handleCloseLabelsCard = () => {
        setShowLabelsCard(false)
        setSelectedPin(null)
    }

    return (
        <div className="w-full h-screen mt-8 overflow-hidden relative">
            <div
                className="w-full h-full cursor-grab active:cursor-grabbing"
            >
                <div
                    className="relative"
                    style={{
                        width: "1400px",
                        height: "900px",
                        transform: `translate(${mapPosition.x}px, ${mapPosition.y}px) scale(${mapScale})`,
                        transformOrigin: "0 0",
                    }}
                >
                    <svg className="absolute inset-0 w-full h-full" width="800" height="600" viewBox="0 0 800 600">
                        <path
                            d="M 50 300 L 150 300 L 150 150 L 350 150 L 350 100 L 650 100 L 650 350 L 500 350 L 500 450 L 200 450 L 200 400 L 100 400"
                            stroke="#1a202c"
                            strokeWidth="42"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            opacity="0.3"
                            transform="translate(3, 3)"
                        />

                        <path
                            d="M 50 300 L 150 300 L 150 150 L 350 150 L 350 100 L 650 100 L 650 350 L 500 350 L 500 450 L 200 450 L 200 400 L 100 400"
                            stroke="url(#roadGradient)"
                            strokeWidth="40"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        <path
                            d="M 50 300 L 150 300 L 150 150 L 350 150 L 350 100 L 650 100 L 650 350 L 500 350 L 500 450 L 200 450 L 200 400 L 100 400"
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
                            <use href="#blueMarker" x="50" y="300"/>
                            <use href="#blueMarker" x="210" y="125"/>
                            <use href="#blueMarker" x="450" y="100"/>
                            <use href="#blueMarker" x="650" y="100"/>
                            <use href="#blueMarker" x="650" y="210"/>
                            <use href="#blueMarker" x="199" y="430"/>

                            <use href="#redMarker" x="650" y="350"/>
                            <use href="#redMarker" x="488" y="459"/>
                            <use href="#redMarker" x="100" y="400"/>
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
                                <path
                                    d="M12 0C5.373 0 0 5.373 0 12c0 7.732 12 20 12 20s12-12.268 12-20c0-6.627-5.373-12-12-12zm0 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"
                                    fill="#2563eb"
                                    stroke="white"
                                    strokeWidth="1.5"
                                />
                            </g>

                            <g id="redMarker" transform="translate(-12, -24)">
                                <path
                                    d="M12 0C5.373 0 0 5.373 0 12c0 7.732 12 20 12 20s12-12.268 12-20c0-6.627-5.373-12-12-12zm0 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"
                                    fill="#dc2626"
                                    stroke="white"
                                    strokeWidth="1.5"
                                />
                            </g>
                        </defs>

                    </svg>
                    {mapPoints.map((point) => (
                        <div
                            key={point.id}
                            className="absolute"
                            style={{
                                left: `${point.x}px`,
                                top: `${point.y}px`,
                                transform: "translate(-50%, -50%)",
                                zIndex: selectedPin === point.id ? 1000 : 100,
                            }}
                        >
                            {!showLabelsCard && (
                                <div
                                    className={`absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm border-2 border-gray-200 rounded-xl shadow-xl p-1 min-w-[160px] transition-all duration-300 ${
                                        selectedPin === point.id
                                            ? "scale-110 shadow-2xl border-blue-400 bg-white"
                                            : "hover:scale-105 hover:shadow-lg"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="text-2xl flex-shrink-0 p-2 rounded-lg bg-gray-50">{point.icon}</div>
                                        <div className="flex-1">
                                            <div
                                                className="font-bold text-sm text-gray-800 leading-tight">{point.title}</div>
                                            {point.subtitle &&
                                                <div className="text-xs text-gray-500 mt-1 ml-4">{point.subtitle}</div>}
                                        </div>
                                    </div>

                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                                        <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-transparent border-t-gray-200"></div>
                                        <div className="absolute -top-[8px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-transparent border-t-white"></div>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={() => handlePinClick(point.id)}
                                className={`relative z-10 w-14 h-18 transition-all duration-300 hover:scale-110 ${
                                    selectedPin === point.id ? "scale-125" : ""
                                }`}
                                style={{
                                    clipPath: "polygon(50% 100%, 0% 40%, 0% 0%, 100% 0%, 100% 40%)",
                                    filter: selectedPin === point.id ? "drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))" : "none",
                                }}
                            >
                                <div
                                    className={`w-full h-full ${
                                        point.color === "blue"
                                            ? " bg-blue hover:bg-blue"
                                            : " bg-red hover:bg-red"
                                    } shadow-lg`}
                                ></div>
                                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-inner">
                                    <div className="w-5 h-5  bg-gray-100 to-gray-200 rounded-full"></div>
                                </div>
                                {selectedPin === point.id && (
                                    <div className="absolute -inset-3 border-2 border-blue-400 rounded-full animate-ping opacity-75"></div>
                                )}
                            </button>
                        </div>
                    ))}

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
                            <div className="bg-white/95 backdrop-blur-sm border-2 border-gray-200 rounded-xl shadow-2xl p-4 min-w-[200px] max-w-[250px] animate-in fade-in duration-300">
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
                                            <div className={`w-full text-center px-4 py-2 rounded-full text-white font-medium ${company.color}`}>
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