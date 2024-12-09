import {Link} from "react-router-dom";
import {formatAmountWithCommas} from "@helpers/formatters.js";
import {formatDate} from "@helpers/dateTime.js";

const SubscriptionSummary = ({id,subscriptionData}) => {
    return (
        <>
            <div className="box custom-box">
                <div className="box-header justify-between flex">
                    <div className="box-title">Subscription Details</div>
                    <div>
                        <Link
                            to={`/module/subscription/edit/${id}`}

                            className="ti-btn !py-1 !px-2 !text-[0.75rem] ti-btn-primary  btn-wave"
                        >
                            <i className="ri-edit-line align-middle me-1 font-semibold"></i>Edit Subscription
                        </Link>


                    </div>
                </div>
                <div className="box-body">
                    <h5 className="font-semibold mb-4 task-title">{subscriptionData.name}</h5>
                    <div className="text-[.9375rem] font-semibold mb-2">Description:</div>
                    <p className="text-[#8c9097] dark:text-white/50 task-description">{subscriptionData.description}</p>
                </div>
                <div className="box-footer">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div>
                            <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">Vendor</span>
                            <span className="block text-[.875rem] font-semibold">{subscriptionData.vendor?.name || "-"}</span>
                        </div>
                        <div>
                                    <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                                        Subscription Start Date
                                    </span>
                            <span className="block text-[.875rem] font-semibold">{formatDate(subscriptionData.started_at)}</span>
                        </div>
                        <div>
                                    <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                                        Subscription End Date
                                    </span>
                            <span className="block text-[.875rem] font-semibold">{formatDate(subscriptionData.ended_at)}</span>
                        </div>
                        <div>
                            <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">Currency</span>
                            <span className="block text-[.875rem] font-semibold">{subscriptionData.currency}</span>
                        </div>
                        <div>
                            <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">Amount</span>
                            <span className="block text-[.875rem] font-semibold">
                                        {formatAmountWithCommas(subscriptionData.amount)}
                                    </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default SubscriptionSummary