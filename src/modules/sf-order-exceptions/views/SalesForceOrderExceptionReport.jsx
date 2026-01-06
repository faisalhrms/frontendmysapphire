import React, {useCallback, useMemo, useState} from "react";
import useFilters from "@hooks/useFilters.js";
import {getPastDate} from "@helpers/dateTime.js";
import {useFetchWithFilters} from "@hooks/useFetchWithFilters.js";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import OrderExceptionFilter from "@modules/sf-order-exceptions/components/OrderExceptionFilter.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import SalesForceOrderExceptionTable from "@modules/sf-order-exceptions/components/SalesForceOrderExceptionTable.jsx";

const SalesForceOrderExceptionReport = () => {

    const {
        control,
        handleSubmit,
        errors,
        getFilters
    } = useFilters(
        useMemo(
            () => ({
                initialFilters: [
                    { name: 'date',defaultValue: getPastDate(0)},
                    { name: 'country',defaultValue: 'PK'},
                ],
            }),
            []
        )
    );

    const [filters, setFilters] = useState(getFilters());

    const { data, isLoading, refetch } = useFetchWithFilters(
        '/reporting/sf/order-exception/', filters
    );
    const onSubmit = useCallback(
        (formData) => {
            setFilters(formData);
        },
        []
    );
    return (
        <>
            <PageHeader currentpage="Salesforce Order Exceptions" activepage="Salesforce"
                        mainpage="Order Exceptions"/>
            <form onSubmit={handleSubmit(onSubmit)}>
                <OrderExceptionFilter control={control} errors={errors}/>
            </form>
                    <>
                        {isLoading ? (
                            <LoadingSpinner />
                        ) : (
                            <SalesForceOrderExceptionTable data={data} isLoading={isLoading} />
                        )}
                    </>
        </>
    );
};

export default SalesForceOrderExceptionReport;
