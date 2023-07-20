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
}

export default UsersModel
