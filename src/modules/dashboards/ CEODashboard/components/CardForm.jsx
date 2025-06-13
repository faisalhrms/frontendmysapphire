import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";

const Card = ({ name, icon, color, onClick }) => (
    <div
        className={`bg-white border border-gray-200  shadow-xl custom-card text-center w-[210px] h-[280px] p-6 m-2 ${color} rounded-lg mb-4 transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl cursor-pointer dark:text-gray-200 dark:bg-bodybg`}
        onClick={onClick}
    >
        <img src={icon} alt={name} className="w-28 h-28 mt-4 justify-center items-center  ml-4 dark:text-gray-200 dark:bg-bodybg" />
        <h3 className="mb-2 mt-6 font-bold  fs-10  dark:text-gray-200 dark:bg-bodybg">{name}</h3>
    </div>
);

const CardForm = () => {
    const navigate = useNavigate();

    return (
        <>
            <PageHeader currentpage="CEO Dashboard" activepage="dashboard" mainpage="CEO Dashboard"/>
        <div className="mt-18 mb-4 flex justify-center items-center">
        
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card
                    name="PMS Dashboard"
                    icon="https://res.cloudinary.com/dsarj6ihu/image/upload/v1740415587/clipboard_gnbo47.png"
                    color="bg-purple-500"
                    onClick={() => navigate('/dashboards/project-management-system')}
                />
                <Card
                    name="Salesforce Dashboard"
                    icon="https://res.cloudinary.com/dtsguaevl/image/upload/v1749809060/im4444_nbrht2.png"
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
                    icon="https://res.cloudinary.com/dtsguaevl/image/upload/v1749809261/25619_lgndgs.png"
                    color="bg-black"
                    onClick={() => navigate('/module/tasks/ecom')}
                />
            </div>
        </div>
        </>
    );
};

export default CardForm;
