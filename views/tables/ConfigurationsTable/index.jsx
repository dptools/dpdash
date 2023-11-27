import React from 'react'

import Table from '../Table'
import TableMenu from './TableMenu'
import { Chip } from '@mui/material'
import { borderRadius, fontSize } from '../../../constants'

const ConfigurationsTable = (props) => {
  const {
    configurations,
    onDefaultChange,
    onDelete,
    onDuplicate,
    onEdit,
    onShare,
    user,
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
            isOwner={ownsConfig}
            onShare={onShare}
            configuration={configuration}
            onDefaultChange={onDefaultChange}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            onEdit={onEdit}
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
    />
  )
}

export default ConfigurationsTable
