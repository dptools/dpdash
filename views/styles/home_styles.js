import { emphasize } from '@material-ui/core/styles/colorManipulator'

const drawerWidth = 200

export const homeStyles = (theme) => ({
  home_root: {
    flexGrow: 1,
    height: '100vh',
    zIndex: 1,
    position: 'relative',
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
  },
  home_appBar: {
    position: 'absolute',
    marginLeft: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
    borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
    backgroundColor: 'white',
    color: 'rgba(0, 0, 0, 0.54)',
  },
  home_navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  home_content: {
    borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
    flexGrow: 1,
    backgroundColor: '#fefefe',
    padding: theme.spacing.unit * 3,
  },
  home_input: {
    display: 'flex',
    padding: 0,
  },
  home_valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
  },
  home_chip: {
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
  home_noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  home_singleValue: {
    fontSize: 16,
  },
  home_placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16,
  },
  home_paper: {
    marginTop: theme.spacing.unit,
    position: 'absolute',
    width: '100%',
  },
})
