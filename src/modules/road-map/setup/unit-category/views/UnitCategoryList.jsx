import React, {useState} from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import {Link} from "react-router-dom";
import {toTitleCase} from "@helpers/formatters.js";
import {UNIT_CATEGORY} from "@modules/road-map/routes.js";

const UnitCategoryList = () => {

    const columns = [
        {
            Header: 'Actions',
            Cell: ({row}) => (
                <div className="flex space-x-2">
                    <Link to={UNIT_CATEGORY.CREATE.path} state={{id: row.original.id}}>
                        <button className="ti-btn ti-btn-primary ti-btn-sm">
                            <i className="ri-edit-line"></i>
                        </button>
                    </Link>
                </div>
            )
        },
        {
            Header: 'Business Unit',
            accessor: 'business_unit_label',
            Cell: ({value}) => toTitleCase(value ?? 'N/A')
        },
        {
            Header: 'Name',
            accessor: 'name',
            Cell: ({value}) => toTitleCase(value ?? 'N/A')
        },
        {
            Header: 'Category Type',
            accessor: 'category_type_label',
            Cell: ({value}) => toTitleCase(value ?? 'N/A')
        }
    ]


    const buttons = (
        <div className="grid grid-cols-1 sm:grid-cols-1">
            <Link
                to={UNIT_CATEGORY.CREATE.path}
                className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
            >
                <i className="ri-add-line font-semibold align-middle"></i> Add
            </Link>
        </div>
    );

    return (
        <>
            <DataTable
                columns={columns}
                title="Unit Category"
                apiUrl="unit/category/datatable/"
                externalFilters={['tab']}
                buttons={buttons}
            />
        </>
    );
};
export default UnitCategoryList;
