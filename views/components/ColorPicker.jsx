import { Paper, Typography } from '@mui/material'
import React, { useCallback, useRef, useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { Controller } from 'react-hook-form'

import useClickOutside from '../hooks/useClickOutside'

const ColorPicker = ({ color, presetColors, name, control }) => {
  const [isColorPickerOpen, setColorPickerToggle] = useState(false)
  const popover = useRef()
  const close = useCallback(() => setColorPickerToggle(false), [])
  useClickOutside(popover, close)

  return (
    <div>
      <Typography variant="caption">Color</Typography>
      <Paper
        style={{ backgroundColor: color }}
        onClick={() => setColorPickerToggle(true)}
      />
      {isColorPickerOpen && (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <div ref={popover}>
              <HexColorPicker
                color={color}
                control={control}
                name={name}
                onChange={(newColor) => field.onChange(newColor)}
              />
              <div>
                {presetColors.map((presetColor) => (
                  <input
                    key={presetColor}
                    style={{
                      backgroundColor: presetColor,
                    }}
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
