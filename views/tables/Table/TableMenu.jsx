import React from 'react'
import { IconButton, Menu, MenuItem, MenuList, Typography } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'

const MENU_ITEM_STYLES = { display: 'flex', gap: '32px' }
const COLOR_STYLES = { color: 'black.A100' }
const TableMenu = (props) => {
  const { menuItems } = props
  const [menuAnchor, setMenuAnchor] = React.useState(null)
  const open = Boolean(menuAnchor)
  const onClose = () => setMenuAnchor(null)

  return (
    <>
      <IconButton
        id={`menu-button-${props.id}`}
        data-testid={props.id}
        aria-label="open menu"
        aria-controls={open ? `menu-${props.id}` : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={(event) => setMenuAnchor(event.currentTarget)}
        color="primary"
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id={`menu-${props.id}`}
        anchorEl={menuAnchor}
        open={open}
        onClose={onClose}
        MenuListProps={{
          'aria-labelledby': `menu-button-${props.id}`,
        }}
      >
        <MenuList sx={{ minWidth: '214px', maxWidth: '100%' }}>
          {menuItems.map((menuItem, idx) => (
            <MenuItem
              key={idx}
              component={menuItem.component}
              onClick={() => {
                menuItem.onClick()
                onClose()
              }}
              data-testid={menuItem.testID}
              disableRipple
              disabled={menuItem.disabled}
              to={menuItem.to}
              sx={MENU_ITEM_STYLES}
            >
              <menuItem.Icon sx={COLOR_STYLES} />
              <Typography sx={COLOR_STYLES}>{menuItem.text}</Typography>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </>
  )
}

export default TableMenu
