import { useFieldArray } from 'react-hook-form'

function useArrayFormFields({ control, name, defaultFieldValue }) {
  const { fields, append, remove } = useFieldArray({ control, name })
  const addNewField = (fieldValues) =>
    append(fieldValues || defaultFieldValue, { shouldFocus: false })

  const removeField = (fieldIndex) => remove(fieldIndex, { shouldFocus: false })

  return {
    fields,
    addNewField,
    removeField,
  }
}

export default useArrayFormFields
