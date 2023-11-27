import React from 'react'
import { Button, Menu, MenuItem, MenuList, Typography } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ShareIcon from '@mui/icons-material/Share'
import { Link } from 'react-router-dom'

import { routes } from '../../routes/routes'
import ChartModel from '../../models/ChartModel'

const MENU_ITEM_STYLES = { display: 'flex', gap: '32px' }
const COLOR_STYLES = { color: 'black.A100' }
const TableMenu = (props) => {
  const { chart, onDelete, onDuplicate, onShare, user } = props
  const [menuAnchor, setMenuAnchor] = React.useState(null)
  const open = Boolean(menuAnchor)
  const editChart = routes.editChart(chart._id)
  const onClose = () => setMenuAnchor(null)
  const deleteAndClose = () => {
    onDelete(chart)
    onClose()
  }
  const duplicateAndClose = () => {
    onDuplicate(chart)
    onClose()
  }
  const shareAndClose = () => {
    onShare(chart)
    onClose()
  }
  const userOwnsChart = ChartModel.isOwnedByUser(chart, user)

  return (
    <>
      <Button
        id={`menu-button-${chart._id}`}
        aria-label={`open menu for ${chart.title}`}
        aria-controls={open ? `menu-${chart._id}` : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={(event) => setMenuAnchor(event.currentTarget)}
      >
        <MoreVertIcon />
      </Button>
      <Menu
        id={`menu-${chart._id}`}
        anchorEl={menuAnchor}
        open={open}
        onClose={onClose}
        MenuListProps={{
          'aria-labelledby': `menu-button-${chart._id}`,
        }}
      >
        <MenuList sx={{ minWidth: '214px', maxWidth: '100%' }}>
          <MenuItem
            component={Link}
            data-testid="edit"
            disableRipple
            disabled={!userOwnsChart}
            to={editChart}
            sx={MENU_ITEM_STYLES}
          >
            <EditIcon sx={COLOR_STYLES} />
            <Typography sx={COLOR_STYLES}>Edit</Typography>
          </MenuItem>
          <MenuItem
            onClick={deleteAndClose}
            disableRipple
            disabled={!userOwnsChart}
            sx={MENU_ITEM_STYLES}
          >
            <DeleteIcon sx={COLOR_STYLES} />
            <Typography sx={COLOR_STYLES}>Delete</Typography>
          </MenuItem>
          <MenuItem
            onClick={duplicateAndClose}
            disableRipple
            sx={MENU_ITEM_STYLES}
          >
            <ContentCopyIcon sx={COLOR_STYLES} />
            <Typography sx={COLOR_STYLES}>Duplicate</Typography>
          </MenuItem>
          <MenuItem onClick={shareAndClose} disableRipple sx={MENU_ITEM_STYLES}>
            <ShareIcon sx={COLOR_STYLES} />
            <Typography sx={COLOR_STYLES}>Share</Typography>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  )
}

export default TableMenu
