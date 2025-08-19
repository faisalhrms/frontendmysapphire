import React, { useState } from "react";

const ExpandableText = ({ content, maxLength = 100 }) => {
    const [expanded, setExpanded] = useState(false);

    const isHtml = content.includes("<");
    const plainText = isHtml ? content.replace(/<[^>]+>/g, "") : content;
    const shouldShowToggle = plainText.length > maxLength;

    return (
        <div className="group relative">
            <div
                className={`text-sm transition-all duration-300 ${
                    shouldShowToggle && !expanded
                        ? "truncate"
                        : "whitespace-pre-line break-words"
                }`}
            >
                {isHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                ) : (
                    content
                )}
            </div>

            {shouldShowToggle && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-primary hover:text-primary-800 text-xs font-medium mt-1 flex items-center transition-colors"
                >
                    {expanded ? (
                        <>
                            <i className="ri-arrow-up-s-line mr-1"></i>
                            Collapse
                        </>
                    ) : (
                        <>
                            <i className="ri-arrow-down-s-line mr-1"></i>
                            Read More
                        </>
                    )}
                </button>
            )}
        </div>
    );
};

export default ExpandableText;
