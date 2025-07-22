import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import DataTable from '@components/DataTable.jsx'
import PageHeader from '@modules/layouts/includes/PageHeader.jsx'
import ConfirmDeleteModal from '@modules/beirholm-bi/components/ConfirmDeleteModal.jsx'
import {deleteChain} from '@modules/road-map/Chain-Designer/services/ChainService.js'
import {CHAIN_DESIGNER} from '@modules/road-map/routes.js'

const chunk = (arr, n = 3) =>
  arr.reduce((a, c, i) => {
    const idx = Math.floor(i / n)
    a[idx] = [...(a[idx] || []), c]
    return a
  }, [])

const renderGrouped = val =>
  chunk(val || [], 3).map((grp, gi) => (
    <div key={gi}>
      {grp
        .filter(v => v && v.name)
        .map(v => (
          <span key={v.id} className="inline-block mr-2">
            {v.name}
          </span>
        ))}
    </div>
  ))

const ChainList = () => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [chainToDelete, setChainToDelete] = useState(null)
  const [tableKey, setTableKey] = useState(Date.now())
  const [loadingActions, setLoadingActions] = useState({})

  const refreshTable = () => setTableKey(Date.now())

  const openConfirmModal = id => {
    setChainToDelete(id)
    setIsConfirmModalOpen(true)
  }

  const closeConfirmModal = () => {
    setChainToDelete(null)
    setIsConfirmModalOpen(false)
  }

  const columns = [
    {
      Header: 'Actions',
      Cell: ({row}) => {
        const id = row.original.id
        return (
          <div className="flex space-x-2">
            <Link to={CHAIN_DESIGNER.CREATE.path} state={{id}}>
              <button className="ti-btn ti-btn-primary ti-btn-sm">
                <i className="ri-edit-line" />
              </button>
            </Link>
            <button
              onClick={() => openConfirmModal(id)}
              className="ti-btn ti-btn-danger ti-btn-sm"
              disabled={loadingActions[`del_${id}`]}
            >
              {loadingActions[`del_${id}`] ? (
                <i className="ri-loader-2-line animate-spin" />
              ) : (
                <i className="ri-delete-bin-line" />
              )}
            </button>
          </div>
        )
      }
    },
    {Header: 'Business Unit', accessor: 'business_unit_label'},
    {
      Header: 'Quality',
      accessor: 'quality.name'
    },
    {
      Header: 'Process',
      accessor: 'process_method.name'
    },
    {
      Header: 'Products',
      accessor: 'products.name',
    },
    {
      Header: 'Unit Categories',
      accessor: 'unit_categories',
      Cell: ({value}) => renderGrouped(value)
    },
    {
      Header: 'Units',
      accessor: 'units',
      Cell: ({value}) => renderGrouped(value)
    },
    {
      Header: 'Dyes Methods',
      accessor: 'dyes_methods',
      Cell: ({value}) => renderGrouped(value)
    },
    {
      Header: 'Stitch Types',
      accessor: 'stitch_types',
      Cell: ({value}) => renderGrouped(value)
    }
  ]

  const buttons = (
    <div>
      <Link
        to={CHAIN_DESIGNER.CREATE.path}
        className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
      >
        <i className="ri-add-line align-middle" /> Add
      </Link>
    </div>
  )

  return (
    <>
      <PageHeader currentpage="Chain List" activepage="Chain" mainpage="List" />
      <DataTable
        key={tableKey}
        columns={columns}
        title="RoadMap Chain"
        apiUrl="chain/datatable"
        buttons={buttons}
      />
      {isConfirmModalOpen && chainToDelete && (
        <ConfirmDeleteModal
          bodyMessage="Are you sure you want to delete this and all related data?"
          closeModal={closeConfirmModal}
          onConfirm={async () => {
            const k = `del_${chainToDelete}`
            setLoadingActions(p => ({...p, [k]: true}))
            await deleteChain(chainToDelete)
            refreshTable()
            setLoadingActions(p => ({...p, [k]: false}))
          }}
        />
      )}
    </>
  )
}

export default ChainList
