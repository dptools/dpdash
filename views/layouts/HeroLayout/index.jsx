import React from 'react'
import { Outlet } from 'react-router-dom'
import { Box, Grid } from '@mui/material'

import HeroCard from '../../components/HeroCard'
import HeroFooter from '../../components/HeroFooter'

const HeroLayout = () => {
  return (
    <Box sx={{ height: '100vh' }}>
      <Grid
        container
        lg={12}
        xl={12}
        md={12}
        xs={12}
        sm={12}
        sx={{
          justifyContent: { lg: 'space-evenly' },
          gap: { md: '20px', sm: '40px', xs: '10px' },
        }}
      >
        <Grid
          item
          sx={{
            justifyContent: {
              lg: 'end',
              xs: 'center',
              md: 'center',
              sm: 'center',
            },
            display: 'flex',
            pt: { lg: '22%', xl: '10%', sm: '3%', xs: '3%' },
          }}
          lg={5}
          xl={5}
          md={12}
          xs={12}
          sm={12}
        >
          <HeroCard />
        </Grid>
        <Grid
          item
          sx={{
            pt: { lg: '20%', xl: '10%' },
            py: { md: '3%' },
            justifyContent: {
              xl: 'start',
              xs: 'center',
              md: 'center',
              sm: 'center',
            },
            display: {
              xs: 'flex',
              md: 'flex',
              sm: 'flex',
            },
          }}
          xl={4}
          lg={4}
          md={12}
          xs={12}
          sm={12}
        >
          <Box
            sx={{
              width: { md: '458px', xs: '350px' },
              boxShadow: 5,
              p: {
                xs: '25px 32px',
                md: '50px 64px',
                lg: '25px 64px',
              },
            }}
          >
            <Outlet />
          </Box>
        </Grid>
      </Grid>
      <HeroFooter />
    </Box>
  )
}

export default HeroLayout
