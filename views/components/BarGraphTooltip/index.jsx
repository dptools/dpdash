import React, { Fragment } from 'react'
import { SITE_NAMES } from '../../../server/utils/siteNames'

import './BarGraphTooltip.css'

const BarGraphTooltip = ({
  active,
  payload,
  label,
  studyTotals,
  displayLeft,
  useSiteName,
}) => {
  if (!active || !payload?.length) return null

  return (
    <div className="BarGraphTooltip">
      {displayLeft ? <div className="arrow-left" /> : null}
      <div className="BarGraphTooltip_data">
        <div className="BarGraphTooltip_label">{label}</div>
        <div className="BarGraphTooltip_values">Value</div>
        {payload.map(({ name, value }) => {
          return (
            <Fragment key={name}>
              <div className="BarGraphTooltip_label">{name}</div>
              <div className="BarGraphTooltip_values">{value}</div>
            </Fragment>
          )
        })}
        <div className="BarGraphTooltip_label">Total</div>
        <div className="BarGraphTooltip_values">
          {useSiteName
            ? studyTotals[label]?.count || null
            : studyTotals[SITE_NAMES[label]]?.count || null}
        </div>
      </div>
      {!displayLeft ? <div className="arrow-right" /> : null}
    </div>
  )
}

export default BarGraphTooltip
