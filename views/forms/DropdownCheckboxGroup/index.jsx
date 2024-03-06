import React, { useState } from 'react'
import { useWatch } from 'react-hook-form'
import { KeyboardArrowDown } from '@mui/icons-material'
import { Menu, ListItem, TextField, InputAdornment } from '@mui/material'
import ControlledCheckbox from '../ControlledCheckbox'

const DropdownCheckboxGroup = ({
  filterKey,
  control,
  options,
  onSubmit,
  getValues,
}) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = async () => {
    setAnchorEl(null)

    const values = getValues()

    await onSubmit(values)
  }

  const formValues = useWatch({
    control,
    name: filterKey,
  })

  return (
    <>
      <TextField
        label={filterKey}
        id={`${filterKey}`}
        placeholder="Select"
        InputLabelProps={{
          shrink: true,
          sx: {
            color: 'grey.A100',
            '&.Mui-focused': { color: 'grey.A100' },
            '&:hover': { cursor: 'none' },
          },
        }}
        onClick={handleClick}
        onFocus={(e) => e.currentTarget.blur()}
        sx={{
          borderColor: 'grey.A100',
        }}
        InputProps={{
          sx: {
            '&.Mui-focused': { borderColor: 'grey.A100' },
          },
          endAdornment: (
            <InputAdornment position="start">
              <KeyboardArrowDown />
            </InputAdornment>
          ),
        }}
      />

      <Menu
        id={`${filterKey}`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        disableAutoFocus
        disableAutoFocusItem
      >
        {options.map((filter) => {
          const currentValue = +formValues?.[filter.label].value

          return (
            <ListItem>
              <ControlledCheckbox
                control={control}
                name={`${filterKey}.${filter.label}.value`}
                label={filter.label}
                checked={currentValue === 1}
              />
            </ListItem>
          )
        })}
      </Menu>
    </>
  )
}

export default DropdownCheckboxGroup
