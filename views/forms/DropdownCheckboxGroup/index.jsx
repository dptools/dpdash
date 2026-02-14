import React from 'react'

import {
  OutlinedInput,
  Select,
  MenuItem,
  Box,
  Chip,
  Button,
} from '@mui/material'
import { useController } from 'react-hook-form'
const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 10.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

const DropdownCheckboxGroup = ({
  label,
  initialValues,
  name,
  control,
  onClear,
  onClose,
  onSelectAll,
}) => {
  const { field } = useController({ name, control })
  const options = Object.values(initialValues)

  return (
    <Select
      labelId={`multi-chip-label-${label}`}
      key={`multi-chip-label-${label}`}
      id={`multi-chip-${label}`}
      data-testid={`multi-chip-${label}`}
      multiple
      {...field}
      input={
        <OutlinedInput data-testid={`select-multiple-${label}`} label={label} />
      }
      renderValue={(selected) => {
        const EtcChip =
          selected.length > 5 ? <Chip key="etc" label="..." /> : <></>

        return selected
          .slice(0, 5)
          .map((value) => <Chip key={`${value}`} label={value} />)
          .concat([EtcChip])
      }}
      onClose={onClose}
      MenuProps={MenuProps}
      fullWidth={false}
    >
      {options.map(({ label }) => {
        return (
          <MenuItem
            data-testid={`menu_item_option_${name}_${label}`}
            key={`${name}_${label}`}
            value={label}
          >
            {label}
          </MenuItem>
        )
      })}
      <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
        <Button onClick={() => onClear(name)}>Clear</Button>
        <Button onClick={() => onSelectAll(name)}>Select All</Button>
      </Box>
    </Select>
  )
}
export default DropdownCheckboxGroup
