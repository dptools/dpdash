import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@mui/material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { borderRadius } from '../../../constants'
import UserProfileImage from './UserProfileImage'
import UserProfileFormFields from './UserProfileFormFields'
import { FileModel } from '../../models'

const schema = yup.object({
  company: yup.string(),
  department: yup.string(),
  display_name: yup.string().required(),
  icon: yup.string(),
  mail: yup.string().email().required(),
  title: yup.string(),
})

const UserProfileForm = ({ initialValues, onSubmit }) => {
  const { handleSubmit, control, watch, setValue } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  })
  const fileInput = useRef()
  const iconFile = watch('iconFile')
  const [iconSrc, setIconSrc] = useState()
  const [iconName, setIconName] = useState()

  useEffect(() => {
    if (iconFile) {
      setIconName(iconFile.name)
      FileModel.toDataURL(iconFile).then(setIconSrc)
    } else {
      setIconSrc(undefined)
    }
  }, [iconFile])

  const onRemoveIcon = () => {
    setValue('iconFileName', '')
    setValue('iconFile', null)
    setIconName('')

    fileInput.current.value = ''
  }
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <UserProfileImage
          control={control}
          iconFileName={iconName}
          fileInputRef={fileInput}
          onRemoveIcon={onRemoveIcon}
          iconSrc={iconSrc}
        />
        <UserProfileFormFields control={control} />
        <div>
          <Button
            variant="contained"
            type="submit"
            sx={{
              textTransform: 'none',
              backgroundColor: 'primary.light',
              borderRadius: borderRadius[8],
              mb: '40px',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            Save changes
          </Button>
        </div>
      </form>
    </>
  )
}

export default UserProfileForm
