import React from 'react';

const UrpCards = ({ cardData }) => {
    console.log(cardData);
    const stats = [
        {
            key: 'total_groups',
            label: 'Total Groups',
            value: cardData.total_groups,
            icon: <i className="bx bx-group text-8xl text-sky-400"></i>
        },
        {
            key: 'total_users',
            label: 'Total Users',
            value: cardData.total_users,
            icon: <i className="bx bx-user text-8xl text-emerald-500"></i>
        },
        {
            key: 'total_permissions',
            label: 'Total Permissions',
            value: cardData.total_permissions,
            icon: <i className="bx bx-key text-8xl text-amber-400"></i>
        }
    ];

    return (
        <div className="flex justify-center items-center mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {stats.map(({ key, label, value, icon }) => (
                    <div
                        key={key}
                        className="flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                    >
                        <div className="mr-4">
                            {icon}
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-600">{label}</div>
                            <div className="text-2xl font-semibold text-gray-800">{value}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UrpCards;
