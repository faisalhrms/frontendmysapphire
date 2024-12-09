import React from 'react';
import { useParams } from 'react-router-dom';
import SubscriptionForm from '../components/SubscriptionForm';
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import {useSubscription} from "@modules/subscription/hooks/subscriptionHooks.js";

const SubscriptionEdit = () => {
    const { id } = useParams();
    const {subscriptionData}=useSubscription(id)



    return (
        <div>
            <PageHeader currentpage='Edit Subscription' activepage="Subscription" mainpage="Edit Subscription"/>
            {subscriptionData&&(
                <SubscriptionForm subscriptionData={subscriptionData} isEditMode={true} />

            )

            }
        </div>
    );
};

export default SubscriptionEdit;
