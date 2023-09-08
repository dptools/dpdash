import ParticipantsModel from '.'
import { createMetadataParticipant } from '../../../test/fixtures'

describe('Participants Model', () => {
  const participantList = [
    createMetadataParticipant({
      subject: 'YA01508',
      synced: '07/28/2022',
      days: 1,
      study: 'YA',
      lastSyncedColor: '#de1d16',
    }),
    createMetadataParticipant({
      subject: 'LA00028',
      synced: '07/28/2022',
      days: 1,
      study: 'LA',
      lastSyncedColor: '#de1d16',
    }),
    createMetadataParticipant({
      subject: 'CA00063',
      synced: '07/28/2022',
      days: 1,
      study: 'CA',
      lastSyncedColor: '#de1d16',
    }),
  ]
  describe('sortAsc', () => {
    it('uses the predicate to sort the list by category in ascending order', () => {
      const category = 'subject'
      const result = [
        createMetadataParticipant({
          subject: 'CA00063',
          synced: '07/28/2022',
          days: 1,
          study: 'CA',
          lastSyncedColor: '#de1d16',
        }),
        createMetadataParticipant({
          subject: 'LA00028',
          synced: '07/28/2022',
          days: 1,
          study: 'LA',
          lastSyncedColor: '#de1d16',
        }),
        createMetadataParticipant({
          subject: 'YA01508',
          synced: '07/28/2022',
          days: 1,
          study: 'YA',
          lastSyncedColor: '#de1d16',
        }),
      ]

      expect(
        participantList.sort((a, b) =>
          ParticipantsModel.sortAsc(a, b, category)
        )
      ).toEqual(result)
    })
  })

  describe('sortDesc', () => {
    it('uses the predicate to sort the list in descending order', () => {
      const category = 'subject'

      expect(
        participantList.sort((a, b) =>
          ParticipantsModel.sortDesc(a, b, category)
        )
      ).toEqual(participantList)
    })
  })

  describe('sortAscWithPriority', () => {
    it('sorts the list and places the users starred participants at the top of the list', () => {
      const category = 'subject'
      const star = { LA: ['LA00028'], YA: ['YA01508'] }
      const result = [
        createMetadataParticipant({
          subject: 'LA00028',
          synced: '07/28/2022',
          days: 1,
          study: 'LA',
          lastSyncedColor: '#de1d16',
        }),
        createMetadataParticipant({
          subject: 'YA01508',
          synced: '07/28/2022',
          days: 1,
          study: 'YA',
          lastSyncedColor: '#de1d16',
        }),
        createMetadataParticipant({
          subject: 'CA00063',
          synced: '07/28/2022',
          days: 1,
          study: 'CA',
          lastSyncedColor: '#de1d16',
        }),
      ]

      expect(
        ParticipantsModel.sortAscWithPriority(participantList, star, category)
      ).toEqual(result)
    })

    it('sorts in ascending order if there are no star participants', () => {
      const category = 'subject'
      const result = [
        createMetadataParticipant({
          subject: 'CA00063',
          synced: '07/28/2022',
          days: 1,
          study: 'CA',
          lastSyncedColor: '#de1d16',
        }),
        createMetadataParticipant({
          subject: 'LA00028',
          synced: '07/28/2022',
          days: 1,
          study: 'LA',
          lastSyncedColor: '#de1d16',
        }),
        createMetadataParticipant({
          subject: 'YA01508',
          synced: '07/28/2022',
          days: 1,
          study: 'YA',
          lastSyncedColor: '#de1d16',
        }),
      ]

      expect(
        ParticipantsModel.sortAscWithPriority(
          participantList,
          undefined,
          category
        )
      ).toEqual(result)
    })
  })

  describe('sortDescWithPriority', () => {
    it('sorts the list and places the users starred participants at the top of the list', () => {
      const category = 'subject'
      const star = { LA: ['LA00028'], YA: ['YA01508'] }
      const result = [
        createMetadataParticipant({
          subject: 'YA01508',
          synced: '07/28/2022',
          days: 1,
          study: 'YA',
          lastSyncedColor: '#de1d16',
        }),
        createMetadataParticipant({
          subject: 'LA00028',
          synced: '07/28/2022',
          days: 1,
          study: 'LA',
          lastSyncedColor: '#de1d16',
        }),
        createMetadataParticipant({
          subject: 'CA00063',
          synced: '07/28/2022',
          days: 1,
          study: 'CA',
          lastSyncedColor: '#de1d16',
        }),
      ]

      expect(
        ParticipantsModel.sortDescWithPriority(participantList, star, category)
      ).toEqual(result)
    })

    it('sorts in descending order if there are no star participants', () => {
      const category = 'subject'
      const result = [
        createMetadataParticipant({
          subject: 'YA01508',
          synced: '07/28/2022',
          days: 1,
          study: 'YA',
          lastSyncedColor: '#de1d16',
        }),
        createMetadataParticipant({
          subject: 'LA00028',
          synced: '07/28/2022',
          days: 1,
          study: 'LA',
          lastSyncedColor: '#de1d16',
        }),
        createMetadataParticipant({
          subject: 'CA00063',
          synced: '07/28/2022',
          days: 1,
          study: 'CA',
          lastSyncedColor: '#de1d16',
        }),
      ]

      expect(
        ParticipantsModel.sortDescWithPriority(
          participantList,
          undefined,
          category
        )
      ).toEqual(result)
    })
  })

  describe('filterParticipantsAndPriority', () => {
    it('returns an object with a priority list and filtered list', () => {
      const star = { LA: ['LA00028'], YA: ['YA01508'] }
      const priority = [
        createMetadataParticipant({
          subject: 'YA01508',
          synced: '07/28/2022',
          days: 1,
          study: 'YA',
          lastSyncedColor: '#de1d16',
        }),
        createMetadataParticipant({
          subject: 'LA00028',
          synced: '07/28/2022',
          days: 1,
          study: 'LA',
          lastSyncedColor: '#de1d16',
        }),
      ]
      const filterParticipants = [
        createMetadataParticipant({
          subject: 'CA00063',
          synced: '07/28/2022',
          days: 1,
          study: 'CA',
          lastSyncedColor: '#de1d16',
        }),
      ]

      expect(
        ParticipantsModel.filterParticipantsAndPriority(participantList, star)
      ).toEqual({
        priority,
        filterParticipants,
      })
    })
  })

  describe('setStarredAndComplete', () => {
    it('sets the starred or complete property to participants state', () => {
      const star = { LA: ['LA00028'], YA: ['YA01508'] }
      const complete = { LA: ['LA00028'], CA: ['CA00063'] }
      const preferences = { star, complete }
      const category = 'subject'
      const direction = 'ASC'
      const result = [
        createMetadataParticipant({
          subject: 'LA00028',
          synced: '07/28/2022',
          days: 1,
          study: 'LA',
          lastSyncedColor: '#de1d16',
          star: true,
          complete: true,
        }),
        createMetadataParticipant({
          subject: 'YA01508',
          synced: '07/28/2022',
          days: 1,
          study: 'YA',
          lastSyncedColor: '#de1d16',
          star: true,
          complete: false,
        }),
        createMetadataParticipant({
          subject: 'CA00063',
          synced: '07/28/2022',
          days: 1,
          study: 'CA',
          lastSyncedColor: '#de1d16',
          star: false,
          complete: true,
        }),
      ]

      expect(
        ParticipantsModel.setStarredAndComplete(
          participantList,
          preferences,
          category,
          direction
        )
      ).toEqual(result)
    })
  })

  describe('sortWithSearch', () => {
    it('returns a sorted list using search results as the priority', () => {
      const searchResults = [{ value: 'YA01508' }]
      const direction = 'ASC'
      const category = 'subject'
      const result = [
        {
          complete: false,
          days: 1,
          lastSyncedColor: '#de1d16',
          star: true,
          study: 'YA',
          subject: 'YA01508',
          synced: '07/28/2022',
        },
        {
          complete: true,
          days: 1,
          lastSyncedColor: '#de1d16',
          star: false,
          study: 'CA',
          subject: 'CA00063',
          synced: '07/28/2022',
        },
        {
          complete: true,
          days: 1,
          lastSyncedColor: '#de1d16',
          star: true,
          study: 'LA',
          subject: 'LA00028',
          synced: '07/28/2022',
        },
      ]

      expect(
        ParticipantsModel.sortWithSearch(
          participantList,
          searchResults,
          direction,
          category
        )
      ).toEqual(result)
    })
  })
})
