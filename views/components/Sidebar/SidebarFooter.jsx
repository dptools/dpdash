import React from 'react'
import {
  Typography,
  Card,
  Avatar,
  CardHeader,
  CardContent,
  CardActions,
  Button,
} from '@mui/material'
import { Link } from 'react-router-dom'
import { routes } from '../../routes/routes'
import { fontSize } from '../../../constants'
import './SidebarFooter.css'

const SidebarFooter = ({ user, onLogout }) => {
  return (
    <Card sx={{ border: 0, boxShadow: 0, marginTop: 'auto' }}>
      <CardHeader
        avatar={<Avatar alt={user.display_name[0]} src={user.icon} />}
        sx={{ pb: '8px' }}
      />
      <CardContent sx={{ pt: 0, pb: '8px' }}>
        <Typography sx={{ fontWeight: 600 }}>{user.display_name}</Typography>
        <Typography
          sx={{ fontSize: fontSize[14], color: 'grey.A200' }}
          variant="subtitle1"
        >
          {user.title}
        </Typography>
      </CardContent>
      <CardActions
        sx={{ fontSize: fontSize[14], p: '16px' }}
        className="SidebarFooter_actions"
      >
        <Button
          variant="outlined"
          component={Link}
          to={routes.userAccount}
          sx={{
            borderColor: 'grey.100',
            color: 'text.primary',
            fontSize: fontSize[14],
            textTransform: 'none',
            borderRadius: '8px',
            padding: '2px 12px',
          }}
        >
          Edit Profile
        </Button>
        <Button
          variant="text"
          sx={{
            color: 'text.primary',
            fontSize: fontSize[14],
            textTransform: 'none',
            padding: '2px 12px',
          }}
          onClick={() => onLogout()}
        >
          Log out
        </Button>
      </CardActions>
      <CardContent>
        <Typography variant="caption" sx={{ color: 'grey.A100' }}>
          DPdash v{process.env.DPDASH_VERSION}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default SidebarFooter
