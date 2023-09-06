import React, { useState, useRef } from 'react'
import classnames from 'classnames'
import { useOutletContext } from 'react-router-dom'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import Snackbar from '@material-ui/core/Snackbar'

import api from '../api'
import { EMAIL_REGEX } from '../../constants'
import Form from '../forms/Form'
import getAvatar from '../fe-utils/avatarUtil'

const AccountPage = () => {
  const canvasRef = useRef()
  const profileImageRef = useRef()
  const [snackBar, setSnackBar] = useState({ open: false, message: '' })
  const { user, classes, setUser } = useOutletContext()
  const [formValues, setFormValues] = useState(user)

  const handleChange = (e) =>
    setFormValues({ ...formValues, [e.target.name]: e.target.value })

  const handleProfileImageChange = (e) => {
    const { files } = e.target

    if (files.length > 0) {
      const reader = new FileReader()

      reader.readAsDataURL(files[0])
      reader.onload = (e) => {
        setFormValues({ ...formValues, icon: e.target.result })
      }
    }
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()

      const updatedUser = await api.users.update(user.uid, formValues)

      setUser(updatedUser)
      setSnackBar(() => ({
        open: true,
        message: 'User has been updated.',
      }))
    } catch (error) {
      setSnackBar({
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

  const handleCrumbs = () =>
    setSnackBar({
      open: false,
      message: '',
    })

  return (
    <>
      <div className={classnames(classes.content, classes.form)}>
        <Form onSubmit={(e) => handleSubmit(e)}>
          <div className={classes.userAvatar}>
            <input
              accept="image/*"
              id="icon"
              multiple
              type="file"
              name="icon"
              className={classes.userAvatarInput}
              onChange={handleProfileImageChange}
            />
            <label htmlFor="icon">
              <span className={classes.userAvatarContainer}>
                <Tooltip title="Edit Profile Photo">
                  {getAvatar({ user: formValues })}
                </Tooltip>
              </span>
            </label>
          </div>
          <TextField
            className={classes.formInputSpacing}
            label="Full Name"
            name="display_name"
            value={formValues.display_name}
            onChange={handleChange}
            fullWidth={true}
          />
          <TextField
            className={classes.formInputSpacing}
            label="Email"
            type="email"
            pattern={EMAIL_REGEX}
            name="email"
            value={formValues.mail}
            fullWidth={true}
            onChange={handleChange}
          />
          <TextField
            className={classes.formInputSpacing}
            label="Title"
            name="title"
            value={formValues.title}
            fullWidth={true}
            onChange={handleChange}
          />
          <TextField
            className={classes.formInputSpacing}
            label="Department"
            name="department"
            value={formValues.department}
            fullWidth={true}
            onChange={handleChange}
          />
          <TextField
            className={classes.formInputSpacing}
            label="Company"
            name="company"
            value={formValues.company}
            fullWidth={true}
            onChange={handleChange}
          />
          <div className={classes.formSubmitButtonContainer}>
            <Button
              className={classes.formSubmitButton}
              variant="outlined"
              type="submit"
            >
              Save
            </Button>
          </div>
        </Form>
      </div>
      <Snackbar
        open={snackBar.open}
        message={snackBar.message}
        autoHideDuration={2000}
        onClose={handleCrumbs}
      />
      <img
        className={classes.userAvatarInput}
        ref={profileImageRef}
        onLoad={scaleDownImage}
        src={formValues.icon}
      />
      <canvas ref={canvasRef} className={classes.userAvatarInput} />
    </>
  )
}

export default AccountPage
