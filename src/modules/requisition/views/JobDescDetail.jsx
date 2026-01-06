import { Fragment } from "react";
import { useParams, Link } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import PerfectScrollbar from "react-perfect-scrollbar";
import { formatDate } from "@helpers/dateTime.js";
import "@assets/css/custom/attachment-card.css";
import { useJobDesc } from "@modules/requisition/hooks/jobDescHooks.js";

const pretty = (val) => (val === 0 || val ? String(val) : "N/A");

/**
 * Basic HTML sanitizer (no external pkg)
 * Allows only a small set of tags + limited attributes
 */
const sanitizeHtml = (input) => {
    if (!input) return "";

    const doc = new DOMParser().parseFromString(String(input), "text/html");

    // allowed tags
    const allowed = new Set([
        "B",
        "STRONG",
        "I",
        "EM",
        "U",
        "S",
        "P",
        "BR",
        "UL",
        "OL",
        "LI",
        "A",
        "SPAN",
        "DIV",
    ]);

    // collect nodes first (because we'll mutate DOM)
    const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT, null);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach((el) => {
        const tag = el.tagName;

        // remove disallowed tags by unwrapping their children
        if (!allowed.has(tag)) {
            const parent = el.parentNode;
            if (parent) {
                while (el.firstChild) parent.insertBefore(el.firstChild, el);
                parent.removeChild(el);
            }
            return;
        }

        // strip attributes
        [...el.attributes].forEach((attr) => {
            const name = attr.name.toLowerCase();

            if (tag === "A") {
                if (!["href", "target", "rel"].includes(name)) el.removeAttribute(attr.name);
            } else {
                el.removeAttribute(attr.name);
            }
        });

        // sanitize links
        if (tag === "A") {
            const href = el.getAttribute("href") || "";
            if (/^\s*javascript:/i.test(href) || /^\s*data:/i.test(href)) {
                el.removeAttribute("href");
            }
            if (el.getAttribute("target") === "_blank") {
                el.setAttribute("rel", "noopener noreferrer");
            }
        }
    });

    return doc.body.innerHTML;
};

const JobDescDetail = () => {
    const { id } = useParams();
    const { jobDesc, loading } = useJobDesc(id);

    // Normalize API shape (supports either full response or just .data)
    const data = jobDesc?.data || jobDesc;

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
        attachments, // optional
    } = data;

    const overviewHtml = sanitizeHtml(brief_role_overview);

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
                                <span className="badge bg-primary/10 text-primary">{pretty(company?.name)}</span>
                                <span className="badge bg-info/10 text-info">{pretty(department?.name)}</span>
                                {sub_department?.name ? (
                                    <span className="badge bg-warning/10 text-warning">{sub_department?.name}</span>
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
                                            <p className="text-[0.975rem] font-semibold mb-0">{pretty(position_title)}</p>
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

                                        {!overviewHtml ? (
                                            <p className="text-[0.875rem] text-[#8c9097] dark:text-white/50 mb-0">
                                                N/A
                                            </p>
                                        ) : (
                                            <div
                                                className="
                                                    text-[0.9rem] leading-6
                                                    [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2
                                                    [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2
                                                    [&_li]:my-1
                                                "
                                                dangerouslySetInnerHTML={{ __html: overviewHtml }}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ✅ Core Responsibilities REMOVED */}

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
                                            <p className="text-[0.875rem] mb-0">{pretty(created_by?.full_name)}</p>
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
                                                <p className="text-[0.875rem] mb-0">{formatDate(updated_at)}</p>
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
                                        <p className="text-[0.875rem] font-semibold mb-0">{pretty(position_title)}</p>
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
