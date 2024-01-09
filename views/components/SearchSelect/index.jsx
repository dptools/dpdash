import React, { useState, useMemo } from 'react'
import { Card, Checkbox, MenuItem, ListItemText } from '@mui/material/'
import ControlledSelectInput from '../../forms/ControlledSelect'
import MenuWithFooterActions from './MenuWithFooterActions'
import SearchInput from './SearchInput'
import { fontSize } from '../../../constants'

const SearchSelect = ({
  control,
  options,
  actions,
  name,
  formValues,
  label,
}) => {
  const [search, setSearch] = useState('')
  const displayedOptions = useMemo(() => {
    const searchTerm = new RegExp(search, 'i')
    return options.filter(({ value }) => searchTerm.test(value))
  }, [search])

  const handleSearch = (e) => setSearch(e.target.value)
  const handleClose = () => setSearch('')

  return (
    <ControlledSelectInput
      control={control}
      name={name}
      multiple
      label={label}
      defaultValue={[]}
      sx={{ flexGrow: 1, flexBasis: 0 }}
      SelectProps={{
        renderValue: (selected) => selected.join(', '),
        onClose: () => handleClose(),
        multiple: true,
        MenuProps: {
          autoFocus: false,
          MenuListProps: {
            autoFocus: true,
          },
          PaperProps: {
            component: MenuWithFooterActions,
            searchInput: <SearchInput handleSearch={handleSearch} />,
            actions: (
              <Card
                raised={0}
                sx={{
                  position: 'sticky',
                  bottom: 0,
                  right: 0,
                  left: 0,
                  pt: '30px',
                }}
              >
                {actions}
              </Card>
            ),
          },
        },
      }}
    >
      {displayedOptions.map(({ label, value }) => {
        return (
          <MenuItem key={value} value={value}>
            <Checkbox
              sx={{ color: 'black.A100' }}
              checked={formValues.studies?.includes(value)}
            />
            <ListItemText primary={label} sx={{ fontSize: fontSize[16] }} />
          </MenuItem>
        )
      })}
    </ControlledSelectInput>
  )
}

export default SearchSelect
