import React from 'react';
import { useNavigate } from 'react-router-dom';

const Card = ({ name, icon, color, onClick }) => (
    <div
        className={`bg-white custom-card text-center w-90 h-60 p-6 m-2 ${color} rounded-lg mb-4 transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl cursor-pointer dark:text-gray-200 dark:bg-bodybg`}
        onClick={onClick}
    >
        <img src={icon} alt={name} className="w-20 h-20 mt-8 avatar avatar-xl avatar-rounded me-2 mb-2" />
        <h3 className="mb-4 text-muted fs-11 dark:text-gray-200">{name}</h3>
    </div>
);

const CardForm = () => {
    const navigate = useNavigate();

    return (
        <div className="mt-52 flex justify-center items-center">
        
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card
                    name="PMS Dashboard"
                    icon="https://res.cloudinary.com/dsarj6ihu/image/upload/v1740415587/clipboard_gnbo47.png"
                    color="bg-purple-500"
                    onClick={() => navigate('/dashboards/project-management-system')}
                />
                <Card
                    name="Salesforce Dashboard"
                    icon="https://res.cloudinary.com/dtsguaevl/image/upload/v1749617983/1_Salesforce_fc08f6ce4677-desktop_h2d86q.jpg"
                    color="bg-blue-500"
                    onClick={() => navigate('/module/ecom/salesforcedashboard')}

                />
                <Card
                    name="Analytics"
                    icon="https://res.cloudinary.com/dsarj6ihu/image/upload/v1740415752/data-analysis_t2ea5q.png"
                    color="bg-yellow-500"
                    onClick={() => navigate('/module/ecom/anlysisReport')}
                />
                <Card
                    name="E-com Deliverables"
                    icon="https://res.cloudinary.com/dsarj6ihu/image/upload/v1740472073/shopping-cart_o1qkxe.png"
                    color="bg-yellow-500"
                    onClick={() => navigate('/module/tasks/ecom')}
                />
            </div>
        </div>
    );
};

export default CardForm;
