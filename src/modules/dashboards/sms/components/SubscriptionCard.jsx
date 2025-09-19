import React from "react";
import { useNavigate } from "react-router-dom";

const subscriptionIcons = {
  "Total Active": "https://be.mysapphire.co/media/uploads/2025/09/19/8215492.png",
  "Paid": "https://be.mysapphire.co/media/uploads/2025/09/03/paid_icon.png",
  "Free": "https://be.mysapphire.co/media/uploads/2025/09/19/8993563.png",
  "Canceled (YTD)": "https://be.mysapphire.co/media/uploads/2025/09/03/cancelled_icon.png",
  "New (YTD)": "https://be.mysapphire.co/media/uploads/2025/09/19/new_icon.png",
};

const subscriptionColors = {
  "Total Active": "bg-success/10",
  "Paid": "bg-secondary/10",
  "Free": "bg-danger/10",
  "Canceled (YTD)": "bg-orange/10",
  "New (YTD)": "bg-purple/10",
};

const SubscriptionCard = ({ subscriptionData, route }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(route);
  };

  const icon = subscriptionIcons[subscriptionData.name] || "";
  const bgColor = subscriptionColors[subscriptionData.name] || "";

  return (
      <div className="cursor-pointer" onClick={handleClick}>
        <div
            className={`${bgColor} rounded-lg p-4 flex items-center space-x-4 transition-transform transform hover:scale-105 max-w-[250px] mx-auto shadow`}
        >
          <img
              src={icon}
              alt={subscriptionData.name}
              className="w-12 h-12"
          />
          <div>
            <h3 className="text-base font-medium leading-snug text-gray-900 dark:text-white ">
              {subscriptionData.name}
            </h3>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {subscriptionData.totalSubscriptions ?? 0}
            </p>
          </div>
        </div>
      </div>
  );
};

export default SubscriptionCard;
