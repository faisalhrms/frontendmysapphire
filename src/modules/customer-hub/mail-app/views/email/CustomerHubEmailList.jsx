import React from "react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import DataTable from "@components/datatable/DataTable.jsx";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import { Mail, Inbox, Filter, FileText } from "lucide-react";
import { CUSTOMER_HUB_ROUTES } from "@modules/customer-hub/routes.js";

const Badge = ({ children, intent = "default" }) => {
  const cls =
    intent === "success"
      ? "bg-success/10 text-success"
      : intent === "danger"
      ? "bg-danger/10 text-danger"
      : "bg-primary/10 text-primary";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${cls}`}>
      {children}
    </span>
  );
};

const ListChip = ({ icon: Icon, label, title }) => (
  <div className="inline-flex items-center gap-1 text-[0.75rem]" title={title}>
    <Icon size={14} />
    <span>{label}</span>
  </div>
);

const CustomerHubEmailList = () => {
  const columns = [
    {
      Header: "Actions",
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <Link to={CUSTOMER_HUB_ROUTES.EMAIL.MAIL_SETTINGS.path} state={{ id: row.original.id }}>
            <button className="ti-btn ti-btn-primary ti-btn-sm">
              <i className="ri-edit-line"></i>
            </button>
          </Link>
        </div>
      ),
      width: 100,
    },
    {
      Header: "Mailbox",
      accessor: "mailbox_email",
      Cell: ({ value }) => (
        <div className="flex items-center gap-2">
          <Mail size={16} />
          <div className="flex flex-col leading-tight">
            <span className="font-medium">{value || "N/A"}</span>
            <span className="text-[0.72rem] opacity-60">{value ? value.split("@")[1] : ""}</span>
          </div>
        </div>
      ),
    },
    {
      Header: "Status",
      accessor: "active",
      Cell: ({ value }) => (value ? <Badge intent="success">Active</Badge> : <Badge intent="danger">Inactive</Badge>),
      width: 110,
    },
    {
      Header: "Unread Only",
      accessor: "use_unread_only",
      Cell: ({ value }) => (value ? <Badge intent="default">Yes</Badge> : <span className="text-[0.8rem] opacity-70">No</span>),
      width: 130,
    },
    {
      Header: "Subjects",
      accessor: "subject_patterns",
      Cell: ({ value }) => {
        const arr = Array.isArray(value) ? value : [];
        const label = `${arr.length || 0}`;
        const title = arr.slice(0, 6).join(", ");
        return <ListChip icon={Inbox} label={label} title={title} />;
      },
      width: 110,
    },
    {
      Header: "From Filters",
      accessor: "from_filters",
      Cell: ({ value }) => {
        const arr = Array.isArray(value) ? value : [];
        const label = `${arr.length || 0}`;
        const title = arr.slice(0, 6).join(", ");
        return <ListChip icon={Filter} label={label} title={title} />;
      },
      width: 130,
    },
    {
      Header: "Body Rules",
      accessor: "body_rules",
      Cell: ({ value }) => {
        const kv = value?.kv_rules || [];
        const label = `${kv.length || 0}`;
        const title = kv.slice(0, 6).map(x => x?.key || "").filter(Boolean).join(", ");
        return <ListChip icon={FileText} label={label} title={title} />;
      },
      width: 120,
    },
    {
      Header: "Created",
      accessor: "created_at",
      Cell: ({ value }) => <span className="text-[0.8rem] opacity-70">{value ? dayjs(value).format("YYYY-MM-DD HH:mm") : ""}</span>,
      width: 160,
    },
  ];

  const buttons = (
    <div className="flex space-x-2">
      <Link
        to={CUSTOMER_HUB_ROUTES.EMAIL.MAIL_SETTINGS.path}
        state={{ new: true }}
        className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
      >
        <i className="ri-add-line font-semibold align-middle"></i>
      </Link>
    </div>
  );

  return (
    <>
      <IconPageHeader
        heading="Customer Hub Email Config"
        description="Manage mailbox connections, extraction rules, and sender filters."
        icon={Mail}
      />
      <DataTable
        columns={columns}
        title="Customer Hub Email List"
        apiUrl="customer-hub/configs/datatable/"
        buttons={buttons}
        needHeader={false}
      />
    </>
  );
};

export default CustomerHubEmailList;
