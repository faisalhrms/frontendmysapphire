import React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import PropTypes from 'prop-types';

const Tooltip = ({ id, tooltipContent, children }) => {
  return (
    <>
      <span data-tooltip-id={id}>
        {children}
      </span>
      <ReactTooltip
        className="z-[9999]" 
        id={id} 
        place="top"
        effect="float" 
        content={tooltipContent} 
      />
    </>
  );
};

Tooltip.propTypes = {
  id: PropTypes.string.isRequired,
  tooltipContent: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default Tooltip;
