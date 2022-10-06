import React from 'react'

import UserAvatar from '../UserAvatar'

const ConfigCardAvatar = (props) => {
  const isCurrentUserConfig =
    props.currentUser.uid === props.config.ownerUser.uid
  const avatarUser = isCurrentUserConfig
    ? props.currentUser
    : props.config.ownerUser

  return <UserAvatar user={avatarUser} />
}
export default ConfigCardAvatar
