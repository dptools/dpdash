import crypto from 'crypto'

import { collections } from '../../utils/mongoCollections'
import StudiesModel from '../StudiesModel'
import AdminAccountPasswordMailer from '../../mailer/AdminAccountPasswordMailer'

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
  all: async (db) =>
    await db
      .collection(collections.users)
      .find({}, { projection: userMongoProjection })
      .toArray(),
  destroy: async (db, uid) => {
    const { deletedCount } = await db
      .collection(collections.users)
      .deleteOne({ uid })

    if (deletedCount !== 1) throw new Error('Unable to delete user')
  },
  create: async (db, userAttributes) => {
    const newUser = UserModel.withDefaults(userAttributes)
    const { insertedId } = await db
      .collection(collections.users)
      .insertOne(newUser)

    return await db.collection(collections.users).findOne({ _id: insertedId })
  },
  findOne: async (db, userAttributes) => {
    const user = await db
      .collection(collections.users)
      .findOne(userAttributes, {
        projection: userMongoProjection,
      })

    return user
  },
  update: async (db, dataDb, uid, userUpdates) => {
    const user = await UserModel.findOne(db, { uid })
    const updatedUser = { ...user, ...userUpdates }
    if (updatedUser.role === 'admin') {
      updatedUser.access = await StudiesModel.all(dataDb)
    }
    const { value } = await db.collection(collections.users).findOneAndUpdate(
      { uid },
      {
        $set: updatedUser,
      },
      {
        projection: userMongoProjection,
        returnOriginal: false,
        upsert: true,
        returnDocument: 'after',
      }
    )

    if (!value) throw new Error('Could not update user.')

    return value
  },
  hasAdmin: async (db) => {
    const userCt = await db
      .collection(collections.users)
      .countDocuments({ role: "admin" })
    return userCt !== 0
  },
  createFirstAdmin: async (db) => {
    if (await UserModel.hasAdmin(db)) {
      return
    } 

    const reset_key = crypto.randomBytes(32).toString('hex')

    await UserModel.create(db, {
      uid: 'admin',
      password: null,
      role: 'admin',
      force_reset_pw: true,
      reset_key,
    })

    if (process.env.NODE_ENV === 'development') {
      console.log(`RESET KEY: ${reset_key}`)
    } else {
      const adminMailer = new AdminAccountPasswordMailer(reset_key)
      await adminMailer.sendMail()
    }
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
    iconFileName: '',
    access: [],
    blocked: false,
    role: 'member',
    ...overrides,
  }),
}

export default UserModel
