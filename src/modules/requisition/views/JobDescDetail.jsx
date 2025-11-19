import { Fragment, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import PerfectScrollbar from "react-perfect-scrollbar";
import { formatDate } from "@helpers/dateTime.js";
import "@assets/css/custom/attachment-card.css";
import { useJobDesc } from "@modules/requisition/hooks/jobDescHooks.js";

const pretty = (val) => (val === 0 || val ? String(val) : "N/A");
const safeUpper = (v) => String(v || "N/A").replaceAll("_", " ").toUpperCase();

const JobDescDetail = () => {
    const { id } = useParams();
    const { jobDesc, loading } = useJobDesc(id);

    // Normalize API shape (supports either full response or just .data)
    const data = jobDesc?.data || jobDesc;

    const responsibilities = data?.core_responsibilities || [];
    const total = useMemo(
        () =>
            responsibilities
                .filter((r) => !r?._delete)
                .reduce((sum, r) => sum + Number(r?.weightage || 0), 0),
        [responsibilities]
    );

    if (loading || !data) {
        return <LoadingSpinner />;
    }

    const {
        position_title,
        brief_role_overview,
        department,
        sub_department,
        company,
        created_by,
        created_at,
        updated_at,
        attachments, // if your API doesn't provide this, it's fine—UI handles empty
    } = data;

    return (
        <Fragment>
            <PageHeader
                currentpage="Job Description Details"
                title="Job Description Details"
                activepage="Recruitment"
                mainpage="Job Description Details"
            />

            <div className="grid grid-cols-12 gap-6">
                {/* Main column */}
                <div className="xl:col-span-9 col-span-12 space-y-6 pb-5">
                    {/* Job Summary */}
                    <div className="box">
                        <div className="box-header justify-between">
                            <div className="box-title">Job Summary</div>
                            <div className="flex items-center gap-2">
                <span className="badge bg-primary/10 text-primary">
                  {pretty(company?.name)}
                </span>
                                <span className="badge bg-info/10 text-info">
                  {pretty(department?.name)}
                </span>
                                {sub_department?.name ? (
                                    <span className="badge bg-warning/10 text-warning">
                    {sub_department?.name}
                  </span>
                                ) : null}
                            </div>
                        </div>

                        <div className="box-body">
                            <div className="grid grid-cols-12 gap-4">
                                {/* Position */}
                                <div className="xl:col-span-6 col-span-12">
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                Position Title
                                            </label>
                                            <p className="text-[0.975rem] font-semibold mb-0">
                                                {pretty(position_title)}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                Company
                                            </label>
                                            <p className="text-[0.875rem] mb-0">{pretty(company?.name)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Org mapping */}
                                <div className="xl:col-span-6 col-span-12">
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                Department
                                            </label>
                                            <p className="text-[0.875rem] mb-0">{pretty(department?.name)}</p>
                                        </div>
                                        <div>
                                            <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                Sub Department
                                            </label>
                                            <p className="text-[0.875rem] mb-0">{pretty(sub_department?.name)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Overview */}
                                <div className="xl:col-span-12 col-span-12">
                                    <div className="space-y-2">
                                        <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                            Brief Role Overview
                                        </label>
                                        <p className="text-[0.9rem] leading-6 mb-0 whitespace-pre-line">
                                            {pretty(brief_role_overview)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Core Responsibilities */}
                    <div className="box">
                        <div className="box-header justify-between">
                            <div className="box-title">Core Responsibilities</div>
                            <div className="badge bg-secondary/10 text-secondary">
                                Total Weightage: {total.toFixed(2)}
                            </div>
                        </div>

                        <div className="box-body">
                            {responsibilities.length === 0 ? (
                                <div className="text-center py-6 text-[#8c9097] dark:text-white/50">
                                    No responsibilities available.
                                </div>
                            ) : (
                                <div className="relative overflow-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Sr. No
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Responsibility
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Weightage
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Status
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                        {responsibilities.map((r, i) => {
                                            const marked = Boolean(r?._delete);
                                            return (
                                                <tr key={r.id ?? i} className={marked ? "opacity-60" : ""}>
                                                    <td className="px-4 py-3 whitespace-nowrap font-semibold">
                                                        {r.sr_no ?? i + 1}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="font-medium">{pretty(r.responsibility_name)}</div>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        {Number(r?.weightage || 0).toFixed(2)}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        {marked ? (
                                                            <span className="badge bg-amber-100 text-amber-700">Marked for Delete</span>
                                                        ) : (
                                                            <span className="badge bg-success/10 text-success">Active</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        </tbody>
                                        <tfoot>
                                        <tr className="bg-gray-50 font-semibold">
                                            <td className="px-4 py-3" colSpan={2}>
                                                Total
                                            </td>
                                            <td className="px-4 py-3">{total.toFixed(2)}</td>
                                            <td></td>
                                        </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Created By */}
                    <div className="box">
                        <div className="box-header">
                            <div className="box-title">Created By</div>
                        </div>
                        <div className="box-body">
                            <div className="grid grid-cols-12 gap-4">
                                <div className="xl:col-span-6 col-span-12">
                                    <div className="space-y-2">
                                        <div>
                                            <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                Name
                                            </label>
                                            <p className="text-[0.875rem] mb-0">
                                                {pretty(created_by?.full_name)}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                Email
                                            </label>
                                            <p className="text-[0.875rem] mb-0">
                                                {created_by?.email ? (
                                                    <a className="text-primary" href={`mailto:${created_by.email}`}>
                                                        {created_by.email}
                                                    </a>
                                                ) : (
                                                    "N/A"
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="xl:col-span-6 col-span-12">
                                    <div className="space-y-2">
                                        <div>
                                            <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                User ID
                                            </label>
                                            <p className="text-[0.875rem] mb-0">{pretty(created_by?.id)}</p>
                                        </div>
                                        <div>
                                            <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                Created At
                                            </label>
                                            <p className="text-[0.875rem] mb-0">
                                                {created_at ? formatDate(created_at) : "N/A"}
                                            </p>
                                        </div>
                                        {updated_at && (
                                            <div>
                                                <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                    Last Updated
                                                </label>
                                                <p className="text-[0.875rem] mb-0">
                                                    {formatDate(updated_at)}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="xl:col-span-3 col-span-12 mb-5 space-y-6">
                    {/* Record Meta */}
                    <div className="box">
                        <div className="box-header">
                            <div className="box-title">Record Meta</div>
                        </div>
                        <div className="box-body">
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="me-3">
                    <span className="avatar avatar-sm avatar-rounded bg-success/10">
                      <i className="ri-briefcase-2-line text-success text-[1rem]"></i>
                    </span>
                                    </div>
                                    <div className="flex-grow">
                                        <p className="mb-1 text-[0.75rem] font-semibold text-[#8c9097] dark:text-white/50">
                                            Position
                                        </p>
                                        <p className="text-[0.875rem] font-semibold mb-0">
                                            {pretty(position_title)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="me-3">
                    <span className="avatar avatar-sm avatar-rounded bg-info/10">
                      <i className="ri-calendar-line text-info text-[1rem]"></i>
                    </span>
                                    </div>
                                    <div className="flex-grow">
                                        <p className="mb-1 text-[0.75rem] font-semibold text-[#8c9097] dark:text-white/50">
                                            Created
                                        </p>
                                        <p className="text-[0.875rem] font-semibold mb-0">
                                            {created_at ? formatDate(created_at) : "—"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Attachments (optional) */}
                    <div className="box">
                        <div className="box-header">
                            <div className="box-title">
                                Attachments
                                <span className="badge bg-primary/10 !rounded-full text-primary ms-1">
                  {attachments?.length || 0}
                </span>
                            </div>
                        </div>

                        {!attachments || attachments.length === 0 ? (
                            <div className="box-body">
                                <div className="text-center py-4">
                                    <i className="ri-file-line text-[2rem] text-[#8c9097] dark:text-white/50"></i>
                                    <p className="text-[0.813rem] text-[#8c9097] dark:text-white/50 mt-2">
                                        No attachments available
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <PerfectScrollbar className="box-body max-h-72">
                                <div className="attachments">
                                    <ul className="shared-files list-none">
                                        {attachments.map((a) => (
                                            <li key={a.id} className="!mb-4">
                                                <div className="flex items-center">
                                                    <div className="me-2">
                            <span className="shared-file-icon">
                              <i className="ti ti-file-text"></i>
                            </span>
                                                    </div>
                                                    <div className="flex-grow">
                                                        <Link
                                                            className="text-[0.75rem] font-semibold mb-0 dark:text-defaulttextcolor/70"
                                                            aria-label={a.file_name}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            to={a.file_url}
                                                        >
                                                            {a.file_name}
                                                            {a.file_extension && `.${a.file_extension}`}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </PerfectScrollbar>
                        )}
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default JobDescDetail;
