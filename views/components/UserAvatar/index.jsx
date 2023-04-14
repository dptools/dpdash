import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import Person from '@material-ui/icons/AccountCircle'
import { colors } from '../../../constants'

const DEFAULT_AVATAR_STYLE = { width: 60, height: 60 }
const AVATAR_STYLE_WITH_COLOR = {
  ...DEFAULT_AVATAR_STYLE,
  backgroundColor: colors.columbia_blue,
}
const SMALLER_AVATAR_STYLE = {
  width: 30,
  height: 30,
}
const SMALLER_AVATAR_WITH_COLOR = {
  ...SMALLER_AVATAR_STYLE,
  backgroundColor: colors.columbia_blue,
}
const UserAvatar = ({ user, small }) => {
  const { icon, name, uid } = user

  if (!!icon) {
    return (
      <Avatar
        style={small ? SMALLER_AVATAR_STYLE : DEFAULT_AVATAR_STYLE}
        src={icon}
      ></Avatar>
    )
  }

  if (!!name) {
    return (
      <Avatar
        style={small ? SMALLER_AVATAR_WITH_COLOR : AVATAR_STYLE_WITH_COLOR}
      >
        {name[0]}
      </Avatar>
    )
  }

  return uid && uid.length > 0 ? (
    <Avatar style={small ? SMALLER_AVATAR_STYLE : DEFAULT_AVATAR_STYLE}>
      {uid[0]}
    </Avatar>
  ) : (
    <Avatar style={small ? SMALLER_AVATAR_WITH_COLOR : AVATAR_STYLE_WITH_COLOR}>
      <Person />
    </Avatar>
  )
}

export default UserAvatar
