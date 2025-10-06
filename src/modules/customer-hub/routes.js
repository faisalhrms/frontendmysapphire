import MailApp from "@modules/customer-hub/views/email/MailApp.jsx";
import CustomerHubEmailConfig from "@modules/customer-hub/components/customer-hub-email-config/CustomerHubEmailConfig.jsx";
import CustomerHubEmailList from "@modules/customer-hub/views/email/CustomerHubEmailList.jsx";


export const CUSTOMER_HUB_ROUTES = {
  EMAIL: {
    MAIL_APP: {
      path: "/module/customer/hub/mails",
      permission: 'customer_hub.view_customer_hub_emails',
    },
    MAIL_LIST: {
      path: "/module/customer/hub/mail/list",
      permission: 'customer_hub.view_customer_hub_email_config_list',
    },
    MAIL_SETTINGS: {
      path: "/module/customer/hub/mail/settings",
      permission: 'customer_hub.add_customer_hub_email_config',
    },

  },
};

export const MODULE_ROUTES = [
  {
    path: CUSTOMER_HUB_ROUTES.EMAIL.MAIL_APP.path,
    component: MailApp,
    permission: CUSTOMER_HUB_ROUTES.EMAIL.MAIL_APP.permission,
  },
    {
    path: CUSTOMER_HUB_ROUTES.EMAIL.MAIL_LIST.path,
    component: CustomerHubEmailList,
    permission: CUSTOMER_HUB_ROUTES.EMAIL.MAIL_LIST.permission,
  },
    {
    path: CUSTOMER_HUB_ROUTES.EMAIL.MAIL_SETTINGS.path,
    component: CustomerHubEmailConfig,
    permission: CUSTOMER_HUB_ROUTES.EMAIL.MAIL_SETTINGS.permission,
  },
];
