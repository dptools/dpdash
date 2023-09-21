import { Paper, Typography } from '@material-ui/core'
import React, { useCallback, useRef, useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { Controller } from 'react-hook-form'

import useClickOutside from '../hooks/useClickOutside'

const ColorPicker = ({ classes, color, presetColors, name, control }) => {
  const [isColorPickerOpen, setColorPickerToggle] = useState(false)
  const popover = useRef()
  const close = useCallback(() => setColorPickerToggle(false), [])
  useClickOutside(popover, close)

  return (
    <div className={classes.swatchContainer}>
      <Typography variant="caption" className={classes.colorLabel}>
        Color
      </Typography>
      <Paper
        className={classes.swatch}
        style={{ backgroundColor: color }}
        onClick={() => setColorPickerToggle(true)}
      />
      {isColorPickerOpen && (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <div className={classes.popover} ref={popover}>
              <HexColorPicker
                color={color}
                control={control}
                name={name}
                onChange={(newColor) => field.onChange(newColor)}
              />
              <div className={classes.colorPickerSwatchBox}>
                {presetColors.map((presetColor) => (
                  <input
                    key={presetColor}
                    style={{
                      backgroundColor: presetColor,
                    }}
                    className={classes.colorPickerSwatch}
                    type="radio"
                    value={presetColor}
                    onChange={({ target: { value: newColor } }) =>
                      field.onChange(newColor)
                    }
                  />
                ))}
              </div>
            </div>
          )}
        />
      )}
    </div>
  )
}

export default ColorPicker
