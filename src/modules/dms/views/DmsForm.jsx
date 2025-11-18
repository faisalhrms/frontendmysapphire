import React, { useMemo, useCallback, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import FormButton from '@components/form/FormButton.jsx';
import GalleryUpload from '@components/GalleryUpload.jsx';
import Notify from '@helpers/toastNotifications.js';

import { useDmsJournal, useSaveDmsAttachments } from '@modules/dms/hooks/dmsHook.js';
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";

const dmsSchema = z.object({
    attachment_ids: z.array(z.number()).optional().default([]),
});

function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}

const DmsForm = () => {
    const query = useQuery();
    const { id: routeId } = useParams();
    const docSequenceValue = query.get('doc_sequence_value') ?? routeId;

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        getValues,
        reset,
    } = useForm({
        resolver: zodResolver(dmsSchema),
        defaultValues: { attachment_ids: [] },
    });

    // ✅ NEW — Using non-react-query hooks
    const { journal: header, load: loadHeader, loading: loadingHeader } = useDmsJournal(docSequenceValue);
    const { save: saveAttachments, saving } = useSaveDmsAttachments(docSequenceValue, loadHeader);

    // ✅ Load header on mount and when ID changes
    useEffect(() => {
        loadHeader();
    }, [docSequenceValue]);
    useEffect(() => {
        if (header?.attachments) {
            // Pre-fill the control with currently linked attachment IDs
            reset({
                attachment_ids: header.attachments.map(a => a.id),
            });
        }
    }, [header, reset]);
    const onSubmit = useCallback(
        async (payload) => {
            if (!docSequenceValue) {
                Notify.error('Missing doc_sequence_value.');
                return;
            }
            const body = {
                doc_sequence_value: Number(docSequenceValue),
                attachment_ids: payload.attachment_ids || [],
            };
            await saveAttachments(body);
            reset({ attachment_ids: [] });
        },
        [docSequenceValue, reset, saveAttachments]
    );

    if (!docSequenceValue) {
        return (
            <div className="p-6">
                <div className="text-sm text-red-500">
                    Missing voucher id. Open this page as <code>/dms/form/2025100047</code> or <code>/dms/form?doc_sequence_value=2025100047</code>.
                </div>
            </div>
        );
    }

    return (
        <>
            <PageHeader currentpage="Journal Voucher Documents" activepage="Dms" mainpage="Form" />

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="col-span-12">
                        <div className="box">
                            <div className="box-body">

                                {loadingHeader && (
                                  <LoadingSpinner/>
                                )}

                                {header && (
                                    <div className="grid grid-cols-12 gap-4">
                                        <div className="col-span-12">
                                            <h3 className="text-base font-semibold">DMS Header</h3>
                                        </div>

                                        <div className="xl:col-span-3 col-span-12">
                                            <div className="text-xs text-muted">Voucher#</div>
                                            <div className="font-medium">
                                                {header.DOC_SEQUENCE_VALUE ?? docSequenceValue}
                                            </div>
                                        </div>

                                        <div className="xl:col-span-3 col-span-12">
                                            <div className="text-xs text-muted">Name</div>
                                            <div className="font-medium">{header.NAME || '-'}</div>
                                        </div>

                                        <div className="xl:col-span-3 col-span-12">
                                            <div className="text-xs text-muted">Period</div>
                                            <div className="font-medium">{header.PERIOD_NAME || '-'}</div>
                                        </div>

                                        <div className="xl:col-span-3 col-span-12">
                                            <div className="text-xs text-muted">Status</div>
                                            <div className="font-medium">{header.STATUS || '-'}</div>
                                        </div>

                                        <div className="xl:col-span-6 col-span-12">
                                            <div className="text-xs text-muted">Description</div>
                                            <div className="font-medium">{header.DESCRIPTION || '-'}</div>
                                        </div>

                                        <div className="xl:col-span-6 col-span-12">
                                            <div className="text-xs text-muted">Date Created</div>
                                            <div className="font-medium">{header.DATE_CREATED || '-'}</div>
                                        </div>

                                        {/* Attachments */}
                                        <div className="col-span-12 mt-4">
                                            <h4 className="text-sm font-semibold mb-2">Attachments</h4>
                                            <GalleryUpload
                                                key={header?.DOC_SEQUENCE_VALUE ?? docSequenceValue}
                                                currentValue={getValues('attachment_ids')}
                                                files={header?.attachments || []}   // 👈 show existing files
                                                label={false}
                                                inputName="attachment_ids"
                                                placeholder="Select Attachments"
                                                control={control}
                                                errors={errors}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="px-6 py-4 border-t border-dashed dark:border-defaultborder/10 sm:flex justify-end">
                                <FormButton
                                    isLoading={isSubmitting || saving}
                                    label="Save Attachments"
                                    disabled={!docSequenceValue || loadingHeader}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default DmsForm;
