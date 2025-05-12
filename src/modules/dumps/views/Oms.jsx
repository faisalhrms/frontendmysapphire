import React, { useState, useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import IconTabs from "@components/IconTabs.jsx";
import OmsFilter from "@modules/dumps/component/oms/OmsFilter.jsx";
import { downloadOrderSummaryExcel, downloadWmsExcel } from "@modules/dumps/services/dumps_services.js";
import { dateRangeSchema } from "@modules/dumps/schema/dateRangeSchema.js";

const downloadMap = {
  Order: downloadOrderSummaryExcel,
  Wms: downloadWmsExcel
};

const labelMap = {
  Order: "Order Summary",
  Wms: "WMS"
};

const Oms = () => {
  const [activeTab, setActiveTab] = useState("Order");
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: { startDate: "", endDate: "" },
    resolver: zodResolver(dateRangeSchema),
    mode: "onTouched"
  });
  const [startDate, endDate] = useWatch({ control, name: ["startDate", "endDate"] });

  const onDownloadExcel = useCallback(async () => {
    const fn = downloadMap[activeTab];
    if (!fn || !startDate || !endDate) return;
    const blob = await fn({ startDate, endDate });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${activeTab.toLowerCase()}_${startDate}_${endDate}.xlsx`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }, [activeTab, startDate, endDate]);

  const onDownload = handleSubmit(onDownloadExcel);

  const handleClear = useCallback(() => {
    reset({ startDate: "", endDate: "" });
  }, [reset]);

  const handleTabChange = useCallback(tabId => {
    setActiveTab(tabId);
    reset({ startDate: "", endDate: "" });
  }, [reset]);

  const currentLabel = labelMap[activeTab];

  return (
    <>
      <PageHeader
        currentpage={`Oms ${currentLabel}`}
        activepage="Oms"
        mainpage={currentLabel}
      />
      <IconTabs
        tabs={[
          {
            id: "Order",
            label: "Order Summary",
            icon: <i className="bx bxs-report" />,
            content: (
              <OmsFilter
                control={control}
                errors={errors}
                onClear={handleClear}
                onDownloadExcel={onDownload}
              />
            )
          },
          {
            id: "Wms",
            label: "Wms",
            icon: <i className="bx bxs-receipt" />,
            content: (
              <OmsFilter
                control={control}
                errors={errors}
                onClear={handleClear}
                onDownloadExcel={onDownload}
              />
            )
          }
        ]}
        onTabChange={handleTabChange}
      />
    </>
  );
};

export default Oms;
