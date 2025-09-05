import { Link } from "react-router-dom";
import {formatAmountWithCommas} from "@helpers/formatters.js";
import {formatDate} from "@helpers/dateTime.js";
import HasPermission from "@components/HasPermission.jsx";

const SubscriptionListCard = ({totalCount, title, items,color }) => {
    return (
        <div className="xl:col-span-6 col-span-12 flex-grow">
            <div className="box custom-box">
                <div className={`box-header ${color}`}>
                    <div className="box-title dark:text-white">{title}<span
                        className="badge bg-primary/10 !rounded-full text-primary ms-1">{totalCount}</span></div>

                </div>

                <div className="box-body max-h-80 overflow-y-auto space-y-2">
                    {items?.map((item, index) => (
                        <div key={index} className="bg-gray-200 dark:bg-gray-800/50 rounded-xl  p-2 border border-gray-400 relative">
                            <div className="flex items-center justify-between">
                                <div className="flex-grow">
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white ">
                                        {item.name}
                                    </h3>

                                    <div className="flex items-center gap-4 ">
                                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                            {item.currency ? `${item.currency} ` : ''}{formatAmountWithCommas(item.amount)} / {item.payment_cycle}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <i className="ri-calendar-2-line text-primary text-sm"></i>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                                {formatDate(item.started_at)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="ml-4 flex-shrink-0 text-right">
                                    <HasPermission permission="subscription.change_subscription">
                                        <Link to={`/module/subscription/edit/${item.id}`}>
                                            <button
                                                className="bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 p-1.5 rounded-lg transition-colors duration-200">
                                                <i className="bi bi-pencil-square text-xl text-primary"></i>
                                            </button>
                                        </Link>
                                    </HasPermission>
                                    <div className="mt-1">
                                        {item.days_left !== null && item.days_left < 0 ? (
                                            <>
                                                <p className="text-danger font-bold text-sm">
                                                    {Math.abs(item.days_left)} Days
                                                </p>
                                                <p className="text-danger font-bold text-xs">Over Due</p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-primary font-bold text-sm">
                                                    {item.days_left !== null ? item.days_left : 'N/A'}
                                                </p>
                                                <p className="text-gray-600 dark:text-gray-400 font-semibold text-xs">Day's
                                                    Left</p>
                                            </>
                                        )}
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

