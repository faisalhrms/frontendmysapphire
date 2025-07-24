import React, { useEffect, useState } from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import DataTable from "@components/datatable/DataTable.jsx";
import { Link, useNavigate } from "react-router-dom";
import { toTitleCase } from "@helpers/formatters.js";
import { deleteCompanyById, getCompanies } from "../services/service";
import Avatar from "@components/Avatar.jsx";
const CompanyList = () => {
  const [dataArray, setDataArray] = useState([]);
  const navigate = useNavigate();

  const fetchAllCompanies = async () => {
    try {
      const response = await getCompanies();

      setDataArray(response?.data || response);
    } catch (error) {}
  };

  useEffect(() => {
    fetchAllCompanies();
  }, []);

  const handleNavigation = (id) => {
    console.log(id);
    navigate("/module/setup/add");
  };



  const columns = [
    {
      Header: "Actions",
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <Link
            to="/module/setup/add" 
            state={{ id: row.original.id }}
          >
            <button className="ti-btn ti-btn-primary ti-btn-sm" title="Edit">
              <i className="ri-edit-line"></i>
            </button>
          </Link>
        </div>
      ),
    },
    {
      Header: "Name",
      accessor: "media",
      Cell: ({ row }) => (
        <div className="flex items-center">
          <Avatar
            avatar={row.original?.media }
            full_name={row.original.full_name || 'N/A'}
            size="md"
            parentClasses="bg-primary/10 !fill-primary"
          />

          <div className="ms-2">
            <p className="font-semibold mb-0 flex items-center">
              {/* {row.original.full_name || "N/A"} */}
            </p>
            <p className="font-semibold mb-0 flex items-center">
              {row.original.name || "N/A"}
            </p>
          </div>
        </div>
      ),
    },
    { Header: "Full Name", accessor: "full_name" },
    {
      Header: "Short Name",
      accessor: "short_name",
      Cell: ({ value }) => toTitleCase(value),
    },
    { Header: "Business", accessor: "business" },
    {
      Header: "Website",
      accessor: "website",
      // Cell: ({ value }) =>
      //   value ? (value.length > 20 ? `${value.slice(0, 20)}...` : value) : "-"
    },
    
    { Header: "Address", accessor: "address" },
  ];

  const buttons = (
    <div className="grid grid-cols-1 sm:grid-cols-1">
      <Link
        to={`/module/setup/add`}
        className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
      >
        <i className="ri-add-line font-semibold align-middle"></i> Add
      </Link>
    </div>
  );

  return (
    <>
      <PageHeader currentpage="Companies" mainpage="Companies" />
      <DataTable
        columns={columns}
        title="Companies"
        apiUrl="/setups/company/datatable/"
        buttons={buttons}
      />
    </>
  );
};

export default CompanyList;
