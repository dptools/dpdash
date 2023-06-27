import { emphasize } from '@material-ui/core/styles/colorManipulator'

const drawerWidth = 200

export const homeStyles = (theme) => ({
  home_root: {
    flexGrow: 1,
  },
  home_content: {
    borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
    flexGrow: 1,
    backgroundColor: '#fefefe',
    padding: theme.spacing.unit * 3,
  },
})
