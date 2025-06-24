import React from "react";

const Avatar = ({ avatar, full_name = '', classes = '', parentClasses = '', size = 'sm', shape = 'rounded' }) => {

    const bgColors = ['ti-btn-primary','ti-btn-success','ti-btn-warning' , 'ti-btn-danger','ti-btn-info'];

    const getRandomColor = (colorArray) => {
        const randomIndex = Math.floor(Math.random() * colorArray.length);
        return colorArray[randomIndex];
    };

    const randomBgColor = getRandomColor(bgColors);

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
                    className={`flex cursor-pointer ${randomBgColor} hover:bg-none rounded-full items-center justify-center w-full h-full `}>
                    {getInitials(full_name)}
                </span>
            )}
        </span>
    );
};

export default React.memo(Avatar);
