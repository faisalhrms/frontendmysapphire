import React, { useEffect, useCallback } from 'react'
import { useMappingModal } from '@modules/beirholm-bi/hooks/useMappingModal.js'
import FormButton from '@components/form/FormButton.jsx'
import FormAsyncSelect from '@components/form/FormAsyncSelect.jsx'
import FormSelect from '@components/form/FormSelect.jsx'
import { productCountry } from '@modules/beirholm-bi/services/DataSanitizeService.js'

const MappingModal = ({ closeModal, refreshTable }) => {
  const { register, handleSubmit, errors, isSubmitting, onSubmit, control } = useMappingModal()
  const close = useCallback(() => {
    const m = document.getElementById('MappingModal')
    if (m && window.HSOverlay?.close) window.HSOverlay.close(m)
    setTimeout(closeModal, 300)
  }, [closeModal])
  useEffect(() => {
    const m = document.getElementById('MappingModal')
    if (m && window.HSOverlay?.open) window.HSOverlay.open(m)
  }, [])
  return (
    <div id="MappingModal" data-hs-overlay-keyboard="false" className="hs-overlay ti-modal [--overlay-backdrop:static] backdrop-blur-[0.08rem]">
      <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center">
        <div className="max-h-full mx-auto overflow-hidden ti-modal-content">
          <form
            onSubmit={handleSubmit(async d => {
              await onSubmit(d)
              refreshTable()
              close()
            })}
          >
            <div className="ti-modal-header">
              <h6 className="modal-title">Upload Mapping Rules</h6>
              <button type="button" className="ti-modal-close-btn" onClick={close}>
                ✕
              </button>
            </div>
            <div className="ti-modal-body overflow-y-auto max-h-[calc(100vh-200px)]">
              <div className="grid grid-cols-12 gap-4">
                <div className="xl:col-span-12 col-span-12">
                  <FormSelect
                    name="product_country"
                    control={control}
                    errors={errors}
                    placeholder="Select Country"
                    options={productCountry}
                    label="Select Country"
                  />
                </div>
                <div className="col-span-12">
                  <label className="block mb-1 text-sm font-medium">
                    File <span className="text-red-500">xlsx *</span>
                  </label>
                  <input
                    type="file"
                    {...register("file", { required: "File is required" })}
                    className="block w-full border border-gray-200 focus:shadow-sm dark:focus:shadow-white/10 rounded-sm
                    text-sm focus:z-10 focus:outline-0 focus:border-gray-200 dark:focus:border-white/10
                     dark:border-white/10 dark:text-[#8c9097] dark:text-white/50 file:me-4 file:py-2
                     file:px-4 file:rounded-s-sm file:border-0 file:text-sm file:font-semibold
                     file:bg-primary file:text-white hover:file:bg-primary focus-visible:outline-none"
                  />
                  {errors.file && (
                    <p className="text-red-600 text-xs mt-1">{errors.file.message}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="ti-modal-footer">
              <FormButton isLoading={isSubmitting} />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
export default MappingModal
