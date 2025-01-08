// src/modules/dashboards/sms/components/SubscriptionCard.jsx

import React from "react";
import { useNavigate } from "react-router-dom";

const SubscriptionCard = ({ subscriptionData, route }) => {
  const navigate = useNavigate(); // Hook for navigation

  const handleClick = () => {
    console.log(`Navigating to: ${route}`); // Log the route being navigated to
    navigate(route); // Navigate to the dynamic route
  };

  return (
      <div
          className="cursor-pointer"
          onClick={handleClick} // Use the new handler
      >
        <div className="bg-white rounded-lg p-4 flex items-center space-x-4 transition-transform transform hover:scale-105 max-w-[250px] mx-auto shadow-md">
          <i className="ri-exchange-dollar-line text-4xl text-primary"></i>
          <div>
            <h3 className="text-gray-600 text-sm font-medium">
              {subscriptionData.name}
            </h3>
            <p className="text-2xl font-bold">
              {subscriptionData.totalSubscriptions ?? 0}
            </p>
          </div>
        </div>
      </div>
  );
};

export default SubscriptionCard;
