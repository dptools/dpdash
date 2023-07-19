const UsersModel = {
  createUserFriendList: (users, user) => {
    const userId = user.uid

    return users.map(({ uid }) => ({
      label: uid,
      value: uid,
      isFixed: uid === userId,
    }))
  },
}

export default UsersModel
