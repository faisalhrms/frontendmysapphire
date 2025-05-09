import React, { useMemo } from 'react';
import OciForm from "@modules/dumps/component/OciForm.jsx";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import useFilters from "@hooks/useFilters.js";
import { getPastDate } from "@helpers/dateTime.js";
import OciFilter from "../component/OciFilter.jsx";

const Oci = () => {
    const {
        control,
        handleSubmit,
        errors,
        getFilters,
        filters
    } = useFilters(
        useMemo(
            () => ({
                initialFilters: [
                    { name: 'date', defaultValue: getPastDate(1) },
                ],
            }),
            []
        )
    );

    const onSubmit = (data) => {
        console.log("Form data:", data);
    };

    return (
        <>
            <PageHeader currentpage="Dumps" activepage="Dumps" mainpage="Oci"/>
            <form onSubmit={handleSubmit(onSubmit)}>
                <OciForm filters={filters} control={control} errors={errors} />
                <OciFilter filters={filters} />
            </form>
        </>
    );
};

export default Oci;
