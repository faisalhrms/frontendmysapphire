import React, {useCallback, useMemo, useState} from 'react';
import OciDateDropdown from "@modules/dumps/component/OciDateDropdown.jsx";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import useFilters from "@hooks/useFilters.js";
import { getPastDate } from "@helpers/dateTime.js";
import OciForm from "../component/OciForm.jsx";
import {useFetchWithFilters} from "@hooks/useFetchWithFilters.js";

const Oci = () => {

    const {
        control,
        handleSubmit,
        errors,
        getFilters,
    } = useFilters(
        useMemo(
            () => ({
                initialFilters: [
                    { name: 'date', defaultValue: getPastDate(0) },
                ],
            }),
            []
        )
    );
    const [filters, setFilters] = useState(getFilters());
    const { data, isLoading } = useFetchWithFilters(
        '/dumps/oci/', filters
    );

    const onSubmit = useCallback(
        (formData) => {
            setFilters(formData);
        },
        []
    );


    return (
        <>
            <PageHeader currentpage="Oci Dumps" activepage="Dumps" mainpage="Oci"/>
            <form onSubmit={handleSubmit(onSubmit)}>
                <OciDateDropdown  filters={filters} control={control} errors={errors} />
                <OciForm data={data} filters={filters} />
            </form>
        </>
    );
};

export default Oci;
