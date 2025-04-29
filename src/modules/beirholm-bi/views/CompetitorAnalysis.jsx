import React, {useState} from "react";
import {useForm, Controller, useWatch} from "react-hook-form";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import Select from "react-select";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import ErrorMessage from "@components/form/ErrorMessage.jsx";
import {useCompetitorAnalysis} from "../hooks/useCompetitorAnalysis";
import FinancialAnalysisResults from "../components/FinancialAnalysisResults";
import InfrastructureResults from "../components/InfrastructureResults";
import SustainabilityResults from "../components/SustainabilityResults";
import {downloadReport} from "@modules/beirholm-bi/services/competitorData.js";

const filterOptions = [
  {label: "Financial Analysis", value: "financialAnalysis"},
  {label: "Infrastructure", value: "infrastructure"},
  {label: "Sustainability", value: "sustainability"}
];

const currencyOptions = [
  {label: "PKR", value: "PKR"},
  {label: "EUR", value: "EUR"}
];

const CompetitorAnalysis = () => {
  const {control, watch, formState: {errors}} = useForm({
    defaultValues: {
      competitor_company: "1",
      filter: [{label: "Financial Analysis", value: "financialAnalysis"}],
      currency: {label: "PKR", value: "PKR"}
    }
  });
  const competitorCompany = useWatch({control, name: "competitor_company"});
  const filters = useWatch({control, name: "filter"}) || [];
  const currencyObj = useWatch({control, name: "currency"});
  const selectedFilterValues = filters.map(opt => opt.value);
  const showCurrencySelect = selectedFilterValues.length === 1 && selectedFilterValues[0] === "financialAnalysis";
  const currencyValue = currencyObj ? currencyObj.value : "PKR";

  const {apiData, isLoading} = useCompetitorAnalysis({
    competitorCompany,
    filters: selectedFilterValues,
    currencyValue
  });

const convertToMillions = arr =>
  arr ? arr.slice(2).map(v => Number(v.replace(/,/g, "")) / 1_000_000) : [];

  const [isDownloading, setIsDownloading] = useState(false);

  const downloadPDF = async () => {
    try {
      setIsDownloading(true)
      const pdfData = await downloadReport({
        competitor_company: competitorCompany,
        filters: selectedFilterValues,
        currency: currencyValue
      });
      const blob = new Blob([pdfData], {type: 'application/pdf'});
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'competitor_analysis_report.pdf';
      link.click();
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setIsDownloading(false)
    }
  };
  return (
    <>
      <PageHeader currentpage="Competitor Analysis" mainpage="Competitor Analysis" />

      <div className="bg-white p-4 shadow-md rounded-lg mb-6">
        <div className="flex space-x-4 mb-4">
          <div className="w-1/3">
            <label htmlFor="filter" className="form-label">Select Analysis Type</label>
            <Controller
              name="filter"
              control={control}
              render={({field}) => (
                <Select
                  {...field}
                  isMulti
                  options={filterOptions}
                  placeholder="Select Analysis Type"
                  onChange={(selected) => field.onChange(selected)}
                  value={field.value}
                  className={`w-full !rounded-sm border ${errors.filter ? "border-red" : ""}`}
                  classNamePrefix="Select2"
                  menuPortalTarget={document.body}
                  styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                />
              )}
            />
            <ErrorMessage message={errors.filter?.message} />
          </div>
          <div className="w-1/3">
            <FormAsyncSelect
              label={true}
              name="competitor_company"
              control={control}
              errors={errors}
              placeholder="Select Company"
              apiUrl="/select/beirholm/competitors/company/"
              queryKeyBase="competitor_company"
              preselectedOptions={competitorCompany ? [{label: "Faisal Spinning Mills", value: "1"}] : []}
            />
          </div>
            <div className="w-1/3">
              <label htmlFor="currency" className="form-label">Select Currency</label>
              <Controller
                name="currency"
                control={control}
                render={({field}) => (
                  <Select
                    {...field}
                    options={currencyOptions}
                    placeholder="Select Currency"
                    onChange={(selected) => field.onChange(selected)}
                    value={field.value}
                    className={`w-full !rounded-sm border ${errors.currency ? "border-red" : ""}`}
                    classNamePrefix="Select2"
                    menuPortalTarget={document.body}
                    styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                  />
                )}
              />
              <ErrorMessage message={errors.currency?.message} />
            </div>
          <div className="ml-auto">
            <button
              type="button"
              className="ti-btn bg-primary border mb-2 text-white btn-wave font-medium text-[0.85rem] rounded-[0.35rem] py-[0.51rem] px-[0.86rem] shadow-none"
              onClick={downloadPDF}
              disabled={isDownloading}
            >
              <i
                className={`bi bi-file-earmark-pdf ${isDownloading ? 'spin' : ''} text-lg`}
                style={isDownloading ? {animation: 'spin 1s infinite linear'} : {}}
              ></i>
              {isDownloading ? '' : 'PDF'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 shadow-md rounded-lg mb-6">
        {(!competitorCompany || selectedFilterValues.length === 0) ? (
          <div className="text-center text-gray-600">
            Please select a competitor company and analysis type.
          </div>
        ) : isLoading ? (
          <div className="text-center text-gray-600">Loading analysis data...</div>
        ) : !apiData ? (
          <div className="text-center text-gray-600">No analysis data available.</div>
        ) : (
          selectedFilterValues.map((analysisType, index) => {
            const analysis = apiData[analysisType];
            if (!analysis) return <div key={index}>No data available for {analysisType}</div>;
            if (analysisType === "financialAnalysis") {
              return (
                <FinancialAnalysisResults
                  key={analysisType}
                  analysis={analysis}
                  currencyValue={currencyValue}
                  convertToMillions={convertToMillions}
                />
              );
            } else if (analysisType === "infrastructure") {
              return (
                <InfrastructureResults
                  key={analysisType}
                  analysis={analysis}
                />
              );
            } else if (analysisType === "sustainability") {
              return (
                <SustainabilityResults
                  key={analysisType}
                  analysis={analysis}
                />
              );
            } else return null;
          })
        )}
      </div>
    </>
  );
};

export default CompetitorAnalysis;
