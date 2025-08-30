// SweepersGuardsSubFormSection.jsx
import React from "react";

/**
 * A wrapper component to group related fields for the Sweepers & Guards form.
 *
 * @param {string} title - The section title.
 * @param {ReactNode} children - The form fields to render inside the section.
 * @param {string} [className=""] - Extra CSS classes for customization.
 * @param {...any} props - Additional props for the root element.
 *
 * Usage:
 * <SweepersGuardsSubFormSection title="Personal Details">
 *   {...fields...}
 * </SweepersGuardsSubFormSection>
 */
const SweepersGuardsSubFormSection = ({ title, children, className = "", ...props }) => {
    return (
        <div
            className={`sweepers-guards-section box shadow-md rounded-lg overflow-hidden ${className}`}
            {...props}
        >
            {/* Header */}
            <div className="box-header bg-gray-100 px-4 py-3 border-b">
                <h3 className="box-title text-base font-semibold text-gray-800">{title}</h3>
            </div>

            {/* Body */}
            <div className="box-body p-4 bg-white">{children}</div>
        </div>
    );
};

export default SweepersGuardsSubFormSection;
