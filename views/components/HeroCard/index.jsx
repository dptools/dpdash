import React from 'react'

import { ArrowForwardOutlined } from '@mui/icons-material'
import {
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
} from '@mui/material'
import './HeroCard.css'

const HeroCard = () => {
  return (
    <Card raised={false} className="HeroCard_container">
      <CardMedia className="HeroCard_image" image="/img/dpdash.png" />
      <CardContent sx={{ px: 0 }}>
        <Typography gutterBottom={false} variant="subtitle1">
          DPDash is a Deep/Digital Phenotyping Dashboard designed to manage and
          visualize multiple data streams coming in continuously over extended
          periods of time in individuals.
        </Typography>
      </CardContent>
      <CardActions sx={{ px: 0 }}>
        <Button
          className="HeroCard_button"
          size="small"
          endIcon={<ArrowForwardOutlined />}
          variant="outlined"
          href="https://sites.google.com/g.harvard.edu/dpdash/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn More
        </Button>
      </CardActions>
    </Card>
  )
}

export default HeroCard
