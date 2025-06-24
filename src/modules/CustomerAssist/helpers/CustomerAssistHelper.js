// src/modules/CustomerAssist/helpers/CustomerAssistHelper.js

// Map normalized status keys to Tailwind CSS classes.
export const statusColorMap = {
    closed: {
        text: "text-sky-600",
        bg: "bg-sky-100",
        border: "border-sky-300",
    },
    resolved: {
        text: "text-emerald-600",
        bg: "bg-emerald-100",
        border: "border-emerald-300",
    },
    irrelevant: {
        text: "text-violet-600",
        bg: "bg-violet-100",
        border: "border-violet-300",
    },
    // Add more statuses if needed...
    default: {
        text: "text-gray-600",
        bg: "bg-gray-100",
        border: "border-gray-300",
    },
};

// Normalize a status string to a key in statusColorMap
export function normalizeStatus(status) {
    if (!status) return "default";
    const key = status.trim().toLowerCase();
    return statusColorMap[key] ? key : "default";
}

// Text color only
export function getStatusTextClass(status) {
    const key = normalizeStatus(status);
    return statusColorMap[key].text;
}

// Background color only (returns e.g. "bg-sky-100")
export function getStatusBgClass(status) {
    const key = normalizeStatus(status);
    return statusColorMap[key].bg;
}

// Border color only (returns e.g. "border-sky-300")
export function getStatusBorderClass(status) {
    const key = normalizeStatus(status);
    return statusColorMap[key].border;
}

/**
 * Full badge/pill style: bg + text + optional border + padding + rounded + font size
 * options.includeBorder (default true), options.size: "sm"|"md"|"lg"
 * Example: "bg-sky-100 text-sky-600 border border-sky-300 px-2 py-0.5 rounded-full text-xs font-medium"
 */
export function getStatusBadgeClass(status, options = {}) {
    const { includeBorder = true, size = "sm" } = options;
    const key = normalizeStatus(status);
    const { text, bg, border } = statusColorMap[key];

    let paddingCls = "";
    let textSize = "";
    if (size === "sm") {
        paddingCls = "px-2 py-0.5";
        textSize = "text-xs";
    } else if (size === "md") {
        paddingCls = "px-3 py-1";
        textSize = "text-sm";
    } else if (size === "lg") {
        paddingCls = "px-4 py-1.5";
        textSize = "text-base";
    }

    const borderCls = includeBorder ? `border ${border}` : "";
    return `${bg} ${text} ${borderCls} ${paddingCls} rounded-full ${textSize} font-medium`;
}

/**
 * Outlined pill: border + text + transparent bg
 * options.size: "sm"|"md"|"lg"
 * Example: "border border-sky-300 text-sky-600 bg-transparent px-2 py-0.5 rounded text-xs font-medium"
 */
export function getStatusOutlinedClass(status, options = {}) {
    const { size = "sm" } = options;
    const key = normalizeStatus(status);
    const { text, border } = statusColorMap[key];

    let paddingCls = "";
    let textSize = "";
    if (size === "sm") {
        paddingCls = "px-2 py-0.5";
        textSize = "text-xs";
    } else if (size === "md") {
        paddingCls = "px-3 py-1";
        textSize = "text-sm";
    } else if (size === "lg") {
        paddingCls = "px-4 py-1.5";
        textSize = "text-base";
    }
    return `border ${border} ${text} bg-transparent ${paddingCls} rounded ${textSize} font-medium`;
}
