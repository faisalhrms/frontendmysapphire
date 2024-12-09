import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import UserForm from "@modules/user/components/UserForm.jsx";

const CreateUser = () => {
    return (
        <>
            <PageHeader currentpage="Add User" activepage="Users" mainpage="Add User"/>
            <UserForm />
        </>
    );
};

export default CreateUser;
