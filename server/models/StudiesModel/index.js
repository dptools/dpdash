import { STUDIES_TO_OMIT } from '../../constants'
import { collections } from '../../utils/mongoCollections'

const study = 'study'

const StudiesModel = {
  all: async (db) => await db.collection(collections.metadata).distinct(study),
  sanitizeAndSort: (studies) => {
    return studies
      .filter((study) => !STUDIES_TO_OMIT.includes(study))
      .sort((prevStudy, nextStudy) => (prevStudy < nextStudy ? -1 : 1))
  },
}

export default StudiesModel
