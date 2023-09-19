import { accountPageStyles } from './account_page_styles'
import { chartStyles } from './chart_styles'
import { configStyles } from './config_styles'
import { graphPageStyles } from './graph_page_styles'
import { studyDetailStyles } from './study_details'
import { mainLayoutStyles } from './main_layout_styles'
import { loginStyles } from './login_page_styles'
import { shareFormStyles } from './share_form_styles'

const drawerWidth = 200

export const styles = (theme) => ({
  ...chartStyles(theme),
  ...configStyles(theme),
  ...graphPageStyles(theme),
  ...studyDetailStyles(theme),
  ...mainLayoutStyles(theme),
  ...accountPageStyles(theme),
  ...shareFormStyles(theme),
  ...loginStyles(theme),
  selectedFontWeight: {
    fontWeight: 500,
  },
  normalFontWeight: {
    fontWeight: 400,
  },
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
  sideBar: { borderRight: '1px solid rgba(0, 0, 0, 0.12)' },
})
