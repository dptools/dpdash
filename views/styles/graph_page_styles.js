import { colors } from '../../constants'

export const graphPageStyles = (theme) => ({
  graph_content: {
    flexGrow: 1,
    backgroundColor: colors.configWhite,
    paddingLeft: theme.spacing.unit * 3,
  },
  configDropDownContainer: {
    width: '50%',
    display: 'flex',
    flexDirection: 'row',
  },
  dropDownText: { alignSelf: 'end', paddingRight: '15px' },
  configForm: { width: '45%' },
  configFormControl: { width: '100%' },
  configLabel: { marginTop: '25px', marginLeft: '30px' },
  graphToolbar: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '80%',
    marginLeft: '210px',
  },
  graphImageButton: {
    right: 10,
    bottom: 10,
    position: 'fixed',
  },
  graphTable: {
    padding: '0',
  },
})
