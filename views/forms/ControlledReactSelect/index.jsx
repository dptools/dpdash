import { useContext } from 'react'
import Select from 'react-select'
import { components } from './components'
import { useController } from 'react-hook-form'
import { NotificationContext } from '../../contexts'

const ControlledReactSelect = (props) => {
  const { field } = useController(props)
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
    <Select
      {...field}
      options={props.options}
      onChange={(options, actionMeta) => onChange(options, actionMeta, field)}
      components={components}
      isMulti
    />
  )
}

export default ControlledReactSelect
