import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { InputAdornment, MenuItem, Button, CardActions } from '@mui/material'
import { Search } from '@mui/icons-material'
import * as yup from 'yup'

import ControlledMultiSelect from '../ControlledMultiSelect'
import ControlledSelectInput from '../ControlledSelect'
import SearchSelect from '../../components/SearchSelect'

import './ParticipantsSearchForm.css'

const schema = yup.object({
  participants: yup.array(),
  studies: yup.array(),
  status: yup.string(),
})

const ParticipantsSearchForm = ({ initialValues, onSubmit, allOptions }) => {
  const { handleSubmit, control, watch, setValue, getValues } = useForm({
    defaultValues: initialValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  })
  const formValues = getValues()

  const handleClear = () => setValue('studies', [])
  const handleSelectAll = () =>
    setValue(
      'studies',
      allOptions.studies.map(({ value }) => value)
    )

  useEffect(() => {
    const subscription = watch((value) => onSubmit(value))

    return () => subscription.unsubscribe()
  }, [watch])
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="ParticipantsSearchForm">
        <ControlledMultiSelect
          name="participants"
          control={control}
          options={allOptions.participants}
          placeholder="Search participants you'd like to view"
          startAdornment={
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          }
          sx={{ flexBasis: 1, flexGrow: 5 }}
        />
        <SearchSelect
          options={allOptions.studies}
          control={control}
          formValues={formValues}
          name="studies"
          label="Study"
          getValues={getValues}
          actions={
            <CardActions
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
              }}
            >
              <Button color="primary" fullWidth onClick={handleClear}>
                CLEAR
              </Button>
              <Button
                color="primary"
                fullWidth
                onClick={handleSelectAll}
                sx={{ gridColumnStart: 4, gridColumnEnd: 6 }}
              >
                SELECT ALL
              </Button>
            </CardActions>
          }
        />
        <ControlledSelectInput
          control={control}
          name="status"
          defaultValue={undefined}
          sx={{ flexGrow: 1, flexBasis: 0 }}
          label="Status"
        >
          <MenuItem value={undefined} key={'All'}>
            All
          </MenuItem>
          <MenuItem value={1}>Active</MenuItem>
          <MenuItem value={0}>Inactive</MenuItem>
        </ControlledSelectInput>
      </div>
    </form>
  )
}

export default ParticipantsSearchForm
