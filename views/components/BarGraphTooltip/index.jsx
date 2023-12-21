import React from 'react'
import classnames from 'classnames'
import { TOTAL_LABEL } from '../../../constants'
import { isTargetShown, siteTooltipContent } from './helpers'

import './BarGraphTooltip.css'

const BarGraphTooltip = ({ active, payload, label, studyTotals }) => {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="BarGraphTooltip">
      <div className="BarGraphTooltip_header">
        <div className="BarGraphTooltip_label">{label}</div>
        <div className="BarGraphTooltip_value">
          {isTargetShown(payload) ? 'Value / Target' : 'Value'}
        </div>
      </div>
      {siteTooltipContent(payload, studyTotals[label]).map(
        ({ labelColumn, valueColumn }) => {
          return (
            <div
              className={classnames('BarGraphTooltip_row', {
                'BarGraphTooltip_row-total': labelColumn === TOTAL_LABEL,
              })}
              key={`${labelColumn}-${valueColumn}`}
            >
              <div className="BarGraphTooltip_label">{labelColumn}</div>
              <div className="BarGraphTooltip_value">{valueColumn}</div>
            </div>
          )
        }
      )}
    </div>
  )
}

export default BarGraphTooltip
