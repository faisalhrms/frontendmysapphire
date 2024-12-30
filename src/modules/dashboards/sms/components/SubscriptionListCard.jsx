import { Link } from "react-router-dom";
import {formatAmountWithCommas} from "@helpers/formatters.js";
import {formatDate} from "@helpers/dateTime.js";
import HasPermission from "@components/HasPermission.jsx";

const SubscriptionListCard = ({totalCount, title, items }) => {
    return (
        <div className="xl:col-span-6 col-span-12 flex-grow box">
            <div className="box custom-box">
                <div className="box-header">
                    <div className="box-title">{title}<span
                        className="badge bg-primary/10 !rounded-full text-primary ms-1">{totalCount}</span></div>

                </div>

                {/* Scrollable container for the items */}
                <div className="box-body  max-h-80 overflow-y-auto">
                    {items?.map((item, index) => (
                        <div key={index} className="box-body task-completed-card rounded-md border-1 !pb-[0.9rem] mb-4">
                            <div className="flex items-start ">
                                <div className="flex-grow">
                                    <p className=" font-semibold  leading-none text-[1.25rem] ">
                                        {item.name}
                                    </p>
                                    <div className="flex my-2 items-start justify-between">
                                        <h5 className="pt-2 text-[0.825rem] opacity-[0.7] text-[#8c9097] dark:text-white/50 font-semibold">
                                            {item.currency ? `${item.currency} ` : ''}{formatAmountWithCommas(item.amount)} / {item.payment_cycle}
                                        </h5>

                                        <div className="text-center">

                                            {item.days_left !== null && item.days_left < 0 ? (
                                                <>  <p className="text-primary font-semibold">
                                                    {Math.abs(item.days_left)} Days
                                                </p>
                                                    <p className="font-bold">Over Due</p>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="text-primary font-semibold">
                                                        {item.days_left !== null ? item.days_left : 'N/A'}
                                                    </p>
                                                    <p className="font-bold">Day's Left</p>
                                                </>
                                            )}

                                        </div>
                                    </div>
                                    {/* If you have additional info, you can display it here */}
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <i className="ri-calendar-2-line me-1 font-semibold text-primary"></i>
                                            <p className="mb-0 text-[0.8rem] opacity-70 text-[#8c9097] dark:text-white/50 font-semibold">
                                                {formatDate(item.started_at)}
                                            </p>
                                        </div>
                                        <HasPermission permission="change_subscription">
                                        <div className="flex space-x-2 pr-4">
                                            <Link to={`/module/subscription/edit/${item.id}`}>
                                                <button className="ti-btn ti-btn-primary ti-btn-sm">
                                                    <i className="ri-edit-line"></i>
                                                </button>
                                            </Link>
                                          </div>
                                        </HasPermission>
                                    </div>


                                </div>
                            </div>
                        </div>

                    ))}
                </div>
            </div>
        </div>
    );
};

export default SubscriptionListCard;
