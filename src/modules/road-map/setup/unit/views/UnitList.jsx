import React, {useState} from "react";
import DataTable from "@components/DataTable.jsx";
import {Link} from "react-router-dom";
import {toTitleCase} from "@helpers/formatters.js";
import {UNIT} from "@modules/road-map/routes.js";

const UnitList = () => {

    const columns = [
        {
            Header: 'Actions',
            Cell: ({row}) => (
                <div className="flex space-x-2">
                    <Link to={UNIT.CREATE.path} state={{id: row.original.id}}>
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
            Header: 'Unit Category',
            accessor: 'unit_category.name',
            Cell: ({value}) => toTitleCase(value ?? 'N/A')
        },
        {
            Header: 'Category Type',
            accessor: 'category_type_label',
            Cell: ({value}) => toTitleCase(value ?? 'N/A')
        },
        {
            Header: 'Unit Name',
            accessor: 'name',
            Cell: ({value}) => toTitleCase(value ?? 'N/A')
        },
        {
            Header: 'Source',
            accessor: 'is_in_house',
            Cell: ({value}) => {
                const label = value == null ? 'N/A' : value ? 'In-House' : 'Out-Source'
                const className =
                    value == null
                        ? ''
                        : value
                            ? 'bg-info/10 text-info rounded-full px-2 py-1'
                            : 'bg-danger/10 text-danger rounded-full px-2 py-1'
                return className ? <span className={className}>{label}</span> : label
            }
        }
    ]


    const buttons = (
        <div className="grid grid-cols-1 sm:grid-cols-1">
            <Link
                to={UNIT.CREATE.path}
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
                title="Unit"
                apiUrl="unit/datatable"
                buttons={buttons}
            />
        </>
    );
};
export default UnitList;
