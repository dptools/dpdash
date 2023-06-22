import { emphasize } from '@material-ui/core/styles/colorManipulator'
import { colors } from '../../constants'

export const configStyles = (theme) => ({
  root: {
    flexGrow: 1,
    height: '100vh',
    zIndex: 1,
    position: 'relative',
    display: 'flex',
    width: '100%',
    backgroundColor: colors.configWhite,
  },
  content: {
    flexGrow: 1,
    borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
    backgroundColor: colors.configWhite,
    paddingTop: theme.spacing.unit * 10,
    paddingLeft: theme.spacing.unit * 3,
  },
  input: {
    display: 'flex',
    padding: 0,
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light'
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
      0.08
    ),
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  singleValue: {
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16,
  },
  paper: {
    position: 'relative',
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  gridList: {
    padding: '2px',
    overflowY: 'auto',
    marginBottom: '128px',
  },
  uploadActions: {
    right: 4,
    bottom: 4,
    position: 'fixed',
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
  textAndIcon: {
    color: colors.gray,
  },
  actionsDivider: {
    padding: '16px 24px',
  },
  actionsContainer: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  dialogTitle: {
    backgroundColor: colors.black,
  },
  dialogText: {
    color: colors.white,
  },
  dialogContent: {
    padding: '24px',
    overflowY: 'visible',
  },
  hiddenInput: { display: 'none' },
})
