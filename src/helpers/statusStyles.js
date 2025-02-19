import {colorPalette, getFormattedColor} from "@helpers/styles.js";


/**
 * Maps each status to its corresponding main color theme.
 */
export const statusColorMapping = {
    "Open": "primary",
    "Expected Progress": "primary",
    "In Progress": "secondary",
    "Completed": "success",
    "Completed On Time": "success",
    "Done": "success",
    "Cancelled": "red",
    "Delayed": "red",
    "Archived": "red",
    "Overdue": "red",
    "On Hold": "warning",
    "Completed Late": "warning",
    "Overall": "primary",
    "Active": "primary",
    "Actual Progress": "success",
    "Brand New": "success",
    "Faulty": "red",
    "Overdue Tasks": "red",
    "Functional": "primary",
    "Lost": "warning",
    "Variance": "warning-fade",
    "Reopened": "yellow",
    "Sold To Employee": "secondary",
    "Total": "secondary",
    "Write Off": "cyan",
    "Temporary Allocation": "warning-fade",
    "N/A":"indigo",
    "Near Completion": "indigo",
    "Half Completed": "green",
    "Done Late": "green",
    "Not Started": "cyan",
};
/**
 * Retrieves the style classes based on the status.
 *
 * @param {string} status - The status of the task.
 * @returns {Object} An object containing style classes for different parts of the component.
 */
export const getStatusStyles = (status) => {
    const mainColor = statusColorMapping[status] || "default";
    return colorPalette[mainColor] || colorPalette["default"];
};

/**
 * Determines the styling based on the percentage change.
 *
 * @param {string} percentage_change - The percentage change string (e.g., "+25.0%", "-50.0%", "0%").
 * @returns {Object} An object containing the CSS class, icon class, and ARIA label.
 */
export const getChangeStyles = (percentage_change) => {
    if (percentage_change.startsWith("+")) {
        return {
            changeClass: "text-success",
            arrowIconClass: "ri-arrow-up-s-line",
            ariaLabel: "Increase",
        };
    } else if (percentage_change.startsWith("-")) {
        return {
            changeClass: "text-danger",
            arrowIconClass: "ri-arrow-down-s-line",
            ariaLabel: "Decrease",
        };
    } else {
        return {
            changeClass: "text-primary",
            arrowIconClass: "",
            ariaLabel: "No Change",
        };
    }
};

/**
 * Maps series data to RGB color strings based on statusColorMapping.
 *
 * @param {Array} series - Array of series objects, each containing at least a 'name' property.
 * @param {Object} statusColorMapping - Mapping of series names to color names.
 * @param {string} defaultColor - Default RGB values as a string (e.g., '0, 0, 0') if color is not found.
 * @returns {Array} - Array of RGB color strings.
 */
export const mapSeriesToColors = (series, statusColorMapping, defaultColor = '0, 0, 0') => {
    if (series && Array.isArray(series)) {
        return series.map((seriesItem) => {
            const colorName = statusColorMapping[seriesItem.name || seriesItem];
            if (colorName) {
               return getFormattedColor(colorName, defaultColor);
            }
            return `rgb(${defaultColor})`;
        });
    }
    return [];
};