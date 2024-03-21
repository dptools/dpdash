import React from 'react'
import { render, screen } from '@testing-library/react'
import UserProfileImage from './UserProfileImage'

jest.mock('react-hook-form')

describe('UserProfileImage', () => {
  test('renders profile image', () => {
    render(
      <UserProfileImage
        iconFileName="myProfileImage.jpeg"
        control={{}}
        iconSrc="ZG90"
      />
    )
    const iconFileImage = screen.getByAltText('User avatar')
    const iconFileName = screen.getByText('myProfileImage.jpeg')

    expect(iconFileImage).toBeInTheDocument()
    expect(iconFileName).toBeInTheDocument()
  })

  test('renders an icon when no profile image', () => {
    render(<UserProfileImage iconFileName="" control={{}} iconSrc="" />)
    const profileIcon = screen.getByTestId('PersonIcon')

    expect(profileIcon).toBeInTheDocument()
  })
})
