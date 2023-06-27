import Fab from '@material-ui/core/Fab'
import Tooltip from '@material-ui/core/Tooltip'
import Add from '@material-ui/icons/Add'

const AddNewChart = ({ onNewChart }) => {
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
        onClick={() => onNewChart()}
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
