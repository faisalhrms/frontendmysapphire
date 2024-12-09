import placeholder from "@assets/images/faces/avatar.webp";

const Avatar = ({ avatar, classes = '', parentClasses ='',  size='sm', shape='rounded' }) => {
    return (
        <span className={`avatar avatar-${shape} avatar-${size} ${parentClasses}`}>
            <img
                className={classes}
                src={avatar ? avatar.small_url : placeholder}
                alt={avatar ?avatar.file_name : 'Image'}
            />
        </span>
    );
};
export default Avatar;
