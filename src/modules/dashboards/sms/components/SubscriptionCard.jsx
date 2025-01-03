import { useNavigate } from "react-router-dom";

const SubscriptionCard = ({ subscriptionData, route }) => {
  const navigate = useNavigate(); // Hook for navigation

  return (
      <div
          className="cursor-pointer"
          onClick={() => navigate(route)} // Navigate to the dynamic route
      >
        <div className="bg-white rounded-lg p-4 flex items-center space-x-4 transition-transform transform hover:scale-105 max-w-[250px] mx-auto shadow-md">
          <i className="ri-exchange-dollar-line text-4xl text-primary"></i>
          <div>
            <h3 className="text-gray-600 text-sm font-medium">
              {subscriptionData.name}
            </h3>
            <p className="text-2xl font-bold">{subscriptionData.totalSubscriptions ?? 0}</p>
          </div>
        </div>
      </div>
  );
};

export default SubscriptionCard;
