import React from "react";

const TaskDetailRow = ({ icon, title, children, bodyClasses = '', alignCenter = true }) => {
    return (
        <>
            <div className="col-span-4 flex items-center">
                <span className="mr-1 font-bold">
                    <i className={icon}></i>
                </span>
                {title}
            </div>
            <div className="col-span-8">
                <div
                    className={`
                        bg-gray-200 
                        text-gray-800 dark:text-gray-200 dark:bg-bodybg/80 
                        px-4
                        min-h-[40px]
                        flex
                        ${alignCenter ? 'justify-center' : 'justify-start'}
                        items-center
                        w-100
                        ${bodyClasses}
                    `}
                >
                    {children}
                </div>
            </div>
        </>
    );
};

export default TaskDetailRow;
