import React from 'react'
import { Chip } from '@mui/material'
import {
  Share,
  Delete,
  ContentCopy,
  Edit,
  SettingsApplications,
} from '@mui/icons-material'

import Table from '../Table'
import { borderRadius, fontSize } from '../../../constants'
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
    { dataProperty: 'owner', label: 'Created By', sortable: false },
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
