import React from "react";
import { formatOptions } from "@helpers/formatters.js";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";

const SanitizedDataDropDown = ({
  control,
  errors,
  data,
  fieldDefinitionId = null,
  multiple = false,
  dataKey = 'correct_value',
  classes = '',
  haveLabel = false,
  name = 'correct_value_id',
  onValueSelect
}) => {
  return (
    <FormAsyncSelect
      isMulti={multiple}
      label={haveLabel}
      name={name}
      control={control}
      errors={errors}
      placeholder="Sanitized Value"
      apiUrl={`/select/sanitized/data/${fieldDefinitionId ? `?field_definition_id=${fieldDefinitionId}` : ''}`}
      queryKeyBase={`sanitized_query${fieldDefinitionId ? `_${fieldDefinitionId}` : ''}`}
      className={classes}
      preselectedOptions={data ? formatOptions(data, dataKey) : []}
      onSelectChange={onValueSelect}
    />
  );
};

export default React.memo(SanitizedDataDropDown);
