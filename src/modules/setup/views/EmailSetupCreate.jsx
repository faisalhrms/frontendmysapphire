import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import EmailSetupForm from "@modules/setup/components/EmailSetupForm.jsx";

const EmailSetupCreate = () => {
    return (
        <>
            <PageHeader currentpage="Add New Setup" activepage="Email Setup" mainpage="Add" />
            <EmailSetupForm/>
        </>
    )
}
export default EmailSetupCreate