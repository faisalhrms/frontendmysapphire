import React from "react";

const HighlightCell = ({ children, highlight, className = "" }) => {
  const highlightClass = highlight ? "text-primary" : "";
  return <span className={`${className} ${highlightClass}`}>{children}</span>;
};

export default HighlightCell;
