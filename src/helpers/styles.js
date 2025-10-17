/**
 * Retrieves the value of a CSS variable from the root.
 *
 * @param {string} variableName - The name of the CSS variable (without '--').
 * @param defaultValue
 * @returns {string} - The value of the CSS variable.
 */
export const getCSSVariable = (variableName, defaultValue = '0, 0, 0') => {
    const value = getComputedStyle(document.documentElement).getPropertyValue(`--${variableName}`).trim();
    return value || defaultValue;
};

/**
 * Retrieves and formats a CSS color variable.
 * Converts space-separated values to comma-separated if necessary.
 * Returns a string in the format 'rgb(r, g, b)'.
 *
 * @param {string} variableName - The name of the CSS variable (without '--').
 * @param {string} defaultColor - The default color to return if the variable is not found or malformed.
 * @returns {string} - The formatted RGB color string.
 */
export const getFormattedColor = (variableName, defaultColor = '0, 0, 0') => {
    const value = getComputedStyle(document.documentElement).getPropertyValue(`--${variableName}`).trim();

    if (!value) {
        console.warn(`CSS variable --${variableName} is not defined. Using default color.`);
        return defaultColor;
    }
    if (value.includes(',')) {
        return value.replace(/\s+/g, '').replace(/,+/g, ',');
    } else {
        const parts = value.split(/\s+/);
        if (parts.length === 3) {
            return `rgb(${parts.join(', ')})`;
        } else if (parts.length === 4){
            return `rgba(${parts.join(', ')})`;
        }else
         {
            console.warn(`CSS variable --${variableName} is malformed. Expected 3 values, got ${parts.length}. Using default color.`);
            return defaultColor;
        }
    }
};

export const colorPalette = {
    primary: {
        background: "bg-primary/10",
        text: "text-primary",
        svgColor: "svg-primary",
        svgFill: "fill-primary",
        badge: "bg-primary",
    },
    secondary: {
        background: "bg-secondary/10",
        text: "text-secondary",
        svgColor: "svg-secondary",
        svgFill: "fill-secondary",
        badge: "bg-secondary",
    },
    success: {
        background: "bg-success/10",
        text: "text-success",
        svgColor: "svg-success",
        svgFill: "fill-success",
        badge: "bg-success",
    },
    danger: {
        background: "bg-danger/10",
        text: "text-danger",
        svgColor: "svg-danger",
        svgFill: "fill-danger",
        badge: "bg-danger",
    },
    warning: {
        background: "bg-warning/10",
        text: "text-warning",
        svgColor: "svg-warning",
        svgFill: "fill-warning",
        badge: "bg-warning",
    },
    info: {
        background: "bg-info/10",
        text: "text-info",
        svgColor: "svg-info",
        svgFill: "fill-info",
        badge: "bg-info",
    },
    gray: {
        background: "bg-gray/10",
        text: "text-gray",
        svgColor: "svg-gray",
        svgFill: "fill-gray",
        badge: "bg-gray",
    },
    purple: {
        background: "bg-purple/10",
        text: "text-purple",
        svgColor: "svg-purple",
        svgFill: "fill-purple",
        badge: "bg-purple",
    },

    orange: {
        background: "bg-orange/10",
        text: "text-orange",
        svgColor: "svg-orange",
        svgFill: "fill-orange",
        badge: "bg-orange",
    },
    red: {
        background: "bg-red/10",
        text: "text-red",
        svgColor: "svg-red",
        svgFill: "fill-red",
        badge: "bg-red",
    },
    yellow: {
        background: "bg-yellow/10",
        text: "text-yellow",
        svgColor: "svg-yellow",
        svgFill: "fill-yellow",
        badge: "bg-yellow",
    },
    teal: {
        background: "bg-teal/10",
        text: "text-teal",
        svgColor: "svg-teal",
        svgFill: "fill-teal",
        badge: "bg-teal",
    },
    indigo: {
        background: "bg-indigo/10",
        text: "text-indigo",
        svgColor: "svg-indigo",
        svgFill: "fill-indigo",
        badge: "bg-indigo",
    },
    green: {
        background: "bg-green/10",
        text: "text-green",
        svgColor: "svg-green",
        svgFill: "fill-green",
        badge: "bg-green",
    },
    cyan: {
        background: "bg-cyan/10",
        text: "text-cyan",
        svgColor: "svg-cyan",
        svgFill: "fill-cyan",
        badge: "bg-cyan",
    },
    blue: {
        background: "bg-blue/10",
        text: "text-blue",
        svgColor: "svg-blue",
        svgFill: "fill-blue",
        badge: "bg-blue",
    },
    pink:{
        background: "bg-pink/10",
        text: "text-pink",
        svgColor: "svg-pink",
        svgFill: "fill-pink",
        badge: "bg-pink",
    },
    default: {
        background: "bg-primary/10",
        text: "text-primary",
        svgColor: "svg-primary",
        svgFill: "fill-primary",
        badge: "bg-primary",
    },
};

export const getDynamicButtonStyle = (primaryColor, withBorder = false) => {
    const hexToRGBA = (hex, opacity = 1) => {
        let r = 0, g = 0, b = 0;

        if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        } else if (hex.length === 7) {
            r = parseInt(hex.slice(1, 3), 16);
            g = parseInt(hex.slice(3, 5), 16);
            b = parseInt(hex.slice(5, 7), 16);
        }

        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };

    return {
        defaultStyle: {
            color: primaryColor,
            backgroundColor: 'transparent',
            ...(withBorder && { borderColor: primaryColor }),
        },
        hoverStyle: {
            backgroundColor: hexToRGBA(primaryColor, 0.1),
        }
    };
};

export const hexToRgb = (hex) => {
    hex = hex.replace(/^#/, '');

    if (hex.length === 3) {
        hex = hex.split('').map((char) => char + char).join('');
    }

    if (hex.length !== 6) {
        throw new Error("Invalid hex color format");
    }

    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return `${r} ${g} ${b}`;
}

const generateExtendedColors = (baseCount = 50, totalCount = 200) => {
    // Start with some carefully chosen base colors
    const baseColors = [
        "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#6366f1",
        "#f97316", "#06b6d4", "#14b8a6", "#84cc16", "#a855f7", "#ef4444",
        "#1e40af", "#7e22ce", "#be185d", "#d97706", "#047857", "#4f46e5",
        "#ea580c", "#0e7490", "#0f766e", "#65a30d", "#7c3aed", "#dc2626"
    ];

    const colors = [...baseColors];
    const goldenRatio = 0.618033988749895;

    // Generate additional colors using HSL for better distribution
    for (let i = colors.length; i < totalCount; i++) {
        const hue = (i * goldenRatio * 360) % 360;
        // Vary saturation and lightness for more visual interest
        const saturation = 65 + Math.random() * 30; // 65-95%
        const lightness = 40 + Math.random() * 35; // 40-75%

        colors.push(`hsl(${Math.round(hue)}, ${Math.round(saturation)}%, ${Math.round(lightness)}%)`);
    }

    return colors;
};

export const DEFAULT_CHART_COLORS = generateExtendedColors(24, 200);