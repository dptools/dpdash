import crypto from 'crypto'

import { collections } from '../../utils/mongoCollections'
import StudiesModel from '../StudiesModel'
import AdminAccountPasswordMailer from '../../mailer/AdminAccountPasswordMailer'
import ConfigModel from '../ConfigModel'

const userMongoProjection = {
  _id: 0,
  password: 0,
  bad_pwd_count: 0,
  lockout_time: 0,
  last_logoff: 0,
  last_logon: 0,
  force_reset_pw: 0,
}

const admin = 'admin'

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
  findOne: async (db, userAttributes, includeFields = {}) => {
    const includeOrExcludeFields = Object.keys(includeFields)?.length
      ? includeFields
      : userMongoProjection

    return await db.collection(collections.users).findOne(userAttributes, {
      projection: includeOrExcludeFields,
    })
  },
  update: async (db, uid, userUpdates) => {
    const user = await UserModel.findOne(db, { uid })
    const updatedUser = { preferences: {}, ...user, ...userUpdates }

    if (updatedUser.role === admin)
      updatedUser.access = await StudiesModel.all(db)

    const value = await db.collection(collections.users).findOneAndUpdate(
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
    const pseudoAdmins = await db
      .collection(collections.users)
      .aggregate([
        { $match: { uid: { $in: [admin, null] } } },
        { $sort: { uid: -1 } },
        { $project: { _id: 1 } },
      ])
      .toArray()

    if (pseudoAdmins.length > 1) {
      const [_, ...rest] = pseudoAdmins.map((el) => el._id)

      await db.collection(collections.users).deleteMany({ _id: { $in: rest } })
    }

    const userCt = await db
      .collection(collections.users)
      .countDocuments({ role: admin, password: { $ne: null } })

    return userCt > 0
  },
  adminPasswordIsNotReset: async (db) => {
    const adminUser = await db.collection(collections.users).findOne({ uid: admin })

    return adminUser.password === adminUser.reset_key
  },
  createFirstAdmin: async (db) => {
    if (await UserModel.hasAdmin(db)){
       if (await UserModel.adminPasswordIsNotReset(db)) {
        const adminMailer = new AdminAccountPasswordMailer(reset_key)
        await adminMailer.sendMail()
       }
      return
    }

    const reset_key = crypto.randomBytes(32).toString('hex')
    const configuration = await ConfigModel.findOne(db, { owner: admin })
    const preferences = {}

    if (configuration) {
      preferences.config = configuration._id.toString()
    } else {
      const configAttributes = ConfigModel.withDefaults({
        owner: admin,
        readers: [admin],
      })
      const newConfiguration = await ConfigModel.create(db, configAttributes)
      preferences.config = newConfiguration._id.toString()
    }

    await UserModel.create(db, {
      uid: admin,
      password: reset_key,
      role: admin,
      mail: process.env.ADMIN_EMAIL,
      preferences,
      force_reset_pw: true,
      reset_key,
    })

    if (process.env.NODE_ENV === 'development')
      console.log(`RESET KEY: ${reset_key}`)
    else {
      const adminMailer = new AdminAccountPasswordMailer(reset_key)
      await adminMailer.sendMail()
    }
  },
  withDefaults: (overrides = {}) => ({
    access: [],
    account_expires: null,
    bad_pwd_count: 0,
    blocked: false,
    company: '',
    display_name: '',
    title: '',
    department: '',
    favoriteCharts: [],
    force_reset_pw: false,
    icon: '',
    iconFileName: '',
    last_logoff: Date.now(),
    last_logon: Date.now(),
    ldap: false,
    lockout_time: 0,
    mail: '',
    member_of: '',
    password: '',
    realms: [''],
    role: 'member',
    ...overrides,
  }),
}

export default UserModel
