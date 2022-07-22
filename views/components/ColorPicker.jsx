import { Paper, Typography } from "@material-ui/core"
import React, { useCallback, useRef, useState } from "react"
import { HexColorPicker } from "react-colorful"

import useClickOutside from "../hooks/useClickOutside"

const ColorPicker = ({ 
  classes, 
  color, 
  onColorChange, 
  idx
}) => {
  const colorKey = 'color'
  const [isColorPickerOpen, setColorPickerToggle] = useState(false)
  const popover = useRef()
  const close = useCallback(() => setColorPickerToggle(false), [])
  useClickOutside(popover, close)

  return (
    <div className={classes.swatchContainer}>
      <Typography variant='caption' className={classes.colorLabel}>
          Color
      </Typography>
      <Paper
        className={classes.swatch}
        style={{ backgroundColor: color }}
        onClick={() => setColorPickerToggle(true)}
      />
    {isColorPickerOpen && (
      <div className={classes.popover} ref={popover}>
        <HexColorPicker 
          color={color} 
          onChange={(newColor) => onColorChange({target: { name: colorKey, value: newColor }}, idx)} 
        />
      </div>
    )}
    </div>
  )
}

export default ColorPicker
