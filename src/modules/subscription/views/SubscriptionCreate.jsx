
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import SubscriptionForm from "@modules/subscription/components/SubscriptionForm.jsx";

const SubscriptionCreate = () => {
    return (
        <>
            <PageHeader currentpage="Add New Subscription" activepage="Subscriptions" mainpage="Add" />
            <SubscriptionForm />
        </>
    );
};

export default SubscriptionCreate;
