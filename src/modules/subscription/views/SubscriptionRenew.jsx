import {useParams} from "react-router-dom";
import {useSubscription} from "@modules/subscription/hooks/subscriptionHooks.js";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import React from "react";
import SubscriptionRenewForm from "@modules/subscription/components/SubscriptionRenewForm.jsx";
const subscriptionRenew = () => {
    const {id}=useParams();
    const {subscriptionData}=useSubscription(id)
  return (
      <>
          <PageHeader currentpage='Renew Subscription' activepage="Subscription" mainpage="Renew Subscription"/>
          {subscriptionData&&(
              <SubscriptionRenewForm subscriptionData={subscriptionData} isReNewMode={true} />
          )
          }

      </>
  )
}
export default subscriptionRenew