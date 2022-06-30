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
  formLabelCol: {
    marginRight: '8px',
  },
  addLabelContainer: {
    height: '60px',
    display: 'flex'
  },
  variableListInput: {
    width: '30%'
  },
  icon: {
    padding: '15px'
  },
  textButton: {
    color: neutral_blue,
    textTransform: 'none',
  },
  submitButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '66%'
  }
})
