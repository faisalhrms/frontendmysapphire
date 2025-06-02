import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import ApplicantForm from "@modules/recruitment/components/ApplicantForm.jsx";

const ApplicantAdd = () => {
    return (
        <>
            <PageHeader currentpage="Add New Applicant" activepage="Recruitment" mainpage="Add" />
            <ApplicantForm />
        </>
    )
}
export default ApplicantAdd