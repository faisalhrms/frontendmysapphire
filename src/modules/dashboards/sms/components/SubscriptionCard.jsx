import { Link } from "react-router-dom";

const SubscriptionCard = ({ subscriptionData, route }) => {
  return (
      <div className="xl:col-span-2 lg:col-span-2 md:col-span-3 sm:col-span-6 col-span-12">
        <div className="box">
          <div className="box-body">
            <div className="grid grid-cols-12">
              <div className="col-span-7 pe-0">
                <p className="mb-2">
                  <span className="text-[1rem] font-bold">{subscriptionData.name}</span>
                </p>
                <p className="mb-2 text-[0.75rem]">
                <span className="text-[1.5625rem] leading-none vertical-bottom mb-0">
                  {subscriptionData.totalSubscriptions}
                </span>
                </p>
                <Link
                    to={route} // Dynamic route passed as a prop
                    className="text-[0.75rem] mb-0 text-sky-400"
                >
                  View all Subscription
                  <i className="ti ti-chevron-right ms-1 inline-flex"></i>
                </Link>
              </div>
              <div className="col-span-5">
                <p className="main-card-icon mb-0 text-[1.5625rem] text-success">
                  <i className="ri-exchange-dollar-line"></i>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default SubscriptionCard;
