import { collections } from '../../utils/mongoCollections'
import { STUDIES_TO_OMIT } from '../../constants'

const study = 'study'

const StudiesModel = {
  all: async (db) => await db.collection(collections.toc).distinct(study),
  sanitizeAndSort: (studies) => {
    return studies
      .filter((study) => !STUDIES_TO_OMIT.includes(study))
      .sort((prevStudy, nextStudy) => (prevStudy < nextStudy ? -1 : 1))
  },
}

export default StudiesModel
