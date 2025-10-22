
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import IntegrationsForm from "@modules/customer-hub/integrations/components/IntegrationsForm.jsx";

const IntegrationView = () => {
    return (
        <>
            <PageHeader currentpage="Integrations" activepage="Customer Hub" mainpage="Integrations" />
            <IntegrationsForm />
        </>
    );
};

export default IntegrationView;
