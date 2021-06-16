import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  LabelList,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import distinctColors from 'distinct-colors';

const getCounts = ({ data, groupings, study }) => {
  return groupings.map((grouping) =>
  ({
    [grouping.value.toString()]: data.filter((entry) =>
    entry.study === study
      && entry.value.toString() === grouping.value.toString()
    ).length,
  }));
};

const getChartDataPerStudy = ({ data, groupings }) => {
  const studies = [...new Set(data.map((entry) => entry.study))];
  return studies.sort().map((study) => {
    const counts = getCounts({ data, groupings, study });
    return {
      study,
      totalCount: data.filter((entry) =>
        entry.study === study
      ).length,
      ...Object.assign({}, ...counts),
    };
  });
};

const getGroupings = ({ data }) => {
  const uniqueGroupings = [...new Set(data.map((entry) => entry.value))];
  const hue = Math.floor(Math.random() * 260);
  const colors = distinctColors({ 
    count: uniqueGroupings.length,
    lightMin: 20,
    lightMax: 90,
    hueMin: hue,
    hueMax: hue+100,
    chromaMax: 90,
  }).sort();
  console.log(colors);
  return uniqueGroupings.sort().map((grouping, idx) => ({
    value: grouping,
    color: colors[idx],
  }));
};

const formatPercentage = (number) => {
  if (number >= 0.03) {
    return `${(number * 100).toFixed(2)}%`;
  } else return null;
};

class EnrollmentBarChart extends React.PureComponent {
  render() {
    const { chartData } = this.props;
    const { data, title } = chartData;
    const chartDataPerStudy = getChartDataPerStudy({
      data,
      groupings: getGroupings({ data }),
    });
    return (
      <div
        style={{
          textAlign: 'center', 
          fontFamily: '"Roboto", sans-serif' 
        }}
      >
        <h2>{title}</h2>
        <BarChart
          width={730}
          height={500}
          data={chartDataPerStudy}
          margin={{ top: 0, right: 30, left: 30, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="study">
            <Label value="Study" offset={0} position="bottom" />
          </XAxis>
          <YAxis>
            <Label value="Enrollment" offset={-10} angle={-90} position="insideLeft" />
          </YAxis>
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          {getGroupings({ data }).map((grouping) => (
            <Bar
              dataKey={grouping.value}
              key={grouping.value}
              fill={grouping.color}
              stackId="a"
            >
              <LabelList
                valueAccessor={(entry) => entry[grouping.value] / entry.totalCount}
                formatter={formatPercentage}
                fill="white"
                style={{ textShadow: "1px 1px 2px black" }}
              />
            </Bar>
          ))}
        </BarChart>
      </div>
    );
  }
}

export default EnrollmentBarChart;
