import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Typography, Button } from '@mui/material'
import { ArrowForwardOutlined } from '@mui/icons-material'
import { borderRadius, fontSize, lineHeight } from '../../../constants'
import { routes } from '../../routes/routes'

const AccountPageHeader = () => {
  const navigate = useNavigate()

  return (
    <>
      <Typography
        variant="h3"
        paragraph
        sx={{
          color: 'common.black',
          lineHeight: lineHeight[56],
          alignSelf: 'flex-end',
        }}
      >
        Profile
      </Typography>
      <Button
        size="small"
        endIcon={<ArrowForwardOutlined />}
        variant="outlined"
        sx={{
          borderRadius: borderRadius[8],
          fontSize: fontSize[14],
          alignSelf: 'flex-start',
          mt: '-10px',
          textTransform: 'none',
          color: 'primary.dark',
          borderColor: 'primary.light',
          p: '2px 12px',
          '& .MuiSvgIcon-root': {
            height: '20px',
            width: '20px',
          },
        }}
        onClick={() => navigate(routes.logout)}
      >
        Log out
      </Button>
    </>
  )
}
export default AccountPageHeader
