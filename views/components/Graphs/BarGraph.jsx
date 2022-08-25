import React from 'react'
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryStack,
  VictoryLegend,
  VictoryLabel,
  VictoryVoronoiContainer,
  VictoryTooltip,
} from 'victory'

import { colors } from '../../../constants/styles'
import { graphStyles } from '../../styles/chart_styles'
import { toolTipPercent } from '../../fe-utils/tooltipUtil'

const NOT_AVAILABLE = 'N/A'
const TOTALS_STUDY = 'Totals'

const BarGraph = ({ graph }) => {
  return (
    <VictoryChart
      domainPadding={20}
      domain={{ x: [0, 6] }}
      theme={VictoryTheme.material}
      containerComponent={
        <VictoryVoronoiContainer
          labels={({ datum: { study, studyTarget, count, valueLabel } }) => {
            const { targetTotal, count: studyTotalCount } =
              graph.studyTotals[study]
            const showToolTip =
              study &&
              count &&
              study !== TOTALS_STUDY &&
              valueLabel !== NOT_AVAILABLE
            return showToolTip
              ? `${study} target: ${targetTotal} (100%) \n ${study} current: ${studyTotalCount} (${toolTipPercent(
                  studyTotalCount,
                  targetTotal
                )}%)\n ${valueLabel} target: ${studyTarget} (${toolTipPercent(
                  +studyTarget,
                  targetTotal
                )}%) \n ${valueLabel} current: ${count} (${toolTipPercent(
                  count,
                  targetTotal
                )}%)`
              : null
          }}
          labelComponent={<VictoryTooltip style={{ fontSize: 7 }} />}
        />
      }
    >
      <VictoryLegend
        orientation="horizontal"
        gutter={20}
        data={graph.legend}
        x={150}
        y={20}
        labelComponent={<VictoryLabel />}
      />
      <VictoryAxis label="Site" style={graphStyles.xAxis} />
      <VictoryAxis
        label="Total"
        dependentAxis
        style={graphStyles.yAxis}
        tickFormat={(yAxisValue) => `${yAxisValue}%`}
      />
      <VictoryStack>
        {Object.values(graph.data).map((data, idx) => (
          <VictoryBar
            data={data}
            x="study"
            y="percent"
            key={'bar' + idx}
            style={{
              data: {
                fill: ({ datum }) => datum.color,
              },
            }}
            labels={({ datum }) =>
              !!datum?.percent ? `${datum.percent.toFixed(0)}%` : null
            }
            labelComponent={
              <VictoryLabel
                dy={15}
                labelPlacement="perpendicular"
                style={{ fill: colors.anti_flash_white, fontSize: 8 }}
              />
            }
            events={[
              {
                target: 'data',
                eventHandlers: {
                  onMouseOver: () => {
                    return [
                      {
                        mutation: (props) => {
                          return {
                            style: {
                              ...props.style,
                              stroke: colors.black,
                              strokeWidth: 1,
                            },
                          }
                        },
                      },
                    ]
                  },
                  onMouseOut: () => {
                    return [
                      {
                        mutation: () => {
                          return null
                        },
                      },
                    ]
                  },
                },
              },
            ]}
          />
        ))}
      </VictoryStack>
    </VictoryChart>
  )
}

export default BarGraph
