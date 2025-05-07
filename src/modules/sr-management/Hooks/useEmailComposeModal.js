import { useMemo, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import emailSchema from '@modules/sr-management/schema/emailSchema.js'
import api from '@config/axiosConfig.js'
import { updateServiceRequest } from '@modules/sr-management/services/Pending.js'
import Notify from '@helpers/toastNotifications.js'

export const useEmailComposeModal = ({ isOpen, serviceRequest, user, onClose }) => {
  const [includePreviousThread, setIncludePreviousThread] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [attachments, setAttachments] = useState(serviceRequest.attachments || [])
  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: { to_email: [], cc_email: [], message: '' }
  })



  const preTo = useMemo(() => {
    const s = new Set([...(serviceRequest?.to_email || [])])
    if (serviceRequest?.reporter_email) s.add(serviceRequest.reporter_email)
    return [...s].map(e => ({ label: e, value: e }))
  }, [serviceRequest])

  const preCc = useMemo(() => {
    const rep = user?.email || null
    const cc = serviceRequest?.cc_email || []
    const all = [...new Set(rep ? [rep, ...cc] : cc)]
    return all.map(e => ({ label: e, value: e }))
  }, [serviceRequest, user])

  useEffect(() => {
    if (isOpen) {
      reset({ to_email: preTo, cc_email: preCc, message: '' })
      setIncludePreviousThread(false)
      setSelectedIds([])
      setAttachments(serviceRequest.attachments || [])
      setShowPicker(false)
    }
  }, [isOpen, preTo, preCc, reset, serviceRequest])

  const toggleId = id =>
    setSelectedIds(p => (p.includes(id) ? p.filter(x => x !== id) : [...p, id]))

  const fileToBase64 = f =>
    new Promise(r => {
      const reader = new FileReader()
      reader.onload = () => r(reader.result)
      reader.readAsDataURL(f)
    })

  const handleUpdateAttachments = async newAttachment => {
    if (!newAttachment) {
      Notify.error('No attachment selected')
      return
    }
    const fileContent = await fileToBase64(newAttachment.file).then(r => r.split(',')[1])
    const payload = [
      ...attachments.map(att =>
        att.id
          ? att.id
          : { file_name: att.file_name, file_content: att.file_content }
      ),
      { file_name: newAttachment.file.name, file_content: fileContent }
    ]
    const res = await updateServiceRequest(serviceRequest.id, { attachments: payload })
    setAttachments(res.attachments || [])
    Notify.success('Attachment uploaded successfully')
  }

  const onSave = async data => {
    const payload = {
      service_request_id: serviceRequest.id,
      message: data.message,
      to_email: data.to_email.map(i => i.value || i),
      cc_email: data.cc_email.map(i => i.value || i),
      send_email: true,
      previous_thread: includePreviousThread,
      attachment_ids: selectedIds
    }
    await api.post(`/sr-task/${serviceRequest.id}/send-email/`, payload)
    onClose()
  }

  const selectedAtt = attachments.filter(a => selectedIds.includes(a.id))

  return {
    includePreviousThread,
    setIncludePreviousThread,
    showPicker,
    setShowPicker,
    selectedIds,
    toggleId,
    attachments,
    handleUpdateAttachments,
    control,
    handleSubmit,
    errors,
    isSubmitting,
    onSave,
    selectedAtt,
    preTo,
    preCc
  }
}
