import { collections } from '../../utils/mongoCollections'

const userMongoProjection = {
  _id: 0,
  password: 0,
  bad_pwd_count: 0,
  lockout_time: 0,
  last_logoff: 0,
  last_logon: 0,
  force_reset_pw: 0,
}

const UserModel = {
  save: async (db, userAttributes) => {
    const newUser = UserModel.withDefaults(userAttributes)

    return await db.collection(collections.users).insertOne(newUser)
  },
  findOne: async (db, uid) => {
    return await db.collection(collections.users).findOne(
      { uid },
      {
        projection: userMongoProjection,
      }
    )
  },
  update: async (db, uid, userUpdates) => {
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
}

export default UserModel
