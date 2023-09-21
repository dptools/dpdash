import React, { useRef } from 'react'
import classnames from 'classnames'
import { useForm } from 'react-hook-form'
import { useOutletContext } from 'react-router-dom'

import api from '../api'
import UserProfileForm from '../forms/UserProfileForm'

const AccountPage = () => {
  const canvasRef = useRef()
  const profileImageRef = useRef()
  const { user, classes, setUser, setNotification } = useOutletContext()
  const { icon, display_name, mail, title, department, company } = user
  const { handleSubmit, control, watch } = useForm({
    defaultValues: { icon, display_name, mail, title, department, company },
  })

  const handleFormSubmit = async (userProfileValues) => {
    try {
      const updatedUser = await api.users.update(user.uid, {
        ...user,
        ...userProfileValues,
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

  const scaleDownImage = () => {
    const image = profileImageRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const x = 0
    const y = 0
    let sx = 0
    let sy = (image.naturalHeight - image.naturalWidth) / 2
    let swidth = image.naturalWidth
    let sheight = image.naturalWidth

    if (image.naturalHeight < image.naturalWidth) {
      sy = 0
      sx = (image.naturalWidth - image.naturalHeight) / 2
      swidth = image.naturalHeight
      sheight = image.naturalHeight
    }

    canvas.height = 200
    canvas.width = 200

    ctx.drawImage(image, sx, sy, swidth, sheight, x, y, 200, 200)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  return (
    <div className={classnames(classes.account_page_container, classes.form)}>
      <UserProfileForm
        control={control}
        classes={classes}
        onSubmit={handleSubmit(handleFormSubmit)}
        user={user}
        setUser={setUser}
      />
      <img
        className={classes.userAvatarInput}
        ref={profileImageRef}
        onLoad={scaleDownImage}
        src={watch('icon')}
      />
      <canvas ref={canvasRef} className={classes.userAvatarInput} />
    </div>
  )
}

export default AccountPage
