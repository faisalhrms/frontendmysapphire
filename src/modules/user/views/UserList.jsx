import PageHeader from '@modules/layouts/includes/PageHeader';
import DataTable from "@components/DataTable.jsx";
import { useNavigate } from "react-router-dom";
import {getBadgeClasses} from "@helpers/badges.js";
import {toTitleCase} from "@helpers/formatters.js";
import Phone from "@mui/icons-material/Phone";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import HasPermission from "@components/HasPermission.jsx";
import Avatar from "@components/Avatar.jsx";


const UserList = () => {
    const navigate = useNavigate();
    const handleEdit = (id) => {
        navigate(`/module/users/edit/${id}`);
    };

    const columns = [
        {
            Header: 'Name', accessor: 'full_name', Cell: ({row}) => (
                <div className="flex">
                    <Avatar avatar={row.original?.avatar} size='md' parentClasses='bg-primary/10 !fill-primary'/>
                    <div className='ms-2'>
                        <p className="font-semibold mb-0 flex items-center">{row.original.full_name}</p>
                        <p className="mb-0 text-[#8c9097] dark:text-white/50 text-[0.75rem]">{row.original.emp_code}</p>
                    </div>
                </div>
            )
        },
        {Header: 'Company', accessor: 'company.name'},
        {
            Header: 'Email', accessor: 'email', Cell: ({row}) => (
                <div className="flex items-center space-x-2">
                    <i className="ri-mail-line"></i>
                    <span>{row.original.email}</span>
                </div>
            )
        },
        { Header: 'Department', accessor: 'department.name' },
        { Header: 'Sub Department', accessor: 'sub_department.name' },
        { Header: 'Designation', accessor: 'designation.name' },
        { Header: 'Position', accessor: 'position.name' },
        { Header: 'Location', accessor: 'location.name' },
        { Header: 'Gender', accessor: 'gender', Cell: ({ row }) => (
            <div className="flex items-center space-x-2 ">
            {row.original.gender === 'M' && <MaleIcon className="icon-grey" />}
            {row.original.gender === 'F' && <FemaleIcon className="icon-grey" />}
            {row.original.gender === 'O' && <TransgenderIcon className="icon-grey" />}
                <span>{row.original.gender}</span>
            </div>
            )},
        { Header: 'Phone', accessor: 'phone', Cell: ({row}) => (
            <div className="flex items-center space-x-2">
                <Phone className="icon-grey" />
                <span>{row.original.phone}</span>
            </div>
            ) },
        {
            Header: 'Status',
            Cell: ({ row }) => (
                <span className={ getBadgeClasses(row.original.status, '!rounded-full') }>{ toTitleCase(row.original.status) }</span>
            ),
        },
        {
            Header: 'Roles',
            Cell: ({ row }) => (
                <div className="space-x-1 rtl:space-x-reverse">
                    {row.original.roles.map((role) => (
                        <span key={role.id} className="badge bg-primary/10 text-primary">{role.name}</span>
                    ))}
                </div>
            ),
        },
    {
        Header: 'Actions',
        Cell: ({row}) => (
            <HasPermission permission='change_user'>
                <div className="flex space-x-2">
                    <button onClick={() => handleEdit(row.original.id)} className="ti-btn ti-btn-primary ti-btn-sm">
                        <i className="ri-edit-line"></i>
                    </button>
                </div>
            </HasPermission>
            ),
        },
    ];

    return (
        <>
            <PageHeader currentpage="Users" mainpage="Users"/>
            <DataTable
                columns={columns}
                title="Users"
                apiUrl="/users/datatable"
            />
        </>
    );
};

export default UserList;

