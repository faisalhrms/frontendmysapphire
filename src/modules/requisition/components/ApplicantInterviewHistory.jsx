import { Fragment, useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import Notify from "@helpers/toastNotifications.js";
import api from "../../../config/axiosConfig.js";
import { toTitleCase } from "@helpers/formatters.js";
import { formatDate } from "@helpers/dateTime.js";
import { getBadgeClasses } from "@helpers/badges.js";

const prettyLabel = (k = "") =>
    toTitleCase(String(k).replaceAll("_", " ").replaceAll("-", " "));

const isEmptyValue = (v) =>
    v === null ||
    v === undefined ||
    (typeof v === "string" && v.trim() === "") ||
    (Array.isArray(v) && v.length === 0) ||
    (typeof v === "object" && !Array.isArray(v) && Object.keys(v || {}).length === 0);

const FeedbackView = ({ feedback }) => {
    if (!feedback || typeof feedback !== "object" || Array.isArray(feedback)) return null;
    const entries = Object.entries(feedback).filter(([, v]) => !isEmptyValue(v));
    if (!entries.length) return null;

    const noteKeys = new Set(["notes", "note", "comment", "remarks", "summary", "observation"]);
    const notesEntry = entries.find(([k]) => noteKeys.has(String(k).toLowerCase()));
    const notes = notesEntry ? notesEntry[1] : null;

    const metrics = entries.filter(([k]) => !noteKeys.has(String(k).toLowerCase()));

    return (
        <div className="mt-3 rounded-md bg-light p-3 space-y-2">
            {notes ? (
                <div className="bg-white/60 rounded-md p-3">
                    <div className="text-xs text-gray-500 mb-1">Notes</div>
                    <div className="text-sm whitespace-pre-wrap">{String(notes)}</div>
                </div>
            ) : null}

            {metrics.length ? (
                <div className="grid grid-cols-12 gap-2">
                    {metrics.map(([k, v]) => (
                        <div key={k} className="col-span-12 md:col-span-6">
                            <div className="text-xs text-gray-500">{prettyLabel(k)}</div>
                            <div className="font-medium text-sm">{String(v)}</div>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
};

const ApplicantInterviewHistory = () => {
    const { requisitionId, applicationId } = useParams();

    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                setLoading(true);
                setError("");

                const { data } = await api.get(
                    `/requisitions/${requisitionId}/applicants/${applicationId}/interviews/`
                );

                if (!mounted) return;
                setItems(Array.isArray(data?.data) ? data.data : []);
            } catch (e) {
                if (!mounted) return;
                const msg = e?.response?.data?.message || e?.message || "Unable to load interview history.";
                setError(msg);
                setItems([]);
                Notify.error(msg);
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [requisitionId, applicationId]);

    const sorted = useMemo(() => {
        return [...items].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }, [items]);

    if (loading) return <LoadingSpinner />;

    return (
        <Fragment>
            <PageHeader
                currentpage="Interview History"
                title="Interview History"
                activepage="Requisitions"
                mainpage="Applicants"
            />

            <div className="mb-4 flex gap-2">
                <Link
                    to={`/module/requisition/${requisitionId}/applicants`}
                    className="ti-btn ti-btn-secondary !py-1 !px-2 !text-[0.75rem]"
                >
                    <i className="ri-arrow-left-line align-middle me-1" /> Back
                </Link>

                <Link
                    to={`/module/requisition/applicants/${requisitionId}`}
                    className="ti-btn ti-btn-light !py-1 !px-2 !text-[0.75rem]"
                >
                    Back to Applicants
                </Link>
            </div>

            {error ? (
                <div className="box">
                    <div className="box-body">
                        <p className="text-danger">{error}</p>
                    </div>
                </div>
            ) : null}

            <div className="box">
                <div className="box-header justify-between flex items-center">
                    <div className="box-title">Interviews</div>
                    <div className="text-xs text-gray-500">
                        Total: <span className="font-semibold">{sorted.length}</span>
                    </div>
                </div>

                <div className="box-body">
                    {sorted.length ? (
                        <div className="space-y-4">
                            {sorted.map((iv) => (
                                <div key={iv.id} className="border rounded-md p-4">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                      <span className={getBadgeClasses(iv.status)}>
                        {toTitleCase(String(iv.status || "").replaceAll("_", " "))}
                      </span>
                                            <span className="text-sm text-gray-500">
                        {formatDate(iv.scheduled_at) || "—"}
                      </span>
                                        </div>

                                        <div className="text-sm text-gray-500">
                                            #{iv.id} • {iv.round ? toTitleCase(iv.round.replaceAll("_", " ")) : "—"} •{" "}
                                            {iv.interview_type ? toTitleCase(iv.interview_type) : "—"}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-12 gap-4 mt-3">
                                        <div className="col-span-12 md:col-span-6">
                                            <div className="text-xs text-gray-500">Interviewer</div>
                                            <div className="font-medium">
                                                {iv?.interviewer?.full_name || "—"}{" "}
                                                <span className="text-gray-500 text-sm">({iv?.interviewer?.email || "—"})</span>
                                            </div>
                                        </div>

                                        <div className="col-span-12 md:col-span-6">
                                            <div className="text-xs text-gray-500">Scheduled By</div>
                                            <div className="font-medium">
                                                {iv?.scheduled_by?.full_name || "—"}{" "}
                                                <span className="text-gray-500 text-sm">({iv?.scheduled_by?.email || "—"})</span>
                                            </div>
                                        </div>

                                        <div className="col-span-12">
                                            <div className="text-xs text-gray-500">Link / Location</div>
                                            <div className="font-medium break-words">{iv.link_or_location || "—"}</div>
                                        </div>

                                        <div className="col-span-12 md:col-span-3">
                                            <div className="text-xs text-gray-500">Outcome</div>
                                            <div className="font-medium">{iv.outcome ? toTitleCase(iv.outcome) : "—"}</div>
                                        </div>

                                        <div className="col-span-12 md:col-span-3">
                                            <div className="text-xs text-gray-500">Rating</div>
                                            <div className="font-medium">{iv.interviewer_rating ?? "—"}</div>
                                        </div>

                                        <div className="col-span-12 md:col-span-3">
                                            <div className="text-xs text-gray-500">Completed At</div>
                                            <div className="font-medium">{formatDate(iv.completed_at) || "—"}</div>
                                        </div>

                                        <div className="col-span-12 md:col-span-3">
                                            <div className="text-xs text-gray-500">Cancelled At</div>
                                            <div className="font-medium">{formatDate(iv.cancelled_at) || "—"}</div>
                                        </div>

                                        {iv.cancel_reason ? (
                                            <div className="col-span-12">
                                                <div className="text-xs text-gray-500">Cancel Reason</div>
                                                <div className="font-medium">{iv.cancel_reason}</div>
                                            </div>
                                        ) : null}

                                        {iv.interviewer_notes ? (
                                            <div className="col-span-12">
                                                <div className="text-xs text-gray-500">Interviewer Notes</div>
                                                <div className="font-medium whitespace-pre-wrap">{iv.interviewer_notes}</div>
                                            </div>
                                        ) : null}

                                        {/* ✅ Pretty feedback */}
                                        <div className="col-span-12">
                                            <FeedbackView feedback={iv.feedback} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-gray-500">No interviews found.</div>
                    )}
                </div>
            </div>
        </Fragment>
    );
};

export default ApplicantInterviewHistory;
