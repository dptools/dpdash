import React from 'react'
import { TextField } from '@mui/material'
import './SearchInput.css'

const SearchInput = ({ handleSearch }) => (
  <div className="SearchInput">
    <TextField
      label="Find category"
      variant="standard"
      key="categorySearch"
      fullWidth
      onChange={handleSearch}
    />
  </div>
)

export default SearchInput
