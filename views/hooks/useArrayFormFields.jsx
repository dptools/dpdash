import { useFieldArray } from 'react-hook-form'

function useArrayFormFields({ control, name, defaultFieldValue }) {
  const { fields, append, remove } = useFieldArray({ control, name })
  const addNewField = (fieldValues) => append(fieldValues || defaultFieldValue)

  const removeField = (fieldIndex) => remove(fieldIndex)

  return {
    fields,
    addNewField,
    removeField,
  }
}

export default useArrayFormFields
