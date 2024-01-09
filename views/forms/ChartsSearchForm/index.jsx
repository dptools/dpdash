import React from 'react'
import { useForm } from 'react-hook-form'
import debounce from 'debounce'
import { yupResolver } from '@hookform/resolvers/yup'
import { InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import * as yup from 'yup'

import TextInput from '../TextInput'

const schema = yup.object({
  search: yup.string(),
})

const ChartsSearchForm = ({ initialValues, onSubmit }) => {
  const { handleSubmit, control } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        name="search"
        control={control}
        placeholder={`Search charts you'd like to view`}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
        fullWidth
        onChange={debounce(
          (e) => onSubmit({ [e.target.name]: e.target.value }),
          500
        )}
        autoComplete="off"
      />
    </form>
  )
}

export default ChartsSearchForm
