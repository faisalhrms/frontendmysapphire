import React from "react";
import DataTable from "@components/DataTable.jsx";

const AllUserTable = () => {
    const columns = [
        { Header: "User ID", accessor: "user_id" },
        { Header: "Name", accessor: "name" },
        { Header: "Email", accessor: "email" },
        { Header: "Role", accessor: "role" },
        { Header: "Status", accessor: "status" },
    ];

    return <DataTable columns={columns} apiUrl="users/all" title="All Users" />;
};

export default AllUserTable;
