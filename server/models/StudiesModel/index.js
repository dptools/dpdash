import { collections } from '../../utils/mongoCollections'

const study = 'study'

const StudiesModel = {
  all: async (db) => await db.collection(collections.toc).distinct(study),
}

export default StudiesModel
