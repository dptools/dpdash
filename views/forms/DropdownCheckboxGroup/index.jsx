import React, { useState } from 'react'
import {
  OutlinedInput,
  Select,
  MenuItem,
  Box,
  Chip,
  Button,
} from '@mui/material'

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

const DropdownCheckboxGroup = ({ label, initialValues, onChange }) => {
  const options = Object.keys(initialValues)
  const selectedValues = Object.keys(initialValues).filter(
    (k) => initialValues[k].value === 1
  )
  const [selectedValue, setSelectedValue] = useState(selectedValues)

  const handleChange = (event) => {
    const {
      target: { value },
    } = event
    if (typeof value === 'string') {
      setSelectedValue(value.split(','))
      onChange(label, value.split(','))
    } else {
      setSelectedValue(value)
      onChange(label, value)
    }
  }

  const handleClearSelection = (_) => {
    setSelectedValue([])
    onChange(label, [])
  }

  const handleSelectAll = (_) => {
    setSelectedValue(options)
    onChange(label, options)
  }
  return (
    <Select
      labelId={`multi-chip-label-${label}`}
      id={`multi-chip-${label}`}
      multiple
      value={selectedValue}
      onChange={handleChange}
      input={<OutlinedInput id={`select-multiple-${label}`} label={label} />}
      renderValue={(selected) => {
        const EtcChip =
          selected.length > 5 ? <Chip key={'etc'} label="..." /> : <></>
        return (
          <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: 0.5 }}>
            {selected
              .slice(0, 5)
              .map((value) => {
                return <Chip key={value} label={value} />
              })
              .concat([EtcChip])}
          </Box>
        )
      }}
      MenuProps={MenuProps}
    >
      {options.map((value) => {
        return (
          <MenuItem key={value} value={value}>
            {value}
          </MenuItem>
        )
      })}
      <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
        <Button onClick={handleClearSelection}>Clear</Button>
        <Button onClick={handleSelectAll}>Select All</Button>
      </Box>
    </Select>
  )
}

export default DropdownCheckboxGroup
