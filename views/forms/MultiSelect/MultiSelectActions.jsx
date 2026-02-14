import { Paper, Button } from '@mui/material'

import './MultiSelect.css'

const MultiSelectFooterActions = ({
  children,
  onClear,
  onSelectAll,
  ...rest
}) => {
  // Prevent input blur which triggers closing the menu
  const preventClosingThePopup = (e) => e.preventDefault()

  return (
    <Paper {...rest}>
      {children}
      <div className="MultiSelectActions">
        <Button onMouseDown={preventClosingThePopup} onClick={onClear}>
          Clear
        </Button>
        <Button onMouseDown={preventClosingThePopup} onClick={onSelectAll}>
          Select all
        </Button>
      </div>
    </Paper>
  )
}

export default MultiSelectFooterActions
