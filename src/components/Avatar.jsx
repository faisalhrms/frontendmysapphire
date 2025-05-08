
import Tooltip from "@components/Tooltip.jsx";
import React from "react";

const Avatar = ({ avatar, full_name = '', classes = '', parentClasses = '', size = 'sm', shape = 'rounded' }) => {

    const getInitials = (name) => {
        if (!name) return '';
        const names = name.trim().split(' ');
        if (names.length === 1) return names[0][0].toUpperCase();
        return (names[0][0] + names[1][0]).toUpperCase();
    };

    return (
        <span className={`avatar avatar-${shape} avatar-${size} ${parentClasses}`}>
            {avatar && avatar?.small_url ? (
                <img
                    className={classes}
                    src={avatar.small_url}
                    alt={avatar.file_name || 'Image'}

                    data-tooltip-id={full_name}
                    data-tooltip-content={full_name}
                />
            ) : (
                <span
                    data-tooltip-id={full_name}
                    data-tooltip-content={full_name}
                    className={`border  flex cursor-pointer  text-black ti-btn-primary hover:bg-none  rounded-lg  items-center justify-center w-full h-full dark:text-gray-200 dark:bg-bodybg `}>

                    {getInitials(full_name)}

                </span>
            )}

            <Tooltip
                id={full_name}
                tooltipContent={full_name}
            />
        </span>
    );
};

export default Avatar;
