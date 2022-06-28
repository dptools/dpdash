import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Add from '@material-ui/icons/Add';

const UploadFile = ({ classes, handleChangeFile }) => {

  return (
    <div className={ classes.uploadButtonContainer }>
      <input
        accept='.json'
        name='file'
        id="raised-button-file"
        multiple
        type="file"
        style={{ display: 'none' }}
        onChange={handleChangeFile}
      />
      <label htmlFor="raised-button-file">
        <Button
          component="span"
          variant="fab"
          focusRipple
          style={{ marginBottom: '8px' }}
        >
          <Tooltip title="Upload Details">
            <Add />
          </Tooltip>
        </Button>
      </label>
    </div>
  )
}

export default UploadFile
