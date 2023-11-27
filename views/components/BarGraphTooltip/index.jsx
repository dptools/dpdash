import React from 'react'
import { TOTAL_LABEL } from '../../../constants'
import { isTargetShown, siteTooltipContent } from './helpers'

const BarGraphTooltip = ({ active, payload, label, studyTotals }) => {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div>
      <div>
        <div>{label}</div>
        <div>{isTargetShown(payload) ? 'Value / Target' : 'Value'}</div>
      </div>
      {siteTooltipContent(payload, studyTotals[label]).map(
        ({ labelColumn, valueColumn }) => {
          return (
            <div
              key={`${labelColumn}-${valueColumn}`}
              style={{
                borderTop:
                  labelColumn === TOTAL_LABEL ? 'solid gray 0.5px' : '',
              }}
            >
              <div>{labelColumn}</div>
              <div>{valueColumn}</div>
            </div>
          )
        }
      )}
    </div>
  )
}

export default BarGraphTooltip
