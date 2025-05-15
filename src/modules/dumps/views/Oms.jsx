import React, { useState, useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import IconTabs from "@components/IconTabs.jsx";
import OmsFilter from "@modules/dumps/component/oms/OmsFilter.jsx";
import {
  downloadOrderSummaryExcel,
  downloadReturnOrderExcel,
  downloadWmsExcel
} from "@modules/dumps/services/dumps_services.js";
import { dateRangeSchema } from "@modules/dumps/schema/dateRangeSchema.js";

const downloadMap = {
  Order: downloadOrderSummaryExcel,
  Wms: downloadWmsExcel,
  return_order: downloadReturnOrderExcel
};

const labelMap = {
  Order: "Order Summary",
  Wms: "WMS",
  return_order: "Return Order"
};

const formatDate = d => {
  const t = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return t.toISOString().split("T")[0];
};

const today = new Date();
today.setDate(today.getDate() - 1);
const defaultEndDate = formatDate(today);

const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
const defaultStartDate = formatDate(startOfMonth);

const Oms = () => {
  const [activeTab, setActiveTab] = useState("Order");
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: { startDate: defaultStartDate, endDate: defaultEndDate },
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
    link.download = `${activeTab}_${startDate}_${endDate}.xlsx`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }, [activeTab, startDate, endDate]);

  const onDownload = handleSubmit(onDownloadExcel);

  const handleClear = useCallback(() => {
    reset({ startDate: defaultStartDate, endDate: defaultEndDate });
  }, [reset]);

  const handleTabChange = useCallback(tabId => {
    setActiveTab(tabId);
    reset({ startDate: defaultStartDate, endDate: defaultEndDate });
  }, [reset]);

  const currentLabel = labelMap[activeTab];

  return (
    <>
      <PageHeader currentpage={`Oms ${currentLabel}`} activepage="Oms" mainpage={currentLabel} />
      <IconTabs
        tabs={[
          {
            id: "Order",
            label: "Order Summary",
            icon: <i className="bx bx-detail" />,
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
            label: "WMS",
            icon: <i className="bx bx-receipt" />,
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
            id: "return_order",
            label: "Return Order",
            icon: <i className="bx bx-repost" />,
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
