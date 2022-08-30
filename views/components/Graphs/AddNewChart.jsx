import Fab from '@material-ui/core/Fab'
import Tooltip from '@material-ui/core/Tooltip'
import Add from '@material-ui/icons/Add'

import { routes } from '../../routes/routes'

const AddNewChart = () => {
  return (
    <div
      style={{
        right: 4,
        bottom: 4,
        position: 'fixed',
      }}
    >
      <Fab
        component="span"
        focusRipple
        onClick={() => window.location.assign(routes.newChart)}
        style={{ marginBottom: '8px' }}
      >
        <Tooltip title="Create A New Chart">
          <Add />
        </Tooltip>
      </Fab>
    </div>
  )
}

export default AddNewChart
