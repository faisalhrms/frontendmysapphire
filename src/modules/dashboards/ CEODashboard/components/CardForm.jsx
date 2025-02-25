
import React from 'react';
import {useNavigate} from "react-router-dom";

const Card = ({ name,icon, color , onClick}) => {
    return (
        <div
            className={`bg-white flex flex-col  items-center justify-center w-80 h-40 p-6 m-2 ${color} rounded-lg mb-4 transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl cursor-pointer`}
            onClick={onClick}
        >
            <img src={icon} alt={name} className="w-16 h-16 mb-2"/>
            <h3 className="text-black italic text-lg">{name}</h3>
        </div>
    );
};

const CardForm = () => {
    const navigate = useNavigate();
    return (
        <div className="mt-52 text-black flex justify-center  items-center">
            <div className="flex space-x-4">
                <Card
                    name="PMS Dashboard"
                    icon="https://res.cloudinary.com/dsarj6ihu/image/upload/v1740415587/clipboard_gnbo47.png"
                    color="bg-purple-500"
                    onClick={() => navigate('/dashboards/project-management-system')}
                />
                <Card
                    name="Salesforce Dashboard"
                    icon="https://res.cloudinary.com/dsarj6ihu/image/upload/v1739448566/networking_w0haty.png"
                    color="bg-blue-500"
                    onClick={() => navigate('/module/ecom/sfd')}

                />
                <Card
                    name="Analytics"
                    icon="https://res.cloudinary.com/dsarj6ihu/image/upload/v1740415752/data-analysis_t2ea5q.png"
                    color="bg-yellow-500"
                    onClick={() => navigate('/module/ecom/anlysisReport')}

                />
            </div>
        </div>
    );
};

export default CardForm;
