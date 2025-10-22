import { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { downloadAgreementsTemplate, ingestAgreementsApi, uploadAgreementsExcel, saveChannel, testChannel } from "@modules/customer-hub/integrations/services/IntegrationsService.js";

export const useIntegrations = () => {
  const { handleSubmit, control, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      channel_id: "",
      preview: true,
      items: [{ agreement_no: "", item_no: "", type: "", color: "", width: "", design: "", quality: "", start_date: "", end_date: "", vmi_po: "", description: "", vendor_design: "" }]
    }
  });

  const itemsFA = useFieldArray({ control, name: "items" });
  const selectedChannelId = useMemo(() => Number(watch("channel_id")) || null, [watch("channel_id")]);
  const onSubmit = async (data) => {
    const payload = { ...data, channel_id: Number(data.channel_id) || undefined };
    await ingestAgreementsApi(payload);
  };

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const openUpload = () => setIsUploadModalOpen(true);
  const closeUpload = () => setIsUploadModalOpen(false);
  const uploadFn = (file) => uploadAgreementsExcel(file, { channel_id: Number(watch("channel_id")) });

  const [newChannel, setNewChannel] = useState({
    name: "",
    type: "api",
    auth_type: "none",
    active: true,
    base_url: "",
    ingest_path: "",
    secret: "",
    bearer_token: "",
    headers: {}
  });
  const [headersText, setHeadersText] = useState("{}");
  useEffect(() => {
    try {
      const obj = JSON.parse(headersText || "{}");
      setNewChannel(s => ({ ...s, headers: obj }));
    } catch {}
  }, [headersText]);

  const onTypeChange = (val) => {
    if (val === "excel") setNewChannel(s => ({ ...s, type: "excel", base_url: "", ingest_path: "" }));
    else setNewChannel(s => ({ ...s, type: "api" }));
  };

  const saveNew = async () => {
    await saveChannel({ ...newChannel, headers: newChannel.headers || {} });
    setNewChannel({ name: "", type: "api", auth_type: "none", active: true, base_url: "", ingest_path: "", secret: "", bearer_token: "", headers: {} });
    setHeadersText("{}");
  };

  const testSelected = async () => {
    if (!selectedChannelId) return;
    const r = await testChannel(selectedChannelId);
    return r;
  };

  return {
    control,
    errors,
    isSubmitting,
    handleSubmit,
    onSubmit,
    itemsFA,
    selectedChannelId,
    isUploadModalOpen,
    openUpload,
    closeUpload,
    uploadFn,
    downloadAgreementsTemplate,
    newChannel,
    setNewChannel,
    headersText,
    setHeadersText,
    onTypeChange,
    saveNew,
    testSelected,
    setValue,
    watch
  };
};
