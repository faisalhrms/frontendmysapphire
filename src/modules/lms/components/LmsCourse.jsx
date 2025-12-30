import React, { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import api from "@config/axiosConfig";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import DataTable from "@components/datatable/DataTable.jsx";
import Notify from "@helpers/toastNotifications.js";

function Modal({ open, title, children, onClose }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl dark:text-gray-200 dark:bg-bodybg">
                <div className="flex items-center justify-between border-b px-5 py-4">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button onClick={onClose} className="rounded-xl px-3 py-1 ">
                        ✕
                    </button>
                </div>
                <div className="p-5">{children}</div>
            </div>
        </div>
    );
}

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

export default function CoursesPage() {
    const tableRef = useRef(null);
    const [selected, setSelected] = useState(null);
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [tableKey, setTableKey] = useState(0);

    const {
        control,
        register,
        reset,
        handleSubmit,
        formState: {errors},
    } = useForm({
        defaultValues: {
            title: "",
            description: "",
            is_active: true,
            scorm_package_id: null,
        },
    });

    const reloadTable = () => {
        setTableKey((prev) => prev + 1);
    }
        const openCreate = () => {
            setSelected(null);
            reset({
                title: "",
                description: "",
                is_active: true,
                scorm_package_id: null,
            });
            setOpen(true);
        };

        const openEdit = (course) => {
            setSelected(course);
            reset({
                title: course?.title ?? "",
                description: course?.description ?? "",
                is_active: course?.is_active ?? true,
                scorm_package_id: course?.scorm_package?.id ?? null,
            });
            setOpen(true);
        };

        const onSubmit = async (values) => {
            setSaving(true);
            try {
                const payload = {
                    title: values.title.trim(),
                    description: values.description?.trim() || null,
                    is_active: !!values.is_active,
                    scorm_package_id: values.scorm_package_id || null,
                };

                if (selected?.id) {
                    await api.put(`/lms/courses/${selected.id}/`, payload);
                    Notify.success("Course updated successfully.");
                } else {
                    await api.post("/lms/courses/", payload);
                    Notify.success("Course created successfully."); // ✅ ADDED
                }

                setOpen(false);
                reloadTable();
            } catch (error) {
                Notify.error(error.response?.data?.message || 'Failed');
            } finally {
                setSaving(false);
            }
        };

        const columns = useMemo(
            () => [
                {Header: "ID", accessor: "id", width: 80},
                {Header: "Title", accessor: "title"},
                {
                    Header: "Active",
                    accessor: "is_active",
                    Cell: ({value}) => (
                        <Badge ok={!!value}>{value ? "Yes" : "No"}</Badge>
                    ),
                    width: 120,
                },
                {
                    Header: "SCORM",
                    accessor: "scorm_package.title",
                    Cell: ({row}) => {
                        const sp = row.original?.scorm_package;
                        return sp ? `#${sp.id} — ${sp.title ?? "SCORM"}` : "—";
                    },
                },
                {
                    Header: "Created",
                    accessor: "created_at",
                    Cell: ({value}) => formatDate(value),
                },
                {
                    Header: "Actions",
                    accessor: "actions",
                    disableSortBy: true,
                    width: 160,
                    Cell: ({row}) => (
                        <button
                            onClick={() => openEdit(row.original)}
                            className="ti-btn ti-btn-primary ti-btn-sm"
                        >
                            <i className="ri-edit-line"></i>
                        </button>
                    ),
                },
            ],
            []
        );

        const buttons = (
            <div className="flex space-x-2">
                <button
                    onClick={openCreate}
                    type="button"
                    className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
                >
                    <i className="ri-add-line font-semibold align-middle"></i>
                    Create Course
                </button>
            </div>
        );

        return (
            <div className="p-4">
                <DataTable
                    key={tableKey}
                    ref={tableRef}
                    columns={columns}
                    title="LMS Courses"
                    buttons={buttons}
                    apiUrl="/lms/courses/datatable/"
                />

                <Modal
                    open={open}
                    title={selected?.id ? `Edit Course #${selected.id}` : "Create New Course"}
                    onClose={() => setOpen(false)}
                >
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label className="form-label">Title *</label>
                            <input
                                className="form-control w-full !rounded-sm border"
                                placeholder="e.g. Fire Safety Training"
                                {...register("title", {required: "Title is required"})}
                            />
                            {errors.title && (
                                <p className="text-xs font-bold text-danger mt-1">{errors.title.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="form-label">Description</label>
                            <textarea
                                rows={3}
                                className="form-control w-full !rounded-sm border"
                                placeholder="Brief description..."
                                {...register("description")}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <FormAsyncSelect
                                    isMulti={false}
                                    name="scorm_package_id"
                                    control={control}
                                    errors={errors}
                                    placeholder="Search SCORM package"
                                    preselectedOptions={
                                        selected?.scorm_package
                                            ? [
                                                {
                                                    value: selected.scorm_package.id,
                                                    label: `${selected.scorm_package.title ?? "SCORM"} (${
                                                        selected.scorm_package.scorm_version ?? ""
                                                    })`,
                                                },
                                            ]
                                            : []
                                    }
                                    allowSaveNewOption={false}
                                    className="w-full"
                                    apiUrl="/select/lms/scorm-packages/"
                                    queryKeyBase="lms_scorm_packages"
                                    needObject={false}
                                    rules={{required: false}}
                                    isClearable={true}
                                />
                                {errors.scorm_package_id && (
                                    <p className="text-xs text-red-600 mt-1">
                                        {errors.scorm_package_id.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-3 mt-6">
                                <input
                                    type="checkbox"
                                    className="h-5 w-5 rounded border-gray-300"
                                    {...register("is_active")}
                                />
                                <label className="text-sm font-medium text-gray-700">Active</label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                disabled={saving}
                                className="ti-btn ti-btn-primary"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-4 py-2 text-sm font-medium rounded-md ti-btn-primary-full"
                            >
                                {saving
                                    ? "Saving..."
                                    : selected?.id
                                        ? "Update Course"
                                        : "Create Course"}
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>

        );
}
