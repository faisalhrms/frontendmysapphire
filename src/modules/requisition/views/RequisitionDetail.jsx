import { Fragment } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import { useRequisition } from "@modules/requisition/hooks/requisitionHooks.js";

import RequisitionSummary from "../components/RequisitionSummary.jsx";
import RequisitionAdditionalDetails from "../components/RequisitionAdditionalDetails.jsx";
import RequisitionPersonSpec from "../components/RequisitionPersonSpec.jsx";
import RequisitionAttachments from "../components/RequisitionAttachments.jsx";

const RequisitionDetail = () => {
    const { id } = useParams();
    const { requisition, loading } = useRequisition(id);

    if (loading || !requisition) return <LoadingSpinner />;

    const data = requisition;
    const attachments = data.attachments || [];
    const hasAttachments = attachments.length > 0;

    return (
        <Fragment>
            <PageHeader
                currentpage="Requisition Details"
                title="Requisition Details"
                activepage="Requisitions"
                mainpage="Details"
            />

            <div className="grid grid-cols-12 gap-6">
                {/* Main column */}
                <div className="xl:col-span-9 col-span-12 pb-6 space-y-6">
                    <RequisitionSummary requisition={data} />
                    <RequisitionPersonSpec requisition={data} />
                </div>

                {/* Sidebar */}
                <div className="xl:col-span-3 col-span-12 space-y-6">
                    <RequisitionAdditionalDetails requisition={data} />

                    {hasAttachments && (
                        <RequisitionAttachments attachments={attachments} />
                    )}
                </div>
            </div>
        </Fragment>
    );
};

export default RequisitionDetail;
