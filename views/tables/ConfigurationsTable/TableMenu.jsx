import React, { useState } from 'react'
import {
  IconButton,
  Menu,
  MenuList,
  MenuItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material'
import {
  MoreVert,
  Share,
  Delete,
  ContentCopy,
  Edit,
  SettingsApplications,
} from '@mui/icons-material'
import { borderRadius } from '../../../constants'

const TableMenu = (props) => {
  const {
    configuration,
    onEdit,
    onDelete,
    onDuplicate,
    onDefaultChange,
    onShare,
    isOwner,
  } = props
  const [menuAnchor, setMenuAnchor] = useState(null)
  const open = Boolean(menuAnchor)

  const deleteAndClose = () => {
    onDelete(configuration._id)
    onClose()
  }
  const duplicateAndClose = () => {
    onDuplicate(configuration)
    onClose()
  }
  const editAndClose = () => {
    onEdit(configuration._id)
    onClose()
  }
  const onClose = () => setMenuAnchor(null)
  const setDefaultAndClose = () => {
    onDefaultChange(configuration._id)
    onClose()
  }
  const shareAndClose = () => {
    onShare(configuration)
    onClose()
  }

  return (
    <>
      <IconButton
        id={`menu-button-${configuration._id}`}
        aria-label={`open menu for ${configuration.name}`}
        aria-controls={open ? `menu-${configuration._id}` : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={(event) => setMenuAnchor(event.currentTarget)}
        sx={{
          color: 'primary.dark',
          backgroundColor: 'primary.light',
          borderRadius: borderRadius[8],
        }}
      >
        <MoreVert />
      </IconButton>
      <Menu open={open} onClose={onClose} anchorEl={menuAnchor}>
        <MenuList
          sx={{
            minWidth: '214px',
            maxWidth: '100%',
            color: isOwner ? 'common.black' : 'text.disabled',
          }}
        >
          <MenuItem disabled={!isOwner}>
            <ListItemButton onClick={() => editAndClose()}>
              <ListItemIcon>
                <Edit />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </ListItemButton>
          </MenuItem>
          <MenuItem disabled={!isOwner}>
            <ListItemButton onClick={() => shareAndClose()}>
              <ListItemIcon>
                <Share />
              </ListItemIcon>

              <ListItemText>Share</ListItemText>
            </ListItemButton>
          </MenuItem>
          <MenuItem disabled={!isOwner}>
            <ListItemButton onClick={() => deleteAndClose()}>
              <ListItemIcon>
                <Delete />
              </ListItemIcon>

              <ListItemText>Delete</ListItemText>
            </ListItemButton>
          </MenuItem>
          <MenuItem>
            <ListItemButton onClick={() => duplicateAndClose()}>
              <ListItemIcon>
                <ContentCopy />
              </ListItemIcon>

              <ListItemText>Duplicate</ListItemText>
            </ListItemButton>
          </MenuItem>
          <MenuItem>
            <ListItemButton onClick={() => setDefaultAndClose()}>
              <ListItemIcon>
                <SettingsApplications />
              </ListItemIcon>

              <ListItemText>Set as default</ListItemText>
            </ListItemButton>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  )
}

export default TableMenu
