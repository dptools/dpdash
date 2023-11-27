import React from 'react'
import { Box, Typography } from '@mui/material'
import HeroFooterLink from './HeroFooterLink'
import { routes } from '../../routes/routes'
import './HeroFooter.css'

const HeroFooter = () => {
  const currentYear = new Date().getFullYear()

  return (
    <Box
      className="HeroFooter_container"
      sx={{
        borderTop: 1,
        borderColor: 'grey.100',
      }}
    >
      <Typography>
        ©{currentYear} Mass General Hospital. All rights reserved.
      </Typography>
      <div className="HeroFooter_linksContainer">
        <HeroFooterLink to={routes.contactUs} label="Contact Us" />
        <HeroFooterLink to={routes.privacyPolicy} label="Privacy Policy" />
        <HeroFooterLink to={routes.termsOfUse} label="Terms of Use" />
      </div>
    </Box>
  )
}

export default HeroFooter
