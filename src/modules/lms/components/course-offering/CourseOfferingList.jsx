// import React, { useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import DataTable from "@components/datatable/DataTable.jsx";
//
// import { COURSE_OFFERING_ROUTES } from "@modules/lms/routes.js";
//
//
// const Badge = ({ ok, children }) => (
//     <span
//         className={[
//             "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
//             ok ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700",
//         ].join(" ")}
//     >
//     {children}
//   </span>
// );
//
// const formatDate = (iso) => (iso ? new Date(iso).toLocaleString() : "—");
//
// export default function CourseOfferingList({ externalFilters = [] }) {
//     const tableRef = useRef(null);
//     const navigate = useNavigate();
//
//     const columns = [
//         { Header: "ID", accessor: "id", width: 80 },
//
//         // { Header: "Checksum", accessor: "checksum" },
//
//         {
//             Header: "Company",
//             accessor: "company.name", // if dot path works
//             Cell: ({ value, row }) => value ?? row.original?.company?.name ?? "—",
//         },
//         {
//             Header: "Course",
//             accessor: "course.title",
//             Cell: ({ value, row }) => value ?? row.original?.course?.title ?? "—",
//         },
//
//         {
//             Header: "Published",
//             accessor: "is_published",
//             Cell: ({ value }) => <Badge ok={!!value}>{value ? "Yes" : "No"}</Badge>,
//             width: 120,
//         },
//         {
//             Header: "Self Enroll",
//             accessor: "allow_self_enroll",
//             Cell: ({ value }) => <Badge ok={!!value}>{value ? "Allowed" : "No"}</Badge>,
//             width: 140,
//         },
//
//         {
//             Header: "Start",
//             accessor: "start_at",
//             Cell: ({ value }) => formatDate(value),
//         },
//         {
//             Header: "End",
//             accessor: "end_at",
//             Cell: ({ value }) => formatDate(value),
//         },
//
//         {
//             Header: "Actions",
//             accessor: "actions",
//             disableSortBy: true,
//             Cell: ({ row }) => {
//                 const id = row.original?.id;
//                 return (
//                     <div className="flex gap-2">
//
//                         <button
//                             className="px-3 py-1 text-sm rounded-lg border hover:bg-gray-50"
//                             onClick={() => navigate(COURSE_OFFERING_ROUTES.edit(id))}
//                         >
//                             Edit
//                         </button>
//                     </div>
//                 );
//             },
//             width: 200,
//         },
//     ];
//
//
//     return (
//         <div className="p-4">
//             <div className="flex items-center justify-between mb-4">
//                 <div>
//                     <h1 className="text-xl font-semibold">Course Offerings</h1>
//                     <p className="text-sm text-gray-500">Manage company availability & rules for courses.</p>
//                 </div>
//
//                 <Link
//                     to={COURSE_OFFERING_ROUTES.create}
//                     className="inline-flex items-center rounded-xl bg-black text-white px-4 py-2 text-sm hover:opacity-90"
//                 >
//                     + Create Offering
//                 </Link>
//             </div>
//
//             <DataTable
//                 ref={tableRef}
//                 apiUrl="/lms/course-offerings/datatable/"
//                 columns={columns}
//                 externalFilters={externalFilters}
//             />
//         </div>
//     );
// }
import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "@components/datatable/DataTable.jsx";

import { COURSE_OFFERING_ROUTES } from "@modules/lms/routes.js";

const Badge = ({ ok, children }) => (
    <span
        className={[
            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
            ok ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700",
        ].join(" ")}
    >
    {children}
  </span>
);

const formatDate = (iso) => (iso ? new Date(iso).toLocaleString() : "—");

export default function CourseOfferingList({ externalFilters = [] }) {
    const tableRef = useRef(null);
    const navigate = useNavigate();

    const columns = [
        { Header: "ID", accessor: "id", width: 80 },

        {
            Header: "Company",
            accessor: "company.name",
            Cell: ({ value, row }) => value ?? row.original?.company?.name ?? "—",
        },
        {
            Header: "Course",
            accessor: "course.title",
            Cell: ({ value, row }) => value ?? row.original?.course?.title ?? "—",
        },

        {
            Header: "Published",
            accessor: "is_published",
            Cell: ({ value }) => <Badge ok={!!value}>{value ? "Yes" : "No"}</Badge>,
            width: 120,
        },
        {
            Header: "Self Enroll",
            accessor: "allow_self_enroll",
            Cell: ({ value }) => <Badge ok={!!value}>{value ? "Allowed" : "No"}</Badge>,
            width: 140,
        },

        {
            Header: "Start",
            accessor: "start_at",
            Cell: ({ value }) => formatDate(value),
        },
        {
            Header: "End",
            accessor: "end_at",
            Cell: ({ value }) => formatDate(value),
        },

        {
            Header: "Actions",
            accessor: "actions",
            disableSortBy: true,
            Cell: ({ row }) => {
                const id = row.original?.id;
                return (
                    <div className="flex gap-2">
                        <button
                            className=" ti-btn ti-btn-primary ti-btn-sm"
                            onClick={() => navigate(COURSE_OFFERING_ROUTES.edit(id))}
                        >
                            <i className={"ri-edit-line"}></i>
                        </button>
                    </div>
                );
            },
            width: 200,
        },
    ];

    // ✅ NEW (only this): Create button inside DataTable header (right side)
    const buttons = (
        <Link
            to={COURSE_OFFERING_ROUTES.create}
            className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
        >
            + Create Offering
        </Link>
    );

    return (
        <div className="p-4">
            <DataTable
                ref={tableRef}
                apiUrl="/lms/course-offerings/datatable/"
                columns={columns}
                externalFilters={externalFilters}
                title="Course Offerings"
                buttons={buttons}
            />
        </div>
    );
}
