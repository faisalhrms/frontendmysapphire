
import IntegrationsTabs from "@modules/customer-hub/integrations/components/IntegrationsTabs.jsx";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import { Workflow } from "lucide-react"

const IntegrationView = () => {
    return (
    <>
    <IconPageHeader
      heading="Integrations"
      description="Manage integrations, Email • API • Excel ingestion."
      icon={Workflow}
    >
    </IconPageHeader>
      <IntegrationsTabs />
    </>
    );
};

export default IntegrationView;
