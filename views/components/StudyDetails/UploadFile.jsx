import Add from '@mui/icons-material/Add'
import Button from '@mui/material/Button'

const UploadFile = ({ handleChangeFile }) => {
  return (
    <div>
      <input
        accept=".json"
        name="file"
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
          <Add />
        </Button>
      </label>
    </div>
  )
}

export default UploadFile
