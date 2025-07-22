import React from "react";

const EmptyState = ({ icon: Icon, heading, description }) => {
    return (
        <div className="text-center py-12">
            {Icon && <Icon className="w-16 h-16 text-gray-400 mx-auto mb-4" />}
            <h3 className="text-lg font-medium text-gray-900 mb-2">{heading}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
};

export default EmptyState;
