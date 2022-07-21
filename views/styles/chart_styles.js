import { neutral_blue } from "../constants/styles"

export const chartStyles = (theme) => ({
  textInput: {
    marginTop: '8px',
    marginBottom: '8px',
    width: '66%'
  },  
  formLabel: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '8px',
    marginBottom: '8px',
  },
  formLabelRow: {
    display: 'flex'
  },
  formLabelCol: {
    marginRight: '8px',
  },
  addLabelContainer: {
    height: '60px',
    display: 'flex'
  },
  variableListInput: {
    width: '20%'
  },
  colorLabel: {
    alignSelf: 'center',
    marginLeft: '10px',
    fontSize: '18px',
    marginRight: '15px'
  },
  deleteContainer: {
    marginLeft: '30px'
  },
  icon: {
    padding: '15px',
    marginBottom: '10px',
  },
  textButton: {
    color: neutral_blue,
    textTransform: 'none',
  },
  submitButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '66%'
  },
  swatchContainer: {
    position: 'relative', 
    display: 'flex', 
    flexDirection: 'row', 
    width: '10%',
    justifyContent: 'center', 
    alignItems: 'center',
    marginLeft: '15px',
    marginBottom: '10px'
  },
  swatch: {
    width: '100%',
    height: '18px',
    cursor: 'pointer',
  },
  popover: {
    position: 'absolute',
    top: 'calc(100% + 2px)',
    borderRadius: '9px',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
    zIndex: '10'
  }
})
