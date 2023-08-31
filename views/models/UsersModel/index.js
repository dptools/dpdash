const UsersModel = {
  createUserFriendList: (users, owner) => {
    return users.map(({ uid }) => ({
      label: uid,
      value: uid,
      isFixed: uid === owner,
    }))
  },
  createOptionsFromReaders: (readers, owner) =>
    readers.map((reader) => ({
      label: reader,
      value: reader,
      isFixed: reader === owner,
    })),
  createReadersList: (readers) => readers.map(({ value }) => value),
  userAccessDropdownOptions: (access) =>
    access.map((site) => ({
      label: site,
      value: site,
    })),
  userFromFormValues: (user) => ({
    ...user,
    role: user.role.value,
    access: user.access.map(({ value }) => value),
  }),
  formValuesFromUser: function (user) {
    return {
      ...user,
      role: { value: user.role },
      access: this.userAccessDropdownOptions(user.access),
    }
  },
}

export default UsersModel
