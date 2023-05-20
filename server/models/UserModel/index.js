import { collections } from '../../utils/mongoCollections'

const userMongoProjection = {
  _id: 0,
  uid: 1,
  display_name: 1,
  acl: 1,
  role: 1,
  icon: 1,
  mail: 1,
  access: 1,
  account_expires: 1,
}

const UserModel = {
  withDefaults: (overrides = {}) => ({
    display_name: '',
    title: '',
    department: '',
    company: '',
    mail: '',
    member_of: '',
    bad_pwd_count: 0,
    lockout_time: 0,
    last_logoff: Date.now(),
    last_logon: Date.now(),
    account_expires: null,
    password: '',
    ldap: false,
    force_reset_pw: false,
    realms: [''],
    icon: '',
    access: [],
    blocked: false,
    role: 'member',
    ...overrides,
  }),
  save: async (db, userAttributes) => {
    const newUser = UserModel.withDefaults(userAttributes)

    return await db.collection(collections.users).insertOne(newUser)
  },
  findAndUpdate: async (db, uid, userUpdates) => {
    return await db.collection(collections.users).findOneAndUpdate(
      { uid },
      {
        $set: userUpdates,
      },
      {
        projection: userMongoProjection,
        returnOriginal: false,
        upsert: true,
      }
    )
  },
  update: async (db, uid, userAttributes) => {
    return await db
      .collection(collections.users)
      .updateOne({ uid }, { $set: userAttributes })
  },
}

export default UserModel
