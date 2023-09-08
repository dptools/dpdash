const ParticipantsModel = {
  selectDropdownOptions: (participants) =>
    participants.map(({ study, subject }) => ({
      value: `${subject}`,
      label: `${subject} in ${study}`,
    })),
  sortAsc: function (currentParticipant, nextParticipant, sortBy) {
    if (currentParticipant[sortBy] > nextParticipant[sortBy]) return 1

    if (currentParticipant[sortBy] < nextParticipant[sortBy]) return -1

    return 0
  },
  sortDesc: function (currentParticipant, nextParticipant, sortBy) {
    if (currentParticipant[sortBy] < nextParticipant[sortBy]) {
      return 1
    }
    if (currentParticipant[sortBy] > nextParticipant[sortBy]) {
      return -1
    }
    return 0
  },
  sortAscWithPriority: function (participants, starred = {}, sortBy) {
    const { priority, filterParticipants } = this.filterParticipantsAndPriority(
      participants,
      starred
    )

    return priority
      .sort((currentParticipant, nextParticipant) =>
        this.sortAsc(currentParticipant, nextParticipant, sortBy)
      )
      .concat(
        filterParticipants.sort((currentParticipant, nextParticipant) =>
          this.sortAsc(currentParticipant, nextParticipant, sortBy)
        )
      )
  },
  sortDescWithPriority: function (participants, starred = {}, sortBy) {
    const { priority, filterParticipants } = this.filterParticipantsAndPriority(
      participants,
      starred
    )

    return priority
      .sort((currentParticipant, nextParticipant) =>
        this.sortDesc(currentParticipant, nextParticipant, sortBy)
      )
      .concat(
        filterParticipants.sort((currentParticipant, nextParticipant) =>
          this.sortDesc(currentParticipant, nextParticipant, sortBy)
        )
      )
  },
  filterParticipantsAndPriority: function (participants, starred) {
    const flattenStarred = Object.values(starred).flat()
    const priority = []
    const filterParticipants = participants.filter((participant) => {
      if (flattenStarred.includes(participant.subject))
        priority.push(participant)

      return !flattenStarred.includes(participant.subject)
    })

    return {
      priority,
      filterParticipants,
    }
  },
  setStarredAndComplete: function (
    participants,
    preferences,
    sortBy,
    sortDirection
  ) {
    const { star, complete } = preferences

    participants.map((participant) => {
      if (
        star?.[participant.study] &&
        star[participant.study].includes(participant.subject)
      )
        participant.star = true
      else participant.star = false
      if (
        complete?.[participant.study] &&
        complete[participant.study].includes(participant.subject)
      )
        participant.complete = true
      else participant.complete = false

      participant.study = participant.study.toUpperCase()

      return participant
    })

    return sortDirection === 'ASC'
      ? this.sortAscWithPriority(participants, star, sortBy)
      : this.sortDescWithPriority(participants, star, sortBy)
  },
  sortWithSearch: function (participants, searchResult, sortDirection, sortBy) {
    const searchedParticipants = []
    const filterParticipants = participants.filter((participant) => {
      if (
        searchResult.findIndex(({ value }) => value === participant.subject) >
        -1
      )
        searchedParticipants.push(participant)

      return (
        searchResult.findIndex(({ value }) => value === participant.subject) ===
        -1
      )
    })

    if (sortDirection === 'ASC') {
      return searchedParticipants
        .sort((currentParticipant, nextParticipant) =>
          this.sortAsc(currentParticipant, nextParticipant, sortBy)
        )
        .concat(
          filterParticipants.sort((currentParticipant, nextParticipant) =>
            this.sortAsc(currentParticipant, nextParticipant, sortBy)
          )
        )
    } else {
      return searchedParticipants
        .sort((currentParticipant, nextParticipant) =>
          this.sortDesc(currentParticipant, nextParticipant, sortBy)
        )
        .concat(
          filterParticipants.sort((currentParticipant, nextParticipant) =>
            this.sortDesc(currentParticipant, nextParticipant, sortBy)
          )
        )
    }
  },
}

export default ParticipantsModel
