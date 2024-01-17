import React from 'react'
import TextInputTopLabel from '../TextInputTopLabel'

import './UserProfileFormFields.css'

const UserProfileFormFields = ({ control }) => {
  return (
    <div className="UserProfileFormInputs_box">
      <TextInputTopLabel
        control={control}
        sx={{
          mb: '20px',
        }}
        label="Full name"
        name="display_name"
        size="small"
        required
        fullWidth
      />
      <TextInputTopLabel
        control={control}
        sx={{
          mb: '20px',
        }}
        label="Title and institution (optional)"
        name="title"
        size="small"
        fullWidth
      />
      <TextInputTopLabel
        control={control}
        sx={{
          mb: '20px',
        }}
        label="Email"
        name="mail"
        size="small"
        fullWidth
        disabled
      />
    </div>
  )
}

export default UserProfileFormFields
