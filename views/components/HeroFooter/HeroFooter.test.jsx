import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import HeroFooter from '.'

describe('Hero Component', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <HeroFooter />
      </MemoryRouter>
    )
  })

  test('renders copyright notice', () => {
    const currentYear = new Date().getFullYear()
    const copyright = screen.getByText(
      `©${currentYear} Mass General Hospital. All rights reserved.`
    )

    expect(copyright).toBeInTheDocument()
  })

  test('renders contact us link', () => {
    const contactUsLink = screen.getByText('Contact Us')

    expect(contactUsLink).toBeInTheDocument()
  })

  test('renders contact us link', () => {
    const privacyPolicyLink = screen.getByText('Privacy Policy')

    expect(privacyPolicyLink).toBeInTheDocument()
  })

  test('renders contact us link', () => {
    const termsOfUseLink = screen.getByText('Terms of Use')

    expect(termsOfUseLink).toBeInTheDocument()
  })
})
