import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import IconTabs from "@components/IconTabs.jsx";
import CentralReportList from "@modules/DailyReport/components/offlineStorePerformReport/CentralReportList.jsx";
import NorthReportList from "@modules/DailyReport/components/offlineStorePerformReport/NorthReportList.jsx";
import SouthReportList from "@modules/DailyReport/components/offlineStorePerformReport/SouthReportList.jsx";
import FolReportList from "@modules/DailyReport/components/offlineStorePerformReport/FolReportList.jsx";
import React, {useState} from "react";
import EmailSetupList from "@modules/setup/components/EmailSetupList.jsx";
import SendEmail from "@modules/setup/components/SendEmail.jsx";
import EmailLog from "@modules/setup/components/EmailLog.jsx";

const EmailSetup = () => {
    const [activeTab, setActiveTab] = useState("emailsSetup-list");
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };
    return (
        <>
            <PageHeader currentpage="Emails Setup" activepage="Setup"
                        mainpage="Emails Setup"/>

            {/*<form onSubmit={handleSubmit(onSubmit)}>*/}
            {/*    <OfflineStorePerformFilter control={control} errors={errors}/>*/}
            {/*</form>*/}
            <IconTabs
                tabs={[
                    {
                        id: "emailsSetup-list",
                        label: "Add Employees",
                        content: (
                            <EmailSetupList isActive={'emailsSetup-list' === activeTab}/>

                        ),
                    },
                {
                    id:"sendEmail",
                    label: "Send Email",
                    content: (
                        <SendEmail isActive={'sendEmail' === activeTab}/>
                    )
                },
                    {
                        id:"log",
                        label: "Log",
                        content: (
                            <EmailLog isActive={'log' === activeTab}/>
                        )
                    }


                ]}
                onTabChange={handleTabChange}
            />
        </>
    )
}
export default EmailSetup