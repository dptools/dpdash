import { useContext } from 'react'
import Select from 'react-select'
import { components } from './components'
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
      case 'clear':
        options = field.value.filter(({ isFixed }) => isFixed)
        field.onChange(options)

        break
    }

    field.onChange(options)
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select
          {...rest}
          {...field}
          options={options}
          onChange={(options, actionMeta) =>
            onChange(options, actionMeta, field)
          }
          components={components}
        />
      )}
    />
  )
}

export default ControlledReactSelect
