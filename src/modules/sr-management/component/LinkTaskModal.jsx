import React, {useEffect} from 'react'
import {useForm} from 'react-hook-form'
import FormAsyncSelect from '@components/form/FormAsyncSelect.jsx'
import FormButton from '@components/form/FormButton.jsx'

const LinkTaskModal = ({isOpen, onLink, onClose}) => {
    const {
        control,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting}
    } = useForm()

    useEffect(() => {
        if (isOpen) reset()
    }, [isOpen, reset])

    const submit = data => {
        reset()
        onLink(data)
        onClose()
    }

    return (
        <div id="link-task-modal"
             className={`hs-overlay fixed inset-0 z-50 bg-black/40 transition-all duration-300 ${isOpen ? 'block' : 'hidden'}`}>
            <div
                className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out relative flex items-center justify-center min-h-[calc(100%-2rem)] max-w-md mx-auto my-auto">
                <div className="ti-modal-content bg-white rounded-lg shadow-xl w-full">
                    <div className="ti-modal-header flex justify-between items-center p-4 border-b">
                        <h6 className="modal-title text-[1rem] font-semibold">Link Service Request</h6>
                        <button
                            onClick={() => {
                                reset();
                                onClose();
                            }}
                            type="button"
                            className="hs-dropdown-toggle !text-[1rem] !font-semibold !text-defaulttextcolor"
                        >
                            <i className="ri-close-line"/>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(submit)}>
                        <div className="ti-modal-body px-4 py-3 space-y-4 mb-5">
                            <FormAsyncSelect
                                label={true}
                                name="sr_number"
                                control={control}
                                errors={errors}
                                placeholder="SR Number"
                                apiUrl="/select/sr/number"
                                queryKeyBase="sr_number"
                                preselectedOptions={[]}
                            />
                        </div>

                        <div className="ti-modal-footer flex justify-end gap-2 p-4 border-t">
                            <button
                                type="button"
                                onClick={() => {
                                    reset();
                                    onClose();
                                }}
                                className="ti-btn ti-btn-secondary-full ti-btn-loader m-2"
                            >
                                Cancel
                            </button>
                            <FormButton isLoading={isSubmitting} text="Save"/>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LinkTaskModal
