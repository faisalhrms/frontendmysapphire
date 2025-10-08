import React, { memo } from "react";
import { useSelector } from "react-redux";
import {
    Store,
    Users,
    Brush,
    Calculator,
    Settings,
    Truck,
    Scissors,
    ClipboardList,
    BarChart3,
    Factory,
    Package,
    Cpu,
    Building2,
    ShoppingBag,
    Shield,
    FileSpreadsheet,
    FileText,
    Globe2,
    TrendingUp,
    Warehouse,
} from "lucide-react";

const departmentThemes = {
    // 💻 Tech
    "Information Technology": {
        icon: <Cpu className="w-8 h-8" />,
        message: "Booting up your workspace...",
        tagline: "Even servers need their beauty sleep 😴💻",
    },
    "MIS - IT": {
        icon: <Settings className="w-8 h-8" />,
        message: "Configuring dashboards...",
        tagline: "Turning chaos into charts 📊✨",
    },
    "ERP": {
        icon: <FileSpreadsheet className="w-8 h-8" />,
        message: "Linking modules...",
        tagline: "Because Excel just wasn’t enough 😎",
    },

    // 👕 Retail + Store
    "Retail Operations": {
        icon: <Store className="w-8 h-8" />,
        message: "Folding digital shelves...",
        tagline: "Every click feels like a store visit 🛍️",
    },
    "Retail Stores": {
        icon: <ShoppingBag className="w-8 h-8" />,
        message: "Polishing store displays...",
        tagline: "Shining brighter than our window lights ✨",
    },
    "Retail Operations - International": {
        icon: <Globe2 className="w-8 h-8" />,
        message: "Connecting global stores...",
        tagline: "Making retail worldwide, one byte at a time 🌍",
    },

    // 🧵 Textile & Production
    "Design Studio": {
        icon: <Brush className="w-8 h-8" />,
        message: "Mixing shades and stitches...",
        tagline: "Designs so good, even fabric blushes 🎨🧶",
    },
    "Product Development": {
        icon: <Factory className="w-8 h-8" />,
        message: "Crafting your next masterpiece...",
        tagline: "Turning threads into trends 👗✨",
    },
    "Quality": {
        icon: <Shield className="w-8 h-8" />,
        message: "Inspecting pixels for perfection...",
        tagline: "Because even buttons deserve QA 🧵🔍",
    },
    "Production": {
        icon: <Factory className="w-8 h-8" />,
        message: "Synchronizing sewing lines...",
        tagline: "Sew fast, sew good, sew Sapphire 🪡",
    },
    "Stitching": {
        icon: <Scissors className="w-8 h-8" />,
        message: "Threading virtual needles...",
        tagline: "Every pixel perfectly stitched 👕",
    },
    "Cutting": {
        icon: <Scissors className="w-8 h-8" />,
        message: "Sharpening digital blades...",
        tagline: "Clean cuts, sharp logic ✂️🧠",
    },
    "Finishing": {
        icon: <Package className="w-8 h-8" />,
        message: "Adding final touches...",
        tagline: "Every detail matters, just like in our fabrics 🧴✨",
    },

    // 🧾 Corporate
    "Accounts & Finance": {
        icon: <Calculator className="w-8 h-8" />,
        message: "Balancing the books...",
        tagline: "We count everything — except calories 💰🍪",
    },
    "Administration": {
        icon: <ClipboardList className="w-8 h-8" />,
        message: "Organizing your workspace...",
        tagline: "Keeping order in the world of chaos 🗂️",
    },
    "Human Resources": {
        icon: <Users className="w-8 h-8" />,
        message: "Syncing employee data...",
        tagline: "Because people are our real assets 💼❤️",
    },
    "Internal Audit": {
        icon: <FileText className="w-8 h-8" />,
        message: "Checking all corners...",
        tagline: "We find errors even Excel missed 👀",
    },
    "Management": {
        icon: <Building2 className="w-8 h-8" />,
        message: "Strategizing your dashboard...",
        tagline: "Leading with vision, powered by data 📈",
    },
    "Marketing": {
        icon: <TrendingUp className="w-8 h-8" />,
        message: "Cooking up campaigns...",
        tagline: "Creativity with a touch of ROI 🔥📢",
    },
    "Performance Marketing": {
        icon: <BarChart3 className="w-8 h-8" />,
        message: "Analyzing ad performance...",
        tagline: "Clicks, conversions & caffeine ☕📊",
    },
    "Corporate Communication": {
        icon: <Users className="w-8 h-8" />,
        message: "Aligning brand messages...",
        tagline: "We talk textile, fluently 🗣️🧵",
    },

    // 🚚 Operations
    "Supply Chain": {
        icon: <Truck className="w-8 h-8" />,
        message: "Mapping delivery routes...",
        tagline: "We move fabric faster than your Wi-Fi 🚛💨",
    },
    "Warehouse & Logistics": {
        icon: <Warehouse className="w-8 h-8" />,
        message: "Sorting inventory...",
        tagline: "Making space for perfection 📦",
    },
    "Purchase": {
        icon: <Scissors className="w-8 h-8" />,
        message: "Reviewing purchase orders...",
        tagline: "We buy smart, we save smarter 💸",
    },

    // 🧠 Special & Misc
    "Research & Development": {
        icon: <Factory className="w-8 h-8" />,
        message: "Experimenting with ideas...",
        tagline: "Innovation stitched daily 🧬",
    },
    "Engineering": {
        icon: <Settings className="w-8 h-8" />,
        message: "Calibrating machines...",
        tagline: "We make steel dance to our rhythm ⚙️",
    },
    "Security": {
        icon: <Shield className="w-8 h-8" />,
        message: "Scanning digital checkpoints...",
        tagline: "Your data’s safer than our fabric stock 🔐",
    },
    "Civil": {
        icon: <Building2 className="w-8 h-8" />,
        message: "Laying digital foundations...",
        tagline: "Building structures that last — in code too 🧱",
    },
};

const defaultTheme = {
    icon: <Store className="w-8 h-8" />,
    message: "Loading data...",
    tagline: "Crafted with precision & detail — just like our fabrics 🧵",
};

const LoadingSpinner = memo(() => {
    const { employee } = useSelector((state) => state.auth.user || {});
    const departmentName = employee?.department?.name || "";
    const theme =
        Object.entries(departmentThemes).find(([key]) =>
            departmentName.toLowerCase().includes(key.toLowerCase())
        )?.[1] || defaultTheme;

    return (
        <div className="flex flex-col justify-center items-center min-h-[250px]">
            {/* Spinning ring */}
            <div className="relative w-16 h-16 flex justify-center items-center mb-3 animate-spin-slow">
                <div className="absolute inset-0 rounded-full border-4 border-gray-200 border-t-[rgb(var(--primary))]"/>
                {theme.icon}
            </div>

            {/* Message */}
            <p className="mt-3 text-sm font-medium text-gray-700 animate-pulse">
                {theme.message}
            </p>

            {/* Tagline */}
            <p className="text-xs text-gray-500 mt-1 italic text-center max-w-[260px] leading-relaxed">
                {theme.tagline}
            </p>
        </div>
    );
});

export default LoadingSpinner;
