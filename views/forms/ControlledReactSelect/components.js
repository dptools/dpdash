import { Chip, MenuItem, Typography, TextField } from '@material-ui/core'
import CancelIcon from '@material-ui/icons/Cancel'
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
      className={classNames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused,
      })}
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
      className={
        props.isSelected
          ? props.selectProps.classes.selectedFontWeight
          : props.selectProps.classes.normalFontWeight
      }
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  ),
  NoOptionsMessage: (props) => (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  ),
  Control: (props) => (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
      {...props.selectProps.textFieldProps}
    />
  ),
  Placeholder: (props) => (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  ),
  SingleValue: (props) => (
    <Typography
      className={props.selectProps.classes.singleValue}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  ),
}
