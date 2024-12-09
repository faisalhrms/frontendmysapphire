import { getBadgeClasses } from "@helpers/badges.js";

const SubscriptionAdditionalDetail = ({ type, reminder_days, payment_cycle, status }) => {
    return (
        <div className="box">
            <div className="box-header">
                <div className="box-title">Additional Details</div>
            </div>
            <div className="box-body !p-0">
                <table className="table whitespace-nowrap min-w-full">
                    <tbody>
                    <tr className="border-b border-defaultborder">
                        <td><span className="font-semibold">Subscription Type:</span></td>
                        <td>{type}</td>
                    </tr>
                    <tr className="border-b border-defaultborder">
                        <td><span className="font-semibold">Reminder Days:</span></td>
                        <td>{reminder_days} Days Before</td>
                    </tr>
                    <tr className="border-b border-defaultborder">
                        <td><span className="font-semibold">Payment Cycle:</span></td>
                        <td>{payment_cycle}</td>
                    </tr>
                    <tr className="border-b border-defaultborder">
                        <td><span className="font-semibold">Status:</span></td>
                        <td>
                            <span className={getBadgeClasses(status)}>{status}</span>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SubscriptionAdditionalDetail;
