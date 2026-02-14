import ParticipantsModel from '.'

describe('ParticipantsModel', () => {
  describe(ParticipantsModel.intersectParticipants, () => {
    it('intersects participants that appear in multiple partcipant lists', () => {
      const groupA = ['A1', 'T1', 'A2', 'T3', 'A4', 'A5', 'A6']
      const groupB = ['T1', 'T3', 'T6']
      const groupC = ['B1', 'T3', 'B2', 'T1', 'B3', 'B4', 'B5']
      const groupedParticipants = [groupA, groupB, groupC]

      expect(
        ParticipantsModel.intersectParticipants(groupedParticipants)
      ).toEqual(['T1', 'T3'])
    })

    it('returns empty if no matching participants', () => {
      const groupA = ['A1', 'A2', 'A4', 'A5', 'A6']
      const groupB = ['T1', 'T3', 'T6']
      const groupC = ['B1', 'B2', 'B3', 'B4', 'B5']
      const groupedParticipants = [groupA, groupB, groupC]

      expect(
        ParticipantsModel.intersectParticipants(groupedParticipants)
      ).toEqual([])
    })
  })
})
