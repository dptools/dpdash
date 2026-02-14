const ChartModel = {
  isOwnedByUser: (chart, user) => chart.owner === user.uid,
}

export default ChartModel
