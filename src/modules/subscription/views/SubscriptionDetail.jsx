import { Fragment } from "react";
import {  useParams } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import { useSubscription } from "@modules/subscription/hooks/subscriptionHooks.js";
import SubscriptionAdditionalDetail from "@modules/subscription/components/SubscriptionAdditionalDetail.jsx";
import SubscriptionDepartments from "@modules/subscription/components/SubscriptionDepartments.jsx";
import SubscriptionSummary from "@modules/subscription/components/SubscriptionSummary.jsx";
import SubscriptionAttachment from "@modules/subscription/components/SubscriptionAttachment.jsx";
import SubscriptionHistory from "@modules/subscription/components/SubscriptionHistory.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";

const SubscriptionDetail = () => {
    const { id } = useParams();
    const { subscriptionData } = useSubscription(id);

    if (!subscriptionData) {
        return <LoadingSpinner/>;
    }

    const {
        type,
        reminder_days,
        payment_cycle,
        status,
        departments,
        attachments,
    } = subscriptionData;

    return (
        <Fragment>
            <PageHeader
                currentpage="Subscription Details"
                title="Subscription Details"
                activepage="Subscription"
                mainpage="Details"
            />
            <div className="grid grid-cols-12 gap-6">
                <div className="xl:col-span-9 col-span-12">
                    <SubscriptionSummary id={id} subscriptionData={subscriptionData}/>
                    <SubscriptionHistory id={subscriptionData.id}/>
                </div>

                <div className="xl:col-span-3 col-span-12">
                    <SubscriptionAdditionalDetail
                        type={type}
                        reminder_days={reminder_days}
                        payment_cycle={payment_cycle}
                        status={status}
                    />
                    <SubscriptionDepartments departments={departments} />
                    {subscriptionData.attachments.length >0&&(<SubscriptionAttachment attachments={subscriptionData.attachments} />)}
                </div>
            </div>
        </Fragment>
    );
};

export default SubscriptionDetail;
