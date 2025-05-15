import React from 'react'
import FormRichTextarea from '@components/form/FormRichTextarea.jsx'
import FormButton from '@components/form/FormButton.jsx'
import SRAsyncSelect from '@modules/sr-management/component/components/SRAsyncSelect.jsx'
import {Link} from 'react-router-dom'
import {getAttachmentIcon, getAttachmentColor, formatBytes} from '@modules/sr-management/services/srServices.js'
import {useEmailComposeModal} from "@modules/sr-management/Hooks/useEmailComposeModal.js";
import EmailAttachmentModal from "@modules/sr-management/component/EmailAttachmentModal.jsx";

const EmailComposeModal = ({isOpen, onClose, serviceRequest, user}) => {
    const {
        attachments,
        selectedIds,
        selectedAtt,
        includePreviousThread,
        setIncludePreviousThread,
        showPicker,
        setShowPicker,
        toggleId,
        control,
        handleSubmit,
        errors,
        isSubmitting,
        onSave,
        handleUpdateAttachments,
        preTo,
        preCc
    } = useEmailComposeModal({isOpen, onClose, serviceRequest, user})

    return (
        <div
            id="email-compose"
            className={`hs-overlay fixed inset-0 z-50 bg-black/40 transition-all duration-300 ${
                isOpen ? 'block' : 'hidden'
            }`}
        >
            <div
                className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out relative flex items-center justify-center min-h-[calc(100%-2rem)] max-w-4xl mx-auto my-auto">
                <div className="ti-modal-content bg-white rounded-lg shadow-xl w-full">
                    <div className="ti-modal-header flex justify-between items-center p-4 border-b">
                        <h6 className="modal-title text-[1rem] font-semibold">Compose Email</h6>
                        <button onClick={onClose} type="button"
                                className="hs-dropdown-toggle !text-[1rem] !font-semibold !text-defaulttextcolor">
                            <i className="ri-close-line"></i>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit(onSave)}>
                        <div className="ti-modal-body px-4 py-3 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
                            <SRAsyncSelect
                                key={`to-email-${isOpen}`}
                                label="To"
                                isMulti
                                name="to_email"
                                control={control}
                                errors={errors}
                                placeholder="To"
                                apiUrl="/select/users/email"
                                queryKeyBase="users-email"
                                preselectedOptions={preTo}
                                allowSaveNewOption
                            />
                            <SRAsyncSelect
                                key={`cc-email-${isOpen}`}
                                label="CC"
                                isMulti
                                name="cc_email"
                                control={control}
                                errors={errors}
                                placeholder="CC"
                                apiUrl="/select/users/email"
                                queryKeyBase="cc-email"
                                preselectedOptions={preCc}
                                allowSaveNewOption
                            />
                            <FormRichTextarea
                                name="message"
                                control={control}
                                errors={errors}
                                placeholder="Write your email message here"
                                editorOptions={{
                                    height: 200,
                                    buttonList: [
                                        ['undo', 'redo'],
                                        ['font', 'fontSize', 'paragraphStyle', 'table'],
                                        ['horizontalRule', 'list', 'lineHeight'],
                                        ['fullScreen', 'preview']
                                    ]
                                }}
                            />
                            <div className="mail-attachments mb-6">
                                <div className="flex justify-between items-center">
                                      <span className="text-[.875rem] font-semibold dark:!text-defaulttextcolor/70">
                                        <i className="ri-attachment-2 me-1 align-middle"></i>Attachments:
                                      </span>
                                    <Link
                                        onClick={() => setShowPicker(true)}
                                        className="!w-[2.75rem] !h-[2.75rem] ti-btn-icon ti-btn-outline-info dark:hover:!bg-light flex items-center justify-center !rounded-md dark:!border-defaultborder/10 !ms-2 !text-[1.2rem] !text-defaulttextcolor dark:!text-defaulttextcolor/70 border"
                                    >
                                        <i className="ri-attachment-2"></i>
                                    </Link>
                                </div>

                                {selectedAtt.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {selectedAtt.map(a => (
                                            <div
                                                key={a.id}
                                                className="relative flex items-center gap-1 rounded-md border dark:border-defaultborder/10 px-2 py-1 bg-white dark:bg-slate-700 hover:shadow-sm"
                                            >
                                                <Link to={a.file} target="_blank" rel="noopener noreferrer"
                                                      className="flex items-center gap-1">
                                                    <i className={`${getAttachmentIcon(a.file_type)} ${getAttachmentColor(a.file_type)} text-base`}/>
                                                    <div className="flex flex-col max-w-[7rem]">
                                                        <p className="truncate text-xs font-medium">{a.file_name}</p>
                                                        <p className="text-[10px] text-[#8c9097]">{formatBytes(a.size)}</p>
                                                    </div>
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleId(a.id)}
                                                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white dark:bg-slate-800 border flex items-center justify-center text-defaulttextcolor shadow"
                                                >
                                                    <i className="ri-close-line text-[9px]"/>
                                                </button>
                                            </div>

                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="previous-thread"
                                    checked={includePreviousThread}
                                    onChange={e => setIncludePreviousThread(e.target.checked)}
                                    className="mr-2"
                                />
                                <label htmlFor="previous-thread" className="text-sm">
                                    Include Previous Thread
                                </label>
                            </div>
                        </div>
                        <div className="ti-modal-footer flex justify-end gap-2 p-4 border-t">
                            <button onClick={onClose} type="button"
                                    className="ti-btn ti-btn-warning-full ti-btn-loader m-2">
                                Cancel
                            </button>
                            <FormButton isLoading={isSubmitting} text="Send"/>
                        </div>
                    </form>

                    <EmailAttachmentModal
                        show={showPicker}
                        onClose={() => setShowPicker(false)}
                        attachments={attachments}
                        selectedIds={selectedIds}
                        toggleId={toggleId}
                        handleUpdateAttachments={handleUpdateAttachments}
                    />
                </div>
            </div>
        </div>
    )
}

export default EmailComposeModal
