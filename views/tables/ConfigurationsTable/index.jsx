import React from 'react'

import {
  Share,
  Delete,
  ContentCopy,
  Edit,
  SettingsApplications,
} from '@mui/icons-material'
import { Chip } from '@mui/material'

import { borderRadius, fontSize } from '../../../constants'
import { UserConfigModel } from '../../models'
import Table from '../Table'
import TableMenu from '../Table/TableMenu'

const ConfigurationsTable = (props) => {
  const {
    configurations,
    onDefaultChange,
    onDelete,
    onDuplicate,
    onEdit,
    onShare,
    user,
    maxRows,
  } = props
  const headers = [
    { dataProperty: 'name', label: 'Configuration Name', sortable: false },
    {
      dataProperty: 'owner_display_name',
      label: 'Created By',
      sortable: false,
    },
    {
      dataProperty: 'status',
      label: 'Status',
      sortable: false,
    },
    {
      dataProperty: 'default',
      label: '',
      sortable: false,
    },

    {
      dataProperty: 'info',
      dataAlign: 'right',
      label: '',
      sortable: false,
    },
  ]

  const cellRenderer = (configuration, property) => {
    const currentConfiguration = user.preferences.config === configuration._id
    const ownsConfig = user.uid === configuration.owner

    switch (property) {
      case 'default':
        return (
          currentConfiguration && (
            <Chip
              sx={{
                backgroundColor: 'purple.100',
                color: 'purple.600',
                fontSize: fontSize[14],
                fontWeight: 500,
                p: '0 6px',
                borderRadius: borderRadius[24],
              }}
              label="Default"
            />
          )
        )
      case 'info':
        return (
          <TableMenu
            id={configuration._id}
            menuItems={[
              {
                disabled: !ownsConfig,
                onClick: () => onEdit(configuration._id),
                Icon: Edit,
                text: 'Edit',
              },
              {
                disabled: !ownsConfig,
                onClick: () => onShare(configuration),
                Icon: Share,
                text: 'Share',
              },
              {
                disabled: !ownsConfig,
                onClick: () => onDelete(configuration._id),
                Icon: Delete,
                text: 'Delete',
              },
              {
                onClick: () => onDuplicate(configuration),
                Icon: ContentCopy,
                text: 'Duplicate',
              },
              {
                onClick: () => onDefaultChange(configuration._id),
                Icon: SettingsApplications,
                text: 'Set as default',
              },
            ]}
          />
        )
      case 'status':
        return UserConfigModel.isActive(configuration, property) ? (
          <Chip
            sx={{
              backgroundColor: 'primary.light',
              color: 'text.secondary',
              fontSize: fontSize[14],
              fontWeight: 500,
              p: '0 19px 0 15px',
              borderRadius: borderRadius[24],
            }}
            label="Active"
          />
        ) : (
          <Chip
            sx={{
              backgroundColor: 'grey.A300',
              color: 'text.primary',
              fontSize: fontSize[14],
              fontWeight: 500,
              p: '0 19px 0 15px',
              borderRadius: borderRadius[24],
            }}
            label="Draft"
          />
        )
      default:
        return configuration[property]
    }
  }

  return (
    <Table
      cellRenderer={cellRenderer}
      data={configurations}
      headers={headers}
      maxRows={maxRows}
    />
  )
}

export default ConfigurationsTable
