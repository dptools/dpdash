import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import HeroLayout from '.'

describe('HeroLayout', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <HeroLayout />
      </MemoryRouter>
    )
  })

  test('it renders the hero image', () => {
    const heroImage = screen.getByRole('img')

    expect(heroImage).toBeInTheDocument()
  })

  test('it renders the hero content description and link', () => {
    const heroContent = screen.getByText(
      'DPDash is a Deep/Digital Phenotyping Dashboard designed to manage and visualize multiple data streams coming in continuously over extended periods of time in individuals.'
    )
    const learnMoreLink = screen.getByText('Learn More')

    expect(heroContent).toBeInTheDocument()
    expect(learnMoreLink).toBeInTheDocument
  })
})
