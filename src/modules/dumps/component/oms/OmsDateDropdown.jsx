import React, { useState, useEffect } from "react";
import { getPastDate } from "@helpers/dateTime.js";
import FormInput from "@components/form/FormInput.jsx";

const OmsDateDropdown = ({ control, errors }) => {

    const getFirstDayOfMonth = () => {
        const today = new Date();
        today.setDate(1);
        return today.toISOString().split("T")[0];
    };

    const [startDate, setStartDate] = useState(getFirstDayOfMonth());
    const [endDate, setEndDate] = useState(getPastDate(0));

    const handleStartDateChange = (e) => {
        const selectedStartDate = e.target.value;
        setStartDate(selectedStartDate);

        const newEndDate = new Date(new Date(selectedStartDate).setDate(new Date(selectedStartDate).getDate() + 30));
        setEndDate(newEndDate.toISOString().split("T")[0]);
    };

    return (
        <div className="grid grid-cols-12 gap-6">
            {/* Start Date */}
            <div className={`xl:col-span-4 col-span-12`}>
                <FormInput
                    type="date"
                    name="started_at"
                    control={control}
                    errors={errors}
                    placeholder="Start Date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    min={getFirstDayOfMonth()}
                    max={getPastDate(0)}
                />
            </div>

            {/* End Date */}
            <div className={`xl:col-span-4 col-span-12`}>
                <FormInput
                    type="date"
                    name="ended_at"
                    control={control}
                    errors={errors}
                    placeholder="End Date"
                    value={endDate}
                    min={startDate}
                    max={new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 30)).toISOString().split("T")[0]} // 31 days max from start date
                    readOnly
                />
            </div>
        </div>
    );
};

export default OmsDateDropdown;
