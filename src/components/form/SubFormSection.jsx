import React from "react";

/**
 * A simple wrapper to group related form fields under a titled section.
 *
 * @param {string} title - The title of the section.
 * @param {ReactNode} children - The form fields to be grouped.
 * @param {number} [headingLevel=2] - The heading level for the title (1 to 6).
 * @param {string} [className=""] - Additional classes for the root element.
 * @param {...any} props - Additional props to pass to the root element.
 *
 * Usage:
 * <SubFormSection title="Section Title" headingLevel={3} className="custom-class">
 *   {... form fields ...}
 * </SubFormSection>
 */
const SubFormSection = ({ title, children, headingLevel = 2, className = "", ...props }) => {
    const Heading = `h${headingLevel}`;
    return (
        <div className={`box mb-4 ${className}`} {...props}>
            <div className="box-header">
                <Heading className="box-title">{title}</Heading>
            </div>
            <div className="box-body">
                {children}
            </div>
        </div>
    );
};

export default SubFormSection;