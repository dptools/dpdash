import React from 'react'
import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'

import HeroCard from '../../components/HeroCard'
import HeroFooter from '../../components/HeroFooter'
import './HeroLayout.css'

const HeroLayout = () => {
  return (
    <Box className="HeroLayout_container">
      <Box className="HeroLayout_main">
        <HeroCard />

        <Box
          sx={{
            width: { md: '458px', xs: '350px' },
            boxShadow: 5,
            mt: { sm: '30px', xs: '15px' },
            px: { md: '64px', xs: '32px' },
            py: { xs: '25px', md: '50px' },
          }}
        >
          <Outlet />
        </Box>
      </Box>
      <HeroFooter />
    </Box>
  )
}

export default HeroLayout
