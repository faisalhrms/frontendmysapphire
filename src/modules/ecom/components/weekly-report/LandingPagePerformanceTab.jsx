import React from "react";
import ClientSideTable from "@components/ClientSideTable.jsx";
import ProgressBar from "@components/ProgressBar.jsx";
import FormSelect from "@components/form/FormSelect.jsx";

const LandingPagePerformanceTab = ({data, isLoading, isActive, control, errors, handleSubmit, onSubmit}) => {
    if (!isActive) {
        return null
    }
    const tableData = (data || []).map((item) => ({
        name: item.name,
        sessions: item.sessions,
        avg_session_duration: item.avg_session_duration,
        engaged_sessions: item.engaged_sessions,
        engagement_rate: <ProgressBar value={item.engagement_rate} withStatus={false}/>,
    }));

  const headerComponents= [
          <FormSelect
              name="top"
              control={control}
              errors={errors}
              placeholder="Show All"
              options={[
                  {value: 5, label: "Show Top 5"},
                  {value: 10, label: "Show Top 10"},
                  {value: 20, label: "Show Top 20"},
                  {value: 30, label: "Show Top 30"},
                  {value: 40, label: "Show Top 40"},
                  {value: 50, label: "Show Top 50"},
                  {value: 70, label: "Show Top 70"},
                  {value: 100, label: "Show Top 100"},
                  {value: 150, label: "Show Top 150"},
                  {value: 200, label: "Show Top 200"},
                  {value: 250, label: "Show Top 250"},
                  {value: 300, label: "Show Top 300"},
                  {value: 400, label: "Show Top 400"},
                  {value: 500, label: "Show Top 500"},
              ]}
              onSelectChange={handleSubmit(onSubmit)}
              label={false}
              className='select-sm min-w-[120px]'
          />

          ]
          const tableConfig = {
          headers: [
      {label: "Name/URL", accessor: "name", align: "left"},
      {label: "Sessions", accessor: "sessions"},
      {label: "Avg Session Duration", accessor: "avg_session_duration"},
      {label: "Engaged Sessions", accessor: "engaged_sessions"},
      {label: "Engagement Rate", accessor: "engagement_rate"},
          ],
      };
          return (
          <ClientSideTable isLoading={isLoading} headerComponents={headerComponents} height="800px" tHeadClasses='text-white bg-[#383853]'
                           config={tableConfig} data={tableData} title='Landing page performance'/>
          )
          }
          export default LandingPagePerformanceTab