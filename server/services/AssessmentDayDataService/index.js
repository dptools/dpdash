import deepEqual from 'deep-equal'

class AssessmentDayDataService {
  constructor(newAssessmentDayData, currentAssessmentDayData) {
    this.newAssessmentDayData = newAssessmentDayData
    this.currentAssessmentDayData = currentAssessmentDayData
  }
  filterNewData = () =>
    this.newAssessmentDayData.filter(
      ({ day }) =>
        this.currentAssessmentDayData.findIndex((el) => el.day === day) === -1
    )

  filterUpdatedData = () => {
    const filteredAssessments = this.newAssessmentDayData.reduce(
      (listOfUpdates, participantData) => {
        const isDayToBeUpdated = this.currentAssessmentDayData.findIndex(
          (data) => data.day === participantData.day
        )
        if (isDayToBeUpdated !== -1) listOfUpdates.push(participantData)

        return listOfUpdates
      },
      []
    )

    return filteredAssessments.filter((newDayData) => {
      const currentData = this.currentAssessmentDayData.find(
        (currentDayData) => currentDayData.day === newDayData.day
      )
      return !deepEqual(newDayData, currentData)
    })
  }
}

export default AssessmentDayDataService
