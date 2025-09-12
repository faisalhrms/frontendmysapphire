import React, { useEffect } from 'react'
import { useFieldArray } from 'react-hook-form'
import FormAsyncSelect from '@components/form/FormAsyncSelect.jsx'

const makePreset = (row, idKey) =>
  row[idKey] && row[`${idKey}_label`]
    ? [{ value: row[idKey], label: row[`${idKey}_label`] }]
    : []

const MappingSection = ({ title, fieldName, selectedBusinessUnit, control, errors, isUnit }) => {
  const { fields, append, remove } = useFieldArray({ control, name: fieldName })

  useEffect(() => {
    if (!fields.length)
      append({
        item: null,
        item_label: '',
        suppliers: [],
        dyes_method: null,
        dyes_label: '',
        sort_order: 0
      })
  }, [append, fields.length])

  return (
    <div className="box">
      <div className="box-header flex justify-between items-center">
        <div className="box-title">{title}</div>
        <button
          type="button"
          onClick={() =>
            append({
              item: null,
              item_label: '',
              suppliers: [],
              dyes_method: null,
              dyes_label: '',
              sort_order: fields.length
            })
          }
          className="ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
        >
          <i className="ri-add-line" /> Add row
        </button>
      </div>

      <div className="box-body space-y-2">
        {fields.map((row, i) => (
          <div key={row.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md border">
            <FormAsyncSelect
              label={false}
              name={`${fieldName}.${i}.item`}
              control={control}
              errors={errors}
              placeholder="Item"
              apiUrl={`/select/roadmap/${fieldName}-items?business_unit=${selectedBusinessUnit}`}
              queryKeyBase={`${fieldName}-items-${selectedBusinessUnit}-${i}`}
              className="flex-1"
              preselectedOptions={makePreset(row, 'item')}
            />

            <FormAsyncSelect
              label={false}
              name={`${fieldName}.${i}.suppliers`}
              control={control}
              errors={errors}
              placeholder="Suppliers"
              apiUrl={`/select/roadmap/suppliers?business_unit=${selectedBusinessUnit}`}
              queryKeyBase={`suppliers-${selectedBusinessUnit}-${i}`}
              className="flex-1"
              isMulti={true}
              preselectedOptions={row.suppliersOptions}
            />

            {isUnit && (
              <FormAsyncSelect
                label={false}
                name={`${fieldName}.${i}.dyes_method`}
                control={control}
                errors={errors}
                placeholder="Dyes Method"
                apiUrl={`/select/roadmap/dyes-methods?business_unit=${selectedBusinessUnit}`}
                queryKeyBase={`dyes-${selectedBusinessUnit}-${i}`}
                className="flex-1"
                preselectedOptions={makePreset(row, 'dyes_method')}
              />
            )}

            <button
              type="button"
              onClick={() => remove(i)}
              className="ti-btn ti-btn-danger ti-btn-sm flex items-center"
            >
              <i className="ti ti-trash" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MappingSection
