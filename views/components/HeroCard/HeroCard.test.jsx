import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import Hero from '.'

describe('Hero Component', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    )
  })

  test('renders Hero image', () => {
    const image = screen.getByRole('img')

    expect(image).toBeInTheDocument()
  })

  test('renders Hero content', () => {
    const heroCopyContent =
      'DPDash is a Deep/Digital Phenotyping Dashboard designed to manage and visualize multiple data streams coming in continuously over extended periods of time in individuals.'
    const content = screen.getByText(heroCopyContent)

    expect(content).toBeInTheDocument()
  })

  test('renders Hero Learn More button', () => {
    const learnMoreButton = screen.getByText('Learn More')

    expect(learnMoreButton).toBeDefined()
  })
})
