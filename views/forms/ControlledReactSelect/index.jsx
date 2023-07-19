import { useContext } from 'react'
import ReactSelect from 'react-select'

import { Controller } from 'react-hook-form'
import { NotificationContext } from '../../contexts'

const ControlledReactSelect = ({ name, control, options, ...rest }) => {
  const [, setNotification] = useContext(NotificationContext)

  const onChange = (options, actionMeta, field) => {
    switch (actionMeta.action) {
      case 'remove-value':
      case 'pop-value':
        if (actionMeta.removedValue.isFixed) {
          setNotification({
            open: true,
            message: `${actionMeta.removedValue.value} cannot be removed`,
          })

          return
        }
        break
    }

    field.onChange(options)
  }

  return (
    <Controller
      name={name}
      defaultValue={['']}
      control={control}
      render={({ field }) => (
        <ReactSelect
          {...rest}
          {...field}
          options={options}
          isClearable={false}
          onChange={(options, actionMeta) =>
            onChange(options, actionMeta, field)
          }
        />
      )}
    />
  )
}

export default ControlledReactSelect
