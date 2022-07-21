import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Add from '@material-ui/icons/Add';

import { routes } from '../../routes/routes'

const AddNewChart = () => {
  return (
    <div style={{
      right: 4,
      bottom: 4,
      position: 'fixed'
    }}>
      <Button
        component="span"
        variant="fab"
        focusRipple
        onClick={() => window.location.assign(routes.newChart)}
        style={{ marginBottom: '8px' }}
      >
        <Tooltip title="Create A New Chart">
          <Add />
        </Tooltip>
      </Button>
    </div>
  )
}

export default AddNewChart
