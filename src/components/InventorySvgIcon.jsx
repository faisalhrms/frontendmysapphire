import React from "react";

const InventorySvgIcon = ({ styles, me = 'me-6' }) => {
    return (
        <div className={`svg-icon-background ${styles.background} ${styles.text} !${styles.svgFill} ${me}`}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className={`${styles.svgColor}`}
            >
                <path d="M19 10H5c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7c0-1.1-.9-2-2-2zM18 17H6v-2h12v2zm0-4H6v-2h12v2z"/>
                <path d="M12 1L2 6v2h20V6l-10-5zm0 3.6l7 3.5V10H5V8.1l7-3.5z"/>
            </svg>
        </div>
    )
}

export default InventorySvgIcon;