import React from 'react'
import { Controller } from 'react-hook-form'
import { Avatar, Typography, Alert, IconButton } from '@mui/material'
import { Delete, Image } from '@mui/icons-material'

import { fontSize } from '../../../constants'

import './UserProfileImage.css'

const UserProfileImage = ({
  control,
  iconFileName,
  fileInputRef,
  onRemoveIcon,
  iconSrc,
}) => {
  return (
    <>
      <div className="UserProfileForm_profileImage">
        <Avatar
          src={iconSrc}
          sx={{ color: 'primary.dark', backgroundColor: 'blue.100' }}
          alt="User avatar"
          data-testid="profilePic"
        />

        <Typography
          component="label"
          htmlFor="icon"
          color="text.secondary"
          sx={{ pl: '9px', fontSize: fontSize[14] }}
        >
          Upload Profile Photo
        </Typography>
        <Controller
          control={control}
          name="iconFile"
          id="iconFile"
          render={({ field: { value, ...field } }) => {
            return (
              <input
                hidden
                className="UserProfileFormFileUploadInput"
                accept="image/*"
                data-testid="icon-input"
                id="icon"
                type="file"
                {...field}
                value={undefined}
                ref={(inputRef) => {
                  fileInputRef.current = inputRef
                  field.ref(inputRef)
                }}
                onChange={(event) => {
                  const { files } = event.target
                  if (files[0]) {
                    field.onChange(files[0])
                  }
                }}
              />
            )
          }}
        />
      </div>
      {iconFileName && (
        <div className="UserProfileFormAlert">
          <Alert
            severity="info"
            role="info"
            icon={
              <IconButton
                aria-label="delete"
                data-testid="delete_image"
                onClick={() => onRemoveIcon()}
                sx={{ color: 'text.secondary' }}
              >
                <Delete />
              </IconButton>
            }
            sx={{
              display: 'flex',
              flexDirection: 'row-reverse',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: 'black.A100',
            }}
          >
            <span className="UserProfileFormFileInfo">
              <Image sx={{ mb: '-6px', color: 'grey.400' }} />
            </span>
            {iconFileName}
          </Alert>
        </div>
      )}
    </>
  )
}

export default UserProfileImage
