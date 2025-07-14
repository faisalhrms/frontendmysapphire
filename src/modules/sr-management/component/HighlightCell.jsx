import React from "react";

const HighlightCell = ({ children, highlight, className = "" }) => {
  const highlightClass = highlight ? "text-danger" : "";
  return <span className={`${className} ${highlightClass}`}>{children}</span>;
};

export default HighlightCell;
