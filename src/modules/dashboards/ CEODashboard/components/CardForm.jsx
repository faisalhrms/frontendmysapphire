import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";

const Card = ({ name, icon, color, onClick }) => (
    <div
        className={`bg-white border border-gray-200  custom-card text-center w-[260px] h-[220px] p-4 m-2 ${color} rounded-lg mb-4 transform transition duration-300 ease-in-out hover:scale-102 hover:shadow-xl cursor-pointer dark:text-gray-200 dark:bg-bodybg`}
        onClick={onClick}
    >
        <div className="flex justify-center items-center h-[140px]">
            <img
                src={icon}
                alt={name}
                className="w-29 h-28 mt-2 object-contain dark:text-gray-200 dark:bg-bodybg"
            />
        </div>
        <h3 className="mt-2 mb-4 text-[1.125rem] font-semibold dark:text-gray-200 dark:bg-bodybg">{name}</h3>
    </div>

);

const CardForm = () => {
    const navigate = useNavigate();

    return (
        <>
            <PageHeader currentpage="CEO Dashboard" activepage="dashboard" mainpage="CEO Dashboard"/>
            <div className="mt-10 mb-2 flex justify-center items-center">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Card
                        name="PMS Dashboard"
                        icon="https://res.cloudinary.com/dtsguaevl/image/upload/v1750327777/pms_logo_otqdsf.png"
                        color="bg-purple-500"
                        onClick={() => navigate('/dashboards/project-management-system')}
                />
                <Card
                    name="Salesforce Dashboard"
                    icon="https://res.cloudinary.com/dtsguaevl/image/upload/v1750327679/salesforce_logo_d7exvq.png"
                    color="bg-blue-500"
                    onClick={() => navigate('/module/ecom/salesforcedashboard')}

                />
                <Card
                    name="Analytics"
                    icon="https://res.cloudinary.com/dtsguaevl/image/upload/v1750327731/analytics_logo_xbieoq.png"
                    color="bg-yellow-500"
                    onClick={() => navigate('/module/ecom/anlysisReport')}
                />
                <Card
                    name="E-com Deliverables"
                    icon="https://res.cloudinary.com/dtsguaevl/image/upload/v1750337716/updated_ecom_deliverables_icon_vy4y6z.png"
                    color="bg-black"
                    onClick={() => navigate('/module/tasks/ecom')}
                />
            </div>
        </div>
        </>
    );
};

export default CardForm;
