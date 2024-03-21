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

  const siteName = useSiteName ? label : SITE_NAMES[label]
  const countsTotal = useSiteName
    ? studyTotals[label].count
    : studyTotals[SITE_NAMES[label]].count
  const variableCounts = payload[0].payload.counts

  return (
    <div className="BarGraphTooltip">
      {displayLeft ? <div className="arrow-left" /> : null}
      <div className="BarGraphTooltip_data">
        <div className="BarGraphTooltip_label">{siteName}</div>
        <div className="BarGraphTooltip_values">Value</div>
        <span className="BarGraphTooltip_divider" />
        {payload.map(({ name }) => {
          return (
            <Fragment key={name}>
              <div className="BarGraphTooltip_label">{name}</div>
              <div className="BarGraphTooltip_values">
                {variableCounts[name]}
              </div>
            </Fragment>
          )
        })}
        <span className="BarGraphTooltip_divider" />
        <div className="BarGraphTooltip_label">Total</div>
        <div className="BarGraphTooltip_values">{countsTotal}</div>
      </div>
      {!displayLeft ? <div className="arrow-right" /> : null}
    </div>
  )
}

export default BarGraphTooltip
