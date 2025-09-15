import { Fragment } from "react";
import { useParams, Link } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import PerfectScrollbar from "react-perfect-scrollbar";
import { formatDate } from "@helpers/dateTime.js";
import {useFetchApplicationById} from "@modules/it_governance/hooks/useApplicationUniverseForm.js";

const ApplicationUniverseDetail = () => {
    const { id } = useParams();
    const{appData}=useFetchApplicationById(id)

    if (!appData) {
        return <LoadingSpinner />;
    }

    const app = appData; // response shape you shared
    return (
        <Fragment>
            <PageHeader
                currentpage="Application Universe"
                title="Application Universe Details"
                activepage="IT Governance"
                mainpage="Application Universe"
            />

            <div className="grid grid-cols-12 gap-6">
                {/* Main content */}
                <div className="xl:col-span-9 col-span-12 space-y-6">
                    <div className="box custom-box">
                        <div className="box-header justify-between flex">
                            <div className="box-title">{app.application_name}</div>
                            
                        </div>

                        <div className="box-body">
                            <div className="grid grid-cols-12 gap-6">
                                <DetailRow label="Ownership" value={app.application_ownership} />
                                <DetailRow label="Versions" value={app.application_versions} />
                                <DetailRow label="Type" value={app.application_type} />
                                <DetailRow label="Backend Database" value={app.backend_database} />
                                <DetailRow label="Platform" value={app.platform} />
                                <DetailRow label="Integrations" value={app.integrations} />
                                <DetailRow label="Company" value={app.company?.name} />
                            </div>
                        </div>

                        <div className="box-footer flex flex-wrap gap-6">
                            <FooterField
                                label="Created At"
                                value={formatDate(app.created_at) || "-"}
                            />
                            <FooterField
                                label="Last Updated"
                                value={formatDate(app.updated_at) || "-"}
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar – Attachments */}
                <div className="xl:col-span-3 col-span-12 space-y-6">
                    <ApplicationAttachments attachments={app.attachments || []} />
                </div>
            </div>
        </Fragment>
    );
};

export default ApplicationUniverseDetail;

/* ---------- Small helper components ---------- */

const DetailRow = ({ label, value }) => (
    <div className="xl:col-span-6 col-span-12">
        <div className="text-[.9375rem] font-semibold mb-1">{label}:</div>
        <p className="text-[#8c9097] dark:text-white/50">{value || "-"}</p>
    </div>
);

const FooterField = ({ label, value }) => (
    <div>
    <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">
      {label}
    </span>
        <span className="block text-[.875rem] font-semibold">{value}</span>
    </div>
);

const ApplicationAttachments = ({ attachments }) => (
    <div className="box">
        <div className="box-header">
            <div className="box-title">
                Attachments{" "}
                <span className="badge bg-primary/10 !rounded-full text-primary ms-1">
          {attachments.length}
        </span>
            </div>
        </div>
        <PerfectScrollbar className="box-body max-h-72">
            <div className="attachments">
                <ul className="shared-files list-none">
                    {attachments.map((file) => (
                        <li key={file.id} className="!mb-4">
                            <div className="flex items-center">
                                <div className="me-2">
                  <span className="shared-file-icon">
                    {file.file_type.startsWith("image") && (
                        <i className="ri-image-line"></i>
                    )}
                      {file.file_type.startsWith("video") && (
                          <i className="ri-video-line"></i>
                      )}
                      {file.file_type.includes("audio") && (
                          <i className="ri-user-voice-line"></i>
                      )}
                      {!file.file_type.startsWith("image") &&
                          !file.file_type.startsWith("video") &&
                          !file.file_type.includes("audio") && (
                              <i className="ti ti-file-text"></i>
                          )}
                  </span>
                                </div>
                                <div className="flex-grow">
                                    <Link
                                        className="text-[0.75rem] font-semibold mb-0 dark:text-defaulttextcolor/70"
                                        to={file.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {file.file_name}.{file.file_extension}
                                    </Link>
                                    <p className="mb-0 text-[#8c9097] dark:text-white/50 text-[0.6875rem]">
                                        {formatDate(file.created_at)}
                                    </p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </PerfectScrollbar>
    </div>
);
