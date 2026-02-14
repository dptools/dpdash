import React from 'react'

import { Button } from '@mui/material'
import { useOutletContext, Link } from 'react-router-dom'

import AccountPageHeader from './AccountPageHeader'
import { borderRadius, fontSize } from '../../../constants'
import api from '../../api'
import UserProfileForm from '../../forms/UserProfileForm'
import FileModel from '../../models/FileModel'
import { routes } from '../../routes/routes'

import './AccountPage.css'

const AccountPage = () => {
  const { user, setUser, setNotification } = useOutletContext()
  const { display_name, icon, iconFileName, mail, title, preferences } = user
  const iconFile =
    !!icon && !!iconFileName
      ? FileModel.fromDataURL(icon, iconFileName)
      : undefined

  const onSubmit = async (userProfileValues) => {
    try {
      const { iconFile, ...formData } = userProfileValues
      const icon = iconFile ? await FileModel.toDataURL(iconFile) : ''
      const iconFileName = iconFile ? iconFile.name : ''
      const updatedUser = await api.users.update(user.uid, {
        ...formData,
        preferences,
        icon,
        iconFileName,
      })

      setUser(updatedUser)
      setNotification(() => ({
        open: true,
        message: 'User has been updated.',
      }))
    } catch (error) {
      setNotification({
        open: true,
        message: error.message,
      })
    }
  }

  return (
    <div className="AccountPage">
      <div className="AccountPageBanner">
        <AccountPageHeader />
      </div>
      <Button
        variant="outlined"
        size="small"
        fullWidth={false}
        component={Link}
        to={routes.previewProfile}
        sx={{
          maxWidth: '121px',
          textDecoration: 'none',
          textTransform: 'none',
          fontSize: fontSize[14],
          borderRadius: borderRadius[8],
        }}
      >
        Preview Profile
      </Button>
      <UserProfileForm
        initialValues={{
          iconFile,
          display_name,
          mail,
          title,
        }}
        onSubmit={onSubmit}
      />
      <Link to={routes.resetpw} className="AccountLink">
        Request password change
      </Link>
    </div>
  )
}

export default AccountPage
