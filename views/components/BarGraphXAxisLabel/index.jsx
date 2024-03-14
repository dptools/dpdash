import React, { useState } from 'react'
import { SITE_NAMES } from '../../../server/utils/siteNames'
import { TOTALS_STUDY } from '../../../server/constants'

const BarGraphXAxisLabel = (props) => {
  const [showPopup, setShowPopup] = useState(false)

  const handleRectangleSize = () => {
    const textLength = SITE_NAMES[props.payload.value]?.length

    if (textLength > 8 && textLength <= 12) return '125'
    if (textLength > 18 && textLength <= 21) return '200'
    else return '95'
  }

  return (
    <g>
      {showPopup ? (
        <g>
          <rect
            x={props.x - 15}
            y={400}
            width={handleRectangleSize()}
            height="25"
            rx="5"
            fill="#616161e6"
          />
          <text x={props.x} y={420} fill="#FFFFFF">
            {SITE_NAMES[props.payload.value]}
          </text>
        </g>
      ) : null}
      <text
        x={props.x - 10}
        y={props.y + props.payload.offset}
        textAnchor="middle"
        fill="#666"
        onMouseEnter={() => setShowPopup(true)}
        onMouseLeave={() => setShowPopup(false)}
      >
        {props.payload.value === TOTALS_STUDY
          ? TOTALS_STUDY
          : props.payload.value}
      </text>
    </g>
  )
}

export default BarGraphXAxisLabel
