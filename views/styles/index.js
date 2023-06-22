import { chartStyles } from './chart_styles'
import { configStyles } from './config_styles'
import { graphPageStyles } from './graph_page_styles'
import { studyDetailStyles } from './study_details'

const drawerWidth = 200

export const styles = (theme) => ({
  ...chartStyles(theme),
  ...configStyles(theme),
  ...graphPageStyles(theme),
  ...studyDetailStyles(theme),
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
    borderRight: '0px',
  },
  appBar: {
    position: 'absolute',
    marginLeft: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
    borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
    backgroundColor: 'white',
    color: 'rgba(0, 0, 0, 0.54)',
    boxShadow: 'none',
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  title: {
    color: 'rgba(0,0,0,0.4)',
    fontSize: '18px',
    letterSpacing: '1.25px',
    flexGrow: 1,
  },
})
