import React from 'react';
import Typography from '@material-ui/core/Typography';
import EnrollmentBarChart from './EnrollmentBarChart';

const Chart = ({
  chart,
}) => {
  const { chartType, chartData } = chart;
  if (chartType === 'bar') {
    return (
      <EnrollmentBarChart
        chartData={chartData}
      />
    );
  } else {
    return (
      <Typography
        variant="body2"
        component="p"
      >
        Chart type not yet supported.
      </Typography>
    )
  }
};

export default Chart;
