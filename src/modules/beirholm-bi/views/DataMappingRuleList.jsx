import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '@modules/layouts/includes/PageHeader.jsx'
import DataTable from '@components/DataTable.jsx'
import { BEIRHOLM_BI_ROUTES } from '@modules/beirholm-bi/routes.js'
import { toTitleCase } from '@helpers/formatters.js'
import MappingModal from '@modules/beirholm-bi/components/MappingModal.jsx'
import { downloadMappingSample } from '@modules/beirholm-bi/services/dataMappingRuleService.js'

const DataMappingRuleList = () => {
  const [open, setOpen] = useState(false)
  const [key, setKey] = useState(Date.now())
  const refresh = () => setKey(Date.now())

  const join = (arr, fn) => arr.map(fn).join(', ')

const columns = [
  {
    Header: 'Actions',
    Cell: ({ row }) => (
      <Link to={BEIRHOLM_BI_ROUTES.DATA_MAPPING_RULE_CREATE.path} state={{ id: row.original.id }}>
        <button className="ti-btn ti-btn-primary ti-btn-sm">
          <i className="ri-edit-line"></i>
        </button>
      </Link>
    )
  },
  { Header: 'Country',       accessor: r => toTitleCase(r.product_country) },
  { Header: 'Data Category', accessor: r => toTitleCase(r.data_category.name) },
  { Header: 'Source Header', accessor: r => toTitleCase(r.source_header.name) },
  { Header: 'Source Value',  accessor: 'source_value' },
  {
    Header: 'Mappings',
    accessor: 'mapped',
    Cell: ({ value }) => (
      <div className="flex flex-col">
        {value.map((m, i) => (
          <span key={i} className="inline-flex items-center space-x-1">
            <span className="font-medium">{toTitleCase(m.mapped_header.name)}:</span>
            <span>{m.mapped_value}</span>
          </span>
        ))}
      </div>
    )
  },
  {
    Header: 'Created',
    accessor: 'created_at',
    Cell: ({ value }) => new Date(value).toLocaleString()
  }
]


  const buttons = (
    <>
      <button
        className="ti-btn ti-btn-info-full !py-1 !px-2 !text-[0.75rem]"
        onClick={downloadMappingSample}
      >
        <i className="ri-download-line"></i>
      </button>
      <button
        className="ti-btn ti-btn-success-full !py-1 !px-2 !text-[0.75rem]"
        onClick={() => setOpen(true)}
      >
        <i className="ri-upload-line"></i>
      </button>
      <Link
        to={BEIRHOLM_BI_ROUTES.DATA_MAPPING_RULE_CREATE.path}
        className="ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
      >
        <i className="ri-add-line"></i> Add
      </Link>
    </>
  )

  return (
    <>
      <PageHeader currentpage="Mapping Rules" mainpage="Mapping Rules" />
      <DataTable
        key={key}
        title="Mapping Rules"
        apiUrl="data/mapping/rule/datatable/"
        columns={columns}
        buttons={buttons}
      />
      {open && <MappingModal closeModal={() => setOpen(false)} refreshTable={refresh} />}
    </>
  )
}

export default DataMappingRuleList
