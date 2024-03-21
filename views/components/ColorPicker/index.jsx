import React, { useState } from 'react'
import { Paper, Typography, Dialog } from '@mui/material'
import { HexColorPicker } from 'react-colorful'
import { Controller } from 'react-hook-form'
import { borderRadius } from '../../../constants'

import './ColorPicker.css'

const ColorPicker = ({ color, presetColors, name, control }) => {
  const [isColorPickerOpen, setColorPickerToggle] = useState(false)

  return (
    <div className="ColorPicker">
      <Typography variant="body2" sx={{ pr: '10px', fontWeight: 600 }}>
        Color
      </Typography>

      <Paper
        sx={{
          backgroundColor: color,
          height: '20px',
          width: '20px',
          borderRadius: borderRadius[8],
        }}
        onClick={() => setColorPickerToggle(true)}
      />
      <Dialog
        open={isColorPickerOpen}
        onClose={() => setColorPickerToggle(false)}
      >
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <>
              <HexColorPicker
                color={color}
                control={control}
                name={name}
                onChange={(newColor) => field.onChange(newColor)}
              />
              <div className="ColorPickerPalette">
                {presetColors.map((presetColor) => (
                  <input
                    key={presetColor}
                    className="ColorPickerSwatch"
                    style={{
                      backgroundColor: presetColor,
                    }}
                    type="button"
                    value={presetColor}
                    onClick={(e) => field.onChange(e.target.value)}
                  />
                ))}
              </div>
            </>
          )}
        />
      </Dialog>
    </div>
  )
}

export default ColorPicker
