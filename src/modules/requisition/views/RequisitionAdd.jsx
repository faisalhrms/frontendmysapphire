import PageHeader from "../../layouts/includes/PageHeader.jsx";
import RequisitionForm from "../components/RequisitionForm.jsx";

const RequisitionAdd = () => {
    return (
        <>
            <PageHeader currentpage="Add New Requisition" activepage="Requisition" mainpage="Add" />
            <RequisitionForm/>
        </>
    )
}
export default RequisitionAdd