import { Chip, MenuItem, Typography, TextField } from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel'
import classNames from 'classnames'

function inputComponent({ inputRef, ...props }) {
  return (
    <div ref={inputRef} {...props}>
      {props.children}
    </div>
  )
}

export const components = {
  MultiValue: (props) => (
    <Chip
      label={props.data.label}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  ),
  Option: (props) => (
    <MenuItem
      key={props.children}
      buttonRef={props.innerRef}
      selected={props.isFocused}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  ),
  NoOptionsMessage: (props) => (
    <Typography color="textSecondary" {...props.innerProps}>
      {props.children}
    </Typography>
  ),
  Control: (props) => (
    <TextField
      fullWidth
      // InputProps={{
      //   inputComponent,
      //   inputProps: {
      //     inputRef: props.innerRef,
      //     children: props.children,
      //     ...props.innerProps,
      //   },
      // }}
      {...props.selectProps.textFieldProps}
    />
  ),
  Placeholder: (props) => (
    <Typography color="textSecondary" {...props.innerProps}>
      {props.children}
    </Typography>
  ),
  SingleValue: (props) => (
    <Typography {...props.innerProps}>{props.children}</Typography>
  ),
}
