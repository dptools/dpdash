import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import Person from '@material-ui/icons/AccountCircle'
import { colors } from '../../../constants'

const DEFAULT_AVATAR_STYLE = { width: 60, height: 60 }
const AVATAR_STYLE_WITH_COLOR = {
  ...DEFAULT_AVATAR_STYLE,
  backgroundColor: colors.columbia_blue,
}

const UserAvatar = ({ user }) => {
  const { icon, name, uid } = user

  if (!!icon) {
    return <Avatar style={DEFAULT_AVATAR_STYLE} src={icon}></Avatar>
  }

  if (!!name) {
    return <Avatar style={AVATAR_STYLE_WITH_COLOR}>{name[0]}</Avatar>
  }

  return uid && uid.length > 0 ? (
    <Avatar style={DEFAULT_AVATAR_STYLE}>{uid[0]}</Avatar>
  ) : (
    <Avatar style={AVATAR_STYLE_WITH_COLOR}>
      <Person />
    </Avatar>
  )
}

export default UserAvatar
