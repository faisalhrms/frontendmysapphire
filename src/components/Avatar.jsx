// import placeholder from "@assets/images/faces/avatar.webp";
//
// const Avatar = ({ avatar, classes = '', parentClasses ='',  size='sm', shape='rounded' }) => {
//     return (
//         <span className={`avatar avatar-${shape} avatar-${size} ${parentClasses}`}>
//             <img
//                 className={classes}
//                 src={avatar ? avatar.small_url : placeholder}
//                 alt={avatar ?avatar.file_name : 'Image'}
//             />
//         </span>
//     );
// };
// export default Avatar;
import placeholder from "@assets/images/faces/avatar.webp";

const Avatar = ({ avatar, full_name = '', classes = '', parentClasses = '', size = 'sm', shape = 'rounded' }) => {
    console.log("full name ", avatar);

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
                />
            ) : (
                <span className={`flex border border-100 text-black  rounded-lg  items-center justify-center w-full h-full dark:text-gray-200 dark:bg-bodybg ${classes}`}>
                    {getInitials(full_name)}

                </span>
            )}
        </span>
    );
};

export default Avatar;
