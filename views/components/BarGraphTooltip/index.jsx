import React from 'react'
import { TOTAL_LABEL } from '../../../constants'
import { isTargetShown, siteTooltipContent } from './helpers'

const BarGraphTooltip = ({ classes, active, payload, label, studyTotals }) => {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className={classes.tooltipContainer}>
      <div className={classes.tooltipHeaderRow}>
        <div className={classes.tooltipLabelColumn}>{label}</div>
        <div className={classes.tooltipValueColumn}>
          {isTargetShown(payload) ? 'Value / Target' : 'Value'}
        </div>
      </div>
      {siteTooltipContent(payload, studyTotals[label]).map(
        ({ labelColumn, valueColumn }) => {
          return (
            <div
              className={classes.tooltipContentRow}
              style={{
                borderTop:
                  labelColumn === TOTAL_LABEL ? 'solid gray 0.5px' : '',
              }}
            >
              <div className={classes.tooltipLabelColumn}>{labelColumn}</div>
              <div className={classes.tooltipValueColumn}>{valueColumn}</div>
            </div>
          )
        }
      )}
    </div>
  )
}

export default BarGraphTooltip
